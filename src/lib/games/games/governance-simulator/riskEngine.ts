/**
 * Governance Simulator - Risk Engine
 * 
 * Calculates risk levels based on governance strategy.
 */

import type { GameState, Risk, GovernanceStrategy } from './types';

/**
 * Calculate risk levels based on governance strategy
 */
export function calculateRiskLevels(
  state: GameState,
  strategy: GovernanceStrategy
): Risk[] {
  return state.risks.map(risk => {
    let newLevel = risk.level;
    
    // Risk changes based on governance strategy
    switch (risk.type) {
      case 'privacy':
      case 'security':
      case 'compliance':
        // Higher controls = lower risk
        newLevel -= (strategy.controls - 50) * 0.3;
        break;
      case 'innovation':
        // Higher controls = higher innovation risk (slower innovation)
        newLevel += (strategy.controls - 50) * 0.2;
        break;
      case 'cost':
        // Higher controls = higher cost risk
        newLevel += (strategy.controls - 50) * 0.1;
        break;
    }
    
    // Update trend
    const trend = newLevel > risk.level ? 'increasing' : 
                  newLevel < risk.level ? 'decreasing' : 'stable';
    
    return {
      ...risk,
      level: Math.max(0, Math.min(100, newLevel)),
      trend,
    };
  });
}

/**
 * Apply events to risks
 */
export function applyEventsToRisks(
  risks: Risk[],
  events: import('./types').Event[]
): Risk[] {
  let updated = [...risks];
  
  for (const event of events) {
    if (event.effect.riskChange) {
      // Apply risk change to all risks (simplified)
      updated = updated.map(risk => ({
        ...risk,
        level: Math.max(0, Math.min(100, risk.level + event.effect.riskChange! * 0.5)),
      }));
    }
  }
  
  return updated;
}
