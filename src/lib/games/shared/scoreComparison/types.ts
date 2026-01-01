/**
 * Score Comparison Types
 */

export interface ScoreData {
  score: number;
  time: number;
  scoreValue?: number;
  timestamp: number;
}

export interface ScoreComparison {
  averageScore: number;
  percentile: number;
  participantCount: number;
  playerScore?: number;
  playerRank?: number;
}