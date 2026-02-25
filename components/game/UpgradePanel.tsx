'use client';

import { useGameStore } from '@/lib/store/gameStore';
import { UPGRADE_DEFINITIONS, getUpgradeCost, isUpgradeMaxed } from '@/lib/game/upgrades';
import type { UpgradeType } from '@/types/game';
import { formatLamports } from '@/lib/utils/formatters';

export function UpgradePanel() {
  const { state, upgrades, buyUpgrade } = useGameStore();

  const handleBuy = (upgradeType: UpgradeType) => {
    buyUpgrade(upgradeType);
  };

  const upgradeList: UpgradeType[] = [
    'hashpower1',
    'hashpower2',
    'hashpower3',
    'rpcSpeed',
    'voteCredits',
    'geyserIndex',
    'merkleOptimizer',
    'jitoTipJar',
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {upgradeList.map((upgradeType) => {
          const def = UPGRADE_DEFINITIONS[upgradeType];
          const currentLevel = upgrades[upgradeType];
          const cost = getUpgradeCost(upgradeType, currentLevel);
          const maxed = isUpgradeMaxed(upgradeType, currentLevel);
          const canAfford = def.currency === 'shreds'
            ? state.shreds >= cost
            : state.lamports >= cost;

          return (
            <div
              key={upgradeType}
              className={`
                p-3 border-4
                ${canAfford && !maxed
                  ? 'border-solana-green bg-solana-green/20'
                  : 'border-gray-600 bg-gray-800'
                }
                ${maxed ? 'opacity-60' : ''}
              `}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xs text-white">
                    {def.name}
                    {currentLevel > 0 && (
                      <span className="text-[10px] text-solana-cyan ml-1">
                        Lv{currentLevel}{def.maxLevel ? `/${def.maxLevel}` : ''}
                      </span>
                    )}
                  </h3>
                  <p className="text-[10px] text-gray-500 mt-1">{def.description}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <div className="text-[10px]">
                  <span className="text-gray-500">Cost: </span>
                  <span className={def.currency === 'shreds' ? 'text-solana-purple' : 'text-solana-green'}>
                    {def.currency === 'shreds' ? `${cost} Shreds` : formatLamports(cost)}
                  </span>
                </div>
                
                <button
                  onClick={() => handleBuy(upgradeType)}
                  disabled={!canAfford || maxed}
                  className={`
                    px-3 py-1.5 border-4 text-[10px]
                    ${canAfford && !maxed
                      ? 'bg-solana-green text-black border-gray-800 shadow-pixel-press active:translate-x-[1px] active:translate-y-[1px] active:shadow-none'
                      : 'bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed'
                    }
                  `}
                >
                  {maxed ? 'MAX' : 'Buy'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

