export type CharacterId = "speedster" | "tank" | "balanced";

export interface CharacterStats {
  id: CharacterId;
  name: string;
  description: string;
  speedMultiplier: number; // 1.0 = default
  hitboxSizeMultiplier: number; // 1.0 = default
  pointsMultiplier: number; // 1.0 = default
  canSurviveHit: boolean; // Can survive one hit
  icon: string; // Emoji or icon identifier
}

export const CHARACTERS: Record<CharacterId, CharacterStats> = {
  speedster: {
    id: "speedster",
    name: "Speedster",
    description: "Fast and agile, but harder to control",
    speedMultiplier: 1.2, // +20% speed
    hitboxSizeMultiplier: 0.85, // -15% hitbox (smaller = harder to hit)
    pointsMultiplier: 0.9, // -10% points
    canSurviveHit: false,
    icon: "⚡",
  },
  tank: {
    id: "tank",
    name: "Tank",
    description: "Slower but tougher, can survive one hit",
    speedMultiplier: 0.85, // -15% speed
    hitboxSizeMultiplier: 1.3, // +30% hitbox (larger = easier to hit)
    pointsMultiplier: 1.2, // +20% points
    canSurviveHit: true,
    icon: "🛡️",
  },
  balanced: {
    id: "balanced",
    name: "Balanced",
    description: "Well-rounded, slight point bonus",
    speedMultiplier: 1.0, // Default speed
    hitboxSizeMultiplier: 1.0, // Default hitbox
    pointsMultiplier: 1.05, // +5% points
    canSurviveHit: false,
    icon: "⭐",
  },
};

export function getCharacter(id: CharacterId): CharacterStats {
  return CHARACTERS[id];
}

