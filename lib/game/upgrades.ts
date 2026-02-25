import { GAME_CONSTANTS } from '../constants';
import type { UpgradeDefinition, UpgradeType, Upgrades } from '@/types/game';

export const UPGRADE_DEFINITIONS: Record<UpgradeType, UpgradeDefinition> = {
  hashpower1: {
    id: 'hashpower1',
    name: 'Hashpower I',
    description: '+28K lamports per click',
    baseCost: GAME_CONSTANTS.UPGRADE_COSTS.hashpower1,
    currency: 'lamports',
  },
  hashpower2: {
    id: 'hashpower2',
    name: 'Hashpower II',
    description: '+5K lamports per click',
    baseCost: GAME_CONSTANTS.UPGRADE_COSTS.hashpower2,
    currency: 'lamports',
  },
  hashpower3: {
    id: 'hashpower3',
    name: 'Hashpower III',
    description: '+700K lamports per click',
    baseCost: GAME_CONSTANTS.UPGRADE_COSTS.hashpower3,
    currency: 'lamports',
  },
  rpcSpeed: {
    id: 'rpcSpeed',
    name: 'RPC Speed',
    description: '-5% click cooldown (stacks up to -25%)',
    baseCost: GAME_CONSTANTS.UPGRADE_COSTS.rpcSpeed,
    maxLevel: 5,
    currency: 'lamports',
  },
  voteCredits: {
    id: 'voteCredits',
    name: 'Vote Credits',
    description: '+10% all income (stacks)',
    baseCost: GAME_CONSTANTS.UPGRADE_COSTS.voteCredits,
    currency: 'lamports',
  },
  geyserIndex: {
    id: 'geyserIndex',
    name: 'Geyser Index',
    description: '+20% idle income (stacks)',
    baseCost: GAME_CONSTANTS.UPGRADE_COSTS.geyserIndex,
    currency: 'lamports',
  },
  merkleOptimizer: {
    id: 'merkleOptimizer',
    name: 'Merkle Optimizer',
    description: '5% crit chance for ×10 payout',
    baseCost: GAME_CONSTANTS.UPGRADE_COSTS.merkleOptimizer,
    maxLevel: 1,
    currency: 'shreds',
  },
  jitoTipJar: {
    id: 'jitoTipJar',
    name: 'Jito Tip Jar',
    description: '5% chance for +1% of bank',
    baseCost: GAME_CONSTANTS.UPGRADE_COSTS.jitoTipJar,
    maxLevel: 1,
    currency: 'shreds',
  },
};

export function getUpgradeCost(
  upgradeType: UpgradeType,
  currentLevel: number
): number {
  const def = UPGRADE_DEFINITIONS[upgradeType];
  return def.baseCost;
}

export function canAffordUpgrade(
  upgradeType: UpgradeType,
  currentLevel: number,
  lamports: number,
  shreds: number
): boolean {
  const cost = getUpgradeCost(upgradeType, currentLevel);
  const def = UPGRADE_DEFINITIONS[upgradeType];
  
  if (def.currency === 'shreds') {
    return shreds >= cost;
  }
  return lamports >= cost;
}

export function isUpgradeMaxed(
  upgradeType: UpgradeType,
  currentLevel: number
): boolean {
  const def = UPGRADE_DEFINITIONS[upgradeType];
  if (def.maxLevel === undefined) return false;
  return currentLevel >= def.maxLevel;
}

export function calculateClickPower(upgrades: Upgrades): number {
  let power = GAME_CONSTANTS.BASE_LAMPORTS_PER_CLICK;
  power += upgrades.hashpower1 * GAME_CONSTANTS.UPGRADE_EFFECTS.hashpower1;
  power += upgrades.hashpower2 * GAME_CONSTANTS.UPGRADE_EFFECTS.hashpower2;
  power += upgrades.hashpower3 * GAME_CONSTANTS.UPGRADE_EFFECTS.hashpower3;
  return power;
}

export function calculateCooldownReduction(upgrades: Upgrades): number {
  const rpcLevels = Math.min(upgrades.rpcSpeed, 5);
  return rpcLevels * GAME_CONSTANTS.UPGRADE_EFFECTS.rpcSpeed;
}

export function calculateIncomeMultiplier(upgrades: Upgrades): number {
  let multiplier = 1;
  multiplier += upgrades.voteCredits * GAME_CONSTANTS.UPGRADE_EFFECTS.voteCredits;
  return multiplier;
}

export function calculateIdleMultiplier(upgrades: Upgrades): number {
  let multiplier = 1;
  multiplier += upgrades.geyserIndex * GAME_CONSTANTS.UPGRADE_EFFECTS.geyserIndex;
  return multiplier;
}

export function hasMerkleOptimizer(upgrades: Upgrades): boolean {
  return upgrades.merkleOptimizer > 0;
}

export function hasJitoTipJar(upgrades: Upgrades): boolean {
  return upgrades.jitoTipJar > 0;
}






