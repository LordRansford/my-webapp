/**
 * Streak Tracking Types
 */

export interface StreakData {
  gameId: string;
  currentStreak: number;
  longestStreak: number;
  lastPlayDate: string | null; // YYYY-MM-DD
  streakFreezesUsed: number; // Per month
  lastFreezeReset: string; // YYYY-MM
}

export interface StreakStorage {
  streaks: Record<string, StreakData>; // key: gameId
  lastUpdated: number;
}