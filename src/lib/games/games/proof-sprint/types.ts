/**
 * Proof Sprint - Type Definitions
 */

export type Difficulty = 'beginner' | 'student' | 'scholar' | 'theorist' | 'master';
export type TopicTrack = 'algebra' | 'number-theory' | 'probability' | 'calculus' | 'logic';
export type MoveType = 'distribute' | 'factor' | 'simplify' | 'substitute' | 'expand' | 'combine' | 'theorem';

/**
 * Statement definition
 */
export interface Statement {
  id: string;
  expression: string; // Mathematical expression as string
  type: 'given' | 'derived' | 'target';
  stepNumber?: number; // For derived statements
}

/**
 * Move definition
 */
export interface Move {
  id: string;
  type: MoveType;
  name: string;
  description: string;
  penalty: number; // 0-1, penalty multiplier for using this move
  prerequisites?: string[]; // Statement IDs that must exist
  applicable: (statements: Statement[]) => boolean; // Function to check if move can be applied
}

/**
 * Proof step
 */
export interface ProofStep {
  stepNumber: number;
  move: Move;
  inputStatements: string[]; // Statement IDs used as input
  outputStatement: Statement; // New statement created
  penalty: number; // Penalty for this step
}

/**
 * Puzzle definition
 */
export interface Puzzle {
  id: string;
  seed: number;
  name: string;
  description: string;
  topicTrack: TopicTrack;
  difficulty: Difficulty;
  givenStatements: Statement[];
  targetStatement: Statement;
  availableMoves: Move[];
  maxSteps: number;
  hintTokens: number;
  tier: number;
}

/**
 * Game state
 */
export interface GameState {
  puzzle: Puzzle;
  currentStatements: Statement[];
  proofSteps: ProofStep[];
  stepCount: number;
  penalty: number;
  hintTokens: number;
  seed: number;
  status: 'idle' | 'playing' | 'finished';
  outcome?: 'win' | 'loss';
  elegance?: number; // 0-10, calculated at end
}
