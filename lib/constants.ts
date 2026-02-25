// Game balance constants (scaled so 1B = 1 SOL prestige in ~15 min)
export const GAME_CONSTANTS = {
  // Click mechanics (tuned so 1B prestige in ~15 min)
  BASE_LAMPORTS_PER_CLICK: 28_000,
  MAX_CLICKS_PER_SECOND: 10,
  CLICK_COOLDOWN_MS: 100, // Base cooldown (100ms = 10 clicks/s)
  
  // Shreds
  SHRED_DROP_CHANCE: 0.05, // 5% chance
  
  // Prestige (1 SOL = 1B lamports, real-life accurate)
  PRESTIGE_THRESHOLD: 1_000_000_000, // 1B lamports = 1 SOL
  STAKE_POWER_PER_EPOCH: 0.2, // +20% per epoch
  
  // SOL conversion
  LAMPORTS_PER_SOL: 1_000_000_000, // 1e9
  
  // Bot system (tuned for ~15 min to 1B)
  BOT_BASE_COST: 1_000_000,
  BOT_COST_MULTIPLIER: 1.15,
  BOT_INCOME_PER_SECOND: 14_000, // 14K L/s per bot
  
  // Upgrade costs (scaled 1000x)
  UPGRADE_COSTS: {
    hashpower1: 100_000,
    hashpower2: 1_000_000,
    hashpower3: 10_000_000,
    rpcSpeed: 500_000,
    voteCredits: 25_000_000,
    geyserIndex: 100_000_000,
    merkleOptimizer: 5, // Shreds (unchanged)
    jitoTipJar: 8, // Shreds (unchanged)
  },
  
  // Upgrade effects (tuned for ~15 min to 1B)
  UPGRADE_EFFECTS: {
    hashpower1: 28_000, // +28K lamports/click
    hashpower2: 140_000, // +140K lamports/click
    hashpower3: 700_000, // +700K lamports/click
    rpcSpeed: 0.05, // -5% cooldown per level (max 5 levels = -25%)
    voteCredits: 0.1, // +10% all income (stacks)
    geyserIndex: 0.2, // +20% idle income (stacks)
    merkleOptimizer: {
      critChance: 0.05, // 5% crit chance
      critMultiplier: 10, // ×10 payout
    },
    jitoTipJar: {
      chance: 0.05, // 5% chance
      bonusPercent: 0.01, // +1% of bank
    },
  },
  
  // Persistence
  SAVE_VERSION: 1,
  AUTOSAVE_INTERVAL_MS: 5000, // 5 seconds

  // Offline progress (bot income only)
  OFFLINE_MAX_MS: 24 * 60 * 60 * 1000, // Cap at 24 hours
  OFFLINE_MIN_MS: 0, // No minimum; popup shows for any tab switch
} as const;






