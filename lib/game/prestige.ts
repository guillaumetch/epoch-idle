import { GAME_CONSTANTS } from '../constants';
import type { GameState } from '@/types/game';

/**
 * Check if player can prestige (advance epoch)
 */
export function canPrestige(state: GameState): boolean {
  return state.lamports >= GAME_CONSTANTS.PRESTIGE_THRESHOLD;
}

/**
 * Calculate new stake power after prestige
 */
export function calculateNewStakePower(currentStakePower: number): number {
  return currentStakePower + GAME_CONSTANTS.STAKE_POWER_PER_EPOCH;
}

/**
 * Apply global multiplier from stake power
 */
export function applyStakePowerMultiplier(value: number, stakePower: number): number {
  return value * (1 + stakePower);
}






