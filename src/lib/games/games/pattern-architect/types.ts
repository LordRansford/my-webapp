/**
 * Pattern Architect Types
 */

export type PatternElementType = 'dot' | 'line' | 'shape' | 'color';
export type SymmetryType = 'horizontal' | 'vertical' | 'rotational' | 'diagonal';

export interface PatternRule {
  id: string;
  type: 'symmetry' | 'color' | 'position' | 'count';
  description: string;
  symmetryType?: SymmetryType;
  requiredCount?: number;
}

export interface PatternConfig {
  gridSize: number;
  rules: PatternRule[];
  requiredSymmetry?: SymmetryType[];
}

export interface Pattern {
  grid: PatternElementType[][];
  elements: Array<{ row: number; col: number; type: PatternElementType }>;
}

export interface PatternValidation {
  valid: boolean;
  violations: string[];
  symmetryScore: number;
}

export interface BeautyScore {
  symmetry: number;
  balance: number;
  complexity: number;
  total: number;
}

export interface PatternChallenge {
  id: string;
  seed: number;
  name: string;
  description: string;
  gridSize: number;
  rules: PatternRule[];
  requiredSymmetry: SymmetryType[];
  difficulty: 'novice' | 'designer' | 'architect' | 'master-architect' | 'pattern-master';
  tier: number;
}

export interface PlayerProgress {
  xp: number;
  tier: 'novice' | 'designer' | 'architect' | 'master-architect' | 'pattern-master';
  challengesCompleted: number;
  personalBests: Record<string, number>;
  achievements: string[];
}