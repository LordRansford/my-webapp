/**
 * Allocation Architect - Explainability Analyzer
 * 
 * Generates deterministic post-run analysis.
 */

import type { GameState, Analysis, KeyDecision, Mistake, Recommendation } from './types';
import { calculateMetrics } from './efficiencyCalculator';
import { areAllObjectivesMet, getUnmetObjectives } from './objectiveCalculator';
import { hasConstraintViolations, getConstraintViolations } from './constraintEngine';

/**
 * Analyze game run and generate explainability report
 */
export function analyzeRun(state: GameState): Analysis {
  const keyDecisions = identifyKeyDecisions(state);
  const mistakes = identifyMistakes(state);
  const recommendations = generateRecommendations(state, mistakes);
  const summary = generateSummary(state, keyDecisions, mistakes);
  
  return {
    keyDecisions,
    mistakes,
    recommendations,
    summary,
  };
}

/**
 * Identify key decision points
 */
function identifyKeyDecisions(state: GameState): KeyDecision[] {
  const decisions: KeyDecision[] = [];
  
  // Analyze each round for significant decisions
  for (let i = 0; i < state.roundHistory.length; i++) {
    const roundResult = state.roundHistory[i];
    const prevRound = i > 0 ? state.roundHistory[i - 1] : null;
    
    // Decision: Resource concentration
    const allocation = roundResult.allocation;
    const totalAllocated = allocation.reduce((sum, a) => sum + a.resources, 0);
    const maxAllocation = Math.max(...allocation.map(a => a.resources), 0);
    const concentration = totalAllocated > 0 ? maxAllocation / totalAllocated : 0;
    
    if (concentration > 0.6) {
      decisions.push({
        round: roundResult.round,
        description: `Concentrated ${Math.round(concentration * 100)}% of resources on single project`,
        impact: concentration > 0.8 ? 'positive' : 'neutral',
        reasoning: concentration > 0.8 
          ? 'High concentration enabled fast project completion'
          : 'Moderate concentration balanced speed and risk',
      });
    }
    
    // Decision: Constraint management
    const constraintViolations = Object.values(roundResult.constraintStatus).filter(v => v).length;
    if (prevRound) {
      const prevViolations = Object.values(prevRound.constraintStatus).filter(v => v).length;
      if (constraintViolations < prevViolations) {
        decisions.push({
          round: roundResult.round,
          description: 'Resolved constraint violations',
          impact: 'positive',
          reasoning: 'Successfully addressed constraint issues from previous round',
        });
      } else if (constraintViolations > prevViolations) {
        decisions.push({
          round: roundResult.round,
          description: 'New constraint violations occurred',
          impact: 'negative',
          reasoning: 'Allocation strategy led to constraint violations',
        });
      }
    }
    
    // Decision: Event response
    if (roundResult.events.length > 0) {
      decisions.push({
        round: roundResult.round,
        description: `Responded to ${roundResult.events.length} event(s)`,
        impact: roundResult.metrics.constraintCompliance > 80 ? 'positive' : 'negative',
        reasoning: roundResult.metrics.constraintCompliance > 80
          ? 'Successfully managed events without major impact'
          : 'Events caused significant disruption',
      });
    }
  }
  
  // Sort by impact and round
  decisions.sort((a, b) => {
    const impactOrder = { positive: 0, neutral: 1, negative: 2 };
    const impactDiff = impactOrder[a.impact] - impactOrder[b.impact];
    if (impactDiff !== 0) return impactDiff;
    return b.round - a.round; // Later rounds first
  });
  
  return decisions.slice(0, 3); // Top 3 decisions
}

/**
 * Identify mistakes and inefficiencies
 */
