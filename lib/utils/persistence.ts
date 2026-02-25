import { GAME_CONSTANTS } from '../constants';
import type { GameSave, GameState, Upgrades } from '@/types/game';

const SAVE_KEY = 'epoch-clicker-save';

export function saveGame(
  state: GameState,
  upgrades: Upgrades,
  bots: number
): void {
  const save: GameSave = {
    version: GAME_CONSTANTS.SAVE_VERSION,
    state,
    upgrades,
    bots,
    lastSaveTime: Date.now(),
  };
  
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch (error) {
    console.error('Failed to save game:', error);
  }
}

export function loadGame(): GameSave | null {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) return null;
    
    const save: GameSave = JSON.parse(saved);
    
    // Version migration can be added here in the future
    if (save.version !== GAME_CONSTANTS.SAVE_VERSION) {
      // Handle version migration if needed
      console.warn('Save version mismatch, may need migration');
    }
    
    return save;
  } catch (error) {
    console.error('Failed to load game:', error);
    return null;
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (error) {
    console.error('Failed to clear save:', error);
  }
}






