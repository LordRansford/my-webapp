/**
 * Constraint Optimizer Persistence
 */

import type { PlayerProgress, Solution } from "./types";

const STORAGE_KEY = 'constraint-optimizer-profile';

export function loadProgress(): PlayerProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as PlayerProgress;
    }
  } catch (error) {
    console.error('Error loading progress:', error);
  }
  
  return {
    xp: 0,
    tier: 'novice',
    challengesCompleted: 0,
    personalBests: {},
    achievements: [],
  };
}

export function saveProgress(progress: PlayerProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

export function saveSolution(challengeId: string, solution: Solution): void {
  try {
    const key = `constraint-optimizer-solution-${challengeId}`;
    localStorage.setItem(key, JSON.stringify(solution));
  } catch (error) {
    console.error('Error saving solution:', error);
  }
}

export function loadSolution(challengeId: string): Solution | null {
  try {
    const key = `constraint-optimizer-solution-${challengeId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as Solution;
    }
  } catch (error) {
    console.error('Error loading solution:', error);
  }
  return null;
}