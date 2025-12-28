export type PowerUpId = "time-slow" | "shield" | "double-points" | "speed-boost";

export type PowerUpRarity = "common" | "rare" | "epic";

export interface PowerUpDefinition {
  id: PowerUpId;
  name: string;
  description: string;
  rarity: PowerUpRarity;
  duration: number; // seconds
  icon: string;
  color: string; // CSS color for visual representation
}

export const POWER_UPS: Record<PowerUpId, PowerUpDefinition> = {
  "time-slow": {
    id: "time-slow",
    name: "Time Slow",
    description: "Slow obstacles by 50% for 3 seconds",
    rarity: "rare",
    duration: 3,
    icon: "⏱️",
    color: "#6366f1", // Indigo
  },
  shield: {
    id: "shield",
    name: "Shield",
    description: "Block one hit",
    rarity: "common",
    duration: 0, // Instant effect (one-time use)
    icon: "🛡️",
    color: "#10b981", // Emerald
  },
  "double-points": {
    id: "double-points",
    name: "Double Points",
    description: "2x points for 10 seconds",
    rarity: "rare",
    duration: 10,
    icon: "💎",
    color: "#f59e0b", // Amber
  },
  "speed-boost": {
    id: "speed-boost",
    name: "Speed Boost",
    description: "+50% speed for 5 seconds",
    rarity: "common",
    duration: 5,
    icon: "⚡",
    color: "#ef4444", // Red
  },
};

export function getPowerUp(id: PowerUpId): PowerUpDefinition {
  return POWER_UPS[id];
}

export function getPowerUpSpawnRate(rarity: PowerUpRarity): number {
  // Spawn rate per second (approximate)
  switch (rarity) {
    case "common":
      return 0.15; // ~15% chance per spawn cycle
    case "rare":
      return 0.05; // ~5% chance per spawn cycle
    case "epic":
      return 0.01; // ~1% chance per spawn cycle
  }
}

