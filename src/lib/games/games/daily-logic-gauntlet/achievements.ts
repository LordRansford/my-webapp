/**
 * Achievement System
 * 
 * Tracks player achievements and unlocks badges for various accomplishments.
 * Achievements unlock features and provide progression goals.
 */

export type AchievementId =
  | 'first-puzzle'
  | 'first-complete'
  | 'perfect-score'
  | 'streak-3'
  | 'streak-7'
  | 'streak-30'
  | 'streak-100'
  | 'xp-1000'
  | 'xp-5000'
  | 'xp-10000'
  | 'master-novice'
  | 'master-apprentice'
  | 'master-adept'
  | 'master-expert'
  | 'master-master'
  | 'speed-demon'
  | 'persistent'
  | 'hint-free'
  | 'archive-7'
  | 'archive-30'
  | 'archive-100';

export interface Achievement {
  id: AchievementId;
  name: string;
  description: string;
  category: 'progress' | 'skill' | 'streak' | 'milestone' | 'special';
  icon: string; // Emoji or icon identifier
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: number; // Timestamp when unlocked
  progress?: number; // Current progress (0-1)
  maxProgress?: number; // Maximum progress needed
}

export interface AchievementData {
  version: number;
  unlocked: Set<AchievementId>;
  progress: Map<AchievementId, number>; // Progress for progress-based achievements
  unlockedTimestamps: Map<AchievementId, number>;
}

export const ALL_ACHIEVEMENTS: Achievement[] = [
  // Progress Achievements
  {
    id: 'first-puzzle',
    name: 'First Steps',
    description: 'Complete your first puzzle',
    category: 'progress',
    icon: '🎯',
    rarity: 'common',
  },
  {
    id: 'first-complete',
    name: 'Gauntlet Runner',
    description: 'Complete your first daily gauntlet',
    category: 'progress',
    icon: '🏁',
    rarity: 'common',
  },
  {
    id: 'perfect-score',
    name: 'Perfect Score',
    description: 'Answer all 10 puzzles correctly in a single day',
    category: 'skill',
    icon: '⭐',
    rarity: 'rare',
  },
  
  // Streak Achievements
  {
    id: 'streak-3',
    name: 'Getting Started',
    description: 'Maintain a 3-day streak',
    category: 'streak',
    icon: '🔥',
    rarity: 'common',
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    category: 'streak',
    icon: '💪',
    rarity: 'uncommon',
  },
  {
    id: 'streak-30',
    name: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    category: 'streak',
    icon: '👑',
    rarity: 'rare',
  },
  {
    id: 'streak-100',
    name: 'Centurion',
    description: 'Maintain a 100-day streak',
    category: 'streak',
    icon: '🏆',
    rarity: 'legendary',
  },
  
  // XP Achievements
  {
    id: 'xp-1000',
    name: 'Aspiring Learner',
    description: 'Reach 1,000 XP',
    category: 'milestone',
    icon: '📚',
    rarity: 'common',
  },
  {
    id: 'xp-5000',
    name: 'Dedicated Scholar',
    description: 'Reach 5,000 XP',
    category: 'milestone',
    icon: '🎓',
    rarity: 'uncommon',
  },
  {
    id: 'xp-10000',
    name: 'Logic Legend',
    description: 'Reach 10,000 XP',
    category: 'milestone',
    icon: '🌟',
    rarity: 'rare',
  },
  
  // Mastery Tier Achievements
  {
    id: 'master-novice',
    name: 'Novice',
    description: 'Reach Novice tier',
    category: 'progress',
    icon: '🌱',
    rarity: 'common',
  },
  {
    id: 'master-apprentice',
    name: 'Apprentice',
    description: 'Reach Apprentice tier',
    category: 'progress',
    icon: '🌿',
    rarity: 'common',
  },
  {
    id: 'master-adept',
    name: 'Adept',
    description: 'Reach Adept tier',
    category: 'progress',
    icon: '🌳',
    rarity: 'uncommon',
  },
  {
    id: 'master-expert',
    name: 'Expert',
    description: 'Reach Expert tier',
    category: 'progress',
    icon: '🌲',
    rarity: 'rare',
  },
  {
    id: 'master-master',
    name: 'Master',
    description: 'Reach Master tier',
    category: 'progress',
    icon: '👑',
    rarity: 'epic',
  },
  
  // Special Achievements
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete a gauntlet in under 5 minutes',
    category: 'special',
    icon: '⚡',
    rarity: 'uncommon',
  },
  {
    id: 'persistent',
    name: 'Persistent',
    description: 'Complete 50 gauntlets',
    category: 'special',
    icon: '💎',
    rarity: 'rare',
  },
  {
    id: 'hint-free',
    name: 'Hint-Free Hero',
    description: 'Complete a gauntlet without using any hints',
    category: 'special',
    icon: '🎖️',
    rarity: 'uncommon',
  },
  
  // Archive Achievements
  {
    id: 'archive-7',
    name: 'Week Collector',
    description: 'Archive 7 different daily sets',
    category: 'milestone',
    icon: '📦',
    rarity: 'common',
  },
  {
    id: 'archive-30',
    name: 'Monthly Archive',
    description: 'Archive 30 different daily sets',
    category: 'milestone',
    icon: '📚',
    rarity: 'uncommon',
  },
  {
    id: 'archive-100',
    name: 'Century Archive',
    description: 'Archive 100 different daily sets',
    category: 'milestone',
    icon: '🏛️',
    rarity: 'rare',
  },
];

