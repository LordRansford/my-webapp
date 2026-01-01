/**
 * Reward Type Definitions
 * 
 * Defines all available reward types with their probabilities and values.
 */

import type { RewardDefinition } from './types';

/**
 * Standard reward definitions for common scenarios
 */
export const STANDARD_REWARDS: RewardDefinition[] = [
  // XP Bonuses
  {
    id: 'xp-bonus-small',
    type: 'xp-bonus',
    rarity: 'common',
    probability: 0.3, // 30% chance
    baseValue: 1.1, // 10% XP bonus
    variance: 0.1, // ±10% variance (1.0x - 1.2x)
    description: 'Small XP Bonus',
    icon: '⭐',
  },
  {
    id: 'xp-bonus-medium',
    type: 'xp-bonus',
    rarity: 'uncommon',
    probability: 0.15, // 15% chance
    baseValue: 1.2, // 20% XP bonus
    variance: 0.1, // ±10% variance (1.1x - 1.3x)
    description: 'Medium XP Bonus',
    icon: '⭐⭐',
  },
  {
    id: 'xp-bonus-large',
    type: 'xp-bonus',
    rarity: 'rare',
    probability: 0.05, // 5% chance
    baseValue: 1.5, // 50% XP bonus
    variance: 0.2, // ±20% variance (1.3x - 1.7x)
    description: 'Large XP Bonus',
    icon: '⭐⭐⭐',
  },
  
  // Unlock Chances
  {
    id: 'unlock-common',
    type: 'unlock-chance',
    rarity: 'common',
    probability: 0.1, // 10% chance
    baseValue: 1, // 1 unlock
    variance: 0,
    description: 'Common Content Unlock',
    icon: '🎁',
  },
  {
    id: 'unlock-rare',
    type: 'unlock-chance',
    rarity: 'rare',
    probability: 0.05, // 5% chance
    baseValue: 1,
    variance: 0,
    description: 'Rare Content Unlock',
    icon: '💎',
  },
  
  // Challenge Modifiers
  {
    id: 'modifier-double-xp',
    type: 'challenge-modifier',
    rarity: 'uncommon',
    probability: 0.1, // 10% chance
    baseValue: 2.0, // 2x XP multiplier
    variance: 0,
    description: 'Double XP Day',
    icon: '⚡',
  },
  {
    id: 'modifier-bonus-tooling',
    type: 'challenge-modifier',
    rarity: 'rare',
    probability: 0.05, // 5% chance
    baseValue: 1.2, // 20% tooling bonus
    variance: 0,
    description: 'Tooling Bonus',
    icon: '🔧',
  },
  
  // Streak Multipliers
  {
    id: 'streak-multiplier-7',
    type: 'streak-multiplier',
    rarity: 'common',
    probability: 1.0, // 100% chance on day 7
    baseValue: 1.1, // 10% multiplier
    variance: 0,
    description: '7-Day Streak Bonus',
    icon: '🔥',
  },
  {
    id: 'streak-multiplier-30',
    type: 'streak-multiplier',
    rarity: 'epic',
    probability: 1.0, // 100% chance on day 30
    baseValue: 1.2, // 20% multiplier
    variance: 0,
    description: '30-Day Streak Bonus',
    icon: '👑',
  },
];

/**
 * Get reward definitions by type
 */
export function getRewardsByType(type: string): RewardDefinition[] {
  return STANDARD_REWARDS.filter(r => r.type === type);
}

/**
 * Get reward definitions by rarity
 */
export function getRewardsByRarity(rarity: string): RewardDefinition[] {
  return STANDARD_REWARDS.filter(r => r.rarity === rarity);
}

/**
 * Get reward definition by ID
 */
export function getRewardDefinition(id: string): RewardDefinition | undefined {
  return STANDARD_REWARDS.find(r => r.id === id);
}
