/**
 * Proof Sprint - Puzzle Generator
 * 
 * Generates deterministic mathematical proof puzzles.
 */

import { SeededRNG } from '@/lib/games/framework/SeededRNG';
import type { Puzzle, Statement, Move, TopicTrack, Difficulty } from './types';
import { getMoveDefinitions } from './moveDefinitions';

export function generatePuzzle(params: {
  seed: number;
  topicTrack: TopicTrack;
  difficulty: Difficulty;
}): Puzzle {
  const rng = new SeededRNG(params.seed);
  const config = getDifficultyConfig(params.difficulty);
  
  // Generate puzzle based on topic track
  const { givenStatements, targetStatement } = generatePuzzleContent(
    params.topicTrack,
    params.difficulty,
    rng
  );
  
  // Get available moves for this difficulty
  const allMoves = getMoveDefinitions();
  const availableMoves = allMoves.filter(move => 
    config.availableMoveTypes.includes(move.type)
  );
  
  return {
    id: `proof-${params.seed}`,
    seed: params.seed,
    name: `${params.topicTrack} Proof Puzzle ${params.seed}`,
    description: `Prove the target statement in ${config.maxSteps} steps or less.`,
    topicTrack: params.topicTrack,
    difficulty: params.difficulty,
    givenStatements,
    targetStatement,
    availableMoves,
    maxSteps: config.maxSteps,
    hintTokens: config.hintTokens,
    tier: getTierForDifficulty(params.difficulty),
  };
}

interface DifficultyConfig {
  maxSteps: number;
  hintTokens: number;
  availableMoveTypes: Move['type'][];
}

function getDifficultyConfig(difficulty: Difficulty): DifficultyConfig {
  switch (difficulty) {
    case 'beginner':
      return {
        maxSteps: 15,
        hintTokens: 3,
        availableMoveTypes: ['distribute', 'simplify', 'combine'],
      };
    case 'student':
      return {
        maxSteps: 12,
        hintTokens: 2,
        availableMoveTypes: ['distribute', 'simplify', 'combine', 'factor'],
      };
    case 'scholar':
      return {
        maxSteps: 10,
        hintTokens: 2,
        availableMoveTypes: ['distribute', 'simplify', 'combine', 'factor', 'substitute'],
      };
    case 'theorist':
      return {
        maxSteps: 8,
        hintTokens: 1,
        availableMoveTypes: ['distribute', 'simplify', 'combine', 'factor', 'substitute', 'expand'],
      };
    case 'master':
      return {
        maxSteps: 6,
        hintTokens: 0,
        availableMoveTypes: ['distribute', 'simplify', 'combine', 'factor', 'substitute', 'expand', 'theorem'],
      };
  }
}

function generatePuzzleContent(
  track: TopicTrack,
  difficulty: Difficulty,
  rng: SeededRNG
): { givenStatements: Statement[]; targetStatement: Statement } {
  // Simplified puzzle generation - in full implementation, this would generate
  // topic-specific puzzles (algebra, number theory, etc.)
  
  const givenStatements: Statement[] = [
    {
      id: 'given-1',
      expression: 'a + b = c',
      type: 'given',
    },
    {
      id: 'given-2',
      expression: 'd = 2',
      type: 'given',
    },
  ];
  
  const targetStatement: Statement = {
    id: 'target',
    expression: '(a + b)^2 = a^2 + 2ab + b^2',
    type: 'target',
  };
  
  return { givenStatements, targetStatement };
}

function getTierForDifficulty(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'beginner': return 0;
    case 'student': return 100;
    case 'scholar': return 300;
    case 'theorist': return 600;
    case 'master': return 1000;
  }
}
