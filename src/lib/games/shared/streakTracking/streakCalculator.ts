/**
 * Streak Calculator
 */

import { getTodayDateString, getCurrentMonthString, getDaysDifference } from "./dateUtils";
import { getStreakData, setStreakData } from "./streakStorage";
import type { StreakData } from "./types";

/**
 * Create default streak data
 */
export function createDefaultStreakData(gameId: string): StreakData {
  return {
    gameId,
    currentStreak: 0,
    longestStreak: 0,
    lastPlayDate: null,
    streakFreezesUsed: 0,
    lastFreezeReset: getCurrentMonthString(),
  };
}

/**
 * Update streak for a game after playing
 */
export function updateStreakForGame(gameId: string, played: boolean): StreakData {
  const today = getTodayDateString();
  const currentMonth = getCurrentMonthString();
  
  let streakData = getStreakData(gameId);
  
  if (!streakData) {
    streakData = createDefaultStreakData(gameId);
  }
  
  // Reset freeze count if new month
  if (streakData.lastFreezeReset !== currentMonth) {
    streakData.streakFreezesUsed = 0;
    streakData.lastFreezeReset = currentMonth;
  }
  
  if (!played) {
    // Just return current data if not played
    setStreakData(gameId, streakData);
    return streakData;
  }
  
  // Update streak
  if (!streakData.lastPlayDate) {
    // First time playing
    streakData.currentStreak = 1;
    streakData.lastPlayDate = today;
  } else if (streakData.lastPlayDate === today) {
    // Already played today - no change
    // Do nothing
  } else {
    const daysDiff = getDaysDifference(streakData.lastPlayDate);
    
    if (daysDiff === 1) {
      // Consecutive day - increment streak
      streakData.currentStreak += 1;
      streakData.lastPlayDate = today;
    } else if (daysDiff === 0) {
      // Same day - no change
      // Do nothing
    } else {
      // Streak broken - reset to 1
      streakData.currentStreak = 1;
      streakData.lastPlayDate = today;
    }
  }
  
  // Update longest streak
  if (streakData.currentStreak > streakData.longestStreak) {
    streakData.longestStreak = streakData.currentStreak;
  }
  
  setStreakData(gameId, streakData);
  return streakData;
}