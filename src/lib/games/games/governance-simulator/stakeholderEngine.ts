/**
 * Governance Simulator - Stakeholder Engine
 * 
 * Calculates stakeholder responses to governance changes.
 */

import type { GameState, Stakeholder, GovernanceStrategy, Event } from './types';

/**
 * Calculate stakeholder responses to governance strategy
 */
export function calculateStakeholderResponses(
  state: GameState,
  strategy: GovernanceStrategy
): Stakeholder[] {
  return state.stakeholders.map(stakeholder => {
    // Calculate alignment with preferences
    const controlsAlignment = 1 - Math.abs(strategy.controls - stakeholder.preferences.controls) / 100;
    const transparencyAlignment = 1 - Math.abs(strategy.transparency - stakeholder.preferences.transparency) / 100;
    const autonomyAlignment = 1 - Math.abs(strategy.autonomy - stakeholder.preferences.autonomy) / 100;
    
    const overallAlignment = (controlsAlignment + transparencyAlignment + autonomyAlignment) / 3;
    
    // Update trust based on alignment
    const trustChange = (overallAlignment - 0.5) * 10; // -5 to +5 per turn
    const newTrust = Math.max(0, Math.min(100, stakeholder.trust + trustChange));
    
    // Update satisfaction based on trust
    const satisfactionChange = (newTrust - stakeholder.trust) * 0.5;
    const newSatisfaction = Math.max(0, Math.min(100, stakeholder.satisfaction + satisfactionChange));
    
    // Update compliance based on controls
    const complianceChange = (strategy.controls - 50) * 0.2; // Higher controls = higher compliance
    const newCompliance = Math.max(0, Math.min(100, stakeholder.compliance + complianceChange));
    
    return {
      ...stakeholder,
      trust: newTrust,
      satisfaction: newSatisfaction,
      compliance: newCompliance,
    };
  });
}

/**
 * Apply events to stakeholders
 */
export function applyEventsToStakeholders(
  stakeholders: Stakeholder[],
  events: Event[]
): Stakeholder[] {
  let updated = [...stakeholders];
  
  for (const event of events) {
    for (const stakeholderId of event.affectedStakeholders) {
      const stakeholder = updated.find(s => s.id === stakeholderId);
      if (stakeholder && event.effect.trustChange) {
        stakeholder.trust = Math.max(0, Math.min(100, stakeholder.trust + event.effect.trustChange));
      }
    }
  }
  
  return updated;
}
