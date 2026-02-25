import { GAME_CONSTANTS } from '../constants';
import type { Upgrades } from '@/types/game';
import {
  calculateClickPower,
  calculateCooldownReduction,
  calculateIncomeMultiplier,
  calculateIdleMultiplier,
  hasMerkleOptimizer,
  hasJitoTipJar,
} from './upgrades';
import { calculateBotIncome } from './bots';
import { applyStakePowerMultiplier } from './prestige';
import { rollForShred } from './resources';

export interface ClickResult {
  lamports: number;
  shreds: number;
  isCrit: boolean;
  jitoBonus: number;
}

export class GameEngine {
  private clickQueue: number[] = [];
  private lastClickTime: number = 0;
  private lastTickTime: number = 0;
  
  /**
   * Process a click and return the rewards
   */
  processClick(
    upgrades: Upgrades,
    stakePower: number,
    currentLamports: number
  ): ClickResult | null {
    const now = Date.now();
    const cooldownReduction = calculateCooldownReduction(upgrades);
    const baseCooldown = GAME_CONSTANTS.CLICK_COOLDOWN_MS;
    const actualCooldown = baseCooldown * (1 - cooldownReduction);
    
    // Check if enough time has passed since last click
    if (now - this.lastClickTime < actualCooldown) {
      // Queue the click if under rate limit
      if (this.clickQueue.length < 10) {
        this.clickQueue.push(now);
      }
      return null;
    }
    
    this.lastClickTime = now;
    
    // Process queued clicks first
    if (this.clickQueue.length > 0) {
      this.clickQueue.shift();
    }
    
    // Calculate base click power
    let clickPower = calculateClickPower(upgrades);
    
    // Apply income multiplier
    const incomeMultiplier = calculateIncomeMultiplier(upgrades);
    clickPower *= incomeMultiplier;
    
    // Apply stake power multiplier
    clickPower = applyStakePowerMultiplier(clickPower, stakePower);
    
    // Check for crit (Merkle Optimizer)
    let isCrit = false;
    if (hasMerkleOptimizer(upgrades)) {
      const critRoll = Math.random();
      if (critRoll < GAME_CONSTANTS.UPGRADE_EFFECTS.merkleOptimizer.critChance) {
        isCrit = true;
        clickPower *= GAME_CONSTANTS.UPGRADE_EFFECTS.merkleOptimizer.critMultiplier;
      }
    }
    
    // Check for Jito Tip Jar bonus
    let jitoBonus = 0;
    if (hasJitoTipJar(upgrades)) {
      const jitoRoll = Math.random();
      if (jitoRoll < GAME_CONSTANTS.UPGRADE_EFFECTS.jitoTipJar.chance) {
        jitoBonus = currentLamports * GAME_CONSTANTS.UPGRADE_EFFECTS.jitoTipJar.bonusPercent;
      }
    }
    
    // Check for Shred drop
    const shreds = rollForShred() ? 1 : 0;
    
    return {
      lamports: clickPower + jitoBonus,
      shreds,
      isCrit,
      jitoBonus,
    };
  }
  
  /**
   * Calculate idle income from bots for a given delta time
   */
  calculateIdleIncome(
    deltaTime: number,
    botCount: number,
    upgrades: Upgrades,
    stakePower: number
  ): number {
    const idleMultiplier = calculateIdleMultiplier(upgrades);
    const incomeMultiplier = calculateIncomeMultiplier(upgrades);
    const botIncomePerSecond = calculateBotIncome(botCount, idleMultiplier);
    
    const totalIncome = botIncomePerSecond * (deltaTime / 1000);
    return applyStakePowerMultiplier(totalIncome * incomeMultiplier, stakePower);
  }
  
  /**
   * Get current time for delta calculations
   */
  getCurrentTime(): number {
    return Date.now();
  }
  
  /**
   * Calculate delta time since last tick
   */
  getDeltaTime(): number {
    const now = Date.now();
    const delta = now - this.lastTickTime;
    this.lastTickTime = now;
    return delta;
  }
  
  /**
   * Reset engine state (useful for testing or reset)
   */
  reset(): void {
    this.clickQueue = [];
    this.lastClickTime = 0;
    this.lastTickTime = Date.now();
  }
}






