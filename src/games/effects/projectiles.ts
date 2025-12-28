// Projectile rendering and visual effects

import type { Projectile } from "@/games/shooting/types";

export function renderProjectile(ctx: CanvasRenderingContext2D, projectile: Projectile, reduceMotion: boolean) {
  ctx.save();

  // Weapon-specific visuals
  switch (projectile.weaponType) {
    case "basic": {
      ctx.fillStyle = "#00ffff";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#00ffff";
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case "spread": {
      ctx.fillStyle = "#ffff00";
      ctx.shadowBlur = 12;
      ctx.shadowColor = "#ffff00";
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case "multi": {
      ctx.fillStyle = "#ff00ff";
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#ff00ff";
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case "laser": {
      // Laser beam - draw as a line from player to projectile
      ctx.strokeStyle = "#00ff00";
      ctx.lineWidth = 8;
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#00ff00";
      ctx.beginPath();
      ctx.moveTo(projectile.x, projectile.y + 100); // From below (player position)
      ctx.lineTo(projectile.x, projectile.y);
      ctx.stroke();
      // Also draw the projectile itself
      ctx.fillStyle = "#00ff00";
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case "homing": {
      ctx.fillStyle = "#ff8800";
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#ff8800";
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
      ctx.fill();
      // Draw trail for homing
      if (!reduceMotion) {
        ctx.strokeStyle = "#ff8800";
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(projectile.x - projectile.vx * 0.1, projectile.y - projectile.vy * 0.1);
        ctx.lineTo(projectile.x, projectile.y);
        ctx.stroke();
      }
      break;
    }
  }

  ctx.restore();
}

