/**
 * Constraint Optimizer Challenge Generator
 */

import { SeededRNG } from "@/lib/games/framework/SeededRNG";
import type { OptimizationChallenge } from "./types";

export function generateChallenge(params: {
  seed: number;
  difficulty: OptimizationChallenge['difficulty'];
}): OptimizationChallenge {
  const rng = new SeededRNG(params.seed);
  const config = getDifficultyConfig(params.difficulty);
  
  // Generate available items
  const itemPool = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  const availableItems = rng.sample(itemPool, config.itemCount);
  
  // Generate constraints
  const constraints = generateConstraints(availableItems, config, rng);
  
  return {
    id: `constraint-${params.seed}`,
    seed: params.seed,
    name: `Optimization Challenge ${params.seed}`,
    description: `Select up to ${config.maxItems} items that satisfy all constraints while maximizing efficiency.`,
    availableItems,
    constraints,
    maxItems: config.maxItems,
    difficulty: params.difficulty,
    tier: getTierForDifficulty(params.difficulty),
  };
}

interface DifficultyConfig {
  itemCount: number;
  maxItems: number;
  constraintCount: number;
}

function getDifficultyConfig(difficulty: OptimizationChallenge['difficulty']): DifficultyConfig {
  switch (difficulty) {
    case 'novice':
      return { itemCount: 6, maxItems: 3, constraintCount: 2 };
    case 'optimizer':
      return { itemCount: 8, maxItems: 4, constraintCount: 3 };
    case 'solver':
      return { itemCount: 10, maxItems: 5, constraintCount: 4 };
    case 'master-optimizer':
      return { itemCount: 12, maxItems: 6, constraintCount: 5 };
    case 'constraint-master':
      return { itemCount: 12, maxItems: 7, constraintCount: 6 };
  }
}

function generateConstraints(
  items: string[],
  config: DifficultyConfig,
  rng: SeededRNG
): OptimizationChallenge['constraints'] {
  const constraints: OptimizationChallenge['constraints'] = [];
  
  // Must-include constraint
  if (config.constraintCount > 0) {
    const mustInclude = rng.sample(items, 1);
    constraints.push({
      id: 'must-1',
      type: 'must-include',
      description: `Must include ${mustInclude[0]}`,
      items: mustInclude,
    });
  }
  
  // At-least constraint
  if (config.constraintCount > 1) {
    const atLeastItems = rng.sample(items, 2);
    constraints.push({
      id: 'at-least-1',
      type: 'at-least',
      description: `Must include at least 1 of: ${atLeastItems.join(', ')}`,
      items: atLeastItems,
      count: 1,
    });
  }
  
  // At-most constraint
  if (config.constraintCount > 2) {
    const atMostItems = rng.sample(items, 3);
    constraints.push({
      id: 'at-most-1',
      type: 'at-most',
      description: `Can include at most 2 of: ${atMostItems.join(', ')}`,
      items: atMostItems,
      count: 2,
    });
  }
  
  // Must-exclude constraint
  if (config.constraintCount > 3) {
    const mustExclude = rng.sample(items, 1);
    constraints.push({
      id: 'must-exclude-1',
      type: 'must-exclude',
      description: `Must not include ${mustExclude[0]}`,
      items: mustExclude,
    });
  }
  
  // Preference constraints
  while (constraints.length < config.constraintCount) {
    const prefItems = rng.sample(items, 2);
    constraints.push({
      id: `pref-${constraints.length}`,
      type: 'preference',
      description: `Prefer ${prefItems[0]} over ${prefItems[1]}`,
      items: prefItems,
      weight: 0.5,
    });
  }
  
  return constraints;
}

function getTierForDifficulty(difficulty: OptimizationChallenge['difficulty']): number {
  switch (difficulty) {
    case 'novice': return 0;
    case 'optimizer': return 100;
    case 'solver': return 300;
    case 'master-optimizer': return 600;
    case 'constraint-master': return 1000;
  }
}