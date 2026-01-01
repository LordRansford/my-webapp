/**
 * Percentile Calculator
 */

import type { ScoreData, ScoreComparison } from './types';

/**
 * Calculate percentile for a score in an array of scores
 */
export function calculatePercentile(score: number, scores: number[]): number {
  if (scores.length === 0) return 50;
  
  const sorted = [...scores].sort((a, b) => a - b);
  const rank = sorted.filter(s => s <= score).length;
  
  return (rank / scores.length) * 100;
}

/**
 * Calculate score comparison
 */
export function calculateScoreComparison(
  challengeCode: string,
  playerScore: ScoreData,
  allScores: ScoreData[]
): ScoreComparison {
  if (allScores.length === 0) {
    return {
      averageScore: playerScore.score,
      percentile: 50,
      participantCount: 1,
      playerScore: playerScore.score,
      playerRank: 1,
    };
  }
  
  const scores = allScores.map(s => s.score);
  const sorted = [...scores].sort((a, b) => b - a); // Descending
  
  const averageScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  const percentile = calculatePercentile(playerScore.score, scores);
  
  // Find player rank (1-based, higher score = better rank)
  let playerRank = sorted.findIndex(s => s <= playerScore.score) + 1;
  if (playerRank === 0) playerRank = sorted.length;
  
  return {
    averageScore,
    percentile,
    participantCount: allScores.length,
    playerScore: playerScore.score,
    playerRank,
  };
}