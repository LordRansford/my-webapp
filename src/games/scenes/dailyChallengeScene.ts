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

  const spawn = (w: number, h: number) => {
    const lane = Math.floor(rand() * 5); // 0..4
    const gap = w / 6;
    const x = Math.round((lane + 1) * gap);
    const size = 18 + Math.round(rand() * 22);
    const speed = 90 + rand() * 140;
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
      nextSpawnMs = 400;
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

      // deterministic spawn schedule + mild ramp
      if (t >= nextSpawnMs) {
        spawn(ctx.width, ctx.height);
        const base = 420 + rand() * 260;
        const ramp = Math.max(140, 520 - (runMs / 1000) * 6);
        nextSpawnMs = t + Math.min(ramp, base);
      }

      // Audio parameters: intensity ramps with time, tension rises as time-left shrinks.
      const intensity = Math.max(0, Math.min(1, runMs / 45_000));
      const timeLeft = Math.max(0, GOAL_MS - runMs);
      const tension = Math.max(0, Math.min(1, 1 - timeLeft / 12_000));
      opts?.onAudio?.({ intensity, tension });

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

      // obstacles
      ctx.ctx2d.save();
      ctx.ctx2d.fillStyle = "rgba(255,255,255,0.10)";
      for (const o of obstacles) {
        ctx.ctx2d.fillRect(o.x - o.w / 2, o.y - o.h / 2, o.w, o.h);
      }
      ctx.ctx2d.restore();

      // player
      ctx.ctx2d.save();
      ctx.ctx2d.fillStyle = "rgba(99,102,241,0.95)";
      ctx.ctx2d.beginPath();
      ctx.ctx2d.arc(px, py, pr, 0, Math.PI * 2);
      ctx.ctx2d.fill();
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


