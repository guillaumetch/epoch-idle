'use client';

import { useGameStore } from '@/lib/store/gameStore';
import { formatLamports, formatTPS } from '@/lib/utils/formatters';

export function ResourceDisplay() {
  const { state, tps } = useGameStore();

  return (
    <div className="flex flex-col gap-2 sm:gap-3 mb-0">
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-3 min-w-0">
        <div className="text-center p-2 sm:p-2.5 md:p-3 border-2 sm:border-4 border-gray-700 bg-gray-800/90 game-stat-card min-w-0">
          <div className="text-[8px] sm:text-[10px] text-solana-cyan mb-0.5 sm:mb-1">BALANCE</div>
          <div className="text-[10px] sm:text-xs md:text-sm text-white animate-glow whitespace-nowrap overflow-hidden text-ellipsis" title={formatLamports(state.lamports)}>
            {formatLamports(state.lamports)}
          </div>
        </div>

        <div className="text-center p-2 sm:p-2.5 md:p-3 border-2 sm:border-4 border-gray-700 bg-gray-800/90 game-stat-card min-w-0">
          <div className="text-[8px] sm:text-[10px] text-solana-green mb-0.5 sm:mb-1">THROUGHPUT</div>
          <div className="text-[10px] sm:text-xs md:text-sm text-solana-green whitespace-nowrap overflow-hidden text-ellipsis" title={formatTPS(tps)}>
            {formatTPS(tps)}
          </div>
        </div>

        <div className="text-center p-2 sm:p-2.5 md:p-3 border-2 sm:border-4 border-gray-700 bg-gray-800/90 game-stat-card min-w-0">
          <div className="text-[8px] sm:text-[10px] text-solana-purple mb-0.5 sm:mb-1">SHREDS</div>
          <div className="text-[10px] sm:text-xs md:text-sm text-solana-purple whitespace-nowrap">
            {state.shreds}
          </div>
        </div>
      </div>

      {state.epoch > 0 && (
        <div className="flex justify-center">
          <div className="text-center p-2 border-4 border-gray-700 bg-gray-800/90 game-stat-card inline-block">
            <span className="text-[10px] text-solana-green">EPOCH </span>
            <span className="text-xs text-solana-green">{state.epoch}</span>
          </div>
        </div>
      )}

      {state.stakePower > 0 && (
        <div className="text-center">
          <div className="text-[10px] text-solana-green">
            Stake: +{(state.stakePower * 100).toFixed(0)}%
          </div>
        </div>
      )}
    </div>
  );
}






