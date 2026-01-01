/**
 * Pattern Validator
 */

import type { PatternChallenge, Pattern, PatternValidation, SymmetryType } from "./types";

export function validatePattern(
  pattern: Pattern,
  challenge: PatternChallenge
): PatternValidation {
  const violations: string[] = [];
  let symmetryScore = 0;
  
  // Check symmetry
  const symmetryTypes: SymmetryType[] = ['horizontal', 'vertical', 'rotational'];
  for (const requiredSym of challenge.requiredSymmetry) {
    if (checkSymmetry(pattern, requiredSym)) {
      symmetryScore += 1;
    } else {
      violations.push(`Missing ${requiredSym} symmetry`);
    }
  }
  
  // Check rules
  for (const rule of challenge.rules) {
    if (rule.type === 'count' && rule.requiredCount) {
      if (pattern.elements.length < rule.requiredCount) {
        violations.push(rule.description);
      }
    }
  }
  
  return {
    valid: violations.length === 0,
    violations,
    symmetryScore: symmetryScore / challenge.requiredSymmetry.length,
  };
}

function checkSymmetry(pattern: Pattern, type: SymmetryType): boolean {
  const grid = pattern.grid;
  const size = grid.length;
  
  switch (type) {
    case 'horizontal':
      for (let row = 0; row < Math.floor(size / 2); row++) {
        for (let col = 0; col < size; col++) {
          if (grid[row][col] !== grid[size - 1 - row][col]) {
            return false;
          }
        }
      }
      return true;
      
    case 'vertical':
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < Math.floor(size / 2); col++) {
          if (grid[row][col] !== grid[row][size - 1 - col]) {
            return false;
          }
        }
      }
      return true;
      
    case 'rotational':
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          if (grid[row][col] !== grid[size - 1 - row][size - 1 - col]) {
            return false;
          }
        }
      }
      return true;
      
    default:
      return false;
  }
}