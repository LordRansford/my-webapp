/**
 * Allocation Architect - Game State Management
 * 
 * Pure functions for state transitions.
 */

import type { GameState, Scenario, Allocation, RoundResult, Metrics } from './types';
import { applyAllocation } from './allocationEngine';
import { applyEvents } from './eventEngine';
import { calculateMetrics } from './efficiencyCalculator';
import { updateObjectives } from './objectiveCalculator';
import { updateConstraints } from './constraintEngine';

/**
 * Initialize game state from scenario
 */
export function initializeGameState(scenario: Scenario, seed: number): GameState {
  return {
    scenario,
    currentRound: 0,
    totalRounds: scenario.totalRounds,
    resourceBudget: scenario.initialBudget + scenario.budgetPerRound,
    totalBudgetUsed: 0,
    projects: scenario.projects.map(p => ({ ...p })),
    objectives: scenario.objectives.map(o => ({ ...o })),
    constraints: scenario.constraints.map(c => ({ ...c })),
    events: [...scenario.events],
    allocationHistory: [],
    roundHistory: [],
    metrics: {
      resourceEfficiency: 0,
      objectiveProgress: 0,
      constraintCompliance: 100,
      riskLevel: 0,
      waste: 0,
    },
    seed,
    status: 'idle',
  };
}

/**
 * Start the game
 */
export function startGame(state: GameState): GameState {
  return {
    ...state,
    status: 'playing',
    currentRound: 1,
  };
}

/**
 * Apply allocation and advance to next round
 */
export function executeRound(state: GameState, allocation: Allocation[]): GameState {
  if (state.status !== 'playing') {
    return state;
  }
  
  // Validate allocation
  const totalAllocated = allocation.reduce((sum, a) => sum + a.resources, 0);
  if (totalAllocated > state.resourceBudget) {
    return state; // Invalid allocation, don't advance
  }
  
  // Apply allocation
  let newState = applyAllocation(state, allocation);
  
  // Apply events for this round
  const roundEvents = newState.events.filter(e => e.round === newState.currentRound);
  if (roundEvents.length > 0) {
    newState = applyEvents(newState, roundEvents);
  }
  
  // Update objectives
  newState = updateObjectives(newState);
  
  // Update constraints
  newState = updateConstraints(newState);
  
  // Calculate metrics
  newState.metrics = calculateMetrics(newState);
  
  // Record round result
  const roundResult: RoundResult = {
    round: newState.currentRound,
    allocation,
    projectProgress: {},
    objectiveProgress: {},
    constraintStatus: {},
    events: roundEvents,
    metrics: { ...newState.metrics },
  };
  
  // Record project progress changes
  state.projects.forEach((oldProject, i) => {
    const newProject = newState.projects[i];
    if (newProject) {
      roundResult.projectProgress[oldProject.id] = newProject.currentProgress - oldProject.currentProgress;
    }
  });
  
  // Record objective progress changes
  state.objectives.forEach((oldObjective, i) => {
    const newObjective = newState.objectives[i];
    if (newObjective) {
      roundResult.objectiveProgress[oldObjective.id] = newObjective.current - oldObjective.current;
    }
  });
  
  // Record constraint status
  newState.constraints.forEach(constraint => {
    roundResult.constraintStatus[constraint.id] = constraint.violated;
  });
  
  newState.roundHistory.push(roundResult);
  newState.allocationHistory.push(...allocation);
  
  // Update budget
  newState.totalBudgetUsed += totalAllocated;
  newState.resourceBudget = newState.resourceBudget - totalAllocated + newState.scenario.budgetPerRound;
  
  // Advance to next round or finish
  if (newState.currentRound >= newState.totalRounds) {
    newState.status = 'finished';
    newState.outcome = checkWinCondition(newState) ? 'win' : 'loss';
  } else {
    newState.currentRound += 1;
  }
  
  return newState;
}

/**
 * Check win condition
 */
export function checkWinCondition(state: GameState): boolean {
  // All objectives must be met
  const allObjectivesMet = state.objectives.every(obj => obj.met);
  
  // No constraints violated
  const noConstraintViolations = state.constraints.every(c => !c.violated);
  
  return allObjectivesMet && noConstraintViolations;
}

/**
 * Check loss condition
 */
export function checkLossCondition(state: GameState): boolean {
  // Any constraint violated
  const constraintViolated = state.constraints.some(c => c.violated);
  
  // Objectives not met at end
  if (state.status === 'finished') {
    const objectivesNotMet = state.objectives.some(obj => !obj.met);
    return constraintViolated || objectivesNotMet;
  }
  
  return constraintViolated;
}

/**
 * Reset game state
 */
export function resetGameState(state: GameState): GameState {
  return initializeGameState(state.scenario, state.seed);
}
