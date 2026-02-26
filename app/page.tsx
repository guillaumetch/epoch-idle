'use client';

import { useEffect, useState, useRef } from 'react';
import { useGameStore } from '@/lib/store/gameStore';
import { ResourceDisplay } from '@/components/game/ResourceDisplay';
import { ClickButton } from '@/components/game/ClickButton';
import { UpgradePanel } from '@/components/game/UpgradePanel';
import { BotPanel } from '@/components/game/BotPanel';
import { PrestigePanel } from '@/components/game/PrestigePanel';
import { AchievementsPanel } from '@/components/game/AchievementsPanel';
import { OfflineClaimPopup } from '@/components/game/OfflineClaimPopup';
import { ValidatorStatusBar } from '@/components/game/ValidatorStatusBar';
import { ControlPanelPanel } from '@/components/game/ControlPanelPanel';

type Tab = 'main' | 'upgrades' | 'automation' | 'epoch' | 'achievements' | 'settings';

const TAB_LABELS: Record<Tab, string> = {
  main: 'Dashboard',
  upgrades: 'Upgrades',
  automation: 'BPF Bots',
  epoch: 'Epoch',
  achievements: 'Achievements',
  settings: 'Config',
};

export default function Home() {
  const { load, toggleMute, toggleReducedMotion, isMuted, reducedMotion, _stopLoop } = useGameStore();
  const [activeTab, setActiveTab] = useState<Tab>('main');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [homeBgBlocks, setHomeBgBlocks] = useState<{ id: number; left: number; top: number; dx: number; dy: number }[]>([]);
  const homeBlockIdRef = useRef(0);

  useEffect(() => {
    load();
    setIsLoaded(true);
    
    return () => {
      _stopLoop();
    };
  }, [load, _stopLoop]);

  useEffect(() => {
    if (!isLoaded) return;
    const onVisibilityChange = () => {
      const { handlePageHidden, handlePageVisible } = useGameStore.getState();
      if (document.hidden) {
        handlePageHidden();
      } else {
        handlePageVisible();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [isLoaded]);

  useEffect(() => {
    if (hasStarted || !isLoaded) return;
    const spawn = () => {
      setHomeBgBlocks((prev) => {
        if (prev.length >= 14) return prev;
        const left = 10 + Math.random() * 80;
        const top = 15 + Math.random() * 70;
        const dirX = left - 50;
        const dirY = top - 50;
        const len = Math.hypot(dirX, dirY) || 1;
        const dist = 60 + Math.random() * 50;
        const id = ++homeBlockIdRef.current;
        setTimeout(() => {
          setHomeBgBlocks((b) => b.filter((block) => block.id !== id));
        }, 1850);
        return [...prev, { id, left, top, dx: (dirX / len) * dist, dy: (dirY / len) * dist }];
      });
    };
    spawn();
    const t = setInterval(spawn, 700);
    return () => clearInterval(t);
  }, [hasStarted, isLoaded]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center font-pixel">
        <div className="text-solana-cyan text-xs animate-pulse-neon">NODE STARTING...</div>
      </div>
    );
  }

  if (!hasStarted) {
    const dots = Array.from({ length: 12 }, (_, i) => ({ id: i, x: 5 + (i * 8) + (i % 3) * 15, y: 10 + (i % 5) * 18, delay: i * 0.4 }));
    return (
      <main className="home-aaa min-h-screen flex flex-col items-center justify-center font-pixel relative">
        <div className="home-aaa-grid" aria-hidden />
        <div className="home-corner home-corner-tl" aria-hidden />
        <div className="home-corner home-corner-tr" aria-hidden />
        <div className="home-corner home-corner-bl" aria-hidden />
        <div className="home-corner home-corner-br" aria-hidden />
        {homeBgBlocks.map((block) => (
          <div
            key={block.id}
            className="absolute w-2 h-2 border border-solana-green/80 bg-solana-purple/40 home-bg-block-expel z-0"
            style={{
              left: `${block.left}%`,
              top: `${block.top}%`,
              ['--dx' as string]: `${block.dx}px`,
              ['--dy' as string]: `${block.dy}px`,
            }}
            aria-hidden
          />
        ))}
        {dots.map((d) => (
          <div
            key={d.id}
            className="home-float-dot absolute w-1 h-1 rounded-full bg-solana-purple pointer-events-none"
            style={{
              left: `${d.x}%`,
              top: `${d.y}%`,
              animationDelay: `${d.delay}s`,
            }}
            aria-hidden
          />
        ))}
        <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center overflow-visible shrink-0">
          <p className="text-solana-cyan/80 text-[10px] tracking-[0.3em] uppercase mb-4 md:mb-6">
            Your validator awaits.
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 bg-gradient-solana bg-clip-text text-transparent home-title-glow tracking-tight">
            EPOCH Idle
          </h1>
          <div className="text-gray-500 text-xs md:text-sm mb-14 md:mb-20 tracking-wide text-center space-y-1 overflow-visible shrink-0">
            <p>Process slots. Earn lamports.</p>
            <p>Take the lead.</p>
          </div>
          <button
            type="button"
            onClick={() => setHasStarted(true)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setHasStarted(true); } }}
            className="home-cta-pulse px-8 py-4 border-2 border-solana-green bg-solana-green/10 backdrop-blur-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-solana-green focus:ring-offset-2 focus:ring-offset-[#0a0a0c]"
            aria-label="Click to start game"
          >
            <span className="text-solana-green text-sm md:text-base font-bold tracking-widest">
              Click to start
            </span>
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="game-aaa flex flex-col h-screen max-h-screen w-full overflow-hidden">
      <div className="game-aaa-grid" aria-hidden />
      <div className="game-corner game-corner-tl" aria-hidden />
      <div className="game-corner game-corner-tr" aria-hidden />
      <div className="game-corner game-corner-bl" aria-hidden />
      <div className="game-corner game-corner-br" aria-hidden />
      <OfflineClaimPopup />

      {/* Control panel: responsive inset so content fits on mobile and desktop */}
      <div className="flex-1 flex flex-col min-h-0 w-full max-w-full box-border game-monitor game-monitor-padding">
        <div className="flex-1 flex flex-col min-h-0 w-full overflow-hidden game-screen px-1 sm:px-2 md:px-4 pb-1 sm:pb-2">
          <ValidatorStatusBar />

          {activeTab === 'achievements' ? (
            <div className="flex-1 p-4 md:p-6 min-h-0 overflow-auto">
              <AchievementsPanel />
            </div>
          ) : activeTab === 'settings' ? (
            <div className="flex-1 p-4 md:p-6 min-h-0 overflow-auto">
              <h2 className="text-base game-panel-title mb-4">CONFIG</h2>
              <div className="space-y-3 max-w-md">
                <div className="flex items-center justify-between p-3 bg-gray-800 border-4 border-gray-600">
                  <div>
                    <div className="text-white text-xs">Sound</div>
                    <div className="text-[10px] text-gray-500">Audio feedback</div>
                  </div>
                  <button
                    onClick={toggleMute}
                    className={`
                      px-3 py-2 border-4 text-xs
                      ${isMuted
                        ? 'bg-gray-700 text-gray-500 border-gray-600'
                        : 'bg-solana-green text-black border-gray-800 shadow-pixel-press'
                      }
                    `}
                  >
                    {isMuted ? 'Off' : 'On'}
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800 border-4 border-gray-600">
                  <div>
                    <div className="text-white text-xs">Reduced Motion</div>
                    <div className="text-[10px] text-gray-500">Accessibility</div>
                  </div>
                  <button
                    onClick={toggleReducedMotion}
                    className={`
                      px-3 py-2 border-4 text-xs
                      ${reducedMotion
                        ? 'bg-solana-green text-black border-gray-800 shadow-pixel-press'
                        : 'bg-gray-700 text-gray-500 border-gray-600'
                      }
                    `}
                  >
                    {reducedMotion ? 'On' : 'Off'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 min-h-0 items-stretch overflow-auto">
              {/* Column 1: Validator Dashboard */}
              <div className="flex flex-col min-h-0">
                <ControlPanelPanel title="VALIDATOR DASHBOARD" className="flex-1 flex flex-col min-h-0">
                  <div className="flex flex-col h-full">
                    <ResourceDisplay />
                    <div className="flex flex-col items-center justify-center mt-2 sm:mt-4 flex-1">
                      <ClickButton />
                    </div>
                  </div>
                </ControlPanelPanel>
              </div>

              {/* Column 2: Upgrades */}
              <div className="flex flex-col min-h-0">
                <ControlPanelPanel title="UPGRADES" className="flex-1 flex flex-col min-h-0">
                  <UpgradePanel />
                </ControlPanelPanel>
              </div>

              {/* Column 3: BPF Bots + Epoch */}
              <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 min-h-0">
                <ControlPanelPanel title="BPF BOTS" className="flex-[0.4] flex flex-col min-h-0">
                  <BotPanel />
                </ControlPanelPanel>
                <ControlPanelPanel title="EPOCH" className="flex-[0.6] flex flex-col min-h-0">
                  <PrestigePanel />
                </ControlPanelPanel>
              </div>
            </div>
          )}

          <nav className="game-nav px-2 sm:px-4 md:px-6 py-2 sm:py-2.5 flex-shrink-0">
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 md:gap-3">
              {(['main', 'upgrades', 'automation', 'epoch', 'achievements', 'settings'] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`
                    min-h-[44px] min-w-[44px] px-2.5 sm:px-3 py-2.5 sm:py-2 border-2 text-[8px] sm:text-[10px] rounded-sm transition-all duration-200
                    ${activeTab === tab
                      ? 'bg-solana-purple/90 text-white border-solana-purple game-tab-active'
                      : 'bg-gray-800/80 text-gray-400 border-gray-600 hover:bg-gray-700/80 hover:text-gray-300'
                    }
                  `}
                >
                  {TAB_LABELS[tab]}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </main>
  );
}






