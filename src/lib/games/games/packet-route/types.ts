/**
 * Packet Route - Type Definitions
 */

export type Difficulty = 'foundations' | 'intermediate' | 'advanced' | 'expert';
export type TopologyType = 'mesh' | 'star' | 'tree' | 'ring' | 'hybrid';
export type RoutingPolicy = 'shortest-path' | 'load-balanced' | 'resilient' | 'hybrid';

/**
 * Network node
 */
export interface Node {
  id: string;
  name: string;
  x: number; // Position for visualization
  y: number;
  capacity: number; // Processing capacity
  currentLoad: number; // Current traffic load
}

/**
 * Network link
 */
export interface Link {
  id: string;
  from: string; // Node ID
  to: string; // Node ID
  capacity: number; // Bandwidth capacity
  latency: number; // Base latency in ms
  currentLoad: number; // Current traffic load (0-1)
  failed: boolean; // Whether link has failed
}

/**
 * Traffic flow
 */
export interface TrafficFlow {
  id: string;
  source: string; // Node ID
  destination: string; // Node ID
  rate: number; // Packets per second
  route: string[]; // Node IDs forming the route
}

/**
 * Routing policy
 */
export interface RoutingPolicyConfig {
  type: RoutingPolicy;
  parameters: Record<string, number>; // Policy-specific parameters
}

/**
 * Topology definition
 */
export interface Topology {
  id: string;
  name: string;
  type: TopologyType;
  difficulty: Difficulty;
  nodes: Node[];
  links: Link[];
  seed: number;
}

/**
 * SLA targets
 */
export interface SLATargets {
  maxLatency: number; // ms
  minThroughput: number; // packets per second
  maxLoss: number; // percentage (0-1)
}

/**
 * Metrics
 */
export interface Metrics {
  averageLatency: number; // ms
  throughput: number; // packets per second
  packetLoss: number; // percentage (0-1)
  congestionLevel: number; // 0-1
  availability: number; // 0-1, percentage of time SLA met
}

/**
 * Game state
 */
export interface GameState {
  topology: Topology;
  currentTick: number;
  totalTicks: number;
  routingPolicy: RoutingPolicyConfig;
  trafficFlows: TrafficFlow[];
  slaTargets: SLATargets;
  metrics: Metrics;
  failures: string[]; // Link IDs that have failed
  seed: number;
  status: 'idle' | 'playing' | 'finished';
  outcome?: 'win' | 'loss';
}
