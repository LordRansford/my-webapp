/**
 * Pattern Generator
 */

import { SeededRNG } from "@/lib/games/framework/SeededRNG";
import type { PatternChallenge, PatternRule, SymmetryType } from "./types";

export function generateChallenge(params: {
  seed: number;
  difficulty: PatternChallenge['difficulty'];
}): PatternChallenge {
  const rng = new SeededRNG(params.seed);
  const config = getDifficultyConfig(params.difficulty);
  
  const rules = generateRules(config, rng);
  const requiredSymmetry = generateSymmetryRequirements(config, rng);
  
  return {
    id: `pattern-${params.seed}`,
    seed: params.seed,
    name: `Pattern Challenge ${params.seed}`,
    description: `Create a ${config.gridSize}x${config.gridSize} pattern following the rules with ${requiredSymmetry.length} symmetry type(s).`,
    gridSize: config.gridSize,
    rules,
    requiredSymmetry,
    difficulty: params.difficulty,
    tier: getTierForDifficulty(params.difficulty),
  };
}

interface DifficultyConfig {
  gridSize: number;
  ruleCount: number;
  symmetryCount: number;
}

function getDifficultyConfig(difficulty: PatternChallenge['difficulty']): DifficultyConfig {
  switch (difficulty) {
    case 'novice':
      return { gridSize: 4, ruleCount: 2, symmetryCount: 1 };
    case 'designer':
      return { gridSize: 5, ruleCount: 3, symmetryCount: 1 };
    case 'architect':
      return { gridSize: 6, ruleCount: 4, symmetryCount: 2 };
    case 'master-architect':
      return { gridSize: 7, ruleCount: 5, symmetryCount: 2 };
    case 'pattern-master':
      return { gridSize: 8, ruleCount: 6, symmetryCount: 3 };
  }
}

function generateRules(config: DifficultyConfig, rng: SeededRNG): PatternRule[] {
  const rules: PatternRule[] = [];
  const symmetryTypes: SymmetryType[] = ['horizontal', 'vertical', 'rotational'];
  
  for (let i = 0; i < config.ruleCount; i++) {
    if (i === 0) {
      // First rule is always symmetry
      rules.push({
        id: `rule-${i}`,
        type: 'symmetry',
        description: `Must have ${symmetryTypes[i % symmetryTypes.length]} symmetry`,
        symmetryType: symmetryTypes[i % symmetryTypes.length],
      });
    } else {
      rules.push({
        id: `rule-${i}`,
        type: 'count',
        description: `Must have at least ${3 + i} elements`,
        requiredCount: 3 + i,
      });
    }
  }
  
  return rules;
}

function generateSymmetryRequirements(
  config: DifficultyConfig,
  rng: SeededRNG
): SymmetryType[] {
  const types: SymmetryType[] = ['horizontal', 'vertical', 'rotational'];
  return rng.sample(types, Math.min(config.symmetryCount, types.length));
}

function getTierForDifficulty(difficulty: PatternChallenge['difficulty']): number {
  switch (difficulty) {
    case 'novice': return 0;
    case 'designer': return 100;
    case 'architect': return 300;
    case 'master-architect': return 600;
    case 'pattern-master': return 1000;
  }
}