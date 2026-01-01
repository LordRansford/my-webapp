/**
 * Allocation Architect - Event Engine
 * 
 * Handles event generation and application.
 */

import type { GameState, Event } from './types';

/**
 * Apply events to game state
 */
export function applyEvents(state: GameState, events: Event[]): GameState {
  let newState = { ...state };
  
  for (const event of events) {
    newState = applyEvent(newState, event);
  }
  
  return newState;
}

/**
 * Apply a single event to game state
 */
function applyEvent(state: GameState, event: Event): GameState {
  const newProjects = state.projects.map(project => {
    // Check if project is affected
    const isAffected = event.affectedProjects.includes(project.id) || 
                      event.affectedProjects.length === 0; // Empty means all projects
    
    if (!isAffected) {
      return { ...project };
    }
    
    let updatedProject = { ...project };
    
    // Apply event effects
    if (event.effect.resourceChange) {
      // Resource change affects project requirements
      const change = event.effect.resourceChange * event.severity;
      updatedProject.requiredResources = Math.max(10, updatedProject.requiredResources + change);
    }
    
    if (event.effect.requirementChange) {
      // Requirement change affects progress needed
      const change = event.effect.requirementChange * event.severity;
      const newRequired = updatedProject.requiredResources * (1 + change);
      updatedProject.requiredResources = Math.max(10, newRequired);
    }
    
    if (event.effect.progressLoss) {
      // Progress loss
      const loss = event.effect.progressLoss * event.severity;
      if (updatedProject.health > 0) {
        // Health buffer absorbs the loss
        updatedProject.health = Math.max(0, updatedProject.health - loss);
      } else {
        // No health buffer, lose progress
        updatedProject.currentProgress = Math.max(0, updatedProject.currentProgress - loss);
      }
    }
    
    return updatedProject;
  });
  
  // Update resource budget if event affects it
  let newResourceBudget = state.resourceBudget;
  if (event.effect.resourceChange && event.affectedProjects.length === 0) {
    // Global resource change
    newResourceBudget = Math.max(0, newResourceBudget + (event.effect.resourceChange * event.severity));
  }
  
  return {
    ...state,
    projects: newProjects,
    resourceBudget: newResourceBudget,
  };
}

/**
 * Get events for a specific round
 */
export function getEventsForRound(state: GameState, round: number): Event[] {
  return state.events.filter(e => e.round === round);
}

/**
 * Get upcoming events
 */
export function getUpcomingEvents(state: GameState): Event[] {
  return state.events.filter(e => e.round > state.currentRound);
}
