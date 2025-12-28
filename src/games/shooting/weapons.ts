// Weapon upgrade system and stats

import type { WeaponType, Projectile, WeaponStats } from "./types";
import { WEAPON_STATS, WEAPON_UPGRADE_PATH, WEAPON_UPGRADE_COST } from "./types";

export type WeaponState = {
  currentWeapon: WeaponType;
  points: number;
  upgradePoints: number; // Points toward next upgrade
  rapidFireActive: boolean; // 2x fire rate power-up
  rapidFireEndTime?: number;
};

export function createWeaponState(): WeaponState {
  return {
    currentWeapon: "basic",
    points: 0,
    upgradePoints: 0,
    rapidFireActive: false,
  };
}

export function canUpgradeWeapon(state: WeaponState): boolean {
  const currentIndex = WEAPON_UPGRADE_PATH.indexOf(state.currentWeapon);
  if (currentIndex === -1 || currentIndex >= WEAPON_UPGRADE_PATH.length - 1) {
    return false; // Already at max or invalid weapon
  }

  const nextWeapon = WEAPON_UPGRADE_PATH[currentIndex + 1];
  const cost = WEAPON_UPGRADE_COST[nextWeapon];
  return state.upgradePoints >= cost;
}

export function upgradeWeapon(state: WeaponState): boolean {
  if (!canUpgradeWeapon(state)) return false;

  const currentIndex = WEAPON_UPGRADE_PATH.indexOf(state.currentWeapon);
  const nextWeapon = WEAPON_UPGRADE_PATH[currentIndex + 1];
  const cost = WEAPON_UPGRADE_COST[nextWeapon];

  state.currentWeapon = nextWeapon;
  state.upgradePoints -= cost;
  return true;
}

export function addUpgradePoints(state: WeaponState, points: number) {
  state.upgradePoints += points;
  // Auto-upgrade if possible
  while (canUpgradeWeapon(state)) {
    upgradeWeapon(state);
  }
}

export function createProjectile(
  weaponType: WeaponType,
  playerX: number,
  playerY: number,
  targetX?: number,
  targetY?: number
): Projectile[] {
  const stats = WEAPON_STATS[weaponType];
  const projectiles: Projectile[] = [];

  switch (weaponType) {
    case "basic": {
      const angle = Math.PI / 2; // Straight up
      projectiles.push({
        id: `proj-${Date.now()}-${Math.random()}`,
        x: playerX,
        y: playerY,
        vx: Math.cos(angle) * stats.speed,
        vy: -Math.sin(angle) * stats.speed,
        speed: stats.speed,
        damage: stats.damage,
        radius: 4,
        life: 1.0,
        maxLife: 2.0,
        weaponType,
      });
      break;
    }

    case "spread": {
      const centerAngle = Math.PI / 2; // Up
      const spread = stats.spreadAngle || Math.PI / 6;
      for (let i = 0; i < stats.projectileCount; i++) {
        const angle = centerAngle - spread / 2 + (spread / (stats.projectileCount - 1)) * i;
        projectiles.push({
          id: `proj-${Date.now()}-${i}-${Math.random()}`,
          x: playerX,
          y: playerY,
          vx: Math.cos(angle) * stats.speed,
          vy: -Math.sin(angle) * stats.speed,
          speed: stats.speed,
          damage: stats.damage,
          radius: 4,
          life: 1.0,
          maxLife: 2.0,
          weaponType,
        });
      }
      break;
    }

    case "multi": {
      const directions = stats.directions || [Math.PI / 2];
      for (let i = 0; i < directions.length; i++) {
        const angle = directions[i];
        projectiles.push({
          id: `proj-${Date.now()}-${i}-${Math.random()}`,
          x: playerX,
          y: playerY,
          vx: Math.cos(angle) * stats.speed,
          vy: -Math.sin(angle) * stats.speed,
          speed: stats.speed,
          damage: stats.damage,
          radius: 4,
          life: 1.0,
          maxLife: 2.0,
          weaponType,
        });
      }
      break;
    }

    case "laser": {
      // Laser is a continuous beam, represented as a fast, long projectile
      projectiles.push({
        id: `proj-${Date.now()}-${Math.random()}`,
        x: playerX,
        y: playerY,
        vx: 0,
        vy: -stats.speed,
        speed: stats.speed,
        damage: stats.damage,
        radius: 6,
        life: 1.0,
        maxLife: (stats.duration || 500) / 1000,
        weaponType,
      });
      break;
    }

    case "homing": {
      // Homing projectile initially goes up, then tracks target
      const initialAngle = Math.PI / 2;
      projectiles.push({
        id: `proj-${Date.now()}-${Math.random()}`,
        x: playerX,
        y: playerY,
        vx: Math.cos(initialAngle) * stats.speed,
        vy: -Math.sin(initialAngle) * stats.speed,
        speed: stats.speed,
        damage: stats.damage,
        radius: 5,
        life: 1.0,
        maxLife: 3.0,
        weaponType,
        targetX,
        targetY,
      });
      break;
    }
  }

  return projectiles;
}

export function updateProjectile(
  projectile: Projectile,
  dt: number,
  canvasWidth: number,
  canvasHeight: number,
  nearestEnemy?: { x: number; y: number; id: string }
): boolean {
  // Update homing projectiles
  if (projectile.weaponType === "homing" && projectile.targetX !== undefined && projectile.targetY !== undefined) {
    const dx = projectile.targetX - projectile.x;
    const dy = projectile.targetY - projectile.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 5 && nearestEnemy) {
      // Update target to nearest enemy
      projectile.targetX = nearestEnemy.x;
      projectile.targetY = nearestEnemy.y;

      // Adjust velocity toward target
      const homingStrength = WEAPON_STATS.homing.homingStrength || 0.15;
      const targetDx = projectile.targetX - projectile.x;
      const targetDy = projectile.targetY - projectile.y;
      const targetDist = Math.sqrt(targetDx * targetDx + targetDy * targetDy);

      if (targetDist > 0) {
        const targetVx = (targetDx / targetDist) * projectile.speed;
        const targetVy = (targetDy / targetDist) * projectile.speed;

        // Interpolate toward target velocity
        projectile.vx += (targetVx - projectile.vx) * homingStrength;
        projectile.vy += (targetVy - projectile.vy) * homingStrength;

        // Normalize to maintain speed
        const currentSpeed = Math.sqrt(projectile.vx * projectile.vx + projectile.vy * projectile.vy);
        if (currentSpeed > 0) {
          const scale = projectile.speed / currentSpeed;
          projectile.vx *= scale;
          projectile.vy *= scale;
        }
      }
    }
  }

  // Update position
  projectile.x += (projectile.vx * dt) / 1000;
  projectile.y += (projectile.vy * dt) / 1000;

  // Update life
  projectile.life -= dt / 1000 / projectile.maxLife;

  // Check bounds
  if (
    projectile.x < -50 ||
    projectile.x > canvasWidth + 50 ||
    projectile.y < -50 ||
    projectile.y > canvasHeight + 50 ||
    projectile.life <= 0
  ) {
    return false; // Remove projectile
  }

  return true; // Keep projectile
}

