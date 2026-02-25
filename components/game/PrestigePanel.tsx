'use client';

import { useState } from 'react';
import { useGameStore } from '@/lib/store/gameStore';
import { canPrestige, calculateNewStakePower } from '@/lib/game/prestige';
import { GAME_CONSTANTS } from '@/lib/constants';
import { formatLamports } from '@/lib/utils/formatters';

export function PrestigePanel() {
  const { state, prestige, reducedMotion } = useGameStore();
  const [showConfirm, setShowConfirm] = useState(false);

  const canPrestigeNow = canPrestige(state);
  const newStakePower = calculateNewStakePower(state.stakePower);
  const progress = Math.min((state.lamports / GAME_CONSTANTS.PRESTIGE_THRESHOLD) * 100, 100);

  const handlePrestige = () => {
    if (showConfirm) {
      prestige();
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-800 p-4 border-4 border-solana-purple">
        <div className="mb-4">
          <div className="text-[10px] text-gray-500 mb-2">
            Progress to Next Epoch
          </div>
          <div className="w-full bg-gray-700 h-4 mb-2 border-2 border-gray-600">
            <div
              className="bg-solana-purple h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-[10px] text-white">
            {formatLamports(state.lamports)} / 1B L
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
            <span className="text-xs text-white">Epoch: {state.epoch}</span>
            <span className="text-[10px] text-gray-500">
              Stake: +{(state.stakePower * 100).toFixed(0)}%
            </span>
          </div>
          {canPrestigeNow && (
            <div className="text-[10px] text-solana-green mt-1">
              Next: +{(newStakePower * 100).toFixed(0)}%
            </div>
          )}
        </div>
        
        {showConfirm ? (
          <div className="space-y-4">
            <div className="bg-yellow-900/50 border-4 border-yellow-600 p-3">
              <div className="text-yellow-200 text-xs mb-1">WARNING</div>
              <div className="text-[10px] text-yellow-100">
                Reset lamports, upgrades, bots. Keep Stake +20%. Sure?
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrestige}
                className="flex-1 px-4 py-2 border-4 bg-red-600 text-white text-xs border-red-800 shadow-pixel active:translate-x-[2px] active:translate-y-[2px] active:shadow-pixel-press hover:bg-red-500"
              >
                CONFIRM OFF
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 border-4 bg-gray-700 text-white text-xs border-gray-600 active:translate-x-[1px] active:translate-y-[1px]"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <button
              onClick={handlePrestige}
              disabled={!canPrestigeNow}
              className={`
                w-32 h-32 rounded-full border-4 text-sm
                flex flex-col items-center justify-center gap-0
                transition-transform
                ${canPrestigeNow
                  ? 'bg-red-600 text-white border-red-800 shadow-[4px_4px_0_rgba(0,0,0,0.8)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_rgba(0,0,0,0.8)] hover:bg-red-500 cursor-pointer'
                  : 'bg-red-950 text-red-800 border-red-900 cursor-not-allowed shadow-none'
                }
              `}
            >
              <span className="text-[10px] opacity-80">ON</span>
              <span className="text-lg font-bold">OFF</span>
            </button>
            <p className="text-[10px] text-gray-500 mt-2">Advance Epoch</p>
          </div>
        )}
      </div>
      
      {canPrestigeNow && !showConfirm && !reducedMotion && (
        <div className="text-center text-[10px] text-solana-green animate-pulse-neon">
          Ready — hit the button
        </div>
      )}
    </div>
  );
}






