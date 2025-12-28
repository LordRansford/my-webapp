import type { GameScene } from "@/games/engine/types";
import { clear, drawHudText } from "@/games/engine/ui";
import { hashStringToUint32, mulberry32, utcDateId } from "@/games/seed";

type Obstacle = { x: number; y: number; w: number; h: number; speed: number };

export function createDailyChallengeScene(opts?: {
  dateId?: string;
  practice?: boolean;
  onComplete?: (won: boolean, runMs: number) => void;
  onAudio?: (p: { intensity: number; tension: number }) => void;
  onMilestone?: (s: number) => void;
}): GameScene {
  const dateId = opts?.dateId ?? utcDateId();
  const seed = hashStringToUint32(`rn:daily:${dateId}`);
  let rand = mulberry32(seed);

  let startedAt = 0;
  let runMs = 0;
  let won = false;
  let dead = false;

  let px = 0;
  let py = 0;
  let pr = 9;

  let t = 0;
  const obstacles: Obstacle[] = [];
  let nextSpawnMs = 0;
  let lastMilestone = 0;

  const GOAL_MS = 45_000;

  const getDifficultyPhase = (ms: number): { phase: number; intensity: number } => {
    // Much harder base difficulty - starts at 0.85 instead of 0.7
    // Phase 1: 0-10s - Start very hard
    if (ms < 10000) return { phase: 1, intensity: 0.85 + (ms / 10000) * 0.10 };
    // Phase 2: 10-25s - Very hard
    if (ms < 25000) return { phase: 2, intensity: 0.95 + ((ms - 10000) / 15000) * 0.03 };
    // Phase 3: 25-40s - Extremely hard (first new level)
    if (ms < 40000) return { phase: 3, intensity: 0.98 + ((ms - 25000) / 15000) * 0.015 };
    // Phase 4: 40-55s - Nearly impossible (second new level)
    if (ms < 55000) return { phase: 4, intensity: 0.995 + ((ms - 40000) / 15000) * 0.004 };
    // Phase 5: 55s+ - Almost impossible (final stage - almost impossible to complete)
    return { phase: 5, intensity: 0.999 + Math.min(0.001, (ms - 55000) / 35000 * 0.001) };
  };

  const spawn = (w: number, h: number, intensity: number) => {
    const lane = Math.floor(rand() * 5); // 0..4
    const gap = w / 6;
    const x = Math.round((lane + 1) * gap);
    // Much larger obstacles and faster speeds due to higher base intensity
    const size = (22 + Math.round(rand() * 26)) * (0.95 + intensity * 0.4); // Larger obstacles
    const speed = (120 + rand() * 160) * (0.85 + intensity * 0.8); // Much faster speed
    obstacles.push({ x, y: -size - 6, w: size, h: size, speed });
  };

  const collideCircleRect = (cx: number, cy: number, cr: number, r: Obstacle) => {
    const rx = r.x - r.w / 2;
    const ry = r.y - r.h / 2;
    const closestX = Math.max(rx, Math.min(cx, rx + r.w));
    const closestY = Math.max(ry, Math.min(cy, ry + r.h));
    const dx = cx - closestX;
    const dy = cy - closestY;
    return dx * dx + dy * dy <= cr * cr;
  };

  return {
    init() {
      rand = mulberry32(seed);
      startedAt = 0;
      runMs = 0;
      won = false;
      dead = false;
      t = 0;
      obstacles.length = 0;
      nextSpawnMs = 300; // Start spawning faster initially
      px = 0;
      py = 0;
    },
    update(ctx) {
      if (!startedAt) {
        startedAt = ctx.nowMs;
        px = ctx.width / 2;
        py = ctx.height * 0.75;
      }

      if (dead) return;

      const dt = ctx.dtMs;
      t += dt;
      runMs = ctx.nowMs - startedAt;

      // Difficulty-based spawn schedule with adaptive ramp - much more aggressive
      const { phase, intensity } = getDifficultyPhase(runMs);
      if (t >= nextSpawnMs) {
        spawn(ctx.width, ctx.height, intensity);
        const base = 380 + rand() * 240;
        const ramp = Math.max(80, 480 - (runMs / 1000) * 10 * intensity); // Much faster spawns
        nextSpawnMs = t + Math.min(ramp, base);
        
        // Progressive modifiers for new difficulty levels
        // Phase 3 (extremely hard): 40% chance of double spawn
        if (phase >= 3 && rand() < 0.4) {
          spawn(ctx.width, ctx.height, intensity);
        }
        // Phase 4 (nearly impossible): 60% chance of double spawn, 20% triple
        if (phase >= 4) {
          if (rand() < 0.6) {
            spawn(ctx.width, ctx.height, intensity);
          }
          if (rand() < 0.2) {
            spawn(ctx.width, ctx.height, intensity);
          }
        }
        // Phase 5 (almost impossible): Always double spawn, 50% triple, 20% quadruple
        if (phase >= 5) {
          spawn(ctx.width, ctx.height, intensity); // Always at least double
          if (rand() < 0.5) {
            spawn(ctx.width, ctx.height, intensity);
          }
          if (rand() < 0.2) {
            spawn(ctx.width, ctx.height, intensity);
          }
        }
      }

      // Audio parameters: intensity ramps with time, tension rises as time-left shrinks.
      const audioIntensity = Math.max(0, Math.min(1, runMs / 45_000));
      const timeLeft = Math.max(0, GOAL_MS - runMs);
      const tension = Math.max(0, Math.min(1, 1 - timeLeft / 12_000));
      opts?.onAudio?.({ intensity: audioIntensity, tension });

      const milestoneS = Math.floor((runMs / 1000) / 15) * 15;
      if (milestoneS > lastMilestone) {
        lastMilestone = milestoneS;
        if (milestoneS > 0) opts?.onMilestone?.(milestoneS);
      }

      const speed = ctx.settings.reduceMotion ? 200 : 260;
      px += (ctx.input.moveX * speed * dt) / 1000;
      py += (ctx.input.moveY * speed * dt) / 1000;
      px = Math.max(14, Math.min(ctx.width - 14, px));
      py = Math.max(14, Math.min(ctx.height - 14, py));

      // update obstacles
      for (const o of obstacles) {
        const s = o.speed * (ctx.settings.reduceMotion ? 0.9 : 1);
        o.y += (s * dt) / 1000;
      }
      while (obstacles.length && obstacles[0].y - obstacles[0].h / 2 > ctx.height + 40) obstacles.shift();

      // collisions
      for (const o of obstacles) {
        if (collideCircleRect(px, py, pr, o)) {
          dead = true;
          won = false;
          opts?.onComplete?.(false, runMs);
          break;
        }
      }

      // win
      if (!dead && runMs >= GOAL_MS) {
        dead = true;
        won = true;
        opts?.onComplete?.(true, runMs);
      }
    },
    render(ctx) {
      clear(ctx.ctx2d, ctx.width, ctx.height);

      // background
      ctx.ctx2d.save();
      ctx.ctx2d.fillStyle = "rgba(2,6,23,0.96)";
      ctx.ctx2d.fillRect(0, 0, ctx.width, ctx.height);
      ctx.ctx2d.restore();

      // obstacles (bright, high contrast colors for dark background)
      ctx.ctx2d.save();
      const brightColors = [
        "#00ffff", // Bright cyan
        "#ffff00", // Bright yellow
        "#ff00ff", // Bright magenta
        "#00ff00", // Bright green
        "#ff8800", // Bright orange
        "#ff0088", // Bright pink
      ];
      for (let i = 0; i < obstacles.length; i++) {
        const o = obstacles[i];
        const colorIndex = Math.floor((o.x + o.y) / 50) % brightColors.length;
        const brightColor = brightColors[colorIndex];
        
        ctx.ctx2d.shadowBlur = 25;
        ctx.ctx2d.shadowColor = brightColor;
        ctx.ctx2d.fillStyle = brightColor; // Fully opaque bright color
        ctx.ctx2d.fillRect(o.x - o.w / 2, o.y - o.h / 2, o.w, o.h);
        ctx.ctx2d.strokeStyle = "#ffffff";
        ctx.ctx2d.lineWidth = 3; // Thicker outline for better visibility
        ctx.ctx2d.strokeRect(o.x - o.w / 2, o.y - o.h / 2, o.w, o.h);
      }
      ctx.ctx2d.restore();

      // player (high contrast)
      ctx.ctx2d.save();
      ctx.ctx2d.shadowBlur = 20;
      ctx.ctx2d.shadowColor = "#6366f1";
      ctx.ctx2d.fillStyle = "rgba(99,102,241,0.95)";
      ctx.ctx2d.beginPath();
      ctx.ctx2d.arc(px, py, pr, 0, Math.PI * 2);
      ctx.ctx2d.fill();
      ctx.ctx2d.strokeStyle = "#ffffff";
      ctx.ctx2d.lineWidth = 3;
      ctx.ctx2d.stroke();
      ctx.ctx2d.restore();

      // minimal HUD
      const left = Math.max(0, GOAL_MS - runMs);
      const leftS = Math.max(0, Math.ceil(left / 1000));
      drawHudText(ctx.ctx2d, `Daily Challenge - ${dateId}`, 16, 26);
      drawHudText(ctx.ctx2d, `Survive ${leftS}s`, 16, 48);

      if (dead) {
        ctx.ctx2d.save();
        ctx.ctx2d.fillStyle = "rgba(0,0,0,0.55)";
        ctx.ctx2d.fillRect(0, 0, ctx.width, ctx.height);
        ctx.ctx2d.restore();
        const title = won ? "Completed" : "Failed";
        drawHudText(ctx.ctx2d, title, 16, 84);
        drawHudText(ctx.ctx2d, "Return to the hub for another mode.", 16, 106);
        if (opts?.practice) drawHudText(ctx.ctx2d, "Practice mode: no rewards.", 16, 128);
      }
    },
    dispose() {
      // no-op
    },
  };
}


