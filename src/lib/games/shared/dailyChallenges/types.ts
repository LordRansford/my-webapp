/**
 * Daily Challenge Types
 */

export interface DailyChallenge {
  gameId: string;
  date: string; // YYYY-MM-DD
  seed: number;
  completed: boolean;
  score?: number;
  time?: number;
  scoreValue?: number;
  completedAt?: number;
}

export interface DailyChallengeStorage {
  challenges: Record<string, DailyChallenge>; // key: gameId-date
  lastUpdated: number;
}