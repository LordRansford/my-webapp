/**
 * Proof Sprint - Game State Management
 */

import type { GameState, Puzzle, Move, Statement, ProofStep } from './types';

/**
 * Initialize game state from puzzle
 */
export function initializeGameState(puzzle: Puzzle, seed: number): GameState {
  return {
    puzzle,
    currentStatements: [...puzzle.givenStatements],
    proofSteps: [],
    stepCount: 0,
    penalty: 0,
    hintTokens: puzzle.hintTokens,
    seed,
    status: 'idle',
  };
}

/**
 * Start the game
 */
export function startGame(state: GameState): GameState {
  return {
    ...state,
    status: 'playing',
  };
}

/**
 * Execute move
 */
export function executeMove(
  state: GameState,
  move: Move,
  inputStatementIds: string[]
): GameState {
  if (state.status !== 'playing') return state;
  
  // Validate move
  if (!move.applicable(state.currentStatements)) {
    return state; // Invalid move
  }
  
  // Check step limit
  if (state.stepCount >= state.puzzle.maxSteps) {
    return {
      ...state,
      status: 'finished',
      outcome: 'loss',
    };
  }
  
  // Apply move (simplified - in full implementation, this would actually transform expressions)
  const outputStatement: Statement = {
    id: `derived-${state.stepCount + 1}`,
    expression: `[Result of ${move.name}]`, // Simplified
    type: 'derived',
    stepNumber: state.stepCount + 1,
  };
  
  const proofStep: ProofStep = {
    stepNumber: state.stepCount + 1,
    move,
    inputStatements: inputStatementIds,
    outputStatement,
    penalty: move.penalty,
  };
  
  const newState: GameState = {
    ...state,
    currentStatements: [...state.currentStatements, outputStatement],
    proofSteps: [...state.proofSteps, proofStep],
    stepCount: state.stepCount + 1,
    penalty: state.penalty + move.penalty,
  };
  
  // Check if target reached (simplified check)
  if (outputStatement.expression === state.puzzle.targetStatement.expression) {
    newState.status = 'finished';
    newState.outcome = 'win';
    newState.elegance = calculateElegance(newState);
  }
  
  return newState;
}

function calculateElegance(state: GameState): number {
  // Simplified elegance calculation
  // In full implementation, would analyze proof structure, move variety, etc.
  const stepEfficiency = 1 - (state.stepCount / state.puzzle.maxSteps);
  const penaltyPenalty = state.penalty;
  const moveVariety = new Set(state.proofSteps.map(s => s.move.type)).size / state.proofSteps.length;
  
  return Math.max(0, Math.min(10, (stepEfficiency * 5 + moveVariety * 5 - penaltyPenalty * 2)));
}

/**
 * Check win condition
 */
export function checkWinCondition(state: GameState): boolean {
  return state.currentStatements.some(s => 
    s.expression === state.puzzle.targetStatement.expression
  );
}

/**
 * Check loss condition
 */
export function checkLossCondition(state: GameState): boolean {
  return state.stepCount >= state.puzzle.maxSteps && !checkWinCondition(state);
}
