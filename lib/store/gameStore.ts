import { create } from 'zustand';
import type { GameState, Upgrades, UpgradeType } from '@/types/game';
import { GameEngine, type ClickResult } from '../game/engine';
import { saveGame, loadGame, clearSave } from '../utils/persistence';
import { GAME_CONSTANTS } from '../constants';
import {
  getUpgradeCost,
  isUpgradeMaxed,
  UPGRADE_DEFINITIONS,
  calculateClickPower,
  calculateIncomeMultiplier,
  calculateIdleMultiplier,
} from '../game/upgrades';
import { getBotCost, calculateBotIncome } from '../game/bots';
import { canPrestige, calculateNewStakePower, applyStakePowerMultiplier } from '../game/prestige';
import { getOfflineBotIncome, getOfflineBotIncomeForElapsed } from '../game/offline';

interface GameStore {
  // State
  state: GameState;
  upgrades: Upgrades;
  bots: number;
  tps: number;
  isMuted: boolean;
  reducedMotion: boolean;
  pendingOfflineClaim: { lamports: number; offlineSeconds: number } | null;
  lastHiddenTime: number | null;
  
  // Engine
  engine: GameEngine;
  animationFrameId: number | null;
  
  // Actions
  click: () => ClickResult | null;
  buyUpgrade: (upgradeType: keyof Upgrades) => void;
  buyBot: () => void;
  prestige: () => void;
  toggleMute: () => void;
  toggleReducedMotion: () => void;
  load: () => void;
  save: () => void;
  reset: () => void;
  dismissOfflineClaim: () => void;
  handlePageHidden: () => void;
  handlePageVisible: () => void;
  
  // Internal
  _tick: () => void;
  _startLoop: () => void;
  _stopLoop: () => void;
}

const initialUpgrades: Upgrades = {
  hashpower1: 0,
  hashpower2: 0,
  hashpower3: 0,
  rpcSpeed: 0,
  voteCredits: 0,
  geyserIndex: 0,
  merkleOptimizer: 0,
  jitoTipJar: 0,
};

const initialState: GameState = {
  lamports: 0,
  shreds: 0,
  stakePower: 0,
  epoch: 0,
  totalSlotsProcessed: 0,
  totalLamportsEarned: 0,
};

