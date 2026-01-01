/**
 * Governance Simulator - Explainability Analyzer
 */

import type { GameState } from './types';

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
    type: 'strategy' | 'stakeholder' | 'risk-management';
    description: string;
    rationale: string;
  }>;
  summary: string;
}

export function analyzeRun(state: GameState): Analysis {
  const keyDecisions: Analysis['keyDecisions'] = [];
  const mistakes: Analysis['mistakes'] = [];
  const recommendations: Analysis['recommendations'] = [];
  
  // Analyze decision history
  for (const decision of state.decisionHistory) {
    const impact = determineDecisionImpact(decision, state);
    keyDecisions.push({
      turn: decision.turn,
      description: `Changed strategy: ${Object.keys(decision.strategyChange).join(', ')}`,
      impact,
      reasoning: impact === 'positive' 
        ? 'Strategy change improved metrics'
        : impact === 'negative'
        ? 'Strategy change worsened metrics'
        : 'Strategy change had neutral impact',
    });
  }
  
  // Analyze stakeholder trust
  const lowTrustStakeholders = state.stakeholders.filter(s => s.trust < 50);
  if (lowTrustStakeholders.length > 0) {
    mistakes.push({
      turn: state.currentTurn,
      description: `${lowTrustStakeholders.length} stakeholders have low trust (<50)`,
      cost: 'Reduced stakeholder satisfaction and compliance',
      recommendation: 'Adjust governance strategy to better align with stakeholder preferences',
    });
  }
  
  // Analyze risks
  const highRisks = state.risks.filter(r => r.level > 70);
  if (highRisks.length > 0) {
    mistakes.push({
      turn: state.currentTurn,
      description: `${highRisks.length} risks are high (>70)`,
      cost: 'Increased vulnerability to incidents',
      recommendation: 'Increase controls or adjust strategy to mitigate risks',
    });
  }
  
  // Generate recommendations
  if (state.metrics.averageTrust < 60) {
    recommendations.push({
      type: 'stakeholder',
      description: 'Improve stakeholder trust by aligning governance with preferences',
      rationale: `Average trust is ${state.metrics.averageTrust.toFixed(1)}, below target of 70`,
    });
  }
  
  if (state.metrics.averageRisk > 60) {
    recommendations.push({
      type: 'risk-management',
      description: 'Increase controls to reduce risk levels',
      rationale: `Average risk is ${state.metrics.averageRisk.toFixed(1)}, above acceptable threshold`,
    });
  }
  
  const win = state.outcome === 'win';
  const summary = win
    ? `Successfully maintained governance with ${state.metrics.averageTrust.toFixed(1)}% average trust and ${state.metrics.outcomes.toFixed(1)}% outcome achievement.`
    : `Failed to maintain governance. Trust dropped to ${state.metrics.averageTrust.toFixed(1)}% or outcomes fell to ${state.metrics.outcomes.toFixed(1)}%.`;
  
  return {
    keyDecisions: keyDecisions.slice(0, 3),
    mistakes: mistakes.slice(0, 3),
    recommendations,
    summary,
  };
}

function determineDecisionImpact(
  decision: GameState['decisionHistory'][0],
  state: GameState
): 'positive' | 'negative' | 'neutral' {
  // Simplified impact determination
  // In full implementation, would compare metrics before/after decision
  return 'neutral';
}
