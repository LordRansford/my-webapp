/**
 * Proof Sprint - Persistence
 */

import type { GameState } from './types';

export interface ProofSprintProgress {
  version: 1;
  xp: number;
  currentTier: 'beginner' | 'student' | 'scholar' | 'theorist' | 'master';
  tierProgress: number;
  unlockedMoves: string[];
  unlockedTracks: string[];
  unlockedPuzzlePacks: string[];
  personalBests: Record<string, {
    bestSteps: number;
    bestScore: number;
    bestElegance: number;
    completionCount: number;
  }>;
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string;
  completedChallenges: Array<{
    challengeCode: string;
    completedDate: string;
    steps: number;
    score: number;
    elegance: number;
  }>;
  stats: {
    puzzlesSolved: number;
    totalSteps: number;
    averageElegance: number;
    hintsUsed: number;
    restarts: number;
    topicTrackStats: Record<string, {
      puzzlesSolved: number;
      averageSteps: number;
      averageElegance: number;
    }>;
  };
}

const STORAGE_KEY = 'proof-sprint-progress';

export function getProgress(): ProofSprintProgress {
  if (typeof window === 'undefined') {
    return getDefaultProgress();
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading progress:', error);
  }
  
  return getDefaultProgress();
}

export function saveProgress(progress: ProofSprintProgress): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

function getDefaultProgress(): ProofSprintProgress {
  return {
    version: 1,
    xp: 0,
    currentTier: 'beginner',
    tierProgress: 0,
    unlockedMoves: ['distribute', 'simplify', 'combine'],
    unlockedTracks: ['algebra', 'logic'],
    unlockedPuzzlePacks: [],
    personalBests: {},
    currentStreak: 0,
    longestStreak: 0,
    lastPlayedDate: '',
    completedChallenges: [],
    stats: {
      puzzlesSolved: 0,
      totalSteps: 0,
      averageElegance: 0,
      hintsUsed: 0,
      restarts: 0,
      topicTrackStats: {},
    },
  };
}

export function updateProgressAfterGame(
  progress: ProofSprintProgress,
  state: GameState,
  score: number,
  elegance: number
): ProofSprintProgress {
  const updated = { ...progress };
  
  updated.stats.puzzlesSolved += 1;
  updated.stats.totalSteps += state.stepCount;
  updated.stats.averageElegance = 
    (updated.stats.averageElegance * (updated.stats.puzzlesSolved - 1) + elegance) / updated.stats.puzzlesSolved;
  
  // Update personal bests
  const puzzleId = `puzzle-${state.seed}`;
  const currentBest = updated.personalBests[puzzleId];
  if (!currentBest || score > currentBest.bestScore) {
    updated.personalBests[puzzleId] = {
      bestSteps: state.stepCount,
      bestScore: score,
      bestElegance: elegance,
      completionCount: (currentBest?.completionCount || 0) + 1,
    };
  }
  
  return updated;
}
