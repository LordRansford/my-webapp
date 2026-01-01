/**
 * Constraint Engine
 * 
 * Validates solutions against constraints
 */

import type { OptimizationChallenge, Constraint, Solution } from "./types";

export function validateSolution(
  selectedItems: string[],
  challenge: OptimizationChallenge
): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  
  for (const constraint of challenge.constraints) {
    const result = checkConstraint(selectedItems, constraint);
    if (!result.valid) {
      violations.push(result.reason || constraint.description);
    }
  }
  
  // Check max items
  if (selectedItems.length > challenge.maxItems) {
    violations.push(`Exceeded maximum items (${challenge.maxItems})`);
  }
  
  return {
    valid: violations.length === 0,
    violations,
  };
}

function checkConstraint(
  selectedItems: string[],
  constraint: Constraint
): { valid: boolean; reason?: string } {
  switch (constraint.type) {
    case 'must-include':
      if (!constraint.items || constraint.items.length === 0) {
        return { valid: true };
      }
      for (const item of constraint.items) {
        if (!selectedItems.includes(item)) {
          return { valid: false, reason: `Must include ${item}` };
        }
      }
      return { valid: true };
      
    case 'must-exclude':
      if (!constraint.items || constraint.items.length === 0) {
        return { valid: true };
      }
      for (const item of constraint.items) {
        if (selectedItems.includes(item)) {
          return { valid: false, reason: `Must not include ${item}` };
        }
      }
      return { valid: true };
      
    case 'at-least':
      if (!constraint.items || !constraint.count) {
        return { valid: true };
      }
      const includedCount = constraint.items.filter(item => selectedItems.includes(item)).length;
      if (includedCount < constraint.count) {
        return { valid: false, reason: `Must include at least ${constraint.count} of: ${constraint.items.join(', ')}` };
      }
      return { valid: true };
      
    case 'at-most':
      if (!constraint.items || constraint.count === undefined) {
        return { valid: true };
      }
      const includedCountAtMost = constraint.items.filter(item => selectedItems.includes(item)).length;
      if (includedCountAtMost > constraint.count) {
        return { valid: false, reason: `Can include at most ${constraint.count} of: ${constraint.items.join(', ')}` };
      }
      return { valid: true };
      
    case 'exactly':
      if (!constraint.items || constraint.count === undefined) {
        return { valid: true };
      }
      const includedCountExactly = constraint.items.filter(item => selectedItems.includes(item)).length;
      if (includedCountExactly !== constraint.count) {
        return { valid: false, reason: `Must include exactly ${constraint.count} of: ${constraint.items.join(', ')}` };
      }
      return { valid: true };
      
    case 'preference':
      // Preferences don't cause violations, they just affect efficiency
      return { valid: true };
      
    default:
      return { valid: true };
  }
}

export function countConstraintViolations(
  selectedItems: string[],
  challenge: OptimizationChallenge
): number {
  const result = validateSolution(selectedItems, challenge);
  return result.violations.length;
}