/**
 * Allocation Architect - Persistence
 * 
 * Handles localStorage persistence with versioning.
 */

import type { GameState } from './types';
import { hasConstraintViolations } from './constraintEngine';

const STORAGE_KEY = 'allocation-architect-progress';
const STORAGE_VERSION = 1;

export interface AllocationArchitectProgress {
  version: number;
  xp: number;
  currentTier: 'planner' | 'strategist' | 'architect' | 'master' | 'legend';
  tierProgress: number;
  unlockedScenarios: string[];
  unlockedHorizons: number[];
  unlockedConstraints: string[];
  personalBests: Record<string, {
    bestScore: number;
    bestEfficiency: number;
    bestCompletionRounds: number;
  }>;
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string;
  completedChallenges: Array<{
    challengeCode: string;
    completedDate: string;
    score: number;
    efficiency: number;
    planHash: string;
  }>;
  stats: {
    scenariosCompleted: number;
    averageEfficiency: number;
    averageScore: number;
    constraintViolations: number;
    eventResilience: number;
    scenarioTypeStats: Record<string, {
      completed: number;
      averageScore: number;
      averageEfficiency: number;
    }>;
  };
}

/**
 * Load progress from localStorage
 */
export function loadProgress(): AllocationArchitectProgress | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const data = JSON.parse(stored) as AllocationArchitectProgress;
    
    // Migrate if needed
    if (data.version !== STORAGE_VERSION) {
      return migrateProgress(data);
    }
    
    return data;
  } catch (error) {
    console.error('Error loading progress:', error);
    return null;
  }
}

/**
 * Save progress to localStorage
 */
export function saveProgress(progress: AllocationArchitectProgress): void {
  if (typeof window === 'undefined') return;
  
  try {
    const data = {
      ...progress,
      version: STORAGE_VERSION,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

/**
 * Initialize progress
 */
export function initializeProgress(): AllocationArchitectProgress {
  return {
    version: STORAGE_VERSION,
    xp: 0,
    currentTier: 'planner',
    tierProgress: 0,
    unlockedScenarios: ['budget-optimization'],
    unlockedHorizons: [6],
    unlockedConstraints: ['budget'],
    personalBests: {},
    currentStreak: 0,
    longestStreak: 0,
    lastPlayedDate: '',
    completedChallenges: [],
    stats: {
      scenariosCompleted: 0,
      averageEfficiency: 0,
      averageScore: 0,
      constraintViolations: 0,
      eventResilience: 0,
      scenarioTypeStats: {},
    },
  };
}

/**
 * Get or initialize progress
 */
export function getProgress(): AllocationArchitectProgress {
  const progress = loadProgress();
  return progress || initializeProgress();
}

/**
 * Migrate progress to new version
 */
function migrateProgress(data: AllocationArchitectProgress): AllocationArchitectProgress {
  // For now, just update version
  // Future migrations can transform data here
  return {
    ...data,
    version: STORAGE_VERSION,
  };
}

/**
 * Update progress after game completion
 */
export function updateProgressAfterGame(
  progress: AllocationArchitectProgress,
  state: GameState,
  score: number,
  efficiency: number
): AllocationArchitectProgress {
  const newProgress = { ...progress };
  
  // Update XP (will be calculated with variable rewards)
  // For now, just increment
  newProgress.xp += 50;
  
  // Update tier
  const tierThresholds = {
    planner: 0,
    strategist: 100,
    architect: 300,
    master: 600,
    legend: 1000,
  };
  
  const currentTierIndex = Object.keys(tierThresholds).indexOf(newProgress.currentTier);
  const nextTier = Object.keys(tierThresholds)[currentTierIndex + 1] as keyof typeof tierThresholds | undefined;
  
  if (nextTier && newProgress.xp >= tierThresholds[nextTier]) {
    newProgress.currentTier = nextTier as AllocationArchitectProgress['currentTier'];
    newProgress.tierProgress = 0;
  } else {
    const currentThreshold = tierThresholds[newProgress.currentTier];
    const nextThreshold = nextTier ? tierThresholds[nextTier] : Infinity;
    newProgress.tierProgress = (newProgress.xp - currentThreshold) / (nextThreshold - currentThreshold);
  }
  
  // Update personal bests
  const scenarioId = state.scenario.id;
  const currentBest = newProgress.personalBests[scenarioId];
  if (!currentBest || score > currentBest.bestScore) {
    newProgress.personalBests[scenarioId] = {
      bestScore: score,
      bestEfficiency: efficiency,
      bestCompletionRounds: state.currentRound,
    };
  }
  
  // Update stats
  newProgress.stats.scenariosCompleted += 1;
  newProgress.stats.averageScore = 
    (newProgress.stats.averageScore * (newProgress.stats.scenariosCompleted - 1) + score) / 
    newProgress.stats.scenariosCompleted;
  newProgress.stats.averageEfficiency = 
    (newProgress.stats.averageEfficiency * (newProgress.stats.scenariosCompleted - 1) + efficiency) / 
    newProgress.stats.scenariosCompleted;
  
  if (hasConstraintViolations(state)) {
    newProgress.stats.constraintViolations += 1;
  }
  
  // Update scenario type stats
  const scenarioType = state.scenario.type;
  if (!newProgress.stats.scenarioTypeStats[scenarioType]) {
    newProgress.stats.scenarioTypeStats[scenarioType] = {
      completed: 0,
      averageScore: 0,
      averageEfficiency: 0,
    };
  }
  const typeStats = newProgress.stats.scenarioTypeStats[scenarioType];
  typeStats.completed += 1;
  typeStats.averageScore = (typeStats.averageScore * (typeStats.completed - 1) + score) / typeStats.completed;
  typeStats.averageEfficiency = (typeStats.averageEfficiency * (typeStats.completed - 1) + efficiency) / typeStats.completed;
  
  return newProgress;
}
