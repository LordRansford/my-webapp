/**
 * Proof Sprint - Explainability Analyzer
 */

import type { GameState } from './types';

export interface Analysis {
  keyDecisions: Array<{
    step: number;
    description: string;
    impact: 'positive' | 'negative' | 'neutral';
    reasoning: string;
  }>;
  mistakes: Array<{
    step: number;
    description: string;
    cost: string;
    recommendation: string;
  }>;
  recommendations: Array<{
    type: 'strategy' | 'move-selection' | 'efficiency';
    description: string;
    rationale: string;
  }>;
  summary: string;
}

export function analyzeRun(state: GameState): Analysis {
  const keyDecisions: Analysis['keyDecisions'] = [];
  const mistakes: Analysis['mistakes'] = [];
  const recommendations: Analysis['recommendations'] = [];
  
  // Analyze proof steps
  for (const step of state.proofSteps) {
    if (step.penalty > 0.1) {
      keyDecisions.push({
        step: step.stepNumber,
        description: `Used ${step.move.name} (penalty: ${step.penalty})`,
        impact: step.penalty > 0.15 ? 'negative' : 'neutral',
        reasoning: 'Powerful move used, but incurred penalty',
      });
    }
  }
  
  // Check for inefficiencies
  if (state.stepCount > state.puzzle.maxSteps * 0.8) {
    mistakes.push({
      step: state.stepCount,
      description: 'Used too many steps',
      cost: 'Reduced efficiency score',
      recommendation: 'Consider using more powerful moves to reduce step count',
    });
  }
  
  if (state.penalty > 0.3) {
    mistakes.push({
      step: state.stepCount,
      description: 'Accumulated high penalty',
      cost: 'Reduced final score',
      recommendation: 'Balance powerful moves with simple steps',
    });
  }
  
  // Generate recommendations
  if (state.stepCount > state.puzzle.maxSteps * 0.7) {
    recommendations.push({
      type: 'efficiency',
      description: 'Focus on reducing step count',
      rationale: `Used ${state.stepCount} of ${state.puzzle.maxSteps} steps`,
    });
  }
  
  if (state.penalty > 0.2) {
    recommendations.push({
      type: 'move-selection',
      description: 'Use powerful moves more strategically',
      rationale: 'High penalty accumulated from powerful moves',
    });
  }
  
  const win = state.outcome === 'win';
  const summary = win
    ? `Successfully completed proof in ${state.stepCount} steps with elegance score ${state.elegance?.toFixed(1) || 0}.`
    : `Failed to complete proof within ${state.puzzle.maxSteps} steps.`;
  
  return {
    keyDecisions: keyDecisions.slice(0, 3),
    mistakes: mistakes.slice(0, 3),
    recommendations,
    summary,
  };
}
