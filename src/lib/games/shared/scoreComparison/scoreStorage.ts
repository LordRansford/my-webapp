/**
 * Score Storage
 * 
 * Stores scores per challenge code (localStorage-based, anonymous).
 */

import type { ScoreData } from './types';

/**
 * Storage key prefix
 */
const STORAGE_KEY_PREFIX = 'ransford-scores';

/**
 * Get storage key for a challenge code
 */
function getStorageKey(challengeCode: string): string {
  // Sanitize code for storage key (replace special chars)
  const sanitized = challengeCode.replace(/[^A-Z0-9-]/gi, '-');
  return `${STORAGE_KEY_PREFIX}-${sanitized}`;
}

/**
 * Store score for a challenge code
 */
export function storeScore(challengeCode: string, scoreData: ScoreData): void {
  try {
    const storageKey = getStorageKey(challengeCode);
    const existing = getScores(challengeCode);
    
    // Add new score (keep last 100 scores per code to prevent storage bloat)
    existing.push(scoreData);
    if (existing.length > 100) {
      existing.shift(); // Remove oldest
    }
    
    localStorage.setItem(storageKey, JSON.stringify(existing));
  } catch (error) {
    console.error('Error storing score:', error);
  }
}

/**
 * Get all scores for a challenge code
 */
export function getScores(challengeCode: string): ScoreData[] {
  try {
    const storageKey = getStorageKey(challengeCode);
    const stored = localStorage.getItem(storageKey);
    
    if (!stored) {
      return [];
    }
    
    return JSON.parse(stored) as ScoreData[];
  } catch (error) {
    console.error('Error retrieving scores:', error);
    return [];
  }
}

/**
 * Get player's score for a challenge code (if exists)
 */
export function getPlayerScore(challengeCode: string): ScoreData | null {
  const scores = getScores(challengeCode);
  
  // Return most recent score (could be enhanced to identify player's score)
  if (scores.length > 0) {
    return scores[scores.length - 1];
  }
  
  return null;
}

/**
 * Clear scores for a challenge code (utility function)
 */
export function clearScores(challengeCode: string): void {
  try {
    const storageKey = getStorageKey(challengeCode);
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error('Error clearing scores:', error);
  }
}