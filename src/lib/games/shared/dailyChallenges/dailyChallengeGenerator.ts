/**
 * Daily Challenge Generator
 * 
 * Generates deterministic daily challenges based on date
 */

import { getDailySeed, hashString } from "@/lib/games/framework/SeededRNG";

/**
 * Get today's date string (YYYY-MM-DD UTC)
 */
export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getUTCFullYear();
  const month = String(today.getUTCMonth() + 1).padStart(2, '0');
  const day = String(today.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Generate seed for a game on a specific date
 */
export function generateDailySeed(gameId: string, date: string): number {
  const baseSeed = getDailySeed();
  // Combine with game ID to get unique seed per game
  const gameHash = hashString(gameId);
  return (baseSeed ^ gameHash) >>> 0;
}

/**
 * Generate daily challenge seed
 */
export function generateChallengeSeed(gameId: string): number {
  const date = getTodayDateString();
  return generateDailySeed(gameId, date);
}