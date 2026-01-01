/**
 * Constraint Optimizer Types
 */

export interface Constraint {
  id: string;
  type: 'must-include' | 'must-exclude' | 'at-least' | 'at-most' | 'exactly' | 'preference';
  description: string;
  items?: string[];
  count?: number;
  weight?: number;
}

export interface OptimizationChallenge {
  id: string;
  seed: number;
  name: string;
  description: string;
  availableItems: string[];
  constraints: Constraint[];
  maxItems: number;
  difficulty: 'novice' | 'optimizer' | 'solver' | 'master-optimizer' | 'constraint-master';
  tier: number;
}

export interface Solution {
  selectedItems: string[];
  efficiency: number;
  constraintViolations: number;
  createdAt: number;
}

export interface PlayerProgress {
  xp: number;
  tier: 'novice' | 'optimizer' | 'solver' | 'master-optimizer' | 'constraint-master';
  challengesCompleted: number;
  personalBests: Record<string, number>;
  achievements: string[];
}