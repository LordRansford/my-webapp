/**
 * Packet Route - Explainability Analyzer
 */

import type { GameState } from './types';

export interface Analysis {
  keyDecisions: Array<{
    tick: number;
    description: string;
    impact: 'positive' | 'negative' | 'neutral';
    reasoning: string;
  }>;
  mistakes: Array<{
    tick: number;
    description: string;
    cost: string;
    recommendation: string;
  }>;
  recommendations: Array<{
    type: 'policy' | 'routing' | 'resilience';
    description: string;
    rationale: string;
  }>;
  summary: string;
}

export function analyzeRun(state: GameState): Analysis {
  const keyDecisions: Analysis['keyDecisions'] = [];
  const mistakes: Analysis['mistakes'] = [];
  const recommendations: Analysis['recommendations'] = [];
  
  // Analyze congestion
  const congestedLinks = state.topology.links.filter(l => l.currentLoad > 0.8);
  if (congestedLinks.length > 0) {
    mistakes.push({
      tick: state.currentTick,
      description: `${congestedLinks.length} links are congested (>80% load)`,
      cost: 'Increased latency and packet loss',
      recommendation: 'Use load balancing policy to distribute traffic',
    });
  }
  
  // Analyze failures
  if (state.failures.length > 0) {
    keyDecisions.push({
      tick: state.currentTick,
      description: `Handled ${state.failures.length} link failures`,
      impact: state.metrics.availability > 0.9 ? 'positive' : 'negative',
      reasoning: state.metrics.availability > 0.9 
        ? 'Failures handled well, maintained availability'
        : 'Failures caused availability issues',
    });
  }
  
  // Generate recommendations
  if (state.metrics.congestionLevel > 0.7) {
    recommendations.push({
      type: 'routing',
      description: 'Switch to load-balanced routing policy',
      rationale: 'High congestion indicates need for better traffic distribution',
    });
  }
  
  if (state.failures.length > 0 && state.metrics.availability < 0.9) {
    recommendations.push({
      type: 'resilience',
      description: 'Implement resilient routing with backup paths',
      rationale: 'Failures caused availability issues, need better resilience',
    });
  }
  
  const win = state.outcome === 'win';
  const summary = win
    ? `Successfully maintained SLA targets with ${(state.metrics.availability * 100).toFixed(1)}% availability. Average latency: ${state.metrics.averageLatency.toFixed(1)}ms.`
    : `Failed to maintain SLA targets. Availability dropped to ${(state.metrics.availability * 100).toFixed(1)}%.`;
  
  return {
    keyDecisions: keyDecisions.slice(0, 3),
    mistakes: mistakes.slice(0, 3),
    recommendations,
    summary,
  };
}
