/**
 * Variable Reward Generator
 * 
 * Generates variable rewards based on probability distributions.
 * Uses 70/20/8/2% distribution for standard/bonus/rare/legendary rewards.
 */

import { SeededRNG } from '@/lib/games/framework/SeededRNG';
import type { RewardContext, RewardResult } from './types';

/**
 * Generate variable reward result
 */
export function generateRewardResult(context: RewardContext): RewardResult {
  const rng = new SeededRNG(context.seed + 1000); // Offset seed for reward generation
  
  // Determine reward tier based on probability
  const roll = rng.next();
  let rewardType: RewardResult['rewardType'];
  let bonusMultiplier: number;
  let rewardDescription: string;
  
  if (roll < 0.70) {
    // 70% - Standard reward
    rewardType = 'standard';
    bonusMultiplier = 1.0;
    rewardDescription = 'Standard completion reward';
  } else if (roll < 0.90) {
    // 20% - Bonus reward
    rewardType = 'bonus';
    bonusMultiplier = 1.2 + (rng.next() * 0.3); // 1.2x to 1.5x
    rewardDescription = 'Bonus reward! Great performance!';
  } else if (roll < 0.98) {
    // 8% - Rare reward
    rewardType = 'rare';
    bonusMultiplier = 1.5 + (rng.next() * 0.5); // 1.5x to 2.0x
    rewardDescription = 'Rare reward! Exceptional performance!';
  } else {
    // 2% - Legendary reward
    rewardType = 'legendary';
    bonusMultiplier = 2.0 + (rng.next() * 1.0); // 2.0x to 3.0x
    rewardDescription = 'Legendary reward! Outstanding achievement!';
  }
  
  // Apply streak multiplier (if streak >= 7)
  let streakMultiplier = 1.0;
  if (context.streak >= 7) {
    streakMultiplier = 1.0 + (Math.min(context.streak, 30) - 7) * 0.01; // +1% per day after 7, max 1.23x at 30 days
  }
  
  // Calculate final XP
  const bonusXP = context.baseXP * (bonusMultiplier - 1.0);
  const totalXP = Math.round(context.baseXP * bonusMultiplier * streakMultiplier);
  
  // Check for special unlocks (rare and legendary only)
  const unlocks: string[] = [];
  if (rewardType === 'rare' && rng.next() < 0.15) {
    unlocks.push('scenario-variant');
  }
  if (rewardType === 'legendary' && rng.next() < 0.5) {
    unlocks.push('exclusive-scenario');
    if (rng.next() < 0.3) {
      unlocks.push('special-modifier');
    }
  }
  
  return {
    totalXP,
    baseXP: context.baseXP,
    bonusXP: Math.round(bonusXP),
    bonusMultiplier: bonusMultiplier * streakMultiplier,
    rewardType,
    rewardDescription,
    unlocks: unlocks.length > 0 ? unlocks : undefined,
  };
}

/**
 * Generate daily challenge modifier
 * Returns modifier type and description
 */
export function generateDailyModifier(seed: number): {
  type: 'double-xp' | 'tooling-bonus' | 'adversary-variant' | 'none';
  description: string;
  multiplier: number;
} {
  const rng = new SeededRNG(seed);
  const roll = rng.next();
  
  if (roll < 0.10) {
    return {
      type: 'double-xp',
      description: 'Double XP Day!',
      multiplier: 2.0,
    };
  } else if (roll < 0.25) {
    return {
      type: 'tooling-bonus',
      description: 'Tooling Bonus Active (+20% effectiveness)',
      multiplier: 1.2,
    };
  } else if (roll < 0.30) {
    return {
      type: 'adversary-variant',
      description: 'Rare Adversary Variant',
      multiplier: 1.0,
    };
  }
  
  return {
    type: 'none',
    description: '',
    multiplier: 1.0,
  };
}
