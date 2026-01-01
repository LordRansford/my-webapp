/**
 * Packet Route - Persistence
 */

import type { GameState } from './types';

export interface PacketRouteProgress {
  version: 1;
  xp: number;
  currentTier: 'operator' | 'engineer' | 'architect' | 'master' | 'legend';
  tierProgress: number;
  unlockedTopologies: string[];
  unlockedPolicyTypes: string[];
  unlockedTools: string[];
  personalBests: Record<string, {
    bestScore: number;
    bestLatency: number;
    bestThroughput: number;
    bestAvailability: number;
  }>;
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string;
  completedChallenges: Array<{
    challengeCode: string;
    completedDate: string;
    score: number;
    latency: number;
    throughput: number;
    availability: number;
    policyHash: string;
  }>;
  stats: {
    topologiesCompleted: number;
    averageLatency: number;
    averageThroughput: number;
    averageAvailability: number;
    bottleneckIdentifications: number;
    policyChanges: number;
    topologyTypeStats: Record<string, {
      completed: number;
      averageScore: number;
      averageLatency: number;
    }>;
  };
}

const STORAGE_KEY = 'packet-route-progress';

export function getProgress(): PacketRouteProgress {
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

export function saveProgress(progress: PacketRouteProgress): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

function getDefaultProgress(): PacketRouteProgress {
  return {
    version: 1,
    xp: 0,
    currentTier: 'operator',
    tierProgress: 0,
    unlockedTopologies: ['mesh', 'star'],
    unlockedPolicyTypes: ['shortest-path', 'load-balanced'],
    unlockedTools: [],
    personalBests: {},
    currentStreak: 0,
    longestStreak: 0,
    lastPlayedDate: '',
    completedChallenges: [],
    stats: {
      topologiesCompleted: 0,
      averageLatency: 0,
      averageThroughput: 0,
      averageAvailability: 0,
      bottleneckIdentifications: 0,
      policyChanges: 0,
      topologyTypeStats: {},
    },
  };
}

export function updateProgressAfterGame(
  progress: PacketRouteProgress,
  state: GameState,
  score: number
): PacketRouteProgress {
  const updated = { ...progress };
  
  updated.stats.topologiesCompleted += 1;
  updated.stats.averageLatency = 
    (updated.stats.averageLatency * (updated.stats.topologiesCompleted - 1) + state.metrics.averageLatency) / 
    updated.stats.topologiesCompleted;
  updated.stats.averageThroughput = 
    (updated.stats.averageThroughput * (updated.stats.topologiesCompleted - 1) + state.metrics.throughput) / 
    updated.stats.topologiesCompleted;
  updated.stats.averageAvailability = 
    (updated.stats.averageAvailability * (updated.stats.topologiesCompleted - 1) + state.metrics.availability) / 
    updated.stats.topologiesCompleted;
  
  // Update personal bests
  const topologyId = `topology-${state.seed}`;
  const currentBest = updated.personalBests[topologyId];
  if (!currentBest || score > currentBest.bestScore) {
    updated.personalBests[topologyId] = {
      bestScore: score,
      bestLatency: state.metrics.averageLatency,
      bestThroughput: state.metrics.throughput,
      bestAvailability: state.metrics.availability,
    };
  }
  
  return updated;
}
