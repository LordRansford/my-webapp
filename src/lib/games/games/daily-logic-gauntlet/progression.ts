/**
 * Progression System
 * 
 * XP calculation, tier progression, and unlock management for Daily Logic Gauntlet
 */

import type { DifficultyTier, PuzzlePerformance } from './types';

/**
 * Mastery tier definitions
 */
export interface MasteryTier {
  id: DifficultyTier;
  name: string;
  minXP: number;
  unlocks: string[];
}

export const MASTERY_TIERS: MasteryTier[] = [
  {
    id: 'novice',
    name: 'Novice',
    minXP: 0,
    unlocks: ['basic-puzzles', 'practice-mode'],
  },
  {
    id: 'apprentice',
    name: 'Apprentice',
    minXP: 100,
    unlocks: ['intermediate-puzzles', 'archive-access'],
  },
  {
    id: 'adept',
    name: 'Adept',
    minXP: 300,
    unlocks: ['advanced-puzzles', 'custom-seeds'],
  },
  {
    id: 'expert',
    name: 'Expert',
    minXP: 600,
    unlocks: ['expert-puzzles', 'puzzle-creator'],
  },
  {
    id: 'master',
    name: 'Master',
    minXP: 1000,
    unlocks: ['master-puzzles', 'all-features'],
  },
];

/**
 * Calculate XP for puzzle performance
 */
export function calculateXP(
  performance: PuzzlePerformance,
  hintsUsed: number,
  perfectGauntlet: boolean
): number {
  let xp = 0;
  
  // Base XP for correct answer
  if (performance.correct) {
    xp += 10;
    
    // Speed bonus (faster = more XP, up to +10)
    const timeBonus = Math.max(0, 10 - (performance.timeSpent / 10000)); // 10 seconds = baseline
    xp += Math.floor(timeBonus);
  }
  
  // Hint penalty (-2 XP per hint)
  xp -= hintsUsed * 2;
  
  // Perfect gauntlet bonus (+50 XP)
  if (perfectGauntlet) {
    xp += 50;
  }
  
  // Minimum 0 XP
  return Math.max(0, xp);
}

/**
 * Calculate total XP for a session
 */
export function calculateSessionXP(
  performances: PuzzlePerformance[],
  hintsUsed: number[],
  streakBonus: number = 0
): number {
  const perfectGauntlet = performances.every(p => p.correct);
  
  let totalXP = 0;
  for (let i = 0; i < performances.length; i++) {
    totalXP += calculateXP(performances[i], hintsUsed[i] || 0, false);
  }
  
  // Perfect gauntlet bonus
  if (perfectGauntlet) {
    totalXP += 50;
  }
  
  // Streak bonus (+5 XP per day in streak)
  totalXP += streakBonus * 5;
  
  return totalXP;
}

/**
 * Get tier from XP
 */
export function getTierFromXP(xp: number): DifficultyTier {
  // Find highest tier that player has reached
  for (let i = MASTERY_TIERS.length - 1; i >= 0; i--) {
    if (xp >= MASTERY_TIERS[i].minXP) {
      return MASTERY_TIERS[i].id;
    }
  }
  return 'novice';
}

/**
 * Get tier information
 */
export function getTierInfo(tier: DifficultyTier): MasteryTier {
  return MASTERY_TIERS.find(t => t.id === tier) || MASTERY_TIERS[0];
}

/**
 * Get next tier information
 */
export function getNextTier(currentXP: number): MasteryTier | null {
  const currentTier = getTierFromXP(currentXP);
  const currentIndex = MASTERY_TIERS.findIndex(t => t.id === currentTier);
  
  if (currentIndex >= MASTERY_TIERS.length - 1) {
    return null; // Already at max tier
  }
  
  return MASTERY_TIERS[currentIndex + 1];
}

/**
 * Calculate progress to next tier (0-1)
 */
export function getTierProgress(currentXP: number): number {
  const currentTier = getTierFromXP(currentXP);
  const nextTier = getNextTier(currentXP);
  
  if (!nextTier) {
    return 1; // Max tier reached
  }
  
  const currentTierInfo = getTierInfo(currentTier);
  const xpInCurrentTier = currentXP - currentTierInfo.minXP;
  const xpNeededForNextTier = nextTier.minXP - currentTierInfo.minXP;
  
  return Math.min(1, Math.max(0, xpInCurrentTier / xpNeededForNextTier));
}

/**
 * Get all unlocked features for XP level
 */
export function getUnlockedFeatures(xp: number): string[] {
  const tier = getTierFromXP(xp);
  const unlocks: string[] = [];
  
  // Add unlocks from all tiers up to current
  for (const tierInfo of MASTERY_TIERS) {
    if (xp >= tierInfo.minXP) {
      unlocks.push(...tierInfo.unlocks);
    }
  }
  
  return [...new Set(unlocks)]; // Remove duplicates
}