/**
 * Create default achievement data
 */
export function createDefaultAchievementData(): AchievementData {
  return {
    version: 1,
    unlocked: new Set(),
    progress: new Map(),
    unlockedTimestamps: new Map(),
  };
}

/**
 * Load achievement data from localStorage
 */
export function loadAchievements(): AchievementData {
  try {
    const stored = localStorage.getItem('daily-logic-gauntlet-achievements');
    if (!stored) {
      return createDefaultAchievementData();
    }
    
    const data = JSON.parse(stored);
    return {
      ...data,
      unlocked: new Set(data.unlocked || []),
      progress: new Map(data.progress || []),
      unlockedTimestamps: new Map(data.unlockedTimestamps || []),
    };
  } catch (error) {
    console.error('Failed to load achievements:', error);
    return createDefaultAchievementData();
  }
}

/**
 * Save achievement data to localStorage
 */
export function saveAchievements(data: AchievementData): void {
  try {
    const saveData = {
      ...data,
      unlocked: Array.from(data.unlocked),
      progress: Array.from(data.progress),
      unlockedTimestamps: Array.from(data.unlockedTimestamps),
    };
    localStorage.setItem('daily-logic-gauntlet-achievements', JSON.stringify(saveData));
  } catch (error) {
    console.error('Failed to save achievements:', error);
  }
}

/**
 * Check if achievement is unlocked
 */
export function isAchievementUnlocked(achievementId: AchievementId): boolean {
  const data = loadAchievements();
  return data.unlocked.has(achievementId);
}

/**
 * Unlock an achievement
 */
export function unlockAchievement(achievementId: AchievementId): boolean {
  const data = loadAchievements();
  
  if (data.unlocked.has(achievementId)) {
    return false; // Already unlocked
  }
  
  data.unlocked.add(achievementId);
  data.unlockedTimestamps.set(achievementId, Date.now());
  saveAchievements(data);
  
  return true; // Newly unlocked
}

/**
 * Update achievement progress
 */
export function updateAchievementProgress(achievementId: AchievementId, progress: number): void {
  const data = loadAchievements();
  
  if (data.unlocked.has(achievementId)) {
    return; // Already unlocked, no need to track progress
  }
  
  data.progress.set(achievementId, progress);
  saveAchievements(data);
}

/**
 * Get achievement progress
 */
export function getAchievementProgress(achievementId: AchievementId): number {
  const data = loadAchievements();
  return data.progress.get(achievementId) || 0;
}

/**
 * Check and unlock achievements based on game state
 */
export interface AchievementCheckContext {
  totalXP: number;
  currentTier: string;
  currentStreak: number;
  gamesCompleted: number;
  perfectScores: number;
  archivedSets: number;
  fastestCompletion?: number; // milliseconds
  hintFreeCompletions: number;
}

