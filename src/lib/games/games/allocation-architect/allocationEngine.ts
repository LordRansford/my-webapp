/**
 * Allocation Architect - Allocation Engine
 * 
 * Handles allocation validation and application.
 */

import type { GameState, Allocation, ValidationResult, ProjectedState, Project } from './types';
import { calculateProjectedMetrics } from './efficiencyCalculator';

/**
 * Validate allocation
 */
export function validateAllocation(state: GameState, allocation: Allocation[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check total allocation doesn't exceed budget
  const totalAllocated = allocation.reduce((sum, a) => sum + a.resources, 0);
  if (totalAllocated > state.resourceBudget) {
    errors.push(`Total allocation (${totalAllocated}) exceeds available budget (${state.resourceBudget})`);
  }
  
  // Check all allocations are non-negative
  for (const alloc of allocation) {
    if (alloc.resources < 0) {
      errors.push(`Allocation for ${alloc.projectId} cannot be negative`);
    }
  }
  
  // Check projects exist
  for (const alloc of allocation) {
    const project = state.projects.find(p => p.id === alloc.projectId);
    if (!project) {
      errors.push(`Project ${alloc.projectId} not found`);
    } else {
      // Check dependencies
      for (const depId of project.dependencies) {
        const depProject = state.projects.find(p => p.id === depId);
        if (depProject && depProject.currentProgress < 100) {
          warnings.push(`Project ${alloc.projectId} depends on ${depId} which is not complete`);
        }
      }
    }
  }
  
  // Check for unused budget
  if (totalAllocated < state.resourceBudget * 0.5) {
    warnings.push('Less than 50% of budget is allocated');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Apply allocation to game state
 */
export function applyAllocation(state: GameState, allocation: Allocation[]): GameState {
  const newProjects = state.projects.map(project => {
    const alloc = allocation.find(a => a.projectId === project.id);
    if (!alloc || alloc.resources === 0) {
      return { ...project };
    }
    
    // Calculate progress gain with diminishing returns
    const progressGain = calculateProgressGain(project, alloc.resources);
    const newProgress = Math.min(100, project.currentProgress + progressGain);
    
    // Check if project completed
    const completed = newProgress >= 100;
    
    return {
      ...project,
      currentProgress: newProgress,
    };
  });
  
  return {
    ...state,
    projects: newProjects,
  };
}

/**
 * Calculate progress gain for a project with diminishing returns
 */
function calculateProgressGain(project: Project, resources: number): number {
  const baseProgress = project.progressPerResource * resources;
  const progressRatio = project.currentProgress / 100;
  const diminishingFactor = 1 - (progressRatio * project.diminishingReturns);
  return baseProgress * diminishingFactor;
}

/**
 * Calculate projected state for preview
 */
export function calculateProjectedState(state: GameState, allocation: Allocation[]): ProjectedState {
  // Create temporary state with allocation applied
  const tempState = applyAllocation(state, allocation);
  
  // Calculate projected metrics
  const projectedMetrics = calculateProjectedMetrics(tempState, allocation);
  
  // Generate warnings
  const warnings: string[] = [];
  const totalAllocated = allocation.reduce((sum, a) => sum + a.resources, 0);
  if (totalAllocated > state.resourceBudget) {
    warnings.push('Allocation exceeds budget');
  }
  
  // Check constraint violations
  tempState.constraints.forEach(constraint => {
    if (constraint.current > constraint.limit) {
      warnings.push(`${constraint.name} will be violated`);
    } else if (constraint.current > constraint.limit * constraint.warningThreshold) {
      warnings.push(`${constraint.name} is approaching limit`);
    }
  });
  
  return {
    projects: tempState.projects,
    objectives: tempState.objectives,
    constraints: tempState.constraints,
    metrics: projectedMetrics,
    warnings,
  };
}
