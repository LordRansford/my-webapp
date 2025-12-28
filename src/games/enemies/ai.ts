// Enhanced enemy AI patterns

import type { Enemy, EnemyPattern } from "./types";

export function updateEnemyPattern(
  enemy: Enemy,
  playerX: number,
  playerY: number,
  dt: number,
  canvasWidth: number,
  canvasHeight: number
): void {
  switch (enemy.pattern) {
    case "straight":
      // Simple vertical movement (default)
      break;

    case "homing": {
      if (!enemy.patternData?.homing) {
        enemy.patternData = {
          homing: {
            targetX: playerX,
            targetY: playerY,
            prediction: 0.3, // Predict 30% ahead
          },
        };
      }

      const homing = enemy.patternData.homing;
      // Update target with prediction
      const dx = playerX - enemy.x;
      const dy = playerY - enemy.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = enemy.speed;

      // Predict player movement
      const predictionTime = dist / speed * homing.prediction;
      homing.targetX = playerX;
      homing.targetY = playerY;

      // Move toward predicted position
      const targetDx = homing.targetX - enemy.x;
      const targetDy = homing.targetY - enemy.y;
      const targetDist = Math.sqrt(targetDx * targetDx + targetDy * targetDy);

      if (targetDist > 5) {
        const moveX = (targetDx / targetDist) * speed * (dt / 1000);
        const moveY = (targetDy / targetDist) * speed * (dt / 1000);
        enemy.x += moveX;
        enemy.y += moveY * 1.2; // Still move down primarily
      } else {
        enemy.y += speed * (dt / 1000);
      }
      break;
    }

    case "zigzag": {
      if (!enemy.patternData?.zigzag) {
        enemy.patternData = {
          zigzag: {
            direction: 1, // 1 or -1
            amplitude: 40,
            frequency: 2, // cycles per second
          },
        };
      }

      const zigzag = enemy.patternData.zigzag;
      const time = Date.now() / 1000;
      const horizontalOffset = Math.sin(time * zigzag.frequency * Math.PI * 2) * zigzag.amplitude;
      enemy.x += horizontalOffset * (dt / 1000) * zigzag.direction;
      enemy.y += enemy.speed * (dt / 1000);

      // Bounce off edges
      if (enemy.x < enemy.w / 2 || enemy.x > canvasWidth - enemy.w / 2) {
        zigzag.direction *= -1;
      }
      break;
    }

    case "spiral": {
      if (!enemy.patternData?.spiral) {
        enemy.patternData = {
          spiral: {
            angle: 0,
            radius: 30,
            centerX: enemy.x,
            centerY: enemy.y,
          },
        };
      }

      const spiral = enemy.patternData.spiral;
      spiral.angle += (dt / 1000) * 3; // Rotate 3 radians per second
      spiral.radius += (dt / 1000) * 20; // Expand radius

      enemy.x = spiral.centerX + Math.cos(spiral.angle) * spiral.radius;
      enemy.y = spiral.centerY + Math.sin(spiral.angle) * spiral.radius;
      spiral.centerY += enemy.speed * (dt / 1000); // Move center down
      break;
    }

    case "formation": {
      // Formation enemies move together (handled by formation system)
      enemy.y += enemy.speed * (dt / 1000);
      break;
    }

    case "kamikaze": {
      // Direct path to player, very fast
      const dx = playerX - enemy.x;
      const dy = playerY - enemy.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 5) {
        const speed = enemy.speed * 1.5; // 50% faster
        enemy.x += (dx / dist) * speed * (dt / 1000);
        enemy.y += (dy / dist) * speed * (dt / 1000);
      }
      break;
    }
  }
}

export function shouldSpawnHomingEnemy(
  playerStationary: boolean,
  playerStationaryTime: number,
  baseHomingChance: number
): boolean {
  if (playerStationary && playerStationaryTime > 2000) {
    // Much higher chance if player stands still
    return Math.random() < baseHomingChance * 3;
  }
  return Math.random() < baseHomingChance;
}

