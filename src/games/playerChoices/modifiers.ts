export type DifficultyModifierId = "high-risk" | "steady-progress" | "safe-mode";

export interface DifficultyModifier {
  id: DifficultyModifierId;
  name: string;
  description: string;
  pointsMultiplier: number;
  obstacleSpeedMultiplier: number; // 1.0 = default
  spawnDelayMultiplier: number; // 1.0 = default (lower = faster spawns)
  icon: string;
}

export const DIFFICULTY_MODIFIERS: Record<DifficultyModifierId, DifficultyModifier> = {
  "high-risk": {
    id: "high-risk",
    name: "High Risk",
    description: "More obstacles, faster speed, but much higher rewards",
    pointsMultiplier: 1.5, // +50% points
    obstacleSpeedMultiplier: 1.3, // +30% speed
    spawnDelayMultiplier: 0.8, // -20% delay (faster spawns)
    icon: "🔥",
  },
  "steady-progress": {
    id: "steady-progress",
    name: "Steady Progress",
    description: "Balanced difficulty with moderate rewards",
    pointsMultiplier: 1.25, // +25% points
    obstacleSpeedMultiplier: 1.0, // Default speed
    spawnDelayMultiplier: 1.0, // Default delay
    icon: "📈",
  },
  "safe-mode": {
    id: "safe-mode",
    name: "Safe Mode",
    description: "Easier obstacles, slower speed, lower rewards",
    pointsMultiplier: 1.1, // +10% points
    obstacleSpeedMultiplier: 0.8, // -20% speed
    spawnDelayMultiplier: 1.3, // +30% delay (slower spawns)
    icon: "🛡️",
  },
};

export function getModifier(id: DifficultyModifierId): DifficultyModifier {
  return DIFFICULTY_MODIFIERS[id];
}

