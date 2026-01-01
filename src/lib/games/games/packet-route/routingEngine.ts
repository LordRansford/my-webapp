/**
 * Packet Route - Routing Engine
 * 
 * Calculates routes based on routing policy.
 */

import type { GameState, TrafficFlow, Node, Link, RoutingPolicyConfig } from './types';

/**
 * Calculate routes for all traffic flows
 */
export function calculateRoutes(state: GameState): TrafficFlow[] {
  const flows: TrafficFlow[] = [];
  
  for (const flow of state.trafficFlows) {
    const route = calculateRoute(
      flow.source,
      flow.destination,
      state.topology.nodes,
      state.topology.links,
      state.routingPolicy
    );
    flows.push({
      ...flow,
      route,
    });
  }
  
  return flows;
}

function calculateRoute(
  source: string,
  destination: string,
  nodes: Node[],
  links: Link[],
  policy: RoutingPolicyConfig
): string[] {
  // Simplified routing - in full implementation, would use Dijkstra's algorithm
  // or other routing algorithms based on policy
  
  switch (policy.type) {
    case 'shortest-path':
      return calculateShortestPath(source, destination, nodes, links);
    case 'load-balanced':
      return calculateLoadBalancedPath(source, destination, nodes, links);
    case 'resilient':
      return calculateResilientPath(source, destination, nodes, links);
    case 'hybrid':
      return calculateShortestPath(source, destination, nodes, links); // Simplified
    default:
      return calculateShortestPath(source, destination, nodes, links);
  }
}

function calculateShortestPath(
  source: string,
  destination: string,
  nodes: Node[],
  links: Link[]
): string[] {
  // Simplified shortest path (Dijkstra's would be used in full implementation)
  const sourceNode = nodes.find(n => n.id === source);
  const destNode = nodes.find(n => n.id === destination);
  
  if (!sourceNode || !destNode) return [source];
  
  // Find direct link
  const directLink = links.find(l => 
    (l.from === source && l.to === destination) && !l.failed
  );
  if (directLink) {
    return [source, destination];
  }
  
  // Find path through one intermediate node
  for (const node of nodes) {
    if (node.id === source || node.id === destination) continue;
    const link1 = links.find(l => l.from === source && l.to === node.id && !l.failed);
    const link2 = links.find(l => l.from === node.id && l.to === destination && !l.failed);
    if (link1 && link2) {
      return [source, node.id, destination];
    }
  }
  
  return [source]; // No path found
}

function calculateLoadBalancedPath(
  source: string,
  destination: string,
  nodes: Node[],
  links: Link[]
): string[] {
  // Simplified - would consider current link loads
  return calculateShortestPath(source, destination, nodes, links);
}

function calculateResilientPath(
  source: string,
  destination: string,
  nodes: Node[],
  links: Link[]
): string[] {
  // Simplified - would prefer paths with redundancy
  return calculateShortestPath(source, destination, nodes, links);
}

/**
 * Simulate packet flow and calculate metrics
 */
export function simulatePacketFlow(state: GameState): GameState {
  const flows = calculateRoutes(state);
  
  // Update link loads
  const updatedLinks = state.topology.links.map(link => {
    let load = 0;
    for (const flow of flows) {
      for (let i = 0; i < flow.route.length - 1; i++) {
        if ((flow.route[i] === link.from && flow.route[i + 1] === link.to) ||
            (flow.route[i] === link.to && flow.route[i + 1] === link.from)) {
          load += flow.rate;
        }
      }
    }
    return {
      ...link,
      currentLoad: Math.min(1, load / link.capacity),
    };
  });
  
  // Calculate metrics
  const totalLatency = flows.reduce((sum, flow) => {
    let latency = 0;
    for (let i = 0; i < flow.route.length - 1; i++) {
      const link = updatedLinks.find(l =>
        (l.from === flow.route[i] && l.to === flow.route[i + 1]) ||
        (l.from === flow.route[i + 1] && l.to === flow.route[i])
      );
      if (link) {
        latency += link.latency * (1 + link.currentLoad); // Latency increases with load
      }
    }
    return sum + latency;
  }, 0);
  
  const averageLatency = flows.length > 0 ? totalLatency / flows.length : 0;
  const throughput = flows.reduce((sum, flow) => sum + flow.rate, 0);
  const packetLoss = updatedLinks.reduce((sum, link) => {
    return sum + Math.max(0, link.currentLoad - 1); // Loss when overloaded
  }, 0) / updatedLinks.length;
  
  const congestionLevel = updatedLinks.reduce((sum, link) => sum + link.currentLoad, 0) / updatedLinks.length;
  
  // Check SLA compliance
  const slaMet = averageLatency <= state.slaTargets.maxLatency &&
                 throughput >= state.slaTargets.minThroughput &&
                 packetLoss <= state.slaTargets.maxLoss;
  
  const availability = state.metrics.availability * 0.9 + (slaMet ? 0.1 : 0);
  
  return {
    ...state,
    topology: {
      ...state.topology,
      links: updatedLinks,
    },
    trafficFlows: flows,
    metrics: {
      averageLatency,
      throughput,
      packetLoss,
      congestionLevel,
      availability,
    },
  };
}
