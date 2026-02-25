export interface GameState {
  lamports: number;
  shreds: number;
  stakePower: number;
  epoch: number;
  totalSlotsProcessed: number;
  totalLamportsEarned: number;
}

export interface Upgrades {
  hashpower1: number;
  hashpower2: number;
  hashpower3: number;
  rpcSpeed: number; // 0-5 levels
  voteCredits: number;
  geyserIndex: number;
  merkleOptimizer: number; // 0 or 1
  jitoTipJar: number; // 0 or 1
}

export interface GameSave {
  version: number;
  state: GameState;
  upgrades: Upgrades;
  bots: number;
  lastSaveTime: number;
}

export type UpgradeType = 
  | 'hashpower1' 
  | 'hashpower2' 
  | 'hashpower3' 
  | 'rpcSpeed' 
  | 'voteCredits' 
  | 'geyserIndex' 
  | 'merkleOptimizer' 
  | 'jitoTipJar';

export interface UpgradeDefinition {
  id: UpgradeType;
  name: string;
  description: string;
  baseCost: number;
  costMultiplier?: number;
  maxLevel?: number;
  currency: 'lamports' | 'shreds';
}






