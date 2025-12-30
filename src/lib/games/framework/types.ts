/**
 * Core type definitions for the Games Framework
 * This provides the foundation for all games in the platform
 */

export type GameMode = "solo" | "multiplayer" | "campaign" | "daily";

export type GameCategory = 
  | "strategy" 
  | "puzzle" 
  | "logic" 
  | "card" 
  | "board" 
  | "arcade"
  | "simulation"
  | "educational";

export type DifficultyLevel = "foundations" | "intermediate" | "advanced" | "expert";

export type GameStatus = "idle" | "playing" | "paused" | "finished" | "error";

/**
 * Game state - pure data structure, no React state
 */
export interface GameState {
  status: GameStatus;
  seed: number; // Deterministic RNG seed
  timestamp: number; // Game start timestamp
  difficulty: number; // 0-1 normalized difficulty
  score?: number;
  moves: GameMove[];
  metadata: Record<string, unknown>;
}

/**
 * Individual game move/action
 */
export interface GameMove {
  timestamp: number; // Relative to game start
  type: string;
  data: unknown;
}

/**
 * Replay log - event stream for deterministic replay
 */
export interface ReplayLog {
  gameId: string;
  seed: number;
  moves: GameMove[];
  initialState: unknown;
  finalState: unknown;
}

/**
 * Difficulty curve configuration
 */
export interface DifficultyCurve {
  initial: number; // 0-1
  target: number; // 0-1
  rampTime: number; // milliseconds
  adaptive: boolean; // Adjust based on performance
}

/**
 * Explainability result - deterministic analysis
 */
export interface GameAnalysis {
  turningPoints: Array<{
    timestamp: number;
    description: string;
    impact: "positive" | "negative" | "neutral";
  }>;
  keyMistakes: Array<{
    timestamp: number;
    description: string;
    suggestion: string;
  }>;
  keyDecisions: Array<{
    timestamp: number;
    description: string;
    impact: string;
  }>;
  summary: string;
}

/**
 * Game configuration
 */
export interface GameConfig {
  id: string;
  title: string;
  description: string;
  category: GameCategory;
  modes: GameMode[];
  supportsMultiplayer: boolean;
  minPlayers: number;
  maxPlayers: number;
  estimatedMinutes: number;
  tutorialAvailable: boolean;
}

/**
 * Player profile (for progression)
 */
export interface PlayerProfile {
  id: string;
  pseudonym: string; // Default pseudonym, no real names
  mastery: Record<string, number>; // gameId -> XP
  rank: string;
  seasonStats: SeasonStats;
}

export interface SeasonStats {
  seasonId: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  rating: number; // Elo/Glicko style
}

/**
 * Match state (for multiplayer)
 */
export interface MatchState {
  id: string;
  gameId: string;
  players: Array<{
    id: string;
    pseudonym: string;
  }>;
  currentTurn: string; // player ID
  gameState: GameState;
  createdAt: number;
  lastMoveAt: number;
  status: "waiting" | "active" | "finished" | "abandoned";
}
