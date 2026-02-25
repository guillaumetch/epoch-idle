import { GAME_CONSTANTS } from '../constants';

/**
 * Check if a click should drop a Shred
 */
export function rollForShred(): boolean {
  return Math.random() < GAME_CONSTANTS.SHRED_DROP_CHANCE;
}

/**
 * Calculate total throughput per second (TPS)
 */
export function calculateTPS(
  botIncomePerSecond: number,
  clickPower: number,
  clicksPerSecond: number,
  incomeMultiplier: number,
  stakePowerMultiplier: number
): number {
  const clickIncome = clickPower * clicksPerSecond;
  const totalIncome = (botIncomePerSecond + clickIncome) * incomeMultiplier;
  return totalIncome * stakePowerMultiplier;
}






