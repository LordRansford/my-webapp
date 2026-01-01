/**
 * Allocation Architect - Efficiency Calculator
 * 
 * Calculates resource efficiency and metrics.
 */

import type { GameState, Metrics, Allocation } from './types';

/**
 * Calculate metrics for current state
 */
export function calculateMetrics(state: GameState): Metrics {
  const resourceEfficiency = calculateResourceEfficiency(state);
  const objectiveProgress = calculateObjectiveProgress(state);
  const constraintCompliance = calculateConstraintCompliance(state);
  const riskLevel = calculateRiskLevel(state);
  const waste = calculateWaste(state);
  
  return {
    resourceEfficiency,
    objectiveProgress,
    constraintCompliance,
    riskLevel,
    waste,
  };
}

/**
 * Calculate resource efficiency (0-100)
 */
function calculateResourceEfficiency(state: GameState): number {
  if (state.totalBudgetUsed === 0) return 100;
  
  // Calculate effective resource usage
  const effectiveUsage = state.projects.reduce((sum, project) => {
    // Progress gained per resource spent
    const progressGain = project.currentProgress;
    const resourcesSpent = state.allocationHistory
      .filter(a => a.projectId === project.id)
      .reduce((s, a) => s + a.resources, 0);
    
    if (resourcesSpent === 0) return sum;
    
    // Efficiency = progress / resources (normalized)
    const efficiency = (progressGain / project.requiredResources) / (resourcesSpent / project.requiredResources);
    return sum + efficiency;
  }, 0);
  
  const averageEfficiency = state.projects.length > 0 ? effectiveUsage / state.projects.length : 0;
  return Math.min(100, Math.max(0, averageEfficiency * 100));
}

/**
 * Calculate objective progress (0-100)
 */
function calculateObjectiveProgress(state: GameState): number {
  if (state.objectives.length === 0) return 100;
  
  const totalProgress = state.objectives.reduce((sum, obj) => {
    const progress = Math.min(100, (obj.current / obj.target) * 100);
    return sum + progress * obj.weight;
  }, 0);
  
  const totalWeight = state.objectives.reduce((sum, obj) => sum + obj.weight, 0);
  return totalWeight > 0 ? totalProgress / totalWeight : 0;
}

/**
 * Calculate constraint compliance (0-100)
 */
function calculateConstraintCompliance(state: GameState): number {
  if (state.constraints.length === 0) return 100;
  
  const compliantConstraints = state.constraints.filter(c => !c.violated).length;
  return (compliantConstraints / state.constraints.length) * 100;
}

/**
 * Calculate risk level (0-100)
 */
function calculateRiskLevel(state: GameState): number {
  // Risk based on:
  // 1. Projects with low health
  // 2. Projects with high risk level
  // 3. Upcoming events
  // 4. Constraint proximity to limits
  
  let risk = 0;
  
  // Project risk
  const projectRisk = state.projects.reduce((sum, project) => {
    const healthRisk = (100 - project.health) / 100;
    const inherentRisk = project.riskLevel;
    return sum + (healthRisk * 0.5 + inherentRisk * 0.5);
  }, 0);
  risk += (projectRisk / state.projects.length) * 50;
  
  // Constraint risk (proximity to limits)
  const constraintRisk = state.constraints.reduce((sum, constraint) => {
    const proximity = constraint.current / constraint.limit;
    return sum + Math.min(1, proximity);
  }, 0);
  risk += (constraintRisk / state.constraints.length) * 30;
  
  // Event risk (upcoming events)
  const upcomingEvents = state.events.filter(e => e.round > state.currentRound);
  risk += Math.min(20, upcomingEvents.length * 5);
  
  return Math.min(100, Math.max(0, risk));
}

/**
 * Calculate waste (resources wasted)
 */
function calculateWaste(state: GameState): number {
  // Waste = resources allocated but not effectively used
  // This is resources allocated to projects that are complete or over-allocated
  
  let waste = 0;
  
  for (const project of state.projects) {
    const allocated = state.allocationHistory
      .filter(a => a.projectId === project.id)
      .reduce((sum, a) => sum + a.resources, 0);
    
    if (project.currentProgress >= 100) {
      // Project is complete, any additional allocation is waste
      const required = project.requiredResources;
      waste += Math.max(0, allocated - required);
    } else {
      // Calculate if over-allocated (diminishing returns make some allocation wasteful)
      const progressRatio = project.currentProgress / 100;
      const diminishingFactor = 1 - (progressRatio * project.diminishingReturns);
      if (diminishingFactor < 0.1) {
        // Very low efficiency, consider some allocation wasteful
        waste += allocated * 0.2;
      }
    }
  }
  
  return waste;
}

/**
 * Calculate projected metrics for preview
 */
export function calculateProjectedMetrics(state: GameState, allocation: Allocation[]): Metrics {
  // Create temporary state with allocation
  const tempState = {
    ...state,
    projects: state.projects.map(project => {
      const alloc = allocation.find(a => a.projectId === project.id);
      if (!alloc) return project;
      
      const progressGain = project.progressPerResource * alloc.resources;
      const progressRatio = project.currentProgress / 100;
      const diminishingFactor = 1 - (progressRatio * project.diminishingReturns);
      const newProgress = Math.min(100, project.currentProgress + (progressGain * diminishingFactor));
      
      return {
        ...project,
        currentProgress: newProgress,
      };
    }),
    allocationHistory: [...state.allocationHistory, ...allocation],
    totalBudgetUsed: state.totalBudgetUsed + allocation.reduce((sum, a) => sum + a.resources, 0),
  };
  
  return calculateMetrics(tempState);
}
