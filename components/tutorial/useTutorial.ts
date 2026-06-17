'use client';

import { useCallback, useState } from 'react';
import { TUTORIAL_STEPS } from '@/lib/tutorial/steps';
import { markTutorialComplete } from '@/lib/tutorial/persistence';

export function useTutorial(isActive: boolean, onComplete: () => void) {
  const [stepIndex, setStepIndex] = useState(0);

  const finish = useCallback(() => {
    markTutorialComplete();
    onComplete();
  }, [onComplete]);

  const next = useCallback(() => {
    if (stepIndex >= TUTORIAL_STEPS.length - 1) {
      finish();
    } else {
      setStepIndex((i) => i + 1);
    }
  }, [stepIndex, finish]);

  const skip = useCallback(() => {
    finish();
  }, [finish]);

  const currentStep = isActive ? TUTORIAL_STEPS[stepIndex] : null;
  const isLastStep = stepIndex >= TUTORIAL_STEPS.length - 1;

  return {
    stepIndex,
    currentStep,
    totalSteps: TUTORIAL_STEPS.length,
    isLastStep,
    next,
    skip,
  };
}
