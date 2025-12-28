// Enemy/obstacle type definitions

export type EnemyType = "destructible" | "indestructible" | "homing" | "zigzag" | "spiral" | "formation" | "kamikaze";

export type EnemyPattern = "straight" | "homing" | "zigzag" | "spiral" | "formation" | "kamikaze";

export type Enemy = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  speed: number;
  type: EnemyType;
  pattern: EnemyPattern;
  health: number; // For destructible enemies
  maxHealth: number;
  // Pattern-specific data
  patternData?: {
    zigzag?: { direction: number; amplitude: number; frequency: number };
    spiral?: { angle: number; radius: number; centerX: number; centerY: number };
    formation?: { groupId: string; offsetX: number; offsetY: number };
    homing?: { targetX: number; targetY: number; prediction: number };
  };
  // Rewards
  dropReward?: "points" | "life" | "star" | "weapon" | "powerup";
  rewardValue?: number;
};

export const ENEMY_TYPE_WEIGHTS: Record<EnemyType, number> = {
  destructible: 0.6, // 60%
  indestructible: 0.3, // 30%
  homing: 0.1, // 10%
  zigzag: 0.0, // Spawned separately
  spiral: 0.0, // Spawned separately
  formation: 0.0, // Spawned separately
  kamikaze: 0.0, // Spawned separately
};

export const ENEMY_PATTERN_WEIGHTS: Record<EnemyPattern, number> = {
  straight: 0.5,
  homing: 0.3,
  zigzag: 0.1,
  spiral: 0.05,
  formation: 0.03,
  kamikaze: 0.02,
};

export const ENEMY_HEALTH_BY_TYPE: Record<EnemyType, number> = {
  destructible: 1,
  indestructible: Infinity,
  homing: 2,
  zigzag: 1,
  spiral: 1,
  formation: 1,
  kamikaze: 1,
};

