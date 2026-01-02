/**
 * Deduction Grid Puzzle Generator
 */

import { SeededRNG } from "@/lib/games/framework/SeededRNG";
import type { DeductionPuzzle, Clue } from "./types";

export function generatePuzzle(params: {
  seed: number;
  difficulty: DeductionPuzzle['difficulty'];
}): DeductionPuzzle {
  const rng = new SeededRNG(params.seed);
  const gridSize = getGridSizeForDifficulty(params.difficulty);
  const rowLabels = generateLabels(gridSize.rows, rng);
  const colLabels = generateLabels(gridSize.cols, rng);
  
  // Generate solution
  const solution: DeductionPuzzle['solution'] = [];
  for (let row = 0; row < gridSize.rows; row++) {
    solution[row] = [];
    for (let col = 0; col < gridSize.cols; col++) {
      solution[row][col] = rng.next() < 0.5 ? 'yes' : 'no';
    }
  }
  
  // Generate clues based on solution
  const clues = generateClues(solution, rowLabels, colLabels, params.difficulty, rng);
  
  return {
    id: `deduction-${params.seed}`,
    seed: params.seed,
    name: `Deduction Puzzle ${params.seed}`,
    description: `Solve this ${gridSize.rows}x${gridSize.cols} logic grid puzzle using the clues provided.`,
    gridSize,
    rowLabels,
    colLabels,
    clues,
    solution,
    difficulty: params.difficulty,
    tier: getTierForDifficulty(params.difficulty),
  };
}

function getGridSizeForDifficulty(difficulty: DeductionPuzzle['difficulty']) {
  switch (difficulty) {
    case 'novice':
      return { rows: 3, cols: 3 };
    case 'deductive':
      return { rows: 4, cols: 4 };
    case 'logical-master':
      return { rows: 5, cols: 5 };
    case 'inference-expert':
      return { rows: 5, cols: 5 };
    case 'deduction-master':
      return { rows: 6, cols: 6 };
    default:
      return { rows: 4, cols: 4 };
  }
}

function generateLabels(count: number, rng: SeededRNG): string[] {
  const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  return labels.slice(0, count);
}

function generateClues(
  solution: DeductionPuzzle['solution'],
  rowLabels: string[],
  colLabels: string[],
  difficulty: DeductionPuzzle['difficulty'],
  rng: SeededRNG
): Clue[] {
  const clues: Clue[] = [];
  const clueCount = getClueCountForDifficulty(difficulty);
  
  // Generate direct clues
  for (let i = 0; i < clueCount; i++) {
    const row = Math.floor(rng.next() * solution.length);
    const col = Math.floor(rng.next() * solution[0].length);
    const value = solution[row][col];
    
    clues.push({
      id: `clue-${i}`,
      description: `${rowLabels[row]} and ${colLabels[col]} are ${value === 'yes' ? 'related' : 'not related'}.`,
      type: 'direct',
      affectedCells: [{ row, col }],
    });
  }
  
  return clues;
}

function getClueCountForDifficulty(difficulty: DeductionPuzzle['difficulty']): number {
  switch (difficulty) {
    case 'novice':
      return 4;
    case 'deductive':
      return 6;
    case 'logical-master':
      return 8;
    case 'inference-expert':
      return 10;
    case 'deduction-master':
      return 12;
    default:
      return 6;
  }
}

function getTierForDifficulty(difficulty: DeductionPuzzle['difficulty']): number {
  switch (difficulty) {
    case 'novice':
      return 0;
    case 'deductive':
      return 100;
    case 'logical-master':
      return 300;
    case 'inference-expert':
      return 600;
    case 'deduction-master':
      return 1000;
    default:
      return 0;
  }
}