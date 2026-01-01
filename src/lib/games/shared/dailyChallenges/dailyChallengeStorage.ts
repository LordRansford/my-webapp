/**
 * Daily Challenge Storage
 */

import type { DailyChallenge, DailyChallengeStorage } from "./types";

const STORAGE_KEY = 'ransford-daily-challenges';

/**
 * Load daily challenges from storage
 */
export function loadDailyChallenges(): DailyChallengeStorage {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as DailyChallengeStorage;
    }
  } catch (error) {
    console.error('Error loading daily challenges:', error);
  }
  
  return {
    challenges: {},
    lastUpdated: Date.now(),
  };
}

/**
 * Save daily challenges to storage
 */
export function saveDailyChallenges(storage: DailyChallengeStorage): void {
  try {
    storage.lastUpdated = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
  } catch (error) {
    console.error('Error saving daily challenges:', error);
  }
}

/**
 * Get challenge key
 */
function getChallengeKey(gameId: string, date: string): string {
  return `${gameId}-${date}`;
}

/**
 * Get daily challenge
 */
export function getDailyChallenge(gameId: string, date: string): DailyChallenge | null {
  const storage = loadDailyChallenges();
  const key = getChallengeKey(gameId, date);
  return storage.challenges[key] || null;
}

/**
 * Set daily challenge
 */
export function setDailyChallenge(challenge: DailyChallenge): void {
  const storage = loadDailyChallenges();
  const key = getChallengeKey(challenge.gameId, challenge.date);
  storage.challenges[key] = challenge;
  saveDailyChallenges(storage);
}