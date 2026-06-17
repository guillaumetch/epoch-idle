'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useGameStore } from '@/lib/store/gameStore';
import { useTutorial } from './useTutorial';

const SPOTLIGHT_PADDING = 8;

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface TooltipPosition {
  top: number;
  left: number;
  placement: 'top' | 'bottom';
}

function getTargetElement(target: string): HTMLElement | null {
  return document.querySelector(`[data-tutorial-target="${target}"]`);
}

function measureSpotlight(element: HTMLElement): SpotlightRect {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top - SPOTLIGHT_PADDING,
    left: rect.left - SPOTLIGHT_PADDING,
    width: rect.width + SPOTLIGHT_PADDING * 2,
    height: rect.height + SPOTLIGHT_PADDING * 2,
  };
}

function measureTooltip(
  spotlight: SpotlightRect | null,
  tooltipEl: HTMLElement | null,
  preferred: 'top' | 'bottom' | 'left' | 'right' = 'bottom'
): TooltipPosition {
  const gap = 12;
  const tooltipHeight = tooltipEl?.offsetHeight ?? 160;
  const tooltipWidth = tooltipEl?.offsetWidth ?? 280;
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;

  if (!spotlight) {
    return {
      top: viewportH / 2 - tooltipHeight / 2,
      left: viewportW / 2 - tooltipWidth / 2,
      placement: 'bottom',
    };
  }

  const centerX = spotlight.left + spotlight.width / 2;
  let placement: 'top' | 'bottom' = preferred === 'top' ? 'top' : 'bottom';

  const spaceBelow = viewportH - (spotlight.top + spotlight.height);
  const spaceAbove = spotlight.top;
  if (placement === 'bottom' && spaceBelow < tooltipHeight + gap + 16 && spaceAbove > spaceBelow) {
    placement = 'top';
  } else if (placement === 'top' && spaceAbove < tooltipHeight + gap + 16 && spaceBelow > spaceAbove) {
    placement = 'bottom';
  }

  let top =
    placement === 'bottom'
      ? spotlight.top + spotlight.height + gap
      : spotlight.top - tooltipHeight - gap;

  let left = centerX - tooltipWidth / 2;
  left = Math.max(12, Math.min(left, viewportW - tooltipWidth - 12));
  top = Math.max(12, Math.min(top, viewportH - tooltipHeight - 12));

  return { top, left, placement };
}

interface TutorialOverlayProps {
  isActive: boolean;
  onComplete: () => void;
}

export function TutorialOverlay({ isActive, onComplete }: TutorialOverlayProps) {
  const reducedMotion = useGameStore((s) => s.reducedMotion);
  const { stepIndex, currentStep, totalSteps, isLastStep, next, skip } = useTutorial(
    isActive,
    onComplete
  );

  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);
  const [tooltipPos, setTooltipPos] = useState<TooltipPosition | null>(null);
  const [targetMissing, setTargetMissing] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  const updateLayout = useCallback(() => {
    if (!currentStep) return;

    const el = getTargetElement(currentStep.target);
    if (!el) {
      setTargetMissing(true);
      setSpotlight(null);
      setTooltipPos(measureTooltip(null, tooltipRef.current, currentStep.tooltipPlacement));
      return;
    }

    setTargetMissing(false);
    const spot = measureSpotlight(el);
    setSpotlight(spot);
    setTooltipPos(
      measureTooltip(spot, tooltipRef.current, currentStep.tooltipPlacement ?? 'bottom')
    );
  }, [currentStep]);

  useLayoutEffect(() => {
    if (!isActive || !currentStep) return;

    const el = getTargetElement(currentStep.target);
    if (el) {
      el.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'center',
      });
    }

    const scrollTimer = setTimeout(updateLayout, reducedMotion ? 0 : 350);
    return () => clearTimeout(scrollTimer);
  }, [isActive, currentStep, stepIndex, reducedMotion, updateLayout]);

  useEffect(() => {
    if (!isActive || !currentStep) return;

    updateLayout();

    const onResize = () => updateLayout();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);

    const el = getTargetElement(currentStep.target);
    let observer: ResizeObserver | null = null;
    if (el && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(onResize);
      observer.observe(el);
    }

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
      observer?.disconnect();
    };
  }, [isActive, currentStep, stepIndex, updateLayout]);

  useEffect(() => {
    if (!isActive) return;
    nextButtonRef.current?.focus();
  }, [isActive, stepIndex]);

  if (!isActive || !currentStep) return null;

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none" aria-hidden={false}>
      {spotlight && !targetMissing ? (
        <div
          className="absolute rounded-sm border-2 border-solana-green pointer-events-none"
          style={{
            top: spotlight.top,
            left: spotlight.left,
            width: spotlight.width,
            height: spotlight.height,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.82)',
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-black/82 pointer-events-none" />
      )}

      <div
        ref={tooltipRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-title"
        aria-describedby="tutorial-body"
        className="absolute pointer-events-auto font-tutorial antialiased bg-gray-900 border-4 border-solana-green p-4 sm:p-5 shadow-pixel-lg max-w-[min(20rem,90vw)]"
        style={
          tooltipPos
            ? { top: tooltipPos.top, left: tooltipPos.left }
            : { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
        }
      >
        <p className="text-[11px] text-solana-cyan mb-2 tracking-wide font-medium">
          {stepIndex + 1} / {totalSteps}
        </p>
        <h2 id="tutorial-title" className="text-sm sm:text-base text-white mb-2 font-semibold tracking-tight">
          {currentStep.title}
        </h2>
        <p id="tutorial-body" className="text-xs sm:text-sm text-gray-400 mb-4 leading-relaxed font-normal">
          {currentStep.body}
        </p>
        <div className="flex gap-2">
          <button
            ref={nextButtonRef}
            type="button"
            onClick={next}
            className="flex-1 py-2 px-3 border-4 bg-gradient-solana text-white text-xs sm:text-sm font-medium border-gray-800 shadow-pixel active:translate-x-[2px] active:translate-y-[2px] active:shadow-pixel-press"
          >
            {isLastStep ? 'Got it' : 'Next'}
          </button>
          <button
            type="button"
            onClick={skip}
            className="py-2 px-3 border-4 bg-gray-800 text-gray-400 text-xs sm:text-sm font-medium border-gray-600 hover:text-gray-300"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
