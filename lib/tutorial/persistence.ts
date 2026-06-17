const TUTORIAL_COMPLETE_KEY = 'epoch-clicker-tutorial-complete';

export function isTutorialComplete(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(TUTORIAL_COMPLETE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markTutorialComplete(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TUTORIAL_COMPLETE_KEY, 'true');
  } catch {
    // ignore
  }
}
