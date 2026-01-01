/**
 * Allocation Architect - Objective Calculator
 * 
 * Calculates objective progress and checks if objectives are met.
 */

import type { GameState, Objective } from './types';
import { calculateMetrics } from './efficiencyCalculator';

/**
 * Update objectives based on current state
 */
export function updateObjectives(state: GameState): GameState {
  const metrics = calculateMetrics(state);
  const newObjectives = state.objectives.map(objective => {
    const current = calculateObjectiveCurrent(state, objective, metrics);
    const met = current >= objective.target;
    
    return {
      ...objective,
      current,
      met,
    };
  });
  
  return {
    ...state,
    objectives: newObjectives,
  };
}

/**
 * Calculate current value for an objective
 */
function calculateObjectiveCurrent(state: GameState, objective: Objective, metrics: GameState['metrics']): number {
  switch (objective.type) {
    case 'complete-projects':
      return state.projects.filter(p => p.currentProgress >= 100).length;
    case 'maintain-efficiency':
      return metrics.resourceEfficiency;
    case 'meet-constraints':
      // Percentage of constraints met
      const metConstraints = state.constraints.filter(c => !c.violated).length;
      return state.constraints.length > 0 ? (metConstraints / state.constraints.length) * 100 : 100;
    case 'minimize-risk':
      return metrics.riskLevel;
    default:
      return 0;
  }
}

/**
 * Calculate objective progress percentage
 */
export function calculateObjectiveProgress(state: GameState): number {
  if (state.objectives.length === 0) return 100;
  
  const totalProgress = state.objectives.reduce((sum, obj) => {
    const progress = Math.min(100, (obj.current / obj.target) * 100);
    return sum + progress;
  }, 0);
  
  return totalProgress / state.objectives.length;
}

/**
 * Check if all objectives are met
 */
export function areAllObjectivesMet(state: GameState): boolean {
  return state.objectives.every(obj => obj.met);
}

/**
 * Get unmet objectives
 */
export function getUnmetObjectives(state: GameState): Objective[] {
  return state.objectives.filter(obj => !obj.met);
}
