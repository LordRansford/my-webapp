/**
 * Streak Tracker
 * 
 * Tracks daily streaks for Daily Logic Gauntlet
 */

/**
 * Streak data
 */
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string; // YYYY-MM-DD
  freePassesUsed: number;
  freePassesAvailable: number;
}

/**
 * Get today's date string (YYYY-MM-DD UTC)
 */
export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getUTCFullYear();
  const month = String(today.getUTCMonth() + 1).padStart(2, '0');
  const day = String(today.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if streak should continue
 */
export function shouldContinueStreak(
  streakData: StreakData,
  completedToday: boolean
): boolean {
  const today = getTodayDateString();
  
  // If already played today, streak continues
  if (streakData.lastPlayedDate === today) {
    return completedToday;
  }
  
  // Check if yesterday (streak continuation)
  const yesterday = getYesterdayDateString();
  if (streakData.lastPlayedDate === yesterday) {
    return completedToday;
  }
  
  // Streak broken (more than 1 day gap)
  return false;
}

/**
 * Get yesterday's date string
 */
function getYesterdayDateString(): string {
  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const year = yesterday.getUTCFullYear();
  const month = String(yesterday.getUTCMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Update streak after completion
 */
export function updateStreak(
  streakData: StreakData,
  completed: boolean
): StreakData {
  const today = getTodayDateString();
  
  if (!completed) {
    // No change if not completed
    return streakData;
  }
  
  // If already played today, no change
  if (streakData.lastPlayedDate === today) {
    return streakData;
  }
  
  const yesterday = getYesterdayDateString();
  let newStreak = streakData.currentStreak;
  
  // Continue streak if played yesterday
  if (streakData.lastPlayedDate === yesterday) {
    newStreak += 1;
  } else if (streakData.lastPlayedDate !== today) {
    // Reset streak if gap > 1 day
    newStreak = 1;
  }
  
  // Update longest streak
  const longestStreak = Math.max(streakData.longestStreak, newStreak);
  
  return {
    currentStreak: newStreak,
    longestStreak,
    lastPlayedDate: today,
    freePassesUsed: streakData.freePassesUsed,
    freePassesAvailable: streakData.freePassesAvailable,
  };
}

/**
 * Use free pass (skip one day without breaking streak)
 */
export function useFreePass(streakData: StreakData): StreakData {
  if (streakData.freePassesAvailable <= 0) {
    return streakData; // No free passes available
  }
  
  const today = getTodayDateString();
  
  return {
    ...streakData,
    lastPlayedDate: today, // Mark as played today (using free pass)
    freePassesUsed: streakData.freePassesUsed + 1,
    freePassesAvailable: streakData.freePassesAvailable - 1,
  };
}

/**
 * Check if free pass can be used today
 */
export function canUseFreePass(streakData: StreakData): boolean {
  const today = getTodayDateString();
  
  // Can't use if already played today
  if (streakData.lastPlayedDate === today) {
    return false;
  }
  
  // Can use if have available passes
  return streakData.freePassesAvailable > 0;
}

/**
 * Create default streak data
 */
export function createDefaultStreak(): StreakData {
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastPlayedDate: '',
    freePassesUsed: 0,
    freePassesAvailable: 1, // Start with 1 free pass
  };
}

/**
 * Reset free passes (monthly)
 */
export function resetFreePasses(streakData: StreakData): StreakData {
  return {
    ...streakData,
    freePassesUsed: 0,
    freePassesAvailable: 1, // Reset to 1 per month
  };
}
