/**
 * Allocation Architect - Constraint Engine
 * 
 * Handles constraint checking and validation.
 */

import type { GameState, Constraint } from './types';

/**
 * Update constraints based on current state
 */
export function updateConstraints(state: GameState): GameState {
  const newConstraints = state.constraints.map(constraint => {
    // Calculate current value based on constraint type
    const current = calculateConstraintValue(state, constraint);
    const violated = current > constraint.limit;
    
    return {
      ...constraint,
      current,
      violated,
    };
  });
  
  return {
    ...state,
    constraints: newConstraints,
  };
}

/**
 * Calculate current value for a constraint
 */
function calculateConstraintValue(state: GameState, constraint: Constraint): number {
  switch (constraint.type) {
    case 'budget':
      return state.totalBudgetUsed;
    case 'time':
      return state.currentRound;
    case 'capacity':
      // Sum of resources allocated to all projects
      return state.allocationHistory.reduce((sum, alloc) => sum + alloc.resources, 0);
    case 'resource':
      // Total resources used across all rounds
      return state.totalBudgetUsed;
    case 'dependency':
      // Count of projects with unmet dependencies
      return state.projects.filter(p => {
        return p.dependencies.some(depId => {
          const dep = state.projects.find(proj => proj.id === depId);
          return !dep || dep.currentProgress < 100;
        });
      }).length;
    default:
      return 0;
  }
}

/**
 * Check if any constraints are violated
 */
export function hasConstraintViolations(state: GameState): boolean {
  return state.constraints.some(c => c.violated);
}

/**
 * Get constraint violations
 */
export function getConstraintViolations(state: GameState): Constraint[] {
  return state.constraints.filter(c => c.violated);
}

/**
 * Get constraint warnings (approaching limit)
 */
export function getConstraintWarnings(state: GameState): Constraint[] {
  return state.constraints.filter(c => {
    if (c.violated) return false;
    const threshold = c.limit * c.warningThreshold;
    return c.current > threshold;
  });
}
