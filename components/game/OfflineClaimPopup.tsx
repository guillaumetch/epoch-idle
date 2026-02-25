'use client';

import { useGameStore } from '@/lib/store/gameStore';
import { formatOfflineTime } from '@/lib/utils/formatters';

function formatExactLamports(lamports: number): string {
  return `${lamports} L`;
}

export function OfflineClaimPopup() {
  const { pendingOfflineClaim, dismissOfflineClaim } = useGameStore();

  if (!pendingOfflineClaim) return null;

  const { lamports, offlineSeconds } = pendingOfflineClaim;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-gray-900 border-4 border-solana-green max-w-md w-full p-6 text-center shadow-pixel-lg">
        <div className="text-solana-green text-2xl mb-2">+</div>
        <h3 className="text-sm text-white mb-2">PASSIVE INCOME</h3>
        <p className="text-[10px] text-gray-400 mb-1">
          Bots earned <span className="text-solana-green">{formatExactLamports(lamports)}</span> away.
        </p>
        <p className="text-[10px] text-gray-500 mb-4">
          Away: <span className="text-solana-cyan">{formatOfflineTime(offlineSeconds)}</span>
        </p>
        <button
          onClick={dismissOfflineClaim}
          className="w-full py-2 px-4 border-4 bg-gradient-solana text-white text-xs border-gray-800 shadow-pixel active:translate-x-[2px] active:translate-y-[2px] active:shadow-pixel-press"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
