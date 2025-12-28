import type { GameScene } from "@/games/engine/types";
import { clear, drawHudText } from "@/games/engine/ui";

type Pulse = { x: number; y: number; r: number; speed: number; color: string; dodged: boolean };
type ScoreEvent = { time: number; type: "dodge" | "miss"; points: number };

/**
 * Pulse Runner: A dodge game focusing on timing and rhythm.
 * Difficulty curve: Starts hard (10s), becomes very hard (30-45s), almost impossible (60-90s).
 */
export function createPulseRunnerScene(): GameScene {
  let px = 0;
  let py = 0;
  let pr = 12;
  let startedAt = 0;
  let runMs = 0;
  let dead = false;
  let score = 0;
  let highScore = 0;
  let pulses: Pulse[] = [];
  let lastSpawnMs = 0;
  let dodgedCount = 0;
  let pulsesSpawned = 0;
  
  // Difficulty modifiers
  let baseSpeed = 180;
  let spawnRate = 800;
  let pulseSizeMultiplier = 1.0;
  let pulseCountMultiplier = 1.0;
  
  const scoreEvents: ScoreEvent[] = [];
  let adaptiveDifficultyScore = 0; // Tracks performance for adaptive difficulty

  const getDifficultyPhase = (ms: number): { phase: number; intensity: number } => {
    // Phase 1: 0-10s - Start hard
    if (ms < 10000) return { phase: 1, intensity: 0.7 + (ms / 10000) * 0.15 };
    // Phase 2: 10-30s - Ramp up to very hard
    if (ms < 30000) return { phase: 2, intensity: 0.85 + ((ms - 10000) / 20000) * 0.10 };
    // Phase 3: 30-45s - Very hard
    if (ms < 45000) return { phase: 3, intensity: 0.95 + ((ms - 30000) / 15000) * 0.03 };
    // Phase 4: 45-60s - Transition to almost impossible
    if (ms < 60000) return { phase: 4, intensity: 0.98 + ((ms - 45000) / 15000) * 0.015 };
    // Phase 5: 60-90s - Almost impossible
    return { phase: 5, intensity: 0.995 + Math.min(0.005, (ms - 60000) / 30000 * 0.005) };
  };

  const getAdaptiveMultiplier = (): number => {
    // If player is doing well (high dodge rate), ramp faster
    if (pulsesSpawned === 0) return 1.0;
    const dodgeRate = dodgedCount / pulsesSpawned;
    if (dodgeRate > 0.85) return 1.15; // Ramp faster if too easy
    if (dodgeRate < 0.4) return 0.92; // Ramp slower if struggling
    return 1.0; // Normal ramp
  };

  const spawnPulse = (ctx: { width: number; height: number }) => {
    const { intensity } = getDifficultyPhase(runMs);
    const adaptive = getAdaptiveMultiplier();
    const effectiveIntensity = Math.min(1.0, intensity * adaptive);
    
    // Progressive modifiers
    const size = 16 + (effectiveIntensity * 20); // 16-36px
    const speed = baseSpeed * (0.8 + effectiveIntensity * 0.6); // 144-288
    const spawnDelay = spawnRate * (1.1 - effectiveIntensity * 0.5); // Faster spawns
    
    // Spawn from random edge
    const edge = Math.floor(Math.random() * 4);
    let x = 0, y = 0;
    const margin = size + 10;
    
    if (edge === 0) { // Top
      x = Math.random() * ctx.width;
      y = -margin;
    } else if (edge === 1) { // Right
      x = ctx.width + margin;
      y = Math.random() * ctx.height;
    } else if (edge === 2) { // Bottom
      x = Math.random() * ctx.width;
      y = ctx.height + margin;
    } else { // Left
      x = -margin;
      y = Math.random() * ctx.height;
    }
    
    // Calculate direction toward player
    const dx = px - x;
    const dy = py - y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const vx = (dx / dist) * speed;
    const vy = (dy / dist) * speed;
    
    // Color based on intensity (progressive modifier)
    const hue = 200 + (effectiveIntensity * 120); // Blue to red
    const saturation = 70 + (effectiveIntensity * 30);
    const color = `hsla(${hue}, ${saturation}%, 60%, 0.95)`;
    
    pulses.push({ x, y, r: size / 2, speed, color, dodged: false });
    pulsesSpawned++;
  };

  const checkCollision = (p: Pulse): boolean => {
    const dx = p.x - px;
    const dy = p.y - py;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist < pr + p.r;
  };

  return {
    init() {
      px = 0;
      py = 0;
      pr = 12;
      startedAt = 0;
      runMs = 0;
      dead = false;
      score = 0;
      pulses.length = 0;
      lastSpawnMs = 0;
      dodgedCount = 0;
      pulsesSpawned = 0;
      baseSpeed = 180;
      spawnRate = 800;
      pulseSizeMultiplier = 1.0;
      pulseCountMultiplier = 1.0;
      scoreEvents.length = 0;
      adaptiveDifficultyScore = 0;
      
      // Load high score from localStorage
      try {
        const saved = localStorage.getItem("rn_pulse_runner_high");
        if (saved) highScore = parseInt(saved, 10) || 0;
      } catch {}
    },
    update(ctx) {
      if (!startedAt) {
        startedAt = ctx.nowMs;
        px = ctx.width / 2;
        py = ctx.height / 2;
      }

      if (dead) return;

      runMs = ctx.nowMs - startedAt;
      const { phase, intensity } = getDifficultyPhase(runMs);

      // Update difficulty based on phase and performance
      const adaptive = getAdaptiveMultiplier();
      baseSpeed = 180 * (0.8 + intensity * 0.6 * adaptive);
      spawnRate = 800 * (1.1 - intensity * 0.5 / adaptive);
      pulseSizeMultiplier = 1.0 + intensity * 0.5;
      pulseCountMultiplier = intensity;

      // Player movement
      const speed = ctx.settings.reduceMotion ? 220 : 280;
      px += (ctx.input.moveX * speed * ctx.dtMs) / 1000;
      py += (ctx.input.moveY * speed * ctx.dtMs) / 1000;
      px = Math.max(pr, Math.min(ctx.width - pr, px));
      py = Math.max(pr, Math.min(ctx.height - pr, py));

      // Spawn pulses
      if (runMs >= lastSpawnMs + spawnRate) {
        spawnPulse(ctx);
        lastSpawnMs = runMs;
        
        // Progressive modifier: spawn multiple pulses in later phases
        if (phase >= 4 && Math.random() < 0.4) {
          spawnPulse(ctx); // Immediate second pulse
        }
        if (phase >= 5 && Math.random() < 0.3) {
          spawnPulse(ctx); // Immediate third pulse
        }
      }

      // Update pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        const dx = px - p.x;
        const dy = py - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const vx = (dx / dist) * p.speed;
        const vy = (dy / dist) * p.speed;
        
        p.x += (vx * ctx.dtMs) / 1000;
        p.y += (vy * ctx.dtMs) / 1000;

        // Check if pulse passed player (dodge) - only count once
        if (!p.dodged) {
          const oldDist = Math.sqrt((p.x - vx * ctx.dtMs / 1000 - px) ** 2 + (p.y - vy * ctx.dtMs / 1000 - py) ** 2);
          const newDist = Math.sqrt((p.x - px) ** 2 + (p.y - py) ** 2);
          if (oldDist < newDist && newDist > pr + p.r + 10) {
            // Pulse passed by safely
            p.dodged = true;
            dodgedCount++;
            const points = Math.floor(10 * (1 + intensity));
            score += points;
            scoreEvents.push({ time: runMs, type: "dodge", points });
            adaptiveDifficultyScore += points;
          }
        }

        // Remove if far off screen
        if (p.x < -100 || p.x > ctx.width + 100 || p.y < -100 || p.y > ctx.height + 100) {
          pulses.splice(i, 1);
          continue;
        }

        // Check collision
        if (checkCollision(p)) {
          dead = true;
          if (score > highScore) {
            highScore = score;
            try {
              localStorage.setItem("rn_pulse_runner_high", String(highScore));
            } catch {}
          }
          break;
        }
      }

      // Scoring: time bonus
      score += Math.floor(ctx.dtMs / 100); // 10 points per second
    },
    render(ctx) {
      clear(ctx.ctx2d, ctx.width, ctx.height);

      // High contrast background
      ctx.ctx2d.save();
      ctx.ctx2d.fillStyle = "#0a0e1a";
      ctx.ctx2d.fillRect(0, 0, ctx.width, ctx.height);
      ctx.ctx2d.restore();

      // Grid lines for depth (subtle)
      ctx.ctx2d.save();
      ctx.ctx2d.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.ctx2d.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < ctx.width; x += gridSize) {
        ctx.ctx2d.beginPath();
        ctx.ctx2d.moveTo(x, 0);
        ctx.ctx2d.lineTo(x, ctx.height);
        ctx.ctx2d.stroke();
      }
      for (let y = 0; y < ctx.height; y += gridSize) {
        ctx.ctx2d.beginPath();
        ctx.ctx2d.moveTo(0, y);
        ctx.ctx2d.lineTo(ctx.width, y);
        ctx.ctx2d.stroke();
      }
      ctx.ctx2d.restore();

      // Pulses with high contrast outlines
      for (const p of pulses) {
        ctx.ctx2d.save();
        // Outer glow for visibility
        ctx.ctx2d.shadowBlur = 20;
        ctx.ctx2d.shadowColor = p.color;
        ctx.ctx2d.fillStyle = p.color;
        ctx.ctx2d.beginPath();
        ctx.ctx2d.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.ctx2d.fill();
        // Outline for extra contrast
        ctx.ctx2d.strokeStyle = "#ffffff";
        ctx.ctx2d.lineWidth = 2;
        ctx.ctx2d.stroke();
        ctx.ctx2d.restore();
      }

      // Player with high contrast
      ctx.ctx2d.save();
      ctx.ctx2d.shadowBlur = 15;
      ctx.ctx2d.shadowColor = "#00ff88";
      ctx.ctx2d.fillStyle = "#00ff88";
      ctx.ctx2d.beginPath();
      ctx.ctx2d.arc(px, py, pr, 0, Math.PI * 2);
      ctx.ctx2d.fill();
      ctx.ctx2d.strokeStyle = "#ffffff";
      ctx.ctx2d.lineWidth = 3;
      ctx.ctx2d.stroke();
      // Inner highlight
      ctx.ctx2d.fillStyle = "#88ffcc";
      ctx.ctx2d.beginPath();
      ctx.ctx2d.arc(px - 3, py - 3, pr * 0.4, 0, Math.PI * 2);
      ctx.ctx2d.fill();
      ctx.ctx2d.restore();

      // HUD
      const phase = getDifficultyPhase(runMs).phase;
      const timeS = (runMs / 1000).toFixed(1);
      drawHudText(ctx.ctx2d, `Pulse Runner`, 16, 26);
      drawHudText(ctx.ctx2d, `Time: ${timeS}s | Score: ${score.toLocaleString()} | Phase ${phase}`, 16, 48);
      if (highScore > 0) {
        drawHudText(ctx.ctx2d, `High: ${highScore.toLocaleString()}`, 16, 70);
      }

      if (dead) {
        ctx.ctx2d.save();
        ctx.ctx2d.fillStyle = "rgba(0, 0, 0, 0.75)";
        ctx.ctx2d.fillRect(0, 0, ctx.width, ctx.height);
        ctx.ctx2d.restore();
        drawHudText(ctx.ctx2d, "Game Over", ctx.width / 2 - 60, ctx.height / 2 - 40);
        drawHudText(ctx.ctx2d, `Final Score: ${score.toLocaleString()}`, ctx.width / 2 - 80, ctx.height / 2);
        drawHudText(ctx.ctx2d, `Time: ${timeS}s`, ctx.width / 2 - 40, ctx.height / 2 + 30);
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

