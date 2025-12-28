import type { GameScene } from "@/games/engine/types";
import { clear, drawHudText } from "@/games/engine/ui";

type Wall = { x: number; y: number; w: number; h: number };
type Checkpoint = { x: number; y: number; r: number; collected: boolean };
type Projectile = { x: number; y: number; vx: number; vy: number; r: number; ttl: number };

/**
 * Vault Circuit: A precision game with tight windows and faster patterns.
 * Difficulty curve: Starts hard (10s), becomes very hard (30-45s), almost impossible (60-90s).
 */
export function createVaultCircuitScene(): GameScene {
  let px = 0;
  let py = 0;
  let pr = 10;
  let startedAt = 0;
  let runMs = 0;
  let dead = false;
  let score = 0;
  let highScore = 0;
  let walls: Wall[] = [];
  let checkpoints: Checkpoint[] = [];
  let projectiles: Projectile[] = [];
  let circuitScroll = 0;
  let checkpointsCollected = 0;
  let lastWallSpawn = 0;
  let lastCheckpointSpawn = 0;
  let lastProjectileSpawn = 0;
  
  // Difficulty modifiers
  let wallGapSize = 80;
  let projectileSpeed = 200;
  let projectileFrequency = 2000;
  let wallFrequency = 400;
  let checkpointFrequency = 800;

  const getDifficultyPhase = (ms: number): { phase: number; intensity: number } => {
    if (ms < 10000) return { phase: 1, intensity: 0.7 + (ms / 10000) * 0.15 };
    if (ms < 30000) return { phase: 2, intensity: 0.85 + ((ms - 10000) / 20000) * 0.10 };
    if (ms < 45000) return { phase: 3, intensity: 0.95 + ((ms - 30000) / 15000) * 0.03 };
    if (ms < 60000) return { phase: 4, intensity: 0.98 + ((ms - 45000) / 15000) * 0.015 };
    return { phase: 5, intensity: 0.995 + Math.min(0.005, (ms - 60000) / 30000 * 0.005) };
  };

  const getAdaptiveMultiplier = (): number => {
    if (checkpointsCollected === 0) return 1.0;
    const checkpointRate = checkpointsCollected / Math.max(1, Math.floor(runMs / checkpointFrequency));
    if (checkpointRate > 0.9) return 1.25; // Too easy
    if (checkpointRate < 0.4) return 0.88; // Struggling
    return 1.0;
  };

  const spawnWallPattern = (ctx: { width: number; height: number }, currentRunMs: number) => {
    const { intensity } = getDifficultyPhase(currentRunMs);
    const adaptive = getAdaptiveMultiplier();
    const effectiveIntensity = Math.min(1.0, intensity * adaptive);
    
    wallGapSize = 80 * (1.2 - effectiveIntensity * 0.6); // 80px down to 32px
    const gapY = Math.random() * (ctx.height - wallGapSize - 40) + 20;
    const wallHeight = 20 + effectiveIntensity * 15;
    
    // Top wall
    walls.push({
      x: ctx.width + 20,
      y: 0,
      w: wallHeight,
      h: gapY,
    });
    
    // Bottom wall
    walls.push({
      x: ctx.width + 20,
      y: gapY + wallGapSize,
      w: wallHeight,
      h: ctx.height - (gapY + wallGapSize),
    });
    
    // Progressive modifier: add middle obstacles in later phases
    if (effectiveIntensity > 0.7) {
      const obstacleCount = Math.floor(effectiveIntensity * 3);
      for (let i = 0; i < obstacleCount; i++) {
        const offsetX = (Math.random() - 0.5) * wallGapSize * 0.6;
        walls.push({
          x: ctx.width + 20 + Math.random() * 100,
          y: gapY + wallGapSize / 2 + offsetX,
          w: 15 + Math.random() * 10,
          h: 15 + Math.random() * 10,
        });
      }
    }
  };

  const spawnCheckpoint = (ctx: { width: number; height: number }) => {
    checkpoints.push({
      x: ctx.width + 50,
      y: ctx.height / 2 + (Math.random() - 0.5) * ctx.height * 0.4,
      r: 15,
      collected: false,
    });
  };

  const spawnProjectile = (ctx: { width: number; height: number }) => {
    const { intensity } = getDifficultyPhase(runMs);
    const adaptive = getAdaptiveMultiplier();
    const effectiveIntensity = Math.min(1.0, intensity * adaptive);
    
    projectileSpeed = 200 * (1.0 + effectiveIntensity * 1.2); // 200-440
    
    // Fire from sides or top/bottom
    const side = Math.floor(Math.random() * 4);
    let x = 0, y = 0, vx = 0, vy = 0;
    
    if (side === 0) { // Left
      x = -20;
      y = Math.random() * ctx.height;
      vx = projectileSpeed;
      vy = (Math.random() - 0.5) * projectileSpeed * 0.5;
    } else if (side === 1) { // Right
      x = ctx.width + 20;
      y = Math.random() * ctx.height;
      vx = -projectileSpeed;
      vy = (Math.random() - 0.5) * projectileSpeed * 0.5;
    } else if (side === 2) { // Top
      x = Math.random() * ctx.width;
      y = -20;
      vx = (Math.random() - 0.5) * projectileSpeed * 0.5;
      vy = projectileSpeed;
    } else { // Bottom
      x = Math.random() * ctx.width;
      y = ctx.height + 20;
      vx = (Math.random() - 0.5) * projectileSpeed * 0.5;
      vy = -projectileSpeed;
    }
    
    projectiles.push({
      x,
      y,
      vx,
      vy,
      r: 6 + effectiveIntensity * 4, // 6-10px
      ttl: 5000,
    });
    
    // Progressive modifier: spawn multiple projectiles immediately
    if (effectiveIntensity > 0.8 && Math.random() < 0.4) {
      projectiles.push({
        x: x + (Math.random() - 0.5) * 50,
        y: y + (Math.random() - 0.5) * 50,
        vx: vx * (0.8 + Math.random() * 0.4),
        vy: vy * (0.8 + Math.random() * 0.4),
        r: 6 + effectiveIntensity * 4,
        ttl: 5000,
      });
    }
  };

  const checkCircleRectCollision = (cx: number, cy: number, cr: number, r: Wall): boolean => {
    const closestX = Math.max(r.x, Math.min(cx, r.x + r.w));
    const closestY = Math.max(r.y, Math.min(cy, r.y + r.h));
    const dx = cx - closestX;
    const dy = cy - closestY;
    return dx * dx + dy * dy <= cr * cr;
  };

  const checkCircleCollision = (x1: number, y1: number, r1: number, x2: number, y2: number, r2: number): boolean => {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return dx * dx + dy * dy <= (r1 + r2) * (r1 + r2);
  };

  return {
    init() {
      px = 0;
      py = 0;
      pr = 10;
      startedAt = 0;
      runMs = 0;
      dead = false;
      score = 0;
      walls.length = 0;
      checkpoints.length = 0;
      projectiles.length = 0;
      circuitScroll = 0;
      checkpointsCollected = 0;
      lastWallSpawn = 0;
      lastCheckpointSpawn = 0;
      lastProjectileSpawn = 0;
      wallGapSize = 80;
      projectileSpeed = 200;
      projectileFrequency = 2000;
      wallFrequency = 400;
      checkpointFrequency = 800;
      
      try {
        const saved = localStorage.getItem("rn_vault_circuit_high");
        if (saved) highScore = parseInt(saved, 10) || 0;
      } catch {}
    },
    update(ctx) {
      if (!startedAt) {
        startedAt = ctx.nowMs;
        px = 80;
        py = ctx.height / 2;
      }

      if (dead) return;

      runMs = ctx.nowMs - startedAt;
      const { phase, intensity } = getDifficultyPhase(runMs);
      const adaptive = getAdaptiveMultiplier();
      const effectiveIntensity = Math.min(1.0, intensity * adaptive);

      // Update difficulty
      wallFrequency = 400 * (1.1 - effectiveIntensity * 0.5);
      projectileFrequency = 2000 * (1.2 - effectiveIntensity * 0.7);
      checkpointFrequency = 800 * (1.1 - effectiveIntensity * 0.4);

      // Player movement (precise, fast)
      const speed = ctx.settings.reduceMotion ? 280 : 360;
      px += (ctx.input.moveX * speed * ctx.dtMs) / 1000;
      py += (ctx.input.moveY * speed * ctx.dtMs) / 1000;
      px = Math.max(pr, Math.min(ctx.width - pr, px));
      py = Math.max(pr, Math.min(ctx.height - pr, py));

      // Scroll circuit
      circuitScroll += 250 * ctx.dtMs / 1000;
      const scrollDelta = 250 * ctx.dtMs / 1000;

      // Update walls
      for (const wall of walls) {
        wall.x -= scrollDelta;
      }
      walls = walls.filter(w => w.x > -100);

      // Update checkpoints
      for (const checkpoint of checkpoints) {
        checkpoint.x -= scrollDelta;
        if (!checkpoint.collected && checkCircleCollision(px, py, pr, checkpoint.x, checkpoint.y, checkpoint.r)) {
          checkpoint.collected = true;
          checkpointsCollected++;
          score += 200;
        }
      }
      checkpoints = checkpoints.filter(c => !c.collected || c.x > -100);

      // Update projectiles
      for (const proj of projectiles) {
        proj.x += (proj.vx * ctx.dtMs) / 1000;
        proj.y += (proj.vy * ctx.dtMs) / 1000;
        proj.ttl -= ctx.dtMs;
        
        if (checkCircleCollision(px, py, pr, proj.x, proj.y, proj.r)) {
          dead = true;
          if (score > highScore) {
            highScore = score;
            try {
              localStorage.setItem("rn_vault_circuit_high", String(highScore));
            } catch {}
          }
          break;
        }
      }
      projectiles = projectiles.filter(p => p.ttl > 0 && p.x > -50 && p.x < ctx.width + 50 && p.y > -50 && p.y < ctx.height + 50);

      // Spawn new walls
      if (circuitScroll - lastWallSpawn >= wallFrequency) {
        spawnWallPattern(ctx, runMs);
        lastWallSpawn = circuitScroll;
      }

      // Spawn checkpoints
      if (circuitScroll - lastCheckpointSpawn >= checkpointFrequency && Math.random() < 0.7) {
        spawnCheckpoint(ctx);
        lastCheckpointSpawn = circuitScroll;
      }

      // Spawn projectiles
      if (runMs - lastProjectileSpawn >= projectileFrequency) {
        spawnProjectile(ctx, runMs);
        lastProjectileSpawn = runMs;
      }

      // Check wall collisions
      for (const wall of walls) {
        if (checkCircleRectCollision(px, py, pr, wall)) {
          dead = true;
          if (score > highScore) {
            highScore = score;
            try {
              localStorage.setItem("rn_vault_circuit_high", String(highScore));
            } catch {}
          }
          break;
        }
      }

      // Time bonus (precision rewards)
      score += Math.floor(ctx.dtMs / 30);
    },
    render(ctx) {
      clear(ctx.ctx2d, ctx.width, ctx.height);

      // High contrast background
      ctx.ctx2d.save();
      ctx.ctx2d.fillStyle = "#0f0f1f";
      ctx.ctx2d.fillRect(0, 0, ctx.width, ctx.height);
      ctx.ctx2d.restore();

      // Walls (high contrast, show gap clearly)
      for (const wall of walls) {
        ctx.ctx2d.save();
        ctx.ctx2d.fillStyle = "#ff4444";
        ctx.ctx2d.fillRect(wall.x, wall.y, wall.w, wall.h);
        ctx.ctx2d.strokeStyle = "#ffffff";
        ctx.ctx2d.lineWidth = 3;
        ctx.ctx2d.strokeRect(wall.x, wall.y, wall.w, wall.h);
        ctx.ctx2d.restore();
      }

      // Checkpoints (high contrast, glowing)
      for (const checkpoint of checkpoints) {
        ctx.ctx2d.save();
        if (checkpoint.collected) {
          ctx.ctx2d.fillStyle = "rgba(0, 255, 136, 0.5)";
        } else {
          ctx.ctx2d.shadowBlur = 20;
          ctx.ctx2d.shadowColor = "#00ff88";
          ctx.ctx2d.fillStyle = "#00ff88";
        }
        ctx.ctx2d.beginPath();
        ctx.ctx2d.arc(checkpoint.x, checkpoint.y, checkpoint.r, 0, Math.PI * 2);
        ctx.ctx2d.fill();
        if (!checkpoint.collected) {
          ctx.ctx2d.strokeStyle = "#ffffff";
          ctx.ctx2d.lineWidth = 2;
          ctx.ctx2d.stroke();
        }
        ctx.ctx2d.restore();
      }

      // Projectiles (high contrast, pulsing)
      for (const proj of projectiles) {
        ctx.ctx2d.save();
        const pulse = 0.8 + 0.2 * Math.sin(proj.ttl / 100);
        ctx.ctx2d.shadowBlur = 15;
        ctx.ctx2d.shadowColor = "#ff6600";
        ctx.ctx2d.fillStyle = `rgba(255, 150, 0, ${pulse})`;
        ctx.ctx2d.beginPath();
        ctx.ctx2d.arc(proj.x, proj.y, proj.r, 0, Math.PI * 2);
        ctx.ctx2d.fill();
        ctx.ctx2d.strokeStyle = "#ffffff";
        ctx.ctx2d.lineWidth = 2;
        ctx.ctx2d.stroke();
        ctx.ctx2d.restore();
      }

      // Player (high contrast, precise indicator)
      ctx.ctx2d.save();
      ctx.ctx2d.shadowBlur = 20;
      ctx.ctx2d.shadowColor = "#00aaff";
      ctx.ctx2d.fillStyle = "#00aaff";
      ctx.ctx2d.beginPath();
      ctx.ctx2d.arc(px, py, pr, 0, Math.PI * 2);
      ctx.ctx2d.fill();
      ctx.ctx2d.strokeStyle = "#ffffff";
      ctx.ctx2d.lineWidth = 3;
      ctx.ctx2d.stroke();
      // Inner dot for precision
      ctx.ctx2d.fillStyle = "#ffffff";
      ctx.ctx2d.beginPath();
      ctx.ctx2d.arc(px, py, 3, 0, Math.PI * 2);
      ctx.ctx2d.fill();
      ctx.ctx2d.restore();

      // HUD
      const phase = getDifficultyPhase(runMs).phase;
      const timeS = (runMs / 1000).toFixed(1);
      drawHudText(ctx.ctx2d, `Vault Circuit`, 16, 26);
      drawHudText(ctx.ctx2d, `Time: ${timeS}s | Score: ${score.toLocaleString()} | Checkpoints: ${checkpointsCollected} | Phase ${phase}`, 16, 48);
      if (highScore > 0) {
        drawHudText(ctx.ctx2d, `High: ${highScore.toLocaleString()}`, 16, 70);
      }

      if (dead) {
        ctx.ctx2d.save();
        ctx.ctx2d.fillStyle = "rgba(0, 0, 0, 0.75)";
        ctx.ctx2d.fillRect(0, 0, ctx.width, ctx.height);
        ctx.ctx2d.restore();
        drawHudText(ctx.ctx2d, "Circuit Failed", ctx.width / 2 - 70, ctx.height / 2 - 40);
        drawHudText(ctx.ctx2d, `Final Score: ${score.toLocaleString()}`, ctx.width / 2 - 80, ctx.height / 2);
        drawHudText(ctx.ctx2d, `Checkpoints: ${checkpointsCollected}`, ctx.width / 2 - 70, ctx.height / 2 + 30);
        if (score === highScore) {
          drawHudText(ctx.ctx2d, "New High Score!", ctx.width / 2 - 70, ctx.height / 2 + 60);
        }
      }
    },
    dispose() {
      // no-op
    },
  };
}

