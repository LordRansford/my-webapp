/**
 * Flow Planner Types
 */

export interface FlowNode {
  id: string;
  label: string;
  capacity: number;
  position: { x: number; y: number };
}

export interface FlowEdge {
  id: string;
  from: string;
  to: string;
  capacity: number;
  flow: number;
}

export interface FlowNetwork {
  nodes: FlowNode[];
  edges: FlowEdge[];
  source: string;
  sink: string;
  targetFlow: number;
}

export interface FlowChallenge {
  id: string;
  seed: number;
  name: string;
  description: string;
  network: FlowNetwork;
  difficulty: 'novice' | 'planner' | 'flow-master' | 'network-expert' | 'optimization-master';
  tier: number;
}

export interface FlowSolution {
  edges: Array<{ edgeId: string; flow: number }>;
  totalFlow: number;
  efficiency: number;
  createdAt: number;
}

export interface PlayerProgress {
  xp: number;
  tier: 'novice' | 'planner' | 'flow-master' | 'network-expert' | 'optimization-master';
  challengesCompleted: number;
  personalBests: Record<string, number>;
  achievements: string[];
}