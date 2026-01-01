/**
 * Packet Route - Topology Generator
 * 
 * Generates deterministic network topologies.
 */

import { SeededRNG } from '@/lib/games/framework/SeededRNG';
import type { Topology, Node, Link, TopologyType, Difficulty } from './types';

export function generateTopology(
  seed: number,
  topologyType: TopologyType,
  difficulty: Difficulty
): Topology {
  const rng = new SeededRNG(seed);
  const config = getDifficultyConfig(difficulty);
  
  const { nodes, links } = generateTopologyStructure(topologyType, config, rng);
  
  return {
    id: `topology-${seed}`,
    name: `${topologyType} Network ${seed}`,
    type: topologyType,
    difficulty,
    nodes,
    links,
    seed,
  };
}

interface DifficultyConfig {
  nodeCount: number;
  linkCapacity: number;
  baseLatency: number;
}

function getDifficultyConfig(difficulty: Difficulty): DifficultyConfig {
  switch (difficulty) {
    case 'foundations':
      return { nodeCount: 5, linkCapacity: 1000, baseLatency: 10 };
    case 'intermediate':
      return { nodeCount: 10, linkCapacity: 800, baseLatency: 15 };
    case 'advanced':
      return { nodeCount: 15, linkCapacity: 600, baseLatency: 20 };
    case 'expert':
      return { nodeCount: 20, linkCapacity: 500, baseLatency: 25 };
  }
}

function generateTopologyStructure(
  type: TopologyType,
  config: DifficultyConfig,
  rng: SeededRNG
): { nodes: Node[]; links: Link[] } {
  const nodes: Node[] = [];
  const links: Link[] = [];
  
  // Generate nodes
  for (let i = 0; i < config.nodeCount; i++) {
    nodes.push({
      id: `node-${i}`,
      name: `Node ${i}`,
      x: (i % 5) * 100 + 50,
      y: Math.floor(i / 5) * 100 + 50,
      capacity: 1000 + rng.random() * 500,
      currentLoad: 0,
    });
  }
  
  // Generate links based on topology type
  switch (type) {
    case 'mesh':
      // Fully connected
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          links.push(createLink(nodes[i].id, nodes[j].id, config, rng));
        }
      }
      break;
    case 'star':
      // Central node connected to all others
      const center = nodes[0];
      for (let i = 1; i < nodes.length; i++) {
        links.push(createLink(center.id, nodes[i].id, config, rng));
      }
      break;
    case 'tree':
      // Tree structure
      for (let i = 1; i < nodes.length; i++) {
        const parent = nodes[Math.floor((i - 1) / 2)];
        links.push(createLink(parent.id, nodes[i].id, config, rng));
      }
      break;
    case 'ring':
      // Ring structure
      for (let i = 0; i < nodes.length; i++) {
        const next = nodes[(i + 1) % nodes.length];
        links.push(createLink(nodes[i].id, next.id, config, rng));
      }
      break;
    case 'hybrid':
      // Combination (simplified)
      // Start with ring, add some cross-connections
      for (let i = 0; i < nodes.length; i++) {
        const next = nodes[(i + 1) % nodes.length];
        links.push(createLink(nodes[i].id, next.id, config, rng));
      }
      // Add some random cross-connections
      for (let i = 0; i < nodes.length / 2; i++) {
        const from = rng.sample(nodes, 1)[0];
        const to = rng.sample(nodes.filter(n => n.id !== from.id), 1)[0];
        if (!links.find(l => (l.from === from.id && l.to === to.id) || (l.from === to.id && l.to === from.id))) {
          links.push(createLink(from.id, to.id, config, rng));
        }
      }
      break;
  }
  
  return { nodes, links };
}

function createLink(
  from: string,
  to: string,
  config: DifficultyConfig,
  rng: SeededRNG
): Link {
  return {
    id: `link-${from}-${to}`,
    from,
    to,
    capacity: config.linkCapacity + rng.random() * 200,
    latency: config.baseLatency + rng.random() * 10,
    currentLoad: 0,
    failed: false,
  };
}