export function checkAndUnlockAchievements(context: AchievementCheckContext): AchievementId[] {
  const data = loadAchievements();
  const newlyUnlocked: AchievementId[] = [];
  
  // Check XP achievements
  if (context.totalXP >= 1000 && !data.unlocked.has('xp-1000')) {
    if (unlockAchievement('xp-1000')) newlyUnlocked.push('xp-1000');
  }
  if (context.totalXP >= 5000 && !data.unlocked.has('xp-5000')) {
    if (unlockAchievement('xp-5000')) newlyUnlocked.push('xp-5000');
  }
  if (context.totalXP >= 10000 && !data.unlocked.has('xp-10000')) {
    if (unlockAchievement('xp-10000')) newlyUnlocked.push('xp-10000');
  }
  
  // Check tier achievements
  const tierMap: Record<string, AchievementId> = {
    'novice': 'master-novice',
    'apprentice': 'master-apprentice',
    'adept': 'master-adept',
    'expert': 'master-expert',
    'master': 'master-master',
  };
  const tierAchievement = tierMap[context.currentTier];
  if (tierAchievement && !data.unlocked.has(tierAchievement)) {
    if (unlockAchievement(tierAchievement)) newlyUnlocked.push(tierAchievement);
  }
  
  // Check streak achievements
  if (context.currentStreak >= 3 && !data.unlocked.has('streak-3')) {
    if (unlockAchievement('streak-3')) newlyUnlocked.push('streak-3');
  }
  if (context.currentStreak >= 7 && !data.unlocked.has('streak-7')) {
    if (unlockAchievement('streak-7')) newlyUnlocked.push('streak-7');
  }
  if (context.currentStreak >= 30 && !data.unlocked.has('streak-30')) {
    if (unlockAchievement('streak-30')) newlyUnlocked.push('streak-30');
  }
  if (context.currentStreak >= 100 && !data.unlocked.has('streak-100')) {
    if (unlockAchievement('streak-100')) newlyUnlocked.push('streak-100');
  }
  
  // Check archive achievements
  if (context.archivedSets >= 7 && !data.unlocked.has('archive-7')) {
    if (unlockAchievement('archive-7')) newlyUnlocked.push('archive-7');
  }
  if (context.archivedSets >= 30 && !data.unlocked.has('archive-30')) {
    if (unlockAchievement('archive-30')) newlyUnlocked.push('archive-30');
  }
  if (context.archivedSets >= 100 && !data.unlocked.has('archive-100')) {
    if (unlockAchievement('archive-100')) newlyUnlocked.push('archive-100');
  }
  
  // Check completion achievements
  if (context.gamesCompleted >= 50 && !data.unlocked.has('persistent')) {
    if (unlockAchievement('persistent')) newlyUnlocked.push('persistent');
  }
  
  // Check perfect score
  if (context.perfectScores > 0 && !data.unlocked.has('perfect-score')) {
    if (unlockAchievement('perfect-score')) newlyUnlocked.push('perfect-score');
  }
  
  // Check speed demon
  if (context.fastestCompletion && context.fastestCompletion < 5 * 60 * 1000 && !data.unlocked.has('speed-demon')) {
    if (unlockAchievement('speed-demon')) newlyUnlocked.push('speed-demon');
  }
  
  // Check hint-free
  if (context.hintFreeCompletions > 0 && !data.unlocked.has('hint-free')) {
    if (unlockAchievement('hint-free')) newlyUnlocked.push('hint-free');
  }
  
  return newlyUnlocked;
}

/**
 * Get all unlocked achievements
 */
export function getUnlockedAchievements(): Achievement[] {
  const data = loadAchievements();
  return ALL_ACHIEVEMENTS.filter(a => data.unlocked.has(a.id));
}

/**
 * Get achievement by ID
 */
export function getAchievement(achievementId: AchievementId): Achievement | undefined {
  return ALL_ACHIEVEMENTS.find(a => a.id === achievementId);
}

/**
 * Get achievements by category
 */
export function getAchievementsByCategory(category: Achievement['category']): Achievement[] {
  return ALL_ACHIEVEMENTS.filter(a => a.category === category);
}

/**
 * Get achievement statistics
 */
export interface AchievementStats {
  total: number;
  unlocked: number;
  progress: number; // Percentage
  byCategory: Record<Achievement['category'], { total: number; unlocked: number }>;
  byRarity: Record<Achievement['rarity'], { total: number; unlocked: number }>;
}

export function getAchievementStats(): AchievementStats {
  const data = loadAchievements();
  const unlocked = Array.from(data.unlocked);
  
  const byCategory: Record<string, { total: number; unlocked: number }> = {};
  const byRarity: Record<string, { total: number; unlocked: number }> = {};
  
  ALL_ACHIEVEMENTS.forEach(achievement => {
    // Category stats
    if (!byCategory[achievement.category]) {
      byCategory[achievement.category] = { total: 0, unlocked: 0 };
    }
    byCategory[achievement.category].total++;
    if (unlocked.includes(achievement.id)) {
      byCategory[achievement.category].unlocked++;
    }
    
    // Rarity stats
    if (!byRarity[achievement.rarity]) {
      byRarity[achievement.rarity] = { total: 0, unlocked: 0 };
    }
    byRarity[achievement.rarity].total++;
    if (unlocked.includes(achievement.id)) {
      byRarity[achievement.rarity].unlocked++;
    }
  });
  
  return {
    total: ALL_ACHIEVEMENTS.length,
    unlocked: unlocked.length,
    progress: (unlocked.length / ALL_ACHIEVEMENTS.length) * 100,
    byCategory: byCategory as Record<Achievement['category'], { total: number; unlocked: number }>,
    byRarity: byRarity as Record<Achievement['rarity'], { total: number; unlocked: number }>,
  };
}

/**
 * Clear achievements (for testing)
 */
export function clearAchievements(): void {
  localStorage.removeItem('daily-logic-gauntlet-achievements');
}
