// Character and player choice system types

export type CharacterId = "agent" | "speedster" | "tank" | "collector" | "perfectionist";

export type CharacterStats = {
  speed: number; // Movement speed multiplier (0.8 - 1.2)
  shieldDuration: number; // Shield power-up duration multiplier (0.8 - 1.5)
  comboMultiplier: number; // Combo point multiplier (0.9 - 1.3)
  collectibleMagnet: number; // Attraction radius for collectibles (0 - 50)
  perfectDodgeWindow: number; // Perfect dodge timing window in ms (50 - 150)
};

export type DifficultyModifier = {
  id: string;
  name: string;
  description: string;
  advantage: string;
  disadvantage: string;
  intensityMultiplier: number; // 0.8 - 1.2
  pointMultiplier: number; // 0.8 - 1.5
};

export type PowerUpPreference = {
  slowTime: boolean;
  shield: boolean;
  doublePoints: boolean;
  speedBoost: boolean;
};

export type PlayerChoice = {
  character: CharacterId;
  difficultyModifier?: string;
  powerUpPreferences: PowerUpPreference;
};

export const CHARACTERS: Record<CharacterId, { name: string; description: string; stats: CharacterStats }> = {
  agent: {
    name: "Agent",
    description: "Balanced. Reliable. The standard choice.",
    stats: {
      speed: 1.0,
      shieldDuration: 1.0,
      comboMultiplier: 1.0,
      collectibleMagnet: 0,
      perfectDodgeWindow: 100,
    },
  },
  speedster: {
    name: "Speedster",
    description: "Fast movement, but harder to control. Perfect for those who like speed.",
    stats: {
      speed: 1.2,
      shieldDuration: 0.8,
      comboMultiplier: 1.1,
      collectibleMagnet: 20,
      perfectDodgeWindow: 80,
    },
  },
  tank: {
    name: "Tank",
    description: "Slower but more durable. Shield power-ups last longer.",
    stats: {
      speed: 0.85,
      shieldDuration: 1.5,
      comboMultiplier: 0.9,
      collectibleMagnet: 0,
      perfectDodgeWindow: 120,
    },
  },
  collector: {
    name: "Collector",
    description: "Magnet for collectibles, but slightly slower. Great for side quests.",
    stats: {
      speed: 0.9,
      shieldDuration: 1.0,
      comboMultiplier: 1.2,
      collectibleMagnet: 50,
      perfectDodgeWindow: 100,
    },
  },
  perfectionist: {
    name: "Perfectionist",
    description: "Larger perfect dodge window, but lower combo multiplier. For precision players.",
    stats: {
      speed: 1.0,
      shieldDuration: 0.9,
      comboMultiplier: 0.95,
      collectibleMagnet: 10,
      perfectDodgeWindow: 150,
    },
  },
};

export const DIFFICULTY_MODIFIERS: DifficultyModifier[] = [
  {
    id: "none",
    name: "Standard",
    description: "No modifier. Balanced gameplay.",
    advantage: "No penalties",
    disadvantage: "No bonuses",
    intensityMultiplier: 1.0,
    pointMultiplier: 1.0,
  },
  {
    id: "hard-mode",
    name: "Hard Mode",
    description: "20% harder obstacles, but 30% more points.",
    advantage: "+30% points",
    disadvantage: "20% harder",
    intensityMultiplier: 1.2,
    pointMultiplier: 1.3,
  },
  {
    id: "easy-mode",
    name: "Easy Mode",
    description: "20% easier obstacles, but 20% fewer points.",
    advantage: "20% easier",
    disadvantage: "-20% points",
    intensityMultiplier: 0.8,
    pointMultiplier: 0.8,
  },
  {
    id: "nightmare",
    name: "Nightmare",
    description: "50% harder obstacles, but 100% more points. For the truly brave.",
    advantage: "+100% points",
    disadvantage: "50% harder",
    intensityMultiplier: 1.5,
    pointMultiplier: 2.0,
  },
];

