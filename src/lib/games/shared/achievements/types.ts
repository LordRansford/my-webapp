/**
 * Achievement System Types
 */

export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type AchievementCategory = 'progress' | 'skill' | 'streak' | 'milestone' | 'special';

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  icon?: string;
  gameId?: string; // If null, it's a cross-game achievement
  checkCondition?: (context: AchievementContext) => boolean;
  progressCondition?: (context: AchievementContext) => number; // 0-1
}

export interface AchievementUnlock {
  achievementId: string;
  unlockedAt: number;
  gameId?: string;
}

export interface AchievementStorage {
  unlocked: AchievementUnlock[];
  progress: Record<string, number>; // achievementId -> progress (0-1)
  version: number;
}

export interface AchievementContext {
  gameId: string;
  currentStreak?: number;
  gamesCompleted?: number;
  score?: number;
  time?: number;
  [key: string]: unknown; // Allow additional context
}

export interface AchievementCheckResult {
  newlyUnlocked: string[];
  updatedProgress: Record<string, number>;
}