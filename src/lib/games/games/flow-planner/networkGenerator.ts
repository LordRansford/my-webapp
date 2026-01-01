/**
 * Flow Network Generator
 */

import { SeededRNG } from "@/lib/games/framework/SeededRNG";
import type { FlowChallenge, FlowNetwork, FlowNode, FlowEdge } from "./types";

export function generateChallenge(params: {
  seed: number;
  difficulty: FlowChallenge['difficulty'];
}): FlowChallenge {
  const rng = new SeededRNG(params.seed);
  const config = getDifficultyConfig(params.difficulty);
  
  const network = generateNetwork(config, rng);
  
  return {
    id: `flow-${params.seed}`,
    seed: params.seed,
    name: `Flow Challenge ${params.seed}`,
    description: `Route flow through the network to achieve target flow of ${network.targetFlow}.`,
    network,
    difficulty: params.difficulty,
    tier: getTierForDifficulty(params.difficulty),
  };
}

interface DifficultyConfig {
  nodeCount: number;
  edgeCount: number;
  targetFlow: number;
}

function getDifficultyConfig(difficulty: FlowChallenge['difficulty']): DifficultyConfig {
  switch (difficulty) {
    case 'novice':
      return { nodeCount: 4, edgeCount: 4, targetFlow: 10 };
    case 'planner':
      return { nodeCount: 5, edgeCount: 6, targetFlow: 15 };
    case 'flow-master':
      return { nodeCount: 6, edgeCount: 8, targetFlow: 20 };
    case 'network-expert':
      return { nodeCount: 7, edgeCount: 10, targetFlow: 25 };
    case 'optimization-master':
      return { nodeCount: 8, edgeCount: 12, targetFlow: 30 };
  }
}

function generateNetwork(config: DifficultyConfig, rng: SeededRNG): FlowNetwork {
  const nodes: FlowNode[] = [];
  const edges: FlowEdge[] = [];
  
  // Generate nodes
  for (let i = 0; i < config.nodeCount; i++) {
    nodes.push({
      id: `node-${i}`,
      label: String.fromCharCode(65 + i), // A, B, C, ...
      capacity: 5 + Math.floor(rng.next() * 10),
      position: {
        x: 100 + (i % 3) * 150,
        y: 100 + Math.floor(i / 3) * 150,
      },
    });
  }
  
  // Generate edges (simple linear flow for now)
  for (let i = 0; i < config.nodeCount - 1; i++) {
    edges.push({
      id: `edge-${i}`,
      from: nodes[i].id,
      to: nodes[i + 1].id,
      capacity: 5 + Math.floor(rng.next() * 10),
      flow: 0,
    });
  }
  
  // Add some additional edges for complexity
  while (edges.length < config.edgeCount && nodes.length > 2) {
    const fromIdx = Math.floor(rng.next() * (nodes.length - 1));
    const toIdx = Math.floor(rng.next() * (nodes.length - fromIdx - 1)) + fromIdx + 1;
    
    if (!edges.find(e => e.from === nodes[fromIdx].id && e.to === nodes[toIdx].id)) {
      edges.push({
        id: `edge-${edges.length}`,
        from: nodes[fromIdx].id,
        to: nodes[toIdx].id,
        capacity: 5 + Math.floor(rng.next() * 10),
        flow: 0,
      });
    }
  }
  
  return {
    nodes,
    edges,
    source: nodes[0].id,
    sink: nodes[nodes.length - 1].id,
    targetFlow: config.targetFlow,
  };
}

function getTierForDifficulty(difficulty: FlowChallenge['difficulty']): number {
  switch (difficulty) {
    case 'novice': return 0;
    case 'planner': return 100;
    case 'flow-master': return 300;
    case 'network-expert': return 600;
    case 'optimization-master': return 1000;
  }
}