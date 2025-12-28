import type { GameScene } from "@/games/engine/types";
import { clear, drawHudText } from "@/games/engine/ui";

type Gate = { x: number; y: number; w: number; h: number; passed: boolean };
type Obstacle = { x: number; y: number; w: number; h: number };

/**
 * Skyline Drift: A momentum-based game focusing on smooth turns and clean lines.
 * Difficulty curve: Starts hard (10s), becomes very hard (30-45s), almost impossible (60-90s).
 */
export function createSkylineDriftScene(): GameScene {
  let px = 0;
  let py = 0;
  let vx = 0;
  let vy = 0;
  let angle = 0; // Ship angle in radians
  let startedAt = 0;
  let runMs = 0;
  let dead = false;
  let score = 0;
  let highScore = 0;
  let gates: Gate[] = [];
  let obstacles: Obstacle[] = [];
  let scrollY = 0;
  let gatesPassed = 0;
  let perfectPasses = 0;
  let lastGateSpawn = 0;
  
  // Difficulty modifiers
  let gateFrequency = 600;
  let gateWidth = 120;
  let obstacleDensity = 0.3;
  let scrollSpeed = 200;

  const SHIP_SIZE = 16;
  const MOMENTUM_DECAY = 0.92; // Momentum decay per frame
  const TURN_SPEED = 0.08; // Radians per frame
  const THRUST_POWER = 300;

  const getDifficultyPhase = (ms: number): { phase: number; intensity: number } => {
    if (ms < 10000) return { phase: 1, intensity: 0.7 + (ms / 10000) * 0.15 };
    if (ms < 30000) return { phase: 2, intensity: 0.85 + ((ms - 10000) / 20000) * 0.10 };
    if (ms < 45000) return { phase: 3, intensity: 0.95 + ((ms - 30000) / 15000) * 0.03 };
    if (ms < 60000) return { phase: 4, intensity: 0.98 + ((ms - 45000) / 15000) * 0.015 };
    return { phase: 5, intensity: 0.995 + Math.min(0.005, (ms - 60000) / 30000 * 0.005) };
  };

  const getAdaptiveMultiplier = (): number => {
    if (gatesPassed === 0) return 1.0;
    const perfectRate = perfectPasses / gatesPassed;
    if (perfectRate > 0.8) return 1.2; // Too easy, ramp faster
    if (perfectRate < 0.3) return 0.9; // Struggling, ramp slower
    return 1.0;
  };

  const spawnGate = (ctx: { width: number; height: number }) => {
    const { intensity } = getDifficultyPhase(runMs);
    const adaptive = getAdaptiveMultiplier();
    const effectiveIntensity = Math.min(1.0, intensity * adaptive);
    
    gateWidth = 120 * (1.2 - effectiveIntensity * 0.5); // 120px down to 60px
    const centerX = ctx.width / 2 + (Math.random() - 0.5) * ctx.width * 0.4 * effectiveIntensity; // Wider variance
    const y = scrollY - ctx.height * 0.2;
    
    gates.push({
      x: centerX - gateWidth / 2,
      y,
      w: gateWidth,
      h: 30,
      passed: false,
    });
    
    // Progressive modifier: add obstacles near gates in later phases
    if (effectiveIntensity > 0.8) {
      const obstacleCount = Math.floor(effectiveIntensity * 4);
      for (let i = 0; i < obstacleCount; i++) {
        const offsetX = (Math.random() - 0.5) * ctx.width * 0.6;
        obstacles.push({
          x: centerX + offsetX,
          y: y + (Math.random() - 0.5) * 100,
          w: 20 + Math.random() * 20,
          h: 20 + Math.random() * 20,
        });
      }
    }
  };

  const checkRectCollision = (
    x: number, y: number, w: number, h: number,
    ox: number, oy: number, ow: number, oh: number
  ): boolean => {
    return x < ox + ow && x + w > ox && y < oy + oh && y + h > oy;
  };

  const checkGatePass = (gate: Gate): boolean => {
    const shipLeft = px - SHIP_SIZE;
    const shipRight = px + SHIP_SIZE;
    const shipTop = py - SHIP_SIZE;
    const shipBottom = py + SHIP_SIZE;
    
    return shipLeft >= gate.x && shipRight <= gate.x + gate.w &&
           shipTop <= gate.y + gate.h && shipBottom >= gate.y;
  };

  return {
    init() {
      px = 0;
      py = 0;
      vx = 0;
      vy = 0;
      angle = Math.PI / 2; // Point up
      startedAt = 0;
      runMs = 0;
      dead = false;
      score = 0;
      gates.length = 0;
      obstacles.length = 0;
      scrollY = 0;
      gatesPassed = 0;
      perfectPasses = 0;
      lastGateSpawn = 0;
      gateFrequency = 600;
      gateWidth = 120;
      obstacleDensity = 0.3;
      scrollSpeed = 200;
      
      try {
        const saved = localStorage.getItem("rn_skyline_drift_high");
        if (saved) highScore = parseInt(saved, 10) || 0;
      } catch {}
    },
    update(ctx) {
      if (!startedAt) {
        startedAt = ctx.nowMs;
        px = ctx.width / 2;
        py = ctx.height * 0.75;
      }

      if (dead) return;

      runMs = ctx.nowMs - startedAt;
      const { phase, intensity } = getDifficultyPhase(runMs);
      const adaptive = getAdaptiveMultiplier();
      const effectiveIntensity = Math.min(1.0, intensity * adaptive);

      // Update difficulty
      gateFrequency = 600 * (1.1 - effectiveIntensity * 0.5);
      obstacleDensity = 0.3 * (1.0 + effectiveIntensity * 1.5);
      scrollSpeed = 200 * (1.0 + effectiveIntensity * 0.8);

      // Player controls - momentum-based movement
      const turnInput = ctx.input.moveX;
      angle += turnInput * TURN_SPEED;
      
      // Apply thrust in direction of movement
      if (ctx.input.moveY < 0 || Math.abs(ctx.input.moveX) > 0) {
        const thrustX = Math.sin(angle) * THRUST_POWER;
        const thrustY = -Math.cos(angle) * THRUST_POWER;
        vx += thrustX * ctx.dtMs / 1000;
        vy += thrustY * ctx.dtMs / 1000;
      }
      
      // Apply momentum decay
      vx *= Math.pow(MOMENTUM_DECAY, ctx.dtMs / 16.67);
      vy *= Math.pow(MOMENTUM_DECAY, ctx.dtMs / 16.67);
      
      // Update position
      px += vx * ctx.dtMs / 1000;
      py += vy * ctx.dtMs / 1000;
      
      // Boundary checks (soft walls)
      if (px < SHIP_SIZE) {
        px = SHIP_SIZE;
        vx *= -0.5;
      }
      if (px > ctx.width - SHIP_SIZE) {
        px = ctx.width - SHIP_SIZE;
        vx *= -0.5;
      }
      if (py < SHIP_SIZE) {
        py = SHIP_SIZE;
        vy *= -0.5;
      }
      if (py > ctx.height - SHIP_SIZE) {
        py = ctx.height - SHIP_SIZE;
        vy *= -0.5;
      }

      // Scroll world
      scrollY += scrollSpeed * ctx.dtMs / 1000;
      const scrollDelta = scrollSpeed * ctx.dtMs / 1000;
      
      // Update gates and check passes
      for (const gate of gates) {
        gate.y += scrollDelta;
        
        if (!gate.passed && checkGatePass(gate)) {
          gate.passed = true;
          gatesPassed++;
          
          // Perfect pass: centered
          const gateCenter = gate.x + gate.w / 2;
          const distFromCenter = Math.abs(px - gateCenter);
          const isPerfect = distFromCenter < gate.w / 4;
          if (isPerfect) perfectPasses++;
          
          const basePoints = 100;
          const bonus = isPerfect ? 50 : 0;
          const speedBonus = Math.floor(Math.sqrt(vx * vx + vy * vy) / 10);
          score += basePoints + bonus + speedBonus;
        }
      }
      
      // Remove passed gates
      gates = gates.filter(g => !g.passed || g.y < ctx.height + 100);
      
      // Update obstacles
      for (const obs of obstacles) {
        obs.y += scrollDelta;
      }
      obstacles = obstacles.filter(obs => obs.y < ctx.height + 100);

      // Spawn new gates
      if (scrollY - lastGateSpawn >= gateFrequency) {
        spawnGate(ctx);
        lastGateSpawn = scrollY;
      }
      
      // Spawn obstacles between gates (progressive modifier)
      if (effectiveIntensity > 0.6 && Math.random() < obstacleDensity * ctx.dtMs / 1000) {
        obstacles.push({
          x: Math.random() * ctx.width,
          y: scrollY - 50,
          w: 25 + Math.random() * 30,
          h: 25 + Math.random() * 30,
        });
      }

      // Check collisions with obstacles
      const shipRect = {
        x: px - SHIP_SIZE,
        y: py - SHIP_SIZE,
        w: SHIP_SIZE * 2,
        h: SHIP_SIZE * 2,
      };
      
      for (const obs of obstacles) {
        if (checkRectCollision(shipRect.x, shipRect.y, shipRect.w, shipRect.h, obs.x, obs.y, obs.w, obs.h)) {
          dead = true;
          if (score > highScore) {
            highScore = score;
            try {
              localStorage.setItem("rn_skyline_drift_high", String(highScore));
            } catch {}
          }
          break;
        }
      }

      // Time bonus
      score += Math.floor(ctx.dtMs / 50);
    },
    render(ctx) {
      clear(ctx.ctx2d, ctx.width, ctx.height);

      // High contrast background with gradient
      ctx.ctx2d.save();
      const gradient = ctx.ctx2d.createLinearGradient(0, 0, 0, ctx.height);
      gradient.addColorStop(0, "#0a0e27");
      gradient.addColorStop(1, "#1a1f3a");
      ctx.ctx2d.fillStyle = gradient;
      ctx.ctx2d.fillRect(0, 0, ctx.width, ctx.height);
      ctx.ctx2d.restore();

      // Gates (high contrast with glow)
      for (const gate of gates) {
        ctx.ctx2d.save();
        if (gate.passed) {
          ctx.ctx2d.fillStyle = "rgba(0, 255, 136, 0.3)";
        } else {
          ctx.ctx2d.shadowBlur = 20;
          ctx.ctx2d.shadowColor = "#00ff88";
          ctx.ctx2d.fillStyle = "rgba(0, 255, 136, 0.6)";
        }
        ctx.ctx2d.fillRect(gate.x, gate.y, gate.w, gate.h);
        ctx.ctx2d.strokeStyle = "#00ff88";
        ctx.ctx2d.lineWidth = 3;
        ctx.ctx2d.strokeRect(gate.x, gate.y, gate.w, gate.h);
        ctx.ctx2d.restore();
      }

      // Obstacles (high contrast with glow)
      for (const obs of obstacles) {
        ctx.ctx2d.save();
        ctx.ctx2d.shadowBlur = 15;
        ctx.ctx2d.shadowColor = "#ff6666";
        ctx.ctx2d.fillStyle = "rgba(255, 100, 100, 0.9)";
        ctx.ctx2d.fillRect(obs.x, obs.y, obs.w, obs.h);
        ctx.ctx2d.strokeStyle = "#ffffff";
        ctx.ctx2d.lineWidth = 2;
        ctx.ctx2d.strokeRect(obs.x, obs.y, obs.w, obs.h);
        ctx.ctx2d.restore();
      }

      // Player ship (momentum-based, shows direction) with high contrast
      ctx.ctx2d.save();
      ctx.ctx2d.translate(px, py);
      ctx.ctx2d.rotate(angle);
      
      // Ship body with glow
      ctx.ctx2d.shadowBlur = 20;
      ctx.ctx2d.shadowColor = "#00aaff";
      ctx.ctx2d.fillStyle = "#00aaff";
      ctx.ctx2d.beginPath();
      ctx.ctx2d.moveTo(0, -SHIP_SIZE);
      ctx.ctx2d.lineTo(-SHIP_SIZE * 0.7, SHIP_SIZE * 0.5);
      ctx.ctx2d.lineTo(0, SHIP_SIZE * 0.3);
      ctx.ctx2d.lineTo(SHIP_SIZE * 0.7, SHIP_SIZE * 0.5);
      ctx.ctx2d.closePath();
      ctx.ctx2d.fill();
      
      // Outline for extra contrast
      ctx.ctx2d.strokeStyle = "#ffffff";
      ctx.ctx2d.lineWidth = 3;
      ctx.ctx2d.stroke();
      
      // Thrust indicator (if moving) - calculate speed for both thrust and HUD
      const speed = Math.sqrt(vx * vx + vy * vy);
      if (speed > 50) {
        ctx.ctx2d.fillStyle = `rgba(255, 200, 0, ${Math.min(1, speed / 200)})`;
        ctx.ctx2d.beginPath();
        ctx.ctx2d.moveTo(-SHIP_SIZE * 0.4, SHIP_SIZE * 0.3);
        ctx.ctx2d.lineTo(0, SHIP_SIZE * 0.7);
        ctx.ctx2d.lineTo(SHIP_SIZE * 0.4, SHIP_SIZE * 0.3);
        ctx.ctx2d.closePath();
        ctx.ctx2d.fill();
      }
      
      ctx.ctx2d.restore();

      // HUD
      const phase = getDifficultyPhase(runMs).phase;
      const timeS = (runMs / 1000).toFixed(1);
      drawHudText(ctx.ctx2d, `Skyline Drift`, 16, 26);
      drawHudText(ctx.ctx2d, `Time: ${timeS}s | Score: ${score.toLocaleString()} | Gates: ${gatesPassed} | Phase ${phase}`, 16, 48);
      drawHudText(ctx.ctx2d, `Speed: ${speed.toFixed(0)} | Perfect: ${perfectPasses}`, 16, 70);
      if (highScore > 0) {
        drawHudText(ctx.ctx2d, `High: ${highScore.toLocaleString()}`, 16, 92);
      }

      if (dead) {
        ctx.ctx2d.save();
        ctx.ctx2d.fillStyle = "rgba(0, 0, 0, 0.75)";
        ctx.ctx2d.fillRect(0, 0, ctx.width, ctx.height);
        ctx.ctx2d.restore();
        drawHudText(ctx.ctx2d, "Crash!", ctx.width / 2 - 40, ctx.height / 2 - 40);
        drawHudText(ctx.ctx2d, `Final Score: ${score.toLocaleString()}`, ctx.width / 2 - 80, ctx.height / 2);
        drawHudText(ctx.ctx2d, `Gates: ${gatesPassed} | Perfect: ${perfectPasses}`, ctx.width / 2 - 100, ctx.height / 2 + 30);
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

