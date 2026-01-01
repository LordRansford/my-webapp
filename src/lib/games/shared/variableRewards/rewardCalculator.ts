/**
 * Reward Calculator
 * 
 * Calculates base XP and applies variable reward multipliers.
 */

import type { BaseXPParams, RewardContext, RewardResult } from './types';
import { SeededRNG } from '@/lib/games/framework/SeededRNG';

/**
 * Calculate base XP based on performance
 */
export function calculateBaseXP(params: BaseXPParams): number {
  const { win, score, efficiency = 100, time, difficulty, tier } = params;
  
  // Base XP
  let baseXP = win ? 50 : 10;
  
  // Score bonus
  const scoreBonus = win ? score * 0.5 : score * 0.2;
  
  // Efficiency bonus
  const efficiencyBonus = efficiency * 0.3;
  
  // Time bonus (faster = more bonus, but capped)
  const timeBonus = time ? Math.max(0, 20 - (time / 1000 / 60)) : 0;
  
  // Difficulty multiplier
  const difficultyMultiplier = {
    'foundations': 1.0,
    'novice': 1.0,
    'intermediate': 1.2,
    'optimizer': 1.2,
    'tactician': 1.2,
    'advanced': 1.5,
    'solver': 1.5,
    'expert': 2.0,
    'master-optimizer': 2.0,
    'allocation-expert': 2.0,
    'constraint-master': 2.5,
    'allocation-master': 2.5,
  }[difficulty] || 1.0;
  
  // Tier multiplier
  const tierMultiplier = {
    'planner': 1.0,
    'novice': 1.0,
    'strategist': 1.2,
    'optimizer': 1.2,
    'architect': 1.5,
    'solver': 1.5,
    'master': 2.0,
    'master-optimizer': 2.0,
    'legend': 2.5,
    'constraint-master': 2.5,
  }[tier] || 1.0;
  
  const total = (baseXP + scoreBonus + efficiencyBonus + timeBonus) * difficultyMultiplier * tierMultiplier;
  
  return Math.round(total);
}

/**
 * Create reward context for variable reward generation
 */
export function createRewardContext(params: {
  gameId: string;
  seed: number;
  baseXP: number;
  performance: RewardContext['performance'];
  streak: number;
  tier: string;
}): RewardContext {
  return {
    gameId: params.gameId,
    seed: params.seed,
    baseXP: params.baseXP,
    performance: params.performance,
    streak: params.streak,
    tier: params.tier,
  };
}
