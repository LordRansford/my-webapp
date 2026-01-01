/**
 * Governance Simulator - Persistence
 */

import type { GameState } from './types';

export interface GovernanceSimulatorProgress {
  version: 1;
  xp: number;
  currentTier: 'assistant' | 'manager' | 'director' | 'executive' | 'master';
  tierProgress: number;
  unlockedScenarios: string[];
  unlockedStrategies: string[];
  unlockedTools: string[];
  personalBests: Record<string, {
    bestScore: number;
    bestTrust: number;
    bestStability: number;
    bestOutcomes: number;
  }>;
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string;
  completedChallenges: Array<{
    challengeCode: string;
    completedDate: string;
    score: number;
    trust: number;
    stability: number;
    outcomes: number;
    strategyHash: string;
  }>;
  stats: {
    scenariosCompleted: number;
    averageTrust: number;
    averageStability: number;
    averageOutcomes: number;
    incidentsPrevented: number;
    stakeholderSatisfaction: number;
    scenarioTypeStats: Record<string, {
      completed: number;
      averageScore: number;
      averageTrust: number;
    }>;
  };
}

const STORAGE_KEY = 'governance-simulator-progress';

export function getProgress(): GovernanceSimulatorProgress {
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

export function saveProgress(progress: GovernanceSimulatorProgress): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

function getDefaultProgress(): GovernanceSimulatorProgress {
  return {
    version: 1,
    xp: 0,
    currentTier: 'assistant',
    tierProgress: 0,
    unlockedScenarios: ['data-sharing'],
    unlockedStrategies: ['balanced'],
    unlockedTools: [],
    personalBests: {},
    currentStreak: 0,
    longestStreak: 0,
    lastPlayedDate: '',
    completedChallenges: [],
    stats: {
      scenariosCompleted: 0,
      averageTrust: 0,
      averageStability: 0,
      averageOutcomes: 0,
      incidentsPrevented: 0,
      stakeholderSatisfaction: 0,
      scenarioTypeStats: {},
    },
  };
}

export function updateProgressAfterGame(
  progress: GovernanceSimulatorProgress,
  state: GameState,
  score: number
): GovernanceSimulatorProgress {
  const updated = { ...progress };
  
  updated.stats.scenariosCompleted += 1;
  updated.stats.averageTrust = 
    (updated.stats.averageTrust * (updated.stats.scenariosCompleted - 1) + state.metrics.averageTrust) / 
    updated.stats.scenariosCompleted;
  updated.stats.averageStability = 
    (updated.stats.averageStability * (updated.stats.scenariosCompleted - 1) + state.metrics.stability) / 
    updated.stats.scenariosCompleted;
  updated.stats.averageOutcomes = 
    (updated.stats.averageOutcomes * (updated.stats.scenariosCompleted - 1) + state.metrics.outcomes) / 
    updated.stats.scenariosCompleted;
  
  // Update personal bests
  const scenarioId = `scenario-${state.seed}`;
  const currentBest = updated.personalBests[scenarioId];
  if (!currentBest || score > currentBest.bestScore) {
    updated.personalBests[scenarioId] = {
      bestScore: score,
      bestTrust: state.metrics.averageTrust,
      bestStability: state.metrics.stability,
      bestOutcomes: state.metrics.outcomes,
    };
  }
  
  return updated;
}
