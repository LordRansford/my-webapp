/**
 * Beauty Calculator
 */

import type { Pattern, PatternChallenge, BeautyScore } from "./types";
import { validatePattern } from "./patternValidator";

export function calculateBeautyScore(
  pattern: Pattern,
  challenge: PatternChallenge
): BeautyScore {
  const validation = validatePattern(pattern, challenge);
  
  // Symmetry score (0-1)
  const symmetry = validation.symmetryScore;
  
  // Balance score (how evenly distributed)
  const balance = calculateBalance(pattern);
  
  // Complexity score (moderate complexity is beautiful)
  const complexity = calculateComplexity(pattern, challenge);
  
  // Total beauty score (0-100)
  const total = (symmetry * 0.4 + balance * 0.3 + complexity * 0.3) * 100;
  
  return {
    symmetry: symmetry * 100,
    balance: balance * 100,
    complexity: complexity * 100,
    total: Math.round(total * 100) / 100,
  };
}

function calculateBalance(pattern: Pattern): number {
  if (pattern.elements.length === 0) return 0;
  
  const grid = pattern.grid;
  const size = grid.length;
  const centerRow = size / 2;
  const centerCol = size / 2;
  
  // Calculate distance from center for all elements
  let totalDistance = 0;
  for (const element of pattern.elements) {
    const rowDist = Math.abs(element.row - centerRow);
    const colDist = Math.abs(element.col - centerCol);
    totalDistance += Math.sqrt(rowDist * rowDist + colDist * colDist);
  }
  
  const avgDistance = totalDistance / pattern.elements.length;
  const maxDistance = Math.sqrt(centerRow * centerRow + centerCol * centerCol);
  
  // Balanced if elements are moderately distributed (not all center, not all edges)
  const normalized = avgDistance / maxDistance;
  return Math.max(0, Math.min(1, 1 - Math.abs(normalized - 0.5) * 2));
}

function calculateComplexity(pattern: Pattern, challenge: PatternChallenge): number {
  const elementCount = pattern.elements.length;
  const maxElements = challenge.gridSize * challenge.gridSize;
  
  // Optimal complexity is around 30-50% of grid
  const optimalMin = maxElements * 0.3;
  const optimalMax = maxElements * 0.5;
  
  if (elementCount < optimalMin) {
    return elementCount / optimalMin;
  } else if (elementCount > optimalMax) {
    return 1 - (elementCount - optimalMax) / (maxElements - optimalMax);
  } else {
    return 1;
  }
}