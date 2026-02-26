'use client';

import { useState, useCallback } from 'react';
import { useGameStore } from '@/lib/store/gameStore';
import { formatNumber } from '@/lib/utils/formatters';

function formatRewardShort(lamports: number): string {
  if (lamports >= 1_000_000) return `${formatNumber(lamports / 1_000_000)}M L`;
  if (lamports >= 1_000) return `${formatNumber(lamports / 1_000)}K L`;
  return `${Math.round(lamports)} L`;
}

export function ClickButton() {
  const { click, reducedMotion } = useGameStore();
  const [isPressed, setIsPressed] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [floatingReward, setFloatingReward] = useState<{ lamports: number; jitoBonus: number } | null>(null);
  const [showBlocksAround, setShowBlocksAround] = useState(false);
  const [expelBlocks, setExpelBlocks] = useState<{ left: number; top: number; dx: number; dy: number }[]>([]);
  const [showCrit, setShowCrit] = useState(false);
  const [showShred, setShowShred] = useState(false);
  const [shredCount, setShredCount] = useState(0);

  const handleClick = useCallback(() => {
    const result = click();
    if (!result) return;

    if (!reducedMotion) {
      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 120);
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 260);
      setFloatingReward({ lamports: result.lamports, jitoBonus: result.jitoBonus });
      const count = 6 + Math.floor(Math.random() * 4);
      const blocks: { left: number; top: number; dx: number; dy: number }[] = [];
      const expelDistance = 100;
      for (let i = 0; i < count; i++) {
        const left = 15 + Math.random() * 70;
        const top = 15 + Math.random() * 70;
        const dirX = left - 50;
        const dirY = top - 50;
        const len = Math.hypot(dirX, dirY) || 1;
        blocks.push({
          left,
          top,
          dx: (dirX / len) * expelDistance,
          dy: (dirY / len) * expelDistance,
        });
      }
      setExpelBlocks(blocks);
      setShowBlocksAround(true);
      setTimeout(() => {
        setShowBlocksAround(false);
        setExpelBlocks([]);
      }, 500);
      setTimeout(() => setFloatingReward(null), 800);
    }

    if (result.isCrit) {
      setShowCrit(true);
      setTimeout(() => setShowCrit(false), 1100);
    }
    if (result.shreds > 0) {
      setShredCount(result.shreds);
      setShowShred(true);
      setTimeout(() => setShowShred(false), 1400);
    }
  }, [click, reducedMotion]);

  return (
    <div className="relative flex flex-col items-center justify-center mb-6">
      {/* Wrapper: room for expelled blocks to show outside button */}
      <div className="relative w-40 h-40 sm:w-52 sm:h-52 md:w-60 md:h-60 max-w-[min(14rem,85vw)] max-h-[min(14rem,85vw)]">
        {/* Blocks: appear at random spots on the button, expel outward, then disappear */}
        {showBlocksAround && !reducedMotion && expelBlocks.length > 0 && (
          <div className="absolute inset-0 overflow-visible pointer-events-none z-10">
            {expelBlocks.map((block, i) => (
              <div
                key={`${i}-${block.left}-${block.top}-${block.dx}-${block.dy}`}
                className="absolute w-3 h-3 border-2 border-solana-green bg-solana-purple/90 animate-block-expel-out"
                style={{
                  left: `${block.left}%`,
                  top: `${block.top}%`,
                  ['--dx' as string]: `${block.dx}px`,
                  ['--dy' as string]: `${block.dy}px`,
                  animationDelay: `${i * 30}ms`,
                }}
              />
            ))}
          </div>
        )}

        {/* Main produce-slot button */}
        <button
          onClick={handleClick}
          className={`
            relative w-full h-full
            border-4 rounded-pixel
            bg-gradient-solana
            text-white text-center
            shadow-[6px_6px_0_rgba(0,0,0,0.9)]
            focus:outline-none focus:border-solana-green
            transition-shadow duration-150
            z-0
            ${isPressed ? 'translate-x-[3px] translate-y-[3px] shadow-[2px_2px_0_rgba(0,0,0,0.9)]' : ''}
            ${showFlash && !reducedMotion ? 'animate-slot-flash' : ''}
          `}
        >
          <span className="absolute inset-0 rounded-pixel slot-button-inner pointer-events-none" />
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <span className="text-[10px] text-white/80">SLOT</span>
            <span className="text-sm md:text-base leading-tight">PRODUCE</span>
          </span>
        </button>
      </div>

      {/* Reward text - float up from button center */}
      {floatingReward && !reducedMotion && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none animate-float-up gap-0.5">
          <span className="text-solana-green text-xs whitespace-nowrap" style={{ textShadow: '2px 2px 0 #000' }}>
            +{formatRewardShort(floatingReward.lamports)}
          </span>
          {floatingReward.jitoBonus > 0 && (
            <span className="text-[10px] text-solana-cyan mt-0.5" style={{ textShadow: '1px 1px 0 #000' }}>
              JITO +{formatRewardShort(floatingReward.jitoBonus)}
            </span>
          )}
        </div>
      )}

      <p className="text-[10px] text-gray-500 mt-8">Leader slot — click to produce block</p>

      {/* Crit overlay - pops in above button */}
      {showCrit && !reducedMotion && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
          style={{ paddingTop: '0' }}
        >
          <div
            className="text-base text-solana-green animate-pop-in font-bold px-3 py-2 border-4 border-solana-green bg-black/80"
            style={{ textShadow: '3px 3px 0 #000', boxShadow: '3px 3px 0 #000' }}
          >
            CRIT! x10
          </div>
        </div>
      )}

      {/* Shred overlay */}
      {showShred && !reducedMotion && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div
            className="text-sm text-solana-purple animate-pop-in font-bold px-3 py-2 border-4 border-solana-purple bg-black/80"
            style={{ textShadow: '3px 3px 0 #000', boxShadow: '3px 3px 0 #000' }}
          >
            SHRED! +{shredCount}
          </div>
        </div>
      )}
    </div>
  );
}
