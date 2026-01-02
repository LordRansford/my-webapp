/**
 * Packet Route - Traffic Generator
 * 
 * Generates deterministic traffic patterns.
 */

import { SeededRNG } from '@/lib/games/framework/SeededRNG';
import type { TrafficFlow, Node } from './types';

export function generateTrafficPattern(
  seed: number,
  tick: number,
  nodes: Node[]
): TrafficFlow[] {
  const rng = new SeededRNG(seed + tick * 1000);
  const flowCount = 3 + Math.floor(rng.next() * 3); // 3-5 flows
  const flows: TrafficFlow[] = [];
  
  for (let i = 0; i < flowCount; i++) {
    const source = rng.sample(nodes, 1)[0];
    const destination = rng.sample(nodes.filter(n => n.id !== source.id), 1)[0];
    
    flows.push({
      id: `flow-${tick}-${i}`,
      source: source.id,
      destination: destination.id,
      rate: 100 + rng.next() * 200, // packets per second
      route: [], // Will be calculated by routing engine
    });
  }
  
  return flows;
}