function identifyMistakes(state: GameState): Mistake[] {
  const mistakes: Mistake[] = [];
  const metrics = calculateMetrics(state);
  
  // Low efficiency
  if (metrics.resourceEfficiency < 70) {
    mistakes.push({
      round: state.currentRound,
      description: `Low resource efficiency: ${Math.round(metrics.resourceEfficiency)}%`,
      cost: `Wasted ${Math.round(metrics.waste)} resources`,
      recommendation: 'Allocate resources more strategically, focus on projects with better returns',
    });
  }
  
  // Constraint violations
  if (hasConstraintViolations(state)) {
    const violations = getConstraintViolations(state);
    mistakes.push({
      round: state.currentRound,
      description: `Constraint violations: ${violations.length} constraint(s) violated`,
      cost: 'Failed scenario due to constraint violations',
      recommendation: 'Monitor constraints more closely, allocate resources within limits',
    });
  }
  
  // Unmet objectives
  if (!areAllObjectivesMet(state)) {
    const unmet = getUnmetObjectives(state);
    mistakes.push({
      round: state.currentRound,
      description: `Unmet objectives: ${unmet.length} objective(s) not achieved`,
      cost: 'Failed scenario due to unmet objectives',
      recommendation: 'Focus allocation on projects that contribute to objectives',
    });
  }
  
  // High waste
  if (metrics.waste > state.totalBudgetUsed * 0.1) {
    mistakes.push({
      round: state.currentRound,
      description: `High resource waste: ${Math.round(metrics.waste)} resources wasted`,
      cost: `Lost ${Math.round(metrics.waste)} resources that could have been used`,
      recommendation: 'Avoid over-allocating to completed projects, redistribute resources',
    });
  }
  
  // Late constraint management
  const lateViolations = state.roundHistory
    .filter(r => Object.values(r.constraintStatus).some(v => v))
    .length;
  if (lateViolations > 2) {
    mistakes.push({
      round: state.currentRound,
      description: 'Late constraint management',
      cost: 'Multiple rounds with constraint violations',
      recommendation: 'Address constraint issues earlier, monitor constraints proactively',
    });
  }
  
  return mistakes.slice(0, 3); // Top 3 mistakes
}

/**
 * Generate recommendations
 */
function generateRecommendations(state: GameState, mistakes: Mistake[]): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const metrics = calculateMetrics(state);
  
  // Strategy recommendation based on performance
  if (metrics.resourceEfficiency < 70) {
    recommendations.push({
      type: 'allocation',
      description: 'Improve resource allocation efficiency',
      rationale: 'Current efficiency is below optimal. Focus on projects with better progress-to-resource ratios and avoid over-allocation.',
    });
  }
  
  // Risk management recommendation
  if (metrics.riskLevel > 50) {
    recommendations.push({
      type: 'risk-management',
      description: 'Invest in project health buffers',
      rationale: 'High risk level suggests vulnerability to events. Allocate extra resources to build health buffers on critical projects.',
    });
  }
  
  // Constraint management recommendation
  if (hasConstraintViolations(state)) {
    recommendations.push({
      type: 'strategy',
      description: 'Adopt more conservative allocation strategy',
      rationale: 'Constraint violations indicate need for more careful resource management. Monitor constraints closely and stay within limits.',
    });
  }
  
  // Objective-focused recommendation
  if (!areAllObjectivesMet(state)) {
    const unmet = getUnmetObjectives(state);
    recommendations.push({
      type: 'strategy',
      description: 'Prioritize objective-critical projects',
      rationale: `Focus allocation on projects that directly contribute to unmet objectives: ${unmet.map(o => o.name).join(', ')}`,
    });
  }
  
  return recommendations.slice(0, 3); // Top 3 recommendations
}

/**
 * Generate summary
 */
function generateSummary(
  state: GameState,
  keyDecisions: KeyDecision[],
  mistakes: Mistake[]
): string {
  const outcome = state.outcome === 'win' ? 'successful' : 'unsuccessful';
  const metrics = calculateMetrics(state);
  
  let summary = `This ${outcome} run achieved ${Math.round(metrics.objectiveProgress)}% objective progress `;
  summary += `with ${Math.round(metrics.resourceEfficiency)}% resource efficiency. `;
  
  if (keyDecisions.length > 0) {
    const positiveDecisions = keyDecisions.filter(d => d.impact === 'positive').length;
    summary += `Key strategic decisions included ${positiveDecisions} positive choices. `;
  }
  
  if (mistakes.length > 0) {
    summary += `Areas for improvement include ${mistakes[0].description.toLowerCase()}. `;
  }
  
  if (state.outcome === 'win') {
    summary += 'Overall, the allocation strategy successfully balanced objectives, constraints, and resource efficiency.';
  } else {
    summary += 'The allocation strategy needs refinement to better balance competing priorities.';
  }
  
  return summary;
}
