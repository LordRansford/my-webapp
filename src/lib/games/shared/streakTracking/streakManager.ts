/**
 * Streak Manager
 * 
 * High-level API for streak tracking
 */

import { getStreakData } from "./streakStorage";
import { updateStreakForGame as updateStreakInternal } from "./streakCalculator";

/**
 * Get streak data for a game
 */
export function getStreakDataForGame(gameId: string) {
  return getStreakData(gameId) || {
    gameId,
    currentStreak: 0,
    longestStreak: 0,
    lastPlayDate: null,
    streakFreezesUsed: 0,
    lastFreezeReset: new Date().toISOString().slice(0, 7),
  };
}

/**
 * Update streak when game is completed
 */
export function updateStreakForGame(gameId: string, completed: boolean) {
  return updateStreakInternal(gameId, completed);
}