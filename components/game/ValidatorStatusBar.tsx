'use client';

import { useGameStore } from '@/lib/store/gameStore';
import { formatLamports, formatTPS } from '@/lib/utils/formatters';

export function ValidatorStatusBar() {
  const { state, tps } = useGameStore();

  return (
    <div className="game-status-bar flex flex-wrap items-center justify-between gap-3 md:gap-4 px-4 md:px-6 py-3 text-[10px] md:text-xs">
      <span className="text-solana-green font-semibold">NODE: SYNCED</span>
      <span className="text-gray-500">|</span>
      <span className="text-white/95">EPOCH: {state.epoch}</span>
      <span className="text-gray-500">|</span>
      <span className="text-solana-cyan">SLOT: {state.totalSlotsProcessed}</span>
      <span className="text-gray-500">|</span>
      <span className="text-solana-green">TPS: {formatTPS(tps)}</span>
      <span className="text-gray-500">|</span>
      <span className="text-white/95">L: {formatLamports(state.lamports)}</span>
      {state.stakePower > 0 && (
        <>
          <span className="text-gray-500">|</span>
          <span className="text-solana-green">STAKE: +{(state.stakePower * 100).toFixed(0)}%</span>
        </>
      )}
    </div>
  );
}
