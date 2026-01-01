/**
 * Daily Challenge Manager
 */

import { getTodayDateString } from "./dailyChallengeGenerator";
import { generateDailySeed } from "./dailyChallengeGenerator";
import { getDailyChallenge, setDailyChallenge } from "./dailyChallengeStorage";
import type { DailyChallenge } from "./types";

/**
 * Get or generate today's challenge for a game
 */
export function getOrGenerateTodayChallenge(gameId: string): DailyChallenge {
  const date = getTodayDateString();
  const existing = getDailyChallenge(gameId, date);
  
  if (existing) {
    return existing;
  }
  
  const seed = generateDailySeed(gameId, date);
  const challenge: DailyChallenge = {
    gameId,
    date,
    seed,
    completed: false,
  };
  
  setDailyChallenge(challenge);
  return challenge;
}

/**
 * Complete today's challenge
 */
export function completeTodayChallenge(
  gameId: string,
  result: {
    score: number;
    time: number;
    scoreValue?: number;
  }
): void {
  const date = getTodayDateString();
  const challenge = getDailyChallenge(gameId, date);
  
  if (!challenge) {
    // Create if doesn't exist
    const seed = generateDailySeed(gameId, date);
    const newChallenge: DailyChallenge = {
      gameId,
      date,
      seed,
      completed: true,
      score: result.score,
      time: result.time,
      scoreValue: result.scoreValue,
      completedAt: Date.now(),
    };
    setDailyChallenge(newChallenge);
    return;
  }
  
  challenge.completed = true;
  challenge.score = result.score;
  challenge.time = result.time;
  challenge.scoreValue = result.scoreValue;
  challenge.completedAt = Date.now();
  
  setDailyChallenge(challenge);
}