/**
 * Signal Hunt - Persistence
 * 
 * localStorage schema and persistence functions.
 */

import type { GameState } from './types';

export interface SignalHuntProgress {
  version: 1;
  xp: number;
  currentTier: 'novice' | 'analyst' | 'expert' | 'master' | 'legend';
  tierProgress: number;
  unlockedTooling: string[];
  unlockedPostures: string[];
  unlockedScenarios: string[];
  personalBests: Record<string, {
    bestScore: number;
    bestTurns: number;
    bestAccuracy: number;
  }>;
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string;
  completedChallenges: Array<{
    challengeCode: string;
    completedDate: string;
    score: number;
    outcome: 'win' | 'loss';
  }>;
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    totalSignalsProcessed: number;
    totalFalsePositives: number;
    averageResponseTime: number;
  };
}

const STORAGE_KEY = 'signal-hunt-progress';

export function getProgress(): SignalHuntProgress {
  if (typeof window === 'undefined') {
    return getDefaultProgress();
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return migrateProgress(parsed);
    }
  } catch (error) {
    console.error('Error loading progress:', error);
  }
  
  return getDefaultProgress();
}

export function saveProgress(progress: SignalHuntProgress): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

function getDefaultProgress(): SignalHuntProgress {
  return {
    version: 1,
    xp: 0,
    currentTier: 'novice',
    tierProgress: 0,
    unlockedTooling: ['basic-investigation', 'basic-containment'],
    unlockedPostures: ['aggressive', 'balanced', 'defensive'],
    unlockedScenarios: ['basic-training'],
    personalBests: {},
    currentStreak: 0,
    longestStreak: 0,
    lastPlayedDate: '',
    completedChallenges: [],
    stats: {
      gamesPlayed: 0,
      gamesWon: 0,
      totalSignalsProcessed: 0,
      totalFalsePositives: 0,
      averageResponseTime: 0,
    },
  };
}

function migrateProgress(progress: any): SignalHuntProgress {
  // Migration logic for future versions
  if (progress.version === 1) {
    return progress as SignalHuntProgress;
  }
  
  return getDefaultProgress();
}

export function updateProgressAfterGame(
  progress: SignalHuntProgress,
  state: GameState,
  score: number,
  accuracy: number
): SignalHuntProgress {
  const updated = { ...progress };
  
  updated.stats.gamesPlayed += 1;
  if (state.outcome === 'win') {
    updated.stats.gamesWon += 1;
  }
  
  // Update personal bests
  const scenarioId = `scenario-${state.seed}`;
  const currentBest = updated.personalBests[scenarioId];
  if (!currentBest || score > currentBest.bestScore) {
    updated.personalBests[scenarioId] = {
      bestScore: score,
      bestTurns: state.currentTurn,
      bestAccuracy: accuracy,
    };
  }
  
  // Update tier
  const tierThresholds = {
    novice: 0,
    analyst: 100,
    expert: 300,
    master: 600,
    legend: 1000,
  };
  
  const currentTierXP = tierThresholds[updated.currentTier];
  const nextTier = getNextTier(updated.currentTier);
  const nextTierXP = tierThresholds[nextTier];
  
  if (updated.xp >= nextTierXP) {
    updated.currentTier = nextTier;
    updated.tierProgress = 0;
  } else {
    updated.tierProgress = (updated.xp - currentTierXP) / (nextTierXP - currentTierXP);
  }
  
  return updated;
}

function getNextTier(tier: SignalHuntProgress['currentTier']): SignalHuntProgress['currentTier'] {
  const tiers: SignalHuntProgress['currentTier'][] = ['novice', 'analyst', 'expert', 'master', 'legend'];
  const index = tiers.indexOf(tier);
  return index < tiers.length - 1 ? tiers[index + 1] : tier;
}
