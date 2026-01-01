/**
 * Achievement Storage
 */

import type { AchievementStorage, AchievementUnlock } from "./types";

const STORAGE_KEY = 'ransford-achievements';
const STORAGE_VERSION = 1;

/**
 * Load achievement storage
 */
export function loadAchievementStorage(): AchievementStorage {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as AchievementStorage;
      // Migrate if needed
      if (parsed.version !== STORAGE_VERSION) {
        return createDefaultStorage();
      }
      // Convert arrays back to proper format
      parsed.unlocked = parsed.unlocked || [];
      parsed.progress = parsed.progress || {};
      return parsed;
    }
  } catch (error) {
    console.error('Error loading achievements:', error);
  }
  
  return createDefaultStorage();
}

/**
 * Save achievement storage
 */
export function saveAchievementStorage(storage: AchievementStorage): void {
  try {
    storage.version = STORAGE_VERSION;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
  } catch (error) {
    console.error('Error saving achievements:', error);
  }
}

/**
 * Create default storage
 */
export function createDefaultStorage(): AchievementStorage {
  return {
    unlocked: [],
    progress: {},
    version: STORAGE_VERSION,
  };
}

/**
 * Check if achievement is unlocked
 */
export function isAchievementUnlocked(achievementId: string, storage: AchievementStorage): boolean {
  return storage.unlocked.some(u => u.achievementId === achievementId);
}

/**
 * Unlock achievement
 */
export function unlockAchievement(achievementId: string, gameId?: string, storage?: AchievementStorage): AchievementStorage {
  const currentStorage = storage || loadAchievementStorage();
  
  if (!isAchievementUnlocked(achievementId, currentStorage)) {
    currentStorage.unlocked.push({
      achievementId,
      unlockedAt: Date.now(),
      gameId,
    });
    saveAchievementStorage(currentStorage);
  }
  
  return currentStorage;
}

/**
 * Update achievement progress
 */
export function updateAchievementProgress(achievementId: string, progress: number, storage?: AchievementStorage): AchievementStorage {
  const currentStorage = storage || loadAchievementStorage();
  currentStorage.progress[achievementId] = Math.max(0, Math.min(1, progress));
  saveAchievementStorage(currentStorage);
  return currentStorage;
}

/**
 * Get achievement progress
 */
export function getAchievementProgress(achievementId: string, storage: AchievementStorage): number {
  return storage.progress[achievementId] || 0;
}

/**
 * Get achievement unlock
 */
export function getAchievementUnlock(achievementId: string, storage: AchievementStorage): AchievementUnlock | undefined {
  return storage.unlocked.find(u => u.achievementId === achievementId);
}

/**
 * Clear achievement storage (for testing)
 */
export function clearAchievementStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}