/**
 * Packet Route - Game State Management
 */

import type { GameState, Topology, RoutingPolicyConfig, SLATargets } from './types';
import { generateTrafficPattern } from './trafficGenerator';
import { simulatePacketFlow } from './routingEngine';
import { generateFailures, applyFailures } from './failureEngine';

/**
 * Initialize game state
 */
export function initializeGameState(
  topology: Topology,
  slaTargets: SLATargets,
  seed: number
): GameState {
  const initialTraffic = generateTrafficPattern(seed, 1, topology.nodes);
  
  return {
    topology,
    currentTick: 0,
    totalTicks: getTotalTicksForDifficulty(topology.difficulty),
    routingPolicy: {
      type: 'shortest-path',
      parameters: {},
    },
    trafficFlows: initialTraffic,
    slaTargets,
    metrics: {
      averageLatency: 0,
      throughput: 0,
      packetLoss: 0,
      congestionLevel: 0,
      availability: 1.0,
    },
    failures: [],
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
    currentTick: 1,
  };
}

/**
 * Execute tick
 */
export function executeTick(state: GameState): GameState {
  if (state.status !== 'playing') return state;
  
  let newState = { ...state };
  
  // Generate new traffic
  const newTraffic = generateTrafficPattern(newState.seed, newState.currentTick, newState.topology.nodes);
  newState.trafficFlows = newTraffic;
  
  // Generate failures
  const phase = getPhaseForTick(newState.currentTick, newState.totalTicks);
  const failures = generateFailures(newState.seed, newState.currentTick, phase, newState.topology.links);
  newState = applyFailures(newState, failures);
  
  // Simulate packet flow
  newState = simulatePacketFlow(newState);
  
  // Advance tick
  newState.currentTick += 1;
  
  // Check win/loss
  if (newState.currentTick > newState.totalTicks) {
    newState.status = 'finished';
    newState.outcome = newState.metrics.availability >= 0.95 ? 'win' : 'loss';
  } else if (newState.metrics.availability < 0.5) {
    // Critical failure
    newState.status = 'finished';
    newState.outcome = 'loss';
  }
  
  return newState;
}

/**
 * Update routing policy
 */
export function updateRoutingPolicy(
  state: GameState,
  policy: RoutingPolicyConfig
): GameState {
  return {
    ...state,
    routingPolicy: policy,
  };
}

function getTotalTicksForDifficulty(difficulty: GameState['topology']['difficulty']): number {
  switch (difficulty) {
    case 'foundations': return 20;
    case 'intermediate': return 30;
    case 'advanced': return 40;
    case 'expert': return 40;
  }
}

function getPhaseForTick(tick: number, totalTicks: number): number {
  const phaseSize = totalTicks / 4;
  if (tick <= phaseSize) return 1;
  if (tick <= phaseSize * 2) return 2;
  if (tick <= phaseSize * 3) return 3;
  return 4;
}

/**
 * Check win condition
 */
export function checkWinCondition(state: GameState): boolean {
  return state.metrics.availability >= 0.95;
}

/**
 * Check loss condition
 */
export function checkLossCondition(state: GameState): boolean {
  return state.metrics.availability < 0.5;
}
