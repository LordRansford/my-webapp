/**
 * Daily Logic Gauntlet - Type Definitions
 */

export type PuzzleType = 'logic' | 'pattern' | 'deduction' | 'constraint';

export type DifficultyTier = 'novice' | 'apprentice' | 'adept' | 'expert' | 'master';

/**
 * Puzzle interface
 */
export interface Puzzle {
  id: string;
  type: PuzzleType;
  difficulty: number; // 0-1 normalized
  question: string;
  options: string[];
  correctAnswer: number; // Index in options array
  explanation: string;
  metadata?: {
    constraints?: number;
    problemSpaceSize?: number;
    patternComplexity?: number;
    [key: string]: unknown;
  };
}

/**
 * Puzzle generation config
 */
export interface PuzzleGenerationConfig {
  type: PuzzleType;
  difficulty: number;
  seed: number;
  playerTier?: DifficultyTier;
}

/**
 * Daily puzzle set
 */
export interface DailyPuzzleSet {
  date: string; // YYYY-MM-DD
  seed: number;
  puzzles: Puzzle[];
  tier: DifficultyTier;
}

/**
 * Puzzle performance tracking
 */
export interface PuzzlePerformance {
  puzzleId: string;
  correct: boolean;
  timeSpent: number; // milliseconds
  attempts: number;
  hintsUsed: number;
  hesitationTime?: number; // Time before first action
  timestamp: number;
}

/**
 * Gauntlet session state
 */
export interface GauntletSession {
  id: string;
  date: string;
  puzzles: Puzzle[];
  currentIndex: number;
  performances: PuzzlePerformance[];
  startedAt: number;
  completedAt?: number;
  score: number;
  hintsRemaining: number;
}
