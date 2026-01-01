/**
 * Signal Hunt - Explainability Analyzer
 * 
 * Generates deterministic post-run analysis.
 */

import type { GameState, Action } from './types';

export interface Analysis {
  keyDecisions: Array<{
    turn: number;
    description: string;
    impact: 'positive' | 'negative' | 'neutral';
    reasoning: string;
  }>;
  mistakes: Array<{
    turn: number;
    description: string;
    cost: string;
    recommendation: string;
  }>;
  recommendations: Array<{
    type: 'strategy' | 'tooling' | 'posture';
    description: string;
    rationale: string;
  }>;
  summary: string;
}

export function analyzeRun(state: GameState): Analysis {
  const keyDecisions: Analysis['keyDecisions'] = [];
  const mistakes: Analysis['mistakes'] = [];
  const recommendations: Analysis['recommendations'] = [];
  
  // Analyze investigation history
  let falsePositiveCount = 0;
  let truePositiveCount = 0;
  
  for (const action of state.investigationHistory) {
    const signal = state.signalQueue.find(s => s.id === action.signalId);
    if (signal) {
      if (signal.isFalsePositive) {
        falsePositiveCount++;
        mistakes.push({
          turn: action.timestamp,
          description: `Investigated false positive: ${signal.name}`,
          cost: 'Wasted 1 action token',
          recommendation: 'Use Deep Investigation tooling to reduce false positives',
        });
      } else {
        truePositiveCount++;
        keyDecisions.push({
          turn: action.timestamp,
          description: `Investigated true threat: ${signal.name}`,
          impact: 'positive',
          reasoning: 'Investigation revealed threat, enabling optimal containment',
        });
      }
    }
  }
  
  // Analyze threat containment
  for (const threat of state.threats.values()) {
    if (threat.state === 'critical') {
      mistakes.push({
        turn: state.currentTurn,
        description: `Threat escalated to critical: ${threat.signalId}`,
        cost: 'Increased risk score significantly',
        recommendation: 'Contain threats earlier, before escalation',
      });
    }
  }
  
  // Generate recommendations
  const falsePositiveRate = state.investigationHistory.length > 0
    ? falsePositiveCount / state.investigationHistory.length
    : 0;
  
  if (falsePositiveRate > 0.3) {
    recommendations.push({
      type: 'tooling',
      description: 'Use Deep Investigation tooling to reduce false positives',
      rationale: `Your false positive rate is ${Math.round(falsePositiveRate * 100)}%, which is inefficient`,
    });
  }
  
  if (state.riskScore > 70) {
    recommendations.push({
      type: 'strategy',
      description: 'Focus on containment earlier in the game',
      rationale: 'High risk score indicates threats were allowed to escalate',
    });
  }
  
  // Generate summary
  const win = state.outcome === 'win';
  const summary = win
    ? `Successfully managed security signals with ${Math.round((1 - falsePositiveRate) * 100)}% accuracy. Final risk score: ${Math.round(state.riskScore)}.`
    : `Failed to maintain security posture. Risk score exceeded threshold at ${state.currentTurn} turns. False positive rate: ${Math.round(falsePositiveRate * 100)}%.`;
  
  return {
    keyDecisions,
    mistakes: mistakes.slice(0, 3), // Top 3 mistakes
    recommendations,
    summary,
  };
}
