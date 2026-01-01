/**
 * Score Aggregator
 */

import { getScores, storeScore } from './scoreStorage';
import { calculateScoreComparison } from './percentileCalculator';
import type { ScoreData, ScoreComparison } from './types';

/**
 * Submit score and get comparison
 */
export function submitScore(challengeCode: string, scoreData: ScoreData): ScoreComparison {
  storeScore(challengeCode, scoreData);
  
  const allScores = getScores(challengeCode);
  return calculateScoreComparison(challengeCode, scoreData, allScores);
}

/**
 * Get comparison for a challenge code
 */
export function getScoreComparison(challengeCode: string, playerScore?: ScoreData): ScoreComparison | null {
  const allScores = getScores(challengeCode);
  
  if (allScores.length === 0) {
    return null;
  }
  
  if (playerScore) {
    return calculateScoreComparison(challengeCode, playerScore, allScores);
  }
  
  // Use most recent score as player score
  const latestScore = allScores[allScores.length - 1];
  return calculateScoreComparison(challengeCode, latestScore, allScores);
}