/**
 * Signal Hunt - Game State Management
 * 
 * Pure functions for state transitions.
 */

import type { GameState, Scenario, Action, Threat, Signal } from './types';
import { generateSignalQueue } from './signalGenerator';

/**
 * Initialize game state from scenario
 */
export function initializeGameState(scenario: Scenario, seed: number): GameState {
  const initialSignals = generateSignalQueue(seed, 1, 1, scenario.environmentNoise);
  
  return {
    currentTurn: 0,
    totalTurns: scenario.totalTurns,
    currentPhase: 1,
    riskScore: 0,
    budget: {
      actions: scenario.initialBudget.actions,
      budget: scenario.initialBudget.budget,
    },
    signalQueue: initialSignals,
    threats: new Map(),
    investigationHistory: [],
    toolingActive: [],
    posture: 'balanced',
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
 * Execute turn with actions
 */
export function executeTurn(state: GameState, actions: Action[]): GameState {
  if (state.status !== 'playing') {
    return state;
  }
  
  let newState = { ...state };
  
  // Execute each action
  for (const action of actions) {
    newState = applyAction(newState, action);
  }
  
  // Update threat escalation
  newState = escalateThreats(newState);
  
  // Generate new signals for next turn
  if (newState.currentTurn < newState.totalTurns) {
    const phase = getPhaseForTurn(newState.currentTurn + 1, newState.totalTurns);
    const newSignals = generateSignalQueue(
      newState.seed,
      newState.currentTurn + 1,
      phase,
      newState.signalQueue.length > 0 ? 0.35 : 0.2 // Dynamic false positive rate
    );
    newState.signalQueue = [...newState.signalQueue, ...newSignals];
  }
  
  // Update phase
  newState.currentPhase = getPhaseForTurn(newState.currentTurn, newState.totalTurns);
  
  // Calculate risk score
  newState.riskScore = calculateRiskScore(newState);
  
  // Check win/loss conditions
  if (newState.currentTurn >= newState.totalTurns || newState.riskScore >= 100) {
    newState.status = 'finished';
    newState.outcome = newState.riskScore < 50 ? 'win' : 'loss';
  } else {
    newState.currentTurn += 1;
  }
  
  return newState;
}

function applyAction(state: GameState, action: Action): GameState {
  const signal = state.signalQueue.find(s => s.id === action.signalId);
  if (!signal) return state;
  
  const newState = { ...state };
  
  switch (action.type) {
    case 'investigate':
      // Reveal evidence
      signal.evidence.forEach(e => e.revealed = true);
      // Update threat probability based on evidence
      const avgConfidence = signal.evidence.reduce((sum, e) => sum + e.confidence, 0) / signal.evidence.length;
      signal.threatProbability = signal.isFalsePositive 
        ? Math.max(0, signal.threatProbability - avgConfidence * 0.3)
        : Math.min(1, signal.threatProbability + avgConfidence * 0.3);
      
      newState.budget.actions -= 1;
      newState.investigationHistory.push(action);
      break;
      
    case 'contain':
      // Stop escalation
      const threat = newState.threats.get(action.signalId);
      if (threat) {
        threat.state = 'contained';
        threat.escalationLevel = Math.max(0, threat.escalationLevel - 20);
      }
      newState.budget.actions -= 1;
      newState.budget.budget -= 1;
      break;
      
    case 'patch':
      // Root cause fix
      const patchThreat = newState.threats.get(action.signalId);
      if (patchThreat) {
        patchThreat.state = 'resolved';
        patchThreat.escalationLevel = 0;
      }
      newState.budget.actions -= 1;
      newState.budget.budget -= 2;
      break;
      
    case 'monitor':
      // Free action, no escalation
      break;
      
    case 'ignore':
      // Remove from queue
      newState.signalQueue = newState.signalQueue.filter(s => s.id !== action.signalId);
      break;
  }
  
  return newState;
}

function escalateThreats(state: GameState): GameState {
  const newState = { ...state };
  const newThreats = new Map(newState.threats);
  
  // Escalate uncontained threats
  for (const [signalId, threat] of newThreats.entries()) {
    if (threat.state !== 'contained' && threat.state !== 'resolved') {
      threat.escalationLevel += threat.escalationRate;
      if (threat.escalationLevel >= 100) {
        threat.state = 'critical';
      } else if (threat.escalationLevel >= 50) {
        threat.state = 'escalating';
      }
    }
  }
  
  // Create threats from high-probability signals
  for (const signal of state.signalQueue) {
    if (!newThreats.has(signal.id) && signal.threatProbability > 0.6) {
      newThreats.set(signal.id, {
        signalId: signal.id,
        state: 'new',
        escalationLevel: 0,
        escalationRate: getEscalationRateForPhase(state.currentPhase),
      });
    }
  }
  
  newState.threats = newThreats;
  return newState;
}

function calculateRiskScore(state: GameState): number {
  let risk = 0;
  
  // Base risk from threats
  for (const threat of state.threats.values()) {
    risk += threat.escalationLevel * 0.5;
    if (threat.state === 'critical') {
      risk += 30;
    }
  }
  
  // Risk from unprocessed high-severity signals
  for (const signal of state.signalQueue) {
    if (signal.severity === 'critical') {
      risk += 10;
    } else if (signal.severity === 'high') {
      risk += 5;
    }
  }
  
  return Math.min(100, risk);
}

function getPhaseForTurn(turn: number, totalTurns: number): 1 | 2 | 3 | 4 {
  const phaseSize = totalTurns / 4;
  if (turn <= phaseSize) return 1;
  if (turn <= phaseSize * 2) return 2;
  if (turn <= phaseSize * 3) return 3;
  return 4;
}

function getEscalationRateForPhase(phase: 1 | 2 | 3 | 4): number {
  switch (phase) {
    case 1: return 10; // Slow
    case 2: return 15; // Moderate
    case 3: return 25; // Fast
    case 4: return 40; // Very fast
  }
}

/**
 * Check win condition
 */
export function checkWinCondition(state: GameState): boolean {
  return state.riskScore < 50 && 
         Array.from(state.threats.values()).every(t => t.state !== 'critical');
}

/**
 * Check loss condition
 */
export function checkLossCondition(state: GameState): boolean {
  return state.riskScore >= 100 || 
         state.budget.actions <= 0 && state.budget.budget <= 0;
}
