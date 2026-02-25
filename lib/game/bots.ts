import { GAME_CONSTANTS } from '../constants';

/**
 * Calculate the cost of the next bot
 */
export function getBotCost(currentBotCount: number): number {
  return Math.floor(
    GAME_CONSTANTS.BOT_BASE_COST * 
    Math.pow(GAME_CONSTANTS.BOT_COST_MULTIPLIER, currentBotCount)
  );
}

/**
 * Calculate total bot income per second
 */
export function calculateBotIncome(
  botCount: number,
  idleMultiplier: number
): number {
  const baseIncome = botCount * GAME_CONSTANTS.BOT_INCOME_PER_SECOND;
  return baseIncome * idleMultiplier;
}






