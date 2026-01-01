/**
 * Governance Simulator - Game State Management
 */

import type { GameState, Scenario, GovernanceStrategy } from './types';
import { calculateStakeholderResponses, applyEventsToStakeholders } from './stakeholderEngine';
import { calculateRiskLevels, applyEventsToRisks } from './riskEngine';

/**
 * Initialize game state
 */
export function initializeGameState(scenario: Scenario, seed: number): GameState {
  const initialStrategy: GovernanceStrategy = {
    controls: 60,
    transparency: 70,
    autonomy: 50,
    enforcement: 60,
  };
  
  return {
    scenario,
    currentTurn: 0,
    totalTurns: scenario.totalTurns,
    governanceStrategy: initialStrategy,
    stakeholders: scenario.stakeholders.map(s => ({ ...s })),
    risks: scenario.initialRisks.map(r => ({ ...r })),
    objectives: scenario.objectives.map(o => ({ ...o })),
    events: [...scenario.events],
    decisionHistory: [],
    metrics: {
      averageTrust: calculateAverageTrust(scenario.stakeholders),
      averageSatisfaction: calculateAverageSatisfaction(scenario.stakeholders),
      averageCompliance: calculateAverageCompliance(scenario.stakeholders),
      averageRisk: calculateAverageRisk(scenario.initialRisks),
      stability: 100,
      outcomes: 0,
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
    currentTurn: 1,
  };
}

/**
 * Execute turn
 */
export function executeTurn(
  state: GameState,
  strategyChange?: Partial<GovernanceStrategy>
): GameState {
  if (state.status !== 'playing') return state;
  
  let newState = { ...state };
  
  // Update governance strategy if changed
  if (strategyChange) {
    newState.governanceStrategy = {
      ...newState.governanceStrategy,
      ...strategyChange,
    };
    newState.decisionHistory.push({
      turn: newState.currentTurn,
      strategyChange,
      reasoning: 'Strategy adjustment',
    });
  }
  
  // Calculate stakeholder responses
  newState.stakeholders = calculateStakeholderResponses(newState, newState.governanceStrategy);
  
  // Calculate risk levels
  newState.risks = calculateRiskLevels(newState, newState.governanceStrategy);
  
  // Apply events for this turn
  const turnEvents = newState.events.filter(e => e.round === newState.currentTurn);
  if (turnEvents.length > 0) {
    newState.stakeholders = applyEventsToStakeholders(newState.stakeholders, turnEvents);
    newState.risks = applyEventsToRisks(newState.risks, turnEvents);
  }
  
  // Update objectives
  newState.objectives = updateObjectives(newState);
  
  // Calculate metrics
  newState.metrics = calculateMetrics(newState);
  
  // Advance turn
  newState.currentTurn += 1;
  
  // Check win/loss
  if (newState.currentTurn > newState.totalTurns) {
    newState.status = 'finished';
    newState.outcome = checkWinCondition(newState) ? 'win' : 'loss';
  } else if (checkLossCondition(newState)) {
    newState.status = 'finished';
    newState.outcome = 'loss';
  }
  
  return newState;
}

function updateObjectives(state: GameState): GameState['objectives'] {
  return state.objectives.map(obj => {
    let current = obj.current;
    
    switch (obj.type) {
      case 'trust':
        current = state.metrics.averageTrust;
        break;
      case 'compliance':
        current = state.metrics.averageCompliance;
        break;
      case 'innovation':
        // Innovation inversely related to controls
        current = 100 - state.governanceStrategy.controls;
        break;
      case 'cost':
        // Cost related to controls and enforcement
        current = (state.governanceStrategy.controls + state.governanceStrategy.enforcement) / 2;
        break;
    }
    
    return {
      ...obj,
      current,
      met: current >= obj.target,
    };
  });
}

function calculateMetrics(state: GameState): GameState['metrics'] {
  return {
    averageTrust: calculateAverageTrust(state.stakeholders),
    averageSatisfaction: calculateAverageSatisfaction(state.stakeholders),
    averageCompliance: calculateAverageCompliance(state.stakeholders),
    averageRisk: calculateAverageRisk(state.risks),
    stability: calculateStability(state),
    outcomes: calculateOutcomes(state),
  };
}

function calculateAverageTrust(stakeholders: GameState['stakeholders']): number {
  return stakeholders.reduce((sum, s) => sum + s.trust, 0) / stakeholders.length;
}

function calculateAverageSatisfaction(stakeholders: GameState['stakeholders']): number {
  return stakeholders.reduce((sum, s) => sum + s.satisfaction, 0) / stakeholders.length;
}

function calculateAverageCompliance(stakeholders: GameState['stakeholders']): number {
  return stakeholders.reduce((sum, s) => sum + s.compliance, 0) / stakeholders.length;
}

function calculateAverageRisk(risks: GameState['risks']): number {
  return risks.reduce((sum, r) => sum + r.level, 0) / risks.length;
}

function calculateStability(state: GameState): number {
  // Simplified stability calculation
  // In full implementation, would track metric volatility over time
  return 80; // Placeholder
}

function calculateOutcomes(state: GameState): number {
  const metObjectives = state.objectives.filter(o => o.met).length;
  return (metObjectives / state.objectives.length) * 100;
}

/**
 * Check win condition
 */
export function checkWinCondition(state: GameState): boolean {
  const trustMet = state.metrics.averageTrust >= 70;
  const objectivesMet = state.objectives.every(o => o.met);
  const noCriticalIncidents = state.metrics.averageRisk < 80;
  
  return trustMet && objectivesMet && noCriticalIncidents;
}

/**
 * Check loss condition
 */
export function checkLossCondition(state: GameState): boolean {
  const trustCritical = state.metrics.averageTrust < 30;
  const riskCritical = state.metrics.averageRisk >= 90;
  const outcomesFailed = state.metrics.outcomes < 50;
  
  return trustCritical || riskCritical || outcomesFailed;
}
