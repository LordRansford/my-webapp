// Projectile and weapon type definitions

export type WeaponType = "basic" | "spread" | "multi" | "laser" | "homing";

export type Projectile = {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  damage: number;
  radius: number;
  life: number;
  maxLife: number;
  weaponType: WeaponType;
  // For homing projectiles
  targetId?: string;
  targetX?: number;
  targetY?: number;
};

export type WeaponStats = {
  type: WeaponType;
  damage: number;
  speed: number;
  cooldown: number; // ms between shots
  projectileCount: number;
  spreadAngle?: number; // For spread weapons
  directions?: number[]; // For multi-directional (angles in radians)
  duration?: number; // For laser (ms)
  homingStrength?: number; // For homing projectiles (0-1)
};

export const WEAPON_STATS: Record<WeaponType, WeaponStats> = {
  basic: {
    type: "basic",
    damage: 1,
    speed: 400,
    cooldown: 200,
    projectileCount: 1,
  },
  spread: {
    type: "spread",
    damage: 1,
    speed: 400,
    cooldown: 250,
    projectileCount: 3,
    spreadAngle: Math.PI / 6, // 30 degrees
  },
  multi: {
    type: "multi",
    damage: 1,
    speed: 400,
    cooldown: 300,
    projectileCount: 5,
    directions: [Math.PI / 2, Math.PI / 2 + Math.PI / 4, Math.PI / 2 - Math.PI / 4, Math.PI, 0], // up, up-left, up-right, left, right
  },
  laser: {
    type: "laser",
    damage: 2,
    speed: 600,
    cooldown: 100,
    projectileCount: 1,
    duration: 500, // 0.5 seconds
  },
  homing: {
    type: "homing",
    damage: 1,
    speed: 350,
    cooldown: 350,
    projectileCount: 1,
    homingStrength: 0.15, // 15% correction per frame
  },
};

export const WEAPON_UPGRADE_COST: Record<WeaponType, number> = {
  basic: 0, // Starting weapon
  spread: 500,
  multi: 1500,
  laser: 3000,
  homing: 5000,
};

export const WEAPON_UPGRADE_PATH: WeaponType[] = ["basic", "spread", "multi", "laser", "homing"];

