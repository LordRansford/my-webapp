/**
 * Tutorial Manager
 * 
 * Manages tutorial state and provides tutorial step definitions.
 */

import type { TutorialStep } from "../components/TutorialOverlay";

export interface TutorialDefinition {
  id: string;
  gameId: string;
  name: string;
  description: string;
  steps: TutorialStep[];
}

const TUTORIAL_STORAGE_KEY = 'ransford-tutorials';
const TUTORIAL_VERSION = 1;

interface TutorialStorage {
  version: number;
  completedTutorials: string[]; // Tutorial IDs
  skippedTutorials: string[]; // Tutorial IDs
  lastShown: Record<string, number>; // tutorialId -> timestamp
}

/**
 * Load tutorial storage
 */
export function loadTutorialStorage(): TutorialStorage {
  if (typeof window === 'undefined') {
    return getDefaultStorage();
  }

  try {
    const stored = localStorage.getItem(TUTORIAL_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.version === TUTORIAL_VERSION) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Failed to load tutorial storage:', error);
  }

  return getDefaultStorage();
}

/**
 * Save tutorial storage
 */
export function saveTutorialStorage(storage: TutorialStorage): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(TUTORIAL_STORAGE_KEY, JSON.stringify(storage));
  } catch (error) {
    console.error('Failed to save tutorial storage:', error);
  }
}

function getDefaultStorage(): TutorialStorage {
  return {
    version: TUTORIAL_VERSION,
    completedTutorials: [],
    skippedTutorials: [],
    lastShown: {},
  };
}

/**
 * Check if tutorial is completed
 */
export function isTutorialCompleted(tutorialId: string): boolean {
  const storage = loadTutorialStorage();
  return storage.completedTutorials.includes(tutorialId);
}

/**
 * Check if tutorial is skipped
 */
export function isTutorialSkipped(tutorialId: string): boolean {
  const storage = loadTutorialStorage();
  return storage.skippedTutorials.includes(tutorialId);
}

/**
 * Mark tutorial as completed
 */
export function completeTutorial(tutorialId: string): void {
  const storage = loadTutorialStorage();
  if (!storage.completedTutorials.includes(tutorialId)) {
    storage.completedTutorials.push(tutorialId);
    saveTutorialStorage(storage);
  }
}

/**
 * Mark tutorial as skipped
 */
export function skipTutorial(tutorialId: string): void {
  const storage = loadTutorialStorage();
  if (!storage.skippedTutorials.includes(tutorialId)) {
    storage.skippedTutorials.push(tutorialId);
    saveTutorialStorage(storage);
  }
}

/**
 * Check if tutorial should be shown
 */
export function shouldShowTutorial(
  tutorialId: string,
  gameId: string,
  isNewPlayer: boolean = false
): boolean {
  const storage = loadTutorialStorage();
  
  // Don't show if completed or skipped
  if (storage.completedTutorials.includes(tutorialId) || 
      storage.skippedTutorials.includes(tutorialId)) {
    return false;
  }

  // Show for new players
  if (isNewPlayer) {
    return true;
  }

  // Don't show if shown recently (within 7 days)
  const lastShown = storage.lastShown[tutorialId];
  if (lastShown) {
    const daysSince = (Date.now() - lastShown) / (1000 * 60 * 60 * 24);
    if (daysSince < 7) {
      return false;
    }
  }

  return true;
}

/**
 * Record tutorial shown
 */
export function recordTutorialShown(tutorialId: string): void {
  const storage = loadTutorialStorage();
  storage.lastShown[tutorialId] = Date.now();
  saveTutorialStorage(storage);
}
