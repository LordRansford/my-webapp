/**
 * Packet Route - Failure Engine
 * 
 * Generates and applies network failures.
 */

import { SeededRNG } from '@/lib/games/framework/SeededRNG';
import type { GameState, Link } from './types';

/**
 * Generate failures for a tick
 */
export function generateFailures(
  seed: number,
  tick: number,
  phase: number,
  links: Link[]
): string[] {
  const rng = new SeededRNG(seed + tick * 2000);
  const failureRate = getFailureRateForPhase(phase);
  
  const failures: string[] = [];
  for (const link of links) {
    if (!link.failed && rng.random() < failureRate) {
      failures.push(link.id);
    }
  }
  
  return failures;
}

/**
 * Apply failures to game state
 */
export function applyFailures(state: GameState, failureIds: string[]): GameState {
  const updatedLinks = state.topology.links.map(link => ({
    ...link,
    failed: link.failed || failureIds.includes(link.id),
  }));
  
  return {
    ...state,
    topology: {
      ...state.topology,
      links: updatedLinks,
    },
    failures: [...state.failures, ...failureIds],
  };
}

function getFailureRateForPhase(phase: number): number {
  switch (phase) {
    case 1: return 0.05; // 5% chance
    case 2: return 0.10; // 10% chance
    case 3: return 0.20; // 20% chance
    case 4: return 0.30; // 30% chance
    default: return 0.10;
  }
}
