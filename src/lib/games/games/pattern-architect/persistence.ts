/**
 * Pattern Architect Persistence
 */

import type { PlayerProgress, Pattern } from "./types";

const STORAGE_KEY = 'pattern-architect-profile';

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

export function savePattern(challengeId: string, pattern: Pattern): void {
  try {
    const key = `pattern-architect-pattern-${challengeId}`;
    localStorage.setItem(key, JSON.stringify(pattern));
  } catch (error) {
    console.error('Error saving pattern:', error);
  }
}

export function loadPattern(challengeId: string): Pattern | null {
  try {
    const key = `pattern-architect-pattern-${challengeId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as Pattern;
    }
  } catch (error) {
    console.error('Error loading pattern:', error);
  }
  return null;
}