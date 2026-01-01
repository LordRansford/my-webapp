/**
 * Streak Storage
 */

import type { StreakData, StreakStorage } from "./types";

const STORAGE_KEY = 'ransford-streaks';

/**
 * Load streaks from storage
 */
export function loadStreakStorage(): StreakStorage {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as StreakStorage;
    }
  } catch (error) {
    console.error('Error loading streaks:', error);
  }
  
  return {
    streaks: {},
    lastUpdated: Date.now(),
  };
}

/**
 * Save streaks to storage
 */
export function saveStreakStorage(storage: StreakStorage): void {
  try {
    storage.lastUpdated = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
  } catch (error) {
    console.error('Error saving streaks:', error);
  }
}

/**
 * Get streak data for a game
 */
export function getStreakData(gameId: string): StreakData | null {
  const storage = loadStreakStorage();
  return storage.streaks[gameId] || null;
}

/**
 * Set streak data for a game
 */
export function setStreakData(gameId: string, data: StreakData): void {
  const storage = loadStreakStorage();
  storage.streaks[gameId] = data;
  saveStreakStorage(storage);
}