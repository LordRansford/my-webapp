/**
 * Puzzle Generator
 * 
 * Generates puzzles for Daily Logic Gauntlet using templates and seeds.
 * Phase 1: Uses curated templates. Phase 2: Will add procedural generation.
 */

import type { Puzzle, PuzzleType, PuzzleGenerationConfig, DifficultyTier } from './types';
import { SeededRNG } from '../../framework/SeededRNG';
import { generatePuzzleFromTemplate, getTemplatesByDifficulty } from './puzzleTemplates';

/**
 * Generate a single puzzle
 */
export function generatePuzzle(config: PuzzleGenerationConfig): Puzzle {
  const rng = new SeededRNG(config.seed);
  
  // Get templates for this type and difficulty
  const templates = getTemplatesByDifficulty(config.type, config.difficulty);
  
  if (templates.length === 0) {
    // Fallback: create simple puzzle
    return createFallbackPuzzle(config, rng);
  }
  
  // Select template randomly
  const template = rng.choice(templates);
  
  // Generate puzzle from template
  return generatePuzzleFromTemplate(template, config.difficulty, rng);
}

/**
 * Generate daily puzzle set
 */
export function generateDailyPuzzleSet(
  seed: number,
  playerTier: DifficultyTier = 'novice',
  puzzleCount: number = 10
): Puzzle[] {
  const rng = new SeededRNG(seed);
  const puzzles: Puzzle[] = [];
  
  // Mix of puzzle types based on tier
  const typeWeights = getTypeWeightsForTier(playerTier);
  const types: PuzzleType[] = ['logic', 'pattern', 'deduction', 'constraint'];
  const weights = typeWeights[0]; // Get first (and only) weight set
  
  for (let i = 0; i < puzzleCount; i++) {
    // Select puzzle type based on weights
    const type = rng.weightedChoice(types, types.map(t => weights[t] || 0));
    
    // Calculate difficulty (progressive: easier to harder)
    const positionFactor = i / puzzleCount;
    const baseDifficulty = 0.3 + (positionFactor * 0.4); // 0.3 to 0.7 range
    
    // Adjust for tier
    const tierAdjustment = getTierDifficultyAdjustment(playerTier);
    const difficulty = Math.max(0.1, Math.min(0.95, baseDifficulty + tierAdjustment));
    
    // Generate puzzle
    const puzzle = generatePuzzle({
      type,
      difficulty,
      seed: seed + i, // Different seed for each puzzle
      playerTier,
    });
    
    puzzles.push(puzzle);
  }
  
  return puzzles;
}

/**
 * Get type weights for tier
 */
function getTypeWeightsForTier(tier: DifficultyTier): [Record<PuzzleType, number>] {
  // Novice: Mostly logic and pattern (easier)
  if (tier === 'novice') {
    return [{ logic: 0.4, pattern: 0.4, deduction: 0.1, constraint: 0.1 }];
  }
  
  // Apprentice: More balanced
  if (tier === 'apprentice') {
    return [{ logic: 0.3, pattern: 0.3, deduction: 0.2, constraint: 0.2 }];
  }
  
  // Adept: More deduction and constraint
  if (tier === 'adept') {
    return [{ logic: 0.25, pattern: 0.25, deduction: 0.25, constraint: 0.25 }];
  }
  
  // Expert+: Balanced with all types
  return [{ logic: 0.25, pattern: 0.25, deduction: 0.25, constraint: 0.25 }];
}

/**
 * Get difficulty adjustment for tier
 */
function getTierDifficultyAdjustment(tier: DifficultyTier): number {
  const adjustments: Record<DifficultyTier, number> = {
    novice: -0.2,
    apprentice: 0,
    adept: 0.1,
    expert: 0.2,
    master: 0.3,
  };
  return adjustments[tier];
}

/**
 * Create fallback puzzle (when no templates available)
 */
function createFallbackPuzzle(
  config: PuzzleGenerationConfig,
  rng: SeededRNG
): Puzzle {
  // Simple fallback puzzle
  const question = `What is the next number in the sequence: 1, 2, 3, 4, ?`;
  const correctAnswer = 5;
  const options = [
    String(correctAnswer),
    String(correctAnswer + 1),
    String(correctAnswer - 1),
    String(correctAnswer * 2),
  ];
  
  const shuffled = rng.shuffle(options);
  const correctIndex = shuffled.indexOf(String(correctAnswer));
  
  return {
    id: `fallback-${rng.nextInt(1000, 9999)}`,
    type: config.type,
    difficulty: config.difficulty,
    question,
    options: shuffled,
    correctAnswer: correctIndex,
    explanation: 'Each number increases by 1, so the next number is 5.',
  };
}

/**
 * Validate puzzle quality
 */
export function validatePuzzle(puzzle: Puzzle): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Check required fields
  if (!puzzle.question || puzzle.question.length < 10) {
    issues.push('Question too short or missing');
  }
  
  if (!puzzle.options || puzzle.options.length < 4) {
    issues.push('Need at least 4 answer options');
  }
  
  if (puzzle.correctAnswer < 0 || puzzle.correctAnswer >= puzzle.options.length) {
    issues.push('Correct answer index out of range');
  }
  
  // Check for duplicate options
  const uniqueOptions = new Set(puzzle.options);
  if (uniqueOptions.size !== puzzle.options.length) {
    issues.push('Duplicate answer options');
  }
  
  // Check explanation
  if (!puzzle.explanation || puzzle.explanation.length < 20) {
    issues.push('Explanation too short or missing');
  }
  
  return {
    valid: issues.length === 0,
    issues,
  };
}
