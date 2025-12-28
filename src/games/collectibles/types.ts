// Collectible and power-up system types

export type CollectibleRarity = "common" | "rare" | "epic";

export type Collectible = {
  id: string;
  x: number;
  y: number;
  radius: number;
  rarity: CollectibleRarity;
  value: number;
  collected: boolean;
  spawnTime: number;
  magnetRadius?: number; // For character magnet ability
};

export type PowerUpType = "slow-time" | "shield" | "double-points" | "speed-boost" | "rapid-fire" | "explosive-shots" | "life-extension" | "star-mode";

export type PowerUp = {
  id: string;
  x: number;
  y: number;
  radius: number;
  type: PowerUpType;
  collected: boolean;
  spawnTime: number;
  active: boolean;
  duration: number; // in ms
  startTime?: number;
};

export const COLLECTIBLE_VALUES: Record<CollectibleRarity, number> = {
  common: 10,
  rare: 25,
  epic: 50,
};

export const COLLECTIBLE_SPAWN_WEIGHTS: Record<CollectibleRarity, number> = {
  common: 0.7,
  rare: 0.25,
  epic: 0.05,
};

export const POWER_UP_DURATIONS: Record<PowerUpType, number> = {
  "slow-time": 5000,
  shield: 8000,
  "double-points": 10000,
  "speed-boost": 6000,
  "rapid-fire": 8000,
  "explosive-shots": 10000,
  "life-extension": 0, // Instant (adds hit point)
  "star-mode": 7000, // Invincibility
};

export const POWER_UP_SPAWN_WEIGHT = 0.15; // 15% chance per spawn cycle