export const useGameStore = create<GameStore>((set, get) => {
  const engine = new GameEngine();
  engine.reset();
  
  let autosaveInterval: NodeJS.Timeout | null = null;
  let idleSlotAccumulator = 0;

  const startAutosave = () => {
    if (autosaveInterval) clearInterval(autosaveInterval);
    autosaveInterval = setInterval(() => {
      get().save();
    }, GAME_CONSTANTS.AUTOSAVE_INTERVAL_MS);
  };
  
  const stopAutosave = () => {
    if (autosaveInterval) {
      clearInterval(autosaveInterval);
      autosaveInterval = null;
    }
  };
  
  return {
    state: { ...initialState },
    upgrades: { ...initialUpgrades },
    bots: 0,
    tps: 0,
    isMuted: false,
    reducedMotion: false,
    pendingOfflineClaim: null,
    lastHiddenTime: null,
    engine,
    animationFrameId: null,
    
    click: () => {
      const { state, upgrades, engine } = get();
      const result = engine.processClick(upgrades, state.stakePower, state.lamports);
      
      if (result) {
        set((prev) => {
          const newState = {
            ...prev.state,
            lamports: prev.state.lamports + result.lamports,
            shreds: prev.state.shreds + result.shreds,
            totalSlotsProcessed: prev.state.totalSlotsProcessed + 1,
            totalLamportsEarned: prev.state.totalLamportsEarned + result.lamports,
          };
          return { state: newState };
        });
        get().save();
      }
      
      // Return result for UI feedback (even if null)
      return result;
    },
    
    buyUpgrade: (upgradeType: keyof Upgrades) => {
      const { state, upgrades } = get();
      const upgrade = upgrades[upgradeType];
      
      if (isUpgradeMaxed(upgradeType as UpgradeType, upgrade)) return;
      
      const cost = getUpgradeCost(upgradeType as UpgradeType, upgrade);
      const def = UPGRADE_DEFINITIONS[upgradeType as UpgradeType];
      
      if (def.currency === 'shreds') {
        if (state.shreds < cost) return;
        set((prev) => ({
          state: { ...prev.state, shreds: prev.state.shreds - cost },
          upgrades: { ...prev.upgrades, [upgradeType]: prev.upgrades[upgradeType] + 1 },
        }));
      } else {
        if (state.lamports < cost) return;
        set((prev) => ({
          state: { ...prev.state, lamports: prev.state.lamports - cost },
          upgrades: { ...prev.upgrades, [upgradeType]: prev.upgrades[upgradeType] + 1 },
        }));
      }
      
      get().save();
    },
    
    buyBot: () => {
      const { state, bots } = get();
      const cost = getBotCost(bots);
      
      if (state.lamports < cost) return;
      
      set((prev) => ({
        state: { ...prev.state, lamports: prev.state.lamports - cost },
        bots: prev.bots + 1,
      }));
      
      get().save();
    },
    
    prestige: () => {
      const { state } = get();
      
      if (!canPrestige(state)) return;
      
      set((prev) => ({
        state: {
          ...initialState,
          stakePower: calculateNewStakePower(prev.state.stakePower),
          epoch: prev.state.epoch + 1,
          totalSlotsProcessed: prev.state.totalSlotsProcessed,
          totalLamportsEarned: prev.state.totalLamportsEarned,
        },
        upgrades: { ...initialUpgrades },
        bots: 0,
      }));
      
      get().engine.reset();
      get().save();
    },
    
    toggleMute: () => {
      set((prev) => ({ isMuted: !prev.isMuted }));
      get().save();
    },
    
    toggleReducedMotion: () => {
      set((prev) => ({ reducedMotion: !prev.reducedMotion }));
      get().save();
    },
    
    load: () => {
      const saved = loadGame();
      if (saved) {
        const offline = getOfflineBotIncome(saved);
        set({
          state: {
            ...saved.state,
            lamports: saved.state.lamports + offline.lamports,
            totalLamportsEarned: saved.state.totalLamportsEarned + offline.lamports,
          },
          upgrades: saved.upgrades,
          bots: saved.bots,
          pendingOfflineClaim:
            offline.lamports > 0
              ? { lamports: offline.lamports, offlineSeconds: offline.offlineSeconds }
              : null,
        });
        get().engine.reset();
        get()._startLoop();
        startAutosave();
      } else {
        get()._startLoop();
        startAutosave();
      }
    },
    
    save: () => {
      const { state, upgrades, bots } = get();
      saveGame(state, upgrades, bots);
    },
    
    reset: () => {
      clearSave();
      set({
        state: { ...initialState },
        upgrades: { ...initialUpgrades },
        bots: 0,
        tps: 0,
        pendingOfflineClaim: null,
        lastHiddenTime: null,
      });
      get().engine.reset();
      get().save();
    },

    dismissOfflineClaim: () => {
      set({ pendingOfflineClaim: null });
    },

    handlePageHidden: () => {
      set({ lastHiddenTime: Date.now() });
    },

    handlePageVisible: () => {
      const { lastHiddenTime, state, upgrades, bots } = get();
      if (lastHiddenTime == null || bots === 0) {
        set({ lastHiddenTime: null });
        return;
      }
      const elapsedMs = Date.now() - lastHiddenTime;
      if (elapsedMs < GAME_CONSTANTS.OFFLINE_MIN_MS) {
        set({ lastHiddenTime: null });
        return;
      }
      const offline = getOfflineBotIncomeForElapsed(
        elapsedMs,
        bots,
        upgrades,
        state.stakePower
      );
      set({
        lastHiddenTime: null,
        state: {
          ...state,
          lamports: state.lamports + offline.lamports,
          totalLamportsEarned: state.totalLamportsEarned + offline.lamports,
        },
        pendingOfflineClaim:
          offline.lamports > 0
            ? { lamports: offline.lamports, offlineSeconds: offline.offlineSeconds }
            : null,
      });
      get().save();
    },
    
    _tick: () => {
      const { state, upgrades, bots, engine } = get();
      const deltaTime = engine.getDeltaTime();
      
      // Calculate idle income
      const idleIncome = engine.calculateIdleIncome(
        deltaTime,
        bots,
        upgrades,
        state.stakePower
      );
      
      if (idleIncome > 0 && bots > 0) {
        idleSlotAccumulator += (bots * deltaTime) / 1000;
        const slotsToAdd = Math.floor(idleSlotAccumulator);
        idleSlotAccumulator -= slotsToAdd;
        set((prev) => ({
          state: {
            ...prev.state,
            lamports: prev.state.lamports + idleIncome,
            totalLamportsEarned: prev.state.totalLamportsEarned + idleIncome,
            totalSlotsProcessed: prev.state.totalSlotsProcessed + slotsToAdd,
          },
        }));
      }
      
      // Calculate TPS
      const clickPower = calculateClickPower(upgrades);
      const incomeMultiplier = calculateIncomeMultiplier(upgrades);
      const idleMultiplier = calculateIdleMultiplier(upgrades);
      const botIncomePerSecond = calculateBotIncome(bots, idleMultiplier);
      const clicksPerSecond = 10; // Max clicks
      const totalIncome = (botIncomePerSecond + clickPower * clicksPerSecond) * incomeMultiplier;
      const tps = applyStakePowerMultiplier(totalIncome, state.stakePower);
      
      set({ tps });
      
      get()._startLoop();
    },
    
    _startLoop: () => {
      const { animationFrameId } = get();
      if (animationFrameId !== null) return;
      
      const id = requestAnimationFrame(() => {
        set({ animationFrameId: null });
        get()._tick();
      });
      set({ animationFrameId: id });
    },
    
    _stopLoop: () => {
      const { animationFrameId } = get();
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        set({ animationFrameId: null });
      }
      stopAutosave();
    },
  };
});

