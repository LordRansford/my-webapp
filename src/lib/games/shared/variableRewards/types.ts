/**
 * Variable Rewards Types
 */

export interface RewardContext {
  gameId: string;
  seed: number;
  baseXP: number;
  performance: {
    score: number;
    efficiency?: number;
    time?: number;
    steps?: number;
    elegance?: number;
  };
  streak: number;
  tier: string;
}

export interface RewardResult {
  totalXP: number;
  baseXP: number;
  bonusXP: number;
  bonusMultiplier: number;
  rewardType: 'standard' | 'bonus' | 'rare' | 'legendary';
  rewardDescription: string;
  unlocks?: string[];
}

export interface BaseXPParams {
  win: boolean;
  score: number;
  efficiency?: number;
  time?: number;
  difficulty: string;
  tier: string;
}
