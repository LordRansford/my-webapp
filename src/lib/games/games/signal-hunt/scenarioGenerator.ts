/**
 * Scenario Generator
 * 
 * Generates deterministic scenarios for Signal Hunt.
 */

import { SeededRNG } from '@/lib/games/framework/SeededRNG';
import type { Scenario, Difficulty } from './types';

export function generateScenario(
  seed: number,
  difficulty: Difficulty
): Scenario {
  const rng = new SeededRNG(seed);
  const config = getDifficultyConfig(difficulty);
  
  return {
    id: `scenario-${seed}`,
    name: getScenarioName(difficulty),
    description: getScenarioDescription(difficulty),
    adversaryType: getAdversaryType(rng),
    environmentNoise: config.falsePositiveRate,
    difficulty,
    totalTurns: config.totalTurns,
    initialBudget: {
      actions: config.initialActions,
      budget: config.initialBudget,
    },
  };
}

interface DifficultyConfig {
  totalTurns: number;
  falsePositiveRate: number;
  initialActions: number;
  initialBudget: number;
}

function getDifficultyConfig(difficulty: Difficulty): DifficultyConfig {
  switch (difficulty) {
    case 'foundations':
      return {
        totalTurns: 8,
        falsePositiveRate: 0.2,
        initialActions: 5,
        initialBudget: 8,
      };
    case 'intermediate':
      return {
        totalTurns: 10,
        falsePositiveRate: 0.35,
        initialActions: 4,
        initialBudget: 6,
      };
    case 'advanced':
      return {
        totalTurns: 12,
        falsePositiveRate: 0.4,
        initialActions: 3,
        initialBudget: 5,
      };
    case 'expert':
      return {
        totalTurns: 12,
        falsePositiveRate: 0.5,
        initialActions: 2,
        initialBudget: 3,
      };
  }
}

function getScenarioName(difficulty: Difficulty): string {
  const names = {
    foundations: 'SOC Training Scenario',
    intermediate: 'Incident Response Challenge',
    advanced: 'Advanced Threat Triage',
    expert: 'Elite Security Operations',
  };
  return names[difficulty];
}

function getScenarioDescription(difficulty: Difficulty): string {
  const descriptions = {
    foundations: 'Learn the basics of security signal triage in a controlled environment.',
    intermediate: 'Manage security signals under moderate pressure with realistic false positive rates.',
    advanced: 'Handle complex security incidents with multiple simultaneous threats.',
    expert: 'Master elite-level security operations with adversarial threats and high noise.',
  };
  return descriptions[difficulty];
}

function getAdversaryType(rng: SeededRNG): string {
  const types = [
    'Script Kiddie',
    'Organized Crime',
    'Advanced Persistent Threat',
    'Insider Threat',
    'Nation State Actor',
  ];
  return rng.sample(types, 1)[0];
}
