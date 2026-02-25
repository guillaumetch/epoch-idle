'use client';

import { useGameStore } from '@/lib/store/gameStore';
import { getBotCost, calculateBotIncome } from '@/lib/game/bots';
import { calculateIdleMultiplier } from '@/lib/game/upgrades';
import { formatLamports, formatTPS } from '@/lib/utils/formatters';

export function BotPanel() {
  const { state, upgrades, bots, buyBot } = useGameStore();

  const botCost = getBotCost(bots);
  const canAfford = state.lamports >= botCost;
  const idleMultiplier = calculateIdleMultiplier(upgrades);
  const botIncomePerSecond = calculateBotIncome(bots, idleMultiplier);

  return (
    <div className="space-y-4">
      <div className="bg-gray-800 p-4 border-4 border-solana-cyan">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-lg text-solana-cyan mb-1">
              {bots} Bots
            </div>
            <div className="text-[10px] text-gray-500">
              Idle: {formatTPS(botIncomePerSecond)}
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-3">
            <div>
              <div className="text-[10px] text-gray-500 mb-1">Next Bot Cost</div>
              <div className="text-sm text-white">
                {formatLamports(botCost)}
              </div>
            </div>
            
            <button
              onClick={buyBot}
              disabled={!canAfford}
              className={`
                px-4 py-2 border-4 text-xs
                ${canAfford
                  ? 'bg-gradient-solana text-white border-gray-800 shadow-pixel active:translate-x-[2px] active:translate-y-[2px] active:shadow-pixel-press'
                  : 'bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed'
                }
              `}
            >
              Deploy Bot
            </button>
          </div>
          
          <div className="text-[10px] text-gray-500 mt-2">
            0.5 L/s per bot. +15% cost each.
          </div>
        </div>
      </div>
    </div>
  );
}






