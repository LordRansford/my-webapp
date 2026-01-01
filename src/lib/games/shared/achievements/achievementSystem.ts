/**
 * Achievement System
 */

import { getAllAchievementDefinitions } from "./achievementDefinitions";
import { loadAchievementStorage, unlockAchievement, updateAchievementProgress } from "./achievementStorage";
import { isAchievementUnlocked } from "./achievementStorage";
import type { AchievementContext, AchievementCheckResult } from "./types";

/**
 * Check and unlock achievements based on context
 */
export function checkAndUnlockAchievements(context: AchievementContext): AchievementCheckResult {
  const storage = loadAchievementStorage();
  const definitions = getAllAchievementDefinitions();
  const newlyUnlocked: string[] = [];
  const updatedProgress: Record<string, number> = {};
  
  let currentStorage = storage;
  
  for (const definition of definitions) {
    // Skip game-specific achievements that don't match
    if (definition.gameId && definition.gameId !== context.gameId) {
      continue;
    }
    
    // Skip if already unlocked
    if (isAchievementUnlocked(definition.id, currentStorage)) {
      continue;
    }
    
    // Update progress if progress condition exists
    if (definition.progressCondition) {
      const progress = definition.progressCondition(context);
      updatedProgress[definition.id] = progress;
      currentStorage = updateAchievementProgress(definition.id, progress, currentStorage);
    }
    
    // Check if achievement should be unlocked
    if (definition.checkCondition && definition.checkCondition(context)) {
      currentStorage = unlockAchievement(definition.id, context.gameId, currentStorage);
      newlyUnlocked.push(definition.id);
    }
  }
  
  return {
    newlyUnlocked,
    updatedProgress,
  };
}

/**
 * Get achievement statistics
 */
export function getAchievementStats() {
  const storage = loadAchievementStorage();
  const definitions = getAllAchievementDefinitions();
  
  const total = definitions.length;
  const unlocked = storage.unlocked.length;
  const progress = storage.progress;
  
  return {
    total,
    unlocked,
    percentage: total > 0 ? (unlocked / total) * 100 : 0,
    progress,
    unlockedIds: storage.unlocked.map(u => u.achievementId),
  };
}