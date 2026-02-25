import { GAME_CONSTANTS } from '../constants';
import type { GameSave } from '@/types/game';
import { calculateBotIncome } from './bots';
import { calculateIncomeMultiplier, calculateIdleMultiplier } from './upgrades';
import { applyStakePowerMultiplier } from './prestige';

export interface OfflineResult {
  lamports: number;
  offlineSeconds: number;
}

/**
 * Calculate bot income earned while the game was closed.
 * Uses the same formula as the game loop (idle only, no clicks).
 * Capped at OFFLINE_MAX_MS to avoid abuse.
 */
export function getOfflineBotIncome(save: GameSave): OfflineResult {
  if (save.bots === 0) {
    return { lamports: 0, offlineSeconds: 0 };
  }

  const now = Date.now();
  let elapsedMs = now - save.lastSaveTime;

  if (elapsedMs <= 0) {
    return { lamports: 0, offlineSeconds: 0 };
  }

  elapsedMs = Math.min(elapsedMs, GAME_CONSTANTS.OFFLINE_MAX_MS);
  const elapsedSeconds = elapsedMs / 1000;

  const idleMultiplier = calculateIdleMultiplier(save.upgrades);
  const incomeMultiplier = calculateIncomeMultiplier(save.upgrades);
  const botIncomePerSecond = calculateBotIncome(save.bots, idleMultiplier);
  const totalIncome = botIncomePerSecond * elapsedSeconds;
  const lamports = applyStakePowerMultiplier(
    totalIncome * incomeMultiplier,
    save.state.stakePower
  );

  return { lamports, offlineSeconds: elapsedSeconds };
}

/**
 * Calculate bot income for a given elapsed time (e.g. tab was hidden).
 * Same formula as getOfflineBotIncome, but takes current state instead of a save.
 */
export function getOfflineBotIncomeForElapsed(
  elapsedMs: number,
  bots: number,
  upgrades: GameSave['upgrades'],
  stakePower: number
): OfflineResult {
  if (bots === 0 || elapsedMs < GAME_CONSTANTS.OFFLINE_MIN_MS) {
    return { lamports: 0, offlineSeconds: 0 };
  }
  const cappedMs = Math.min(elapsedMs, GAME_CONSTANTS.OFFLINE_MAX_MS);
  const elapsedSeconds = cappedMs / 1000;
  const idleMultiplier = calculateIdleMultiplier(upgrades);
  const incomeMultiplier = calculateIncomeMultiplier(upgrades);
  const botIncomePerSecond = calculateBotIncome(bots, idleMultiplier);
  const totalIncome = botIncomePerSecond * elapsedSeconds;
  const lamports = applyStakePowerMultiplier(
    totalIncome * incomeMultiplier,
    stakePower
  );
  return { lamports, offlineSeconds: elapsedSeconds };
}
