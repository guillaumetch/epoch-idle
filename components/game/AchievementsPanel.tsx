'use client';

import { useGameStore } from '@/lib/store/gameStore';
import { formatNumber, formatLamports, formatTPS } from '@/lib/utils/formatters';
import { GAME_CONSTANTS } from '@/lib/constants';

export function AchievementsPanel() {
  const { state, bots, tps } = useGameStore();

  // Placeholder for Phase 3 - ACHIEVO integration
  const achievements = [
    {
      id: 'validator-novice',
      name: 'Validator Novice',
      description: 'Process 100 slots',
      current: state.totalSlotsProcessed,
      target: 100,
      unlocked: state.totalSlotsProcessed >= 100,
      progress: Math.min((state.totalSlotsProcessed / 100) * 100, 100),
      formatValue: (val: number) => formatNumber(val),
    },
    {
      id: 'blocksmith',
      name: 'Blocksmith',
      description: 'Process 1,000 slots',
      current: state.totalSlotsProcessed,
      target: 1000,
      unlocked: state.totalSlotsProcessed >= 1000,
      progress: Math.min((state.totalSlotsProcessed / 1000) * 100, 100),
      formatValue: (val: number) => formatNumber(val),
    },
    {
      id: 'first-sol',
      name: 'First SOL',
      description: 'Earn ≥ 1 SOL total',
      current: state.totalLamportsEarned,
      target: 1_000_000_000,
      unlocked: state.totalLamportsEarned >= 1_000_000_000,
      progress: Math.min((state.totalLamportsEarned / 1_000_000_000) * 100, 100),
      formatValue: (val: number) => {
        // Always show in L (lamports) format for consistency
        // Use B for billion instead of scientific notation
        if (val >= 1_000_000_000) {
          return `${(val / 1_000_000_000).toFixed(2)}B L`;
        }
        if (val >= 1_000_000) {
          return `${(val / 1_000_000).toFixed(2)}M L`;
        }
        if (val >= 1_000) {
          return `${(val / 1_000).toFixed(2)}K L`;
        }
        return `${val.toFixed(2)} L`;
      },
    },
    {
      id: 'botnet-online',
      name: 'Botnet Online',
      description: 'Own 10 BPF Bots',
      current: bots,
      target: 10,
      unlocked: bots >= 10,
      progress: Math.min((bots / 10) * 100, 100),
      formatValue: (val: number) => formatNumber(val),
    },
    {
      id: 'epoch-runner',
      name: 'Epoch Runner',
      description: 'First prestige',
      current: state.epoch > 0 ? 1 : 0,
      target: 1,
      unlocked: state.epoch > 0,
      progress: state.epoch > 0 ? 100 : 0,
      formatValue: (val: number) => formatNumber(val),
    },
    {
      id: 'tps-10',
      name: 'TPS 10',
      description: 'Reach 10 L/s throughput',
      current: tps,
      target: 10,
      unlocked: tps >= 10,
      progress: Math.min((tps / 10) * 100, 100),
      formatValue: (val: number) => formatTPS(val),
    },
    {
      id: 'shard-hunter',
      name: 'Shard Hunter',
      description: 'First Shred drop',
      current: state.shreds > 0 ? 1 : 0,
      target: 1,
      unlocked: state.shreds > 0,
      progress: state.shreds > 0 ? 100 : 0,
      formatValue: (val: number) => formatNumber(val),
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-base text-white mb-4">ACHIEVEMENTS</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`
              p-3 border-4
              ${achievement.unlocked
                ? 'border-solana-green bg-solana-green/20'
                : 'border-gray-600 bg-gray-800'
              }
            `}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="text-xs text-white mb-1">
                  {achievement.name}
                </h3>
                <p className="text-[10px] text-gray-500">{achievement.description}</p>
              </div>
            </div>
            
            {!achievement.unlocked && achievement.progress > 0 && (
              <div className="mt-2">
                <div className="w-full bg-gray-700 h-2 border border-gray-600">
                  <div
                    className="bg-solana-cyan h-full transition-all duration-300"
                    style={{ width: `${achievement.progress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-gray-500 mt-1">
                  <span>{achievement.progress.toFixed(0)}%</span>
                  <span>
                    {achievement.formatValue(achievement.current)} / {achievement.formatValue(achievement.target)}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

