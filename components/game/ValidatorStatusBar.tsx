'use client';

import { useGameStore } from '@/lib/store/gameStore';
import { formatLamports, formatTPS } from '@/lib/utils/formatters';

export function ValidatorStatusBar() {
  const { state, tps } = useGameStore();

  return (
    <div className="game-status-bar flex flex-wrap items-center justify-between gap-2 sm:gap-3 md:gap-4 px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-[8px] sm:text-[10px] md:text-xs">
      <span className="text-solana-green font-semibold shrink-0">NODE: SYNCED</span>
      <span className="text-gray-500 shrink-0">|</span>
      <span className="text-white/95 shrink-0">EPOCH: {state.epoch}</span>
      <span className="text-gray-500 shrink-0">|</span>
      <span className="text-solana-cyan shrink-0">SLOT: {state.totalSlotsProcessed}</span>
      <span className="text-gray-500 shrink-0">|</span>
      <span className="text-solana-green shrink-0">TPS: {formatTPS(tps)}</span>
      <span className="text-gray-500 shrink-0">|</span>
      <span className="text-white/95 truncate min-w-0">L: {formatLamports(state.lamports)}</span>
      {state.stakePower > 0 && (
        <>
          <span className="text-gray-500">|</span>
          <span className="text-solana-green">STAKE: +{(state.stakePower * 100).toFixed(0)}%</span>
        </>
      )}
    </div>
  );
}
