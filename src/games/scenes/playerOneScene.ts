import type { GameScene } from "@/games/engine/types";
import { clear } from "@/games/engine/ui";
import { hashStringToUint32, mulberry32 } from "@/games/seed";

type Gate = { x: number; y: number; w: number; h: number; speed: number };

function feedbackFor(ms: number) {
  const s = ms / 1000;
  if (s < 12) return "Closer.";
  if (s < 25) return "Steady.";
  if (s < 45) return "Almost.";
  return "Again.";
}

export function createPlayerOneScene(opts?: {
  onRunEnd?: (runMs: number) => void;
  bestMs?: () => number | null;
  onAudio?: (p: { intensity: number; tension: number }) => void;
}): GameScene {
  // Seeded per session mount (but deterministic per seed input).
  const seed = hashStringToUint32(`rn:player-one:${Math.floor(Math.random() * 1e9)}`);
  const rand = mulberry32(seed);

  let startedAt = 0;
  let runMs = 0;
  let dead = false;

  // player
  let px = 0;
  let py = 0;
  const pr = 8;
  let iFrameMs = 0;
  let nextBlinkOkMs = 0;

  // gates
  const gates: Gate[] = [];
  let nextGateMs = 0;
  let t = 0;
  let peakIntensity = 0;

  const spawnGate = (w: number) => {
    const span = w * 0.66;
    const cx = (w - span) / 2 + rand() * span;
    const gw = 24 + rand() * 44;
    const gh = 14 + rand() * 26;
    const speed = 120 + rand() * 180;
    gates.push({ x: cx, y: -40, w: gw, h: gh, speed });
  };

  const collideCircleRect = (cx: number, cy: number, cr: number, r: Gate) => {
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
      startedAt = 0;
      runMs = 0;
      dead = false;
      px = 0;
      py = 0;
      iFrameMs = 0;
      nextBlinkOkMs = 0;
      gates.length = 0;
      nextGateMs = 350;
      t = 0;
    },
    update(ctx) {
      if (!startedAt) {
        startedAt = ctx.nowMs;
        px = ctx.width / 2;
        py = ctx.height * 0.78;
      }
      if (dead) return;

      const dt = ctx.dtMs;
      t += dt;
      runMs = ctx.nowMs - startedAt;

      // Slowly-ramping schedule: less about speed, more about density + offsets.
      const density = Math.max(140, 520 - (runMs / 1000) * 4.2);
      if (t >= nextGateMs) {
        spawnGate(ctx.width);
        // rare double gates as pattern layer
        if (runMs > 18_000 && rand() > 0.72) spawnGate(ctx.width);
        nextGateMs = t + density + rand() * 180;
      }

      const speed = ctx.settings.reduceMotion ? 210 : 260;
      px += (ctx.input.moveX * speed * dt) / 1000;
      py += (ctx.input.moveY * speed * dt) / 1000;
      px = Math.max(12, Math.min(ctx.width - 12, px));
      py = Math.max(12, Math.min(ctx.height - 12, py));

      // Tap = blink (short i-frames), cosmetic skill test only.
      if (ctx.input.actionPressed && runMs >= nextBlinkOkMs) {
        iFrameMs = 220;
        nextBlinkOkMs = runMs + 1200;
      }
      if (iFrameMs > 0) iFrameMs = Math.max(0, iFrameMs - dt);

      // gates move and tighten patterns with time
      const drift = Math.sin(runMs / 1100) * (ctx.settings.reduceMotion ? 4 : 6);
      const intensity = Math.max(0, Math.min(1, runMs / 75_000));
      const tension = Math.max(0, Math.min(1, (density - 180) / 360));
      peakIntensity = Math.max(peakIntensity, intensity);
      opts?.onAudio?.({ intensity, tension });
      for (const g of gates) {
        const ramp = 1 + Math.min(1.25, runMs / 60_000);
        g.y += ((g.speed * ramp) * dt) / 1000;
        g.x += drift * (dt / 1000);
      }
      while (gates.length && gates[0].y - gates[0].h / 2 > ctx.height + 60) gates.shift();

      if (iFrameMs <= 0) {
        for (const g of gates) {
          if (collideCircleRect(px, py, pr, g)) {
            dead = true;
            opts?.onRunEnd?.(runMs);
            break;
          }
        }
      }
    },
    render(ctx) {
      clear(ctx.ctx2d, ctx.width, ctx.height);

      // background
      ctx.ctx2d.save();
      ctx.ctx2d.fillStyle = "rgba(2,6,23,0.98)";
      ctx.ctx2d.fillRect(0, 0, ctx.width, ctx.height);
      ctx.ctx2d.restore();

      // gates
      ctx.ctx2d.save();
      ctx.ctx2d.fillStyle = "rgba(255,255,255,0.10)";
      for (const g of gates) {
        ctx.ctx2d.fillRect(g.x - g.w / 2, g.y - g.h / 2, g.w, g.h);
      }
      ctx.ctx2d.restore();

      // player
      ctx.ctx2d.save();
      const invuln = iFrameMs > 0;
      ctx.ctx2d.fillStyle = invuln ? "rgba(16,185,129,0.95)" : "rgba(244,63,94,0.92)";
      ctx.ctx2d.beginPath();
      ctx.ctx2d.arc(px, py, pr, 0, Math.PI * 2);
      ctx.ctx2d.fill();
      ctx.ctx2d.restore();

      // No HUD during play.
      if (!dead) return;

      // End-of-run summary only.
      const best = opts?.bestMs?.() ?? null;
      const bestS = best == null ? "-" : `${(best / 1000).toFixed(2)}s`;
      const runS = `${(runMs / 1000).toFixed(2)}s`;

      ctx.ctx2d.save();
      ctx.ctx2d.fillStyle = "rgba(0,0,0,0.62)";
      ctx.ctx2d.fillRect(0, 0, ctx.width, ctx.height);
      ctx.ctx2d.restore();

      ctx.ctx2d.save();
      ctx.ctx2d.fillStyle = "rgba(255,255,255,0.92)";
      ctx.ctx2d.font = "700 18px system-ui, -apple-system, Segoe UI, sans-serif";
      ctx.ctx2d.fillText("Player One", 18, 44);
      ctx.ctx2d.font = "600 14px system-ui, -apple-system, Segoe UI, sans-serif";
      ctx.ctx2d.fillText(`Run: ${runS}`, 18, 72);
      ctx.ctx2d.fillText(`Best: ${bestS}`, 18, 94);
      ctx.ctx2d.font = "700 14px system-ui, -apple-system, Segoe UI, sans-serif";
      ctx.ctx2d.fillText(feedbackFor(runMs), 18, 128);
      ctx.ctx2d.restore();
    },
    dispose() {
      // no-op
    },
  };
}


