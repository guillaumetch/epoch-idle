import { GAME_CONSTANTS } from '../constants';

/**
 * Format lamports to SOL string
 * Shows SOL when >= 1 SOL, otherwise shows lamports
 */
export function formatLamports(lamports: number): string {
  if (lamports >= GAME_CONSTANTS.LAMPORTS_PER_SOL) {
    const sol = lamports / GAME_CONSTANTS.LAMPORTS_PER_SOL;
    return `${formatNumber(sol)} SOL`;
  }
  return `${formatNumber(lamports)} L`;
}

/**
 * Format number with commas and appropriate decimals
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return num.toExponential(2);
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(2) + 'K';
  }
  if (num >= 1) {
    return num.toFixed(2);
  }
  return num.toFixed(4);
}

/**
 * Format TPS (throughput per second)
 */
export function formatTPS(tps: number): string {
  return `${formatNumber(tps)} L/s`;
}

/**
 * Format offline time in seconds to human-readable (e.g. "2h 15m", "45m")
 */
export function formatOfflineTime(seconds: number): string {
  if (seconds < 60) return '< 1 min';
  const m = Math.floor(seconds / 60);
  const h = Math.floor(m / 60);
  const mins = m % 60;
  if (h > 0) return `${h}h ${mins}m`;
  return `${m}m`;
}






