/**
 * Efficiency Calculator
 * 
 * Calculates solution efficiency based on constraints and preferences
 */

import type { OptimizationChallenge, Solution } from "./types";
import { countConstraintViolations } from "./constraintEngine";

export function calculateEfficiency(
  selectedItems: string[],
  challenge: OptimizationChallenge
): number {
  // Base efficiency: how close to max items (using all available resources is efficient)
  const itemUtilization = selectedItems.length / challenge.maxItems;
  const baseEfficiency = itemUtilization * 0.6; // 60% weight on utilization
  
  // Preference satisfaction: 30% weight
  let preferenceScore = 0;
  const preferenceConstraints = challenge.constraints.filter(c => c.type === 'preference');
  if (preferenceConstraints.length > 0) {
    let satisfiedPrefs = 0;
    for (const pref of preferenceConstraints) {
      if (pref.items && pref.items.length >= 2) {
        const [preferred, alternative] = pref.items;
        if (selectedItems.includes(preferred) && !selectedItems.includes(alternative)) {
          satisfiedPrefs++;
        }
      }
    }
    preferenceScore = satisfiedPrefs / preferenceConstraints.length;
  }
  const preferenceEfficiency = preferenceScore * 0.3;
  
  // Constraint violation penalty: -10% per violation
  const violations = countConstraintViolations(selectedItems, challenge);
  const violationPenalty = Math.min(0.4, violations * 0.1); // Max 40% penalty
  
  // Final efficiency score (0-100)
  const efficiency = Math.max(0, Math.min(100, (baseEfficiency + preferenceEfficiency - violationPenalty) * 100));
  
  return Math.round(efficiency * 100) / 100;
}

export function createSolution(
  selectedItems: string[],
  challenge: OptimizationChallenge
): Solution {
  const violations = countConstraintViolations(selectedItems, challenge);
  const efficiency = calculateEfficiency(selectedItems, challenge);
  
  return {
    selectedItems,
    efficiency,
    constraintViolations: violations,
    createdAt: Date.now(),
  };
}