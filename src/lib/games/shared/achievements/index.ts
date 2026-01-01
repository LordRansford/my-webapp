/**
 * Cross-Game Achievement System
 * 
 * Shared achievement system for all games.
 * 
 * Usage:
 * ```typescript
 * import { checkAndUnlockAchievements, getAchievementStats } from '@/lib/games/shared/achievements';
 * 
 * // Check and unlock achievements
 * const result = checkAndUnlockAchievements({
 *   gameId: 'constraint-optimizer',
 *   currentStreak: 10,
 *   gamesCompleted: 50,
 * });
 * 
 * // Get stats
 * const stats = getAchievementStats();
 * ```
 */

// Types
export type {
  AchievementRarity,
  AchievementCategory,
  AchievementDefinition,
  AchievementUnlock,
  AchievementStorage,
  AchievementContext,
  AchievementCheckResult,
} from './types';

// Definitions
export {
  CROSS_GAME_ACHIEVEMENTS,
  getAllAchievementDefinitions,
  getAchievementDefinition,
  getAchievementsByGame,
  getCrossGameAchievements,
} from './achievementDefinitions';

// Storage
export {
  loadAchievementStorage,
  saveAchievementStorage,
  createDefaultStorage,
  isAchievementUnlocked,
  unlockAchievement,
  updateAchievementProgress,
  getAchievementProgress,
  getAchievementUnlock,
  clearAchievementStorage,
} from './achievementStorage';

// System
export {
  checkAndUnlockAchievements,
  getAchievementStats,
} from './achievementSystem';