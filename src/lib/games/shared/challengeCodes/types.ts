/**
 * Challenge Code System Types
 * 
 * Universal challenge code system for sharing and replaying challenges across all games.
 * Format: GAME-YYYY-MM-DD-XXXX
 */

/**
 * Game identifier (4-letter uppercase code)
 */
export type GameId = 'DLG' | 'COPT' | 'PATT' | 'DEDU' | 'FLOW' | 'MEMO' | 'ALOC';

/**
 * Challenge code structure
 */
export interface ChallengeCode {
  code: string;           // Full code: GAME-YYYY-MM-DD-XXXX
  gameId: GameId;         // Game identifier
  date: string;           // YYYY-MM-DD format
  seed: number;           // Numeric seed for challenge generation
  hash: string;           // 4-character hash (XXXX)
  version?: string;       // Optional version for future compatibility
}

/**
 * Challenge code storage data
 */
export interface ChallengeCodeStorage {
  code: string;
  gameId: GameId;
  date: string;
  seed: number;
  playerResult?: {
    score: number;
    time: number;
    efficiency?: number;
    achievements: string[];
    timestamp: number;
  };
  comparison?: {
    averageScore: number;
    percentile: number;
    participantCount: number;
    lastUpdated: number;
  };
}

/**
 * Challenge code validation result
 */
export interface CodeValidationResult {
  valid: boolean;
  code?: ChallengeCode;
  error?: string;
}

/**
 * Challenge code parse result
 */
export interface ParseResult {
  success: boolean;
  code?: ChallengeCode;
  error?: string;
}