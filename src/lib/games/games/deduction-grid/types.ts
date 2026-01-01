/**
 * Deduction Grid Types
 */

export type CellValue = 'yes' | 'no' | 'unknown';

export interface GridCell {
  row: number;
  col: number;
  value: CellValue;
}

export interface Clue {
  id: string;
  description: string;
  type: 'direct' | 'indirect' | 'conditional';
  affectedCells: Array<{ row: number; col: number }>;
}

export interface DeductionPuzzle {
  id: string;
  seed: number;
  name: string;
  description: string;
  gridSize: { rows: number; cols: number };
  rowLabels: string[];
  colLabels: string[];
  clues: Clue[];
  solution: CellValue[][];
  difficulty: 'novice' | 'deductive' | 'logical-master' | 'inference-expert' | 'deduction-master';
  tier: number;
}

export interface DeductionResult {
  correct: boolean;
  accuracy: number;
  cellsCorrect: number;
  totalCells: number;
}

export interface PlayerProgress {
  xp: number;
  tier: 'novice' | 'deductive' | 'logical-master' | 'inference-expert' | 'deduction-master';
  challengesCompleted: number;
  personalBests: Record<string, number>;
  achievements: string[];
}