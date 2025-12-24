import type { GameScene } from "@/games/engine/types";
import { clear } from "@/games/engine/ui";

export function createDevRoomScene(opts?: { onEnd?: () => void; endAlreadySeen?: () => boolean }): GameScene {
  // No UI. No sound (handled by shell). The environment reacts to input habits.
  let startedAt = 0;
  let runMs = 0;
  let ended = false;

  // world state
  let energy = 0; // grows with spammy input
  let calm = 0; // grows with steady input
  let px = 0;
  let py = 0;

  return {
    init() {
      startedAt = 0;
      runMs = 0;
      ended = false;
      energy = 0;
      calm = 0;
      px = 0;
      py = 0;
    },
    update(ctx) {
      if (!startedAt) {
        startedAt = ctx.nowMs;
        px = ctx.width / 2;
        py = ctx.height / 2;
      }
      if (ended) return;

      runMs = ctx.nowMs - startedAt;
      const dt = ctx.dtMs / 1000;

      // Input habit signal: changing direction / spamming action increases energy.
      const moveMag = Math.min(1, Math.abs(ctx.input.moveX) + Math.abs(ctx.input.moveY));
      const spam = ctx.input.actionPressed ? 1 : 0;

      energy += (moveMag * 0.6 + spam * 1.2) * dt;
      calm += (1 - moveMag) * dt;

      // Adaptive difficulty: environment pushes back more when energy is high.
      const drift = Math.sin(runMs / 650) * (0.6 + Math.min(2.2, energy * 0.25));
      const pull = Math.cos(runMs / 920) * (0.5 + Math.min(1.7, energy * 0.18));

      const speed = ctx.settings.reduceMotion ? 120 : 160;
      px += (ctx.input.moveX * speed + drift * 22) * dt;
      py += (ctx.input.moveY * speed + pull * 22) * dt;

      // Soft boundaries: touch edges drains calm fast.
      const margin = 18;
      const nearEdge =
        px < margin || py < margin || px > ctx.width - margin || py > ctx.height - margin;
      if (nearEdge) calm = Math.max(0, calm - 1.6 * dt);

      // Clamp.
      px = Math.max(10, Math.min(ctx.width - 10, px));
      py = Math.max(10, Math.min(ctx.height - 10, py));

      // End condition: maintain calm longer than energy for a while.
      const mastery = calm - energy * 0.45;
      if (runMs > 40_000 && mastery > 8) {
        ended = true;
        if (!opts?.endAlreadySeen?.()) opts?.onEnd?.();
      }
    },
    render(ctx) {
      clear(ctx.ctx2d, ctx.width, ctx.height);

      // Very minimal environment: gradient + reactive noise dots.
      const t = runMs / 1000;
      const e = Math.min(1, energy / 14);
      const c = Math.min(1, calm / 14);

      ctx.ctx2d.save();
      const g = ctx.ctx2d.createLinearGradient(0, 0, ctx.width, ctx.height);
      g.addColorStop(0, `rgba(${Math.floor(8 + 40 * e)},6,23,1)`);
      g.addColorStop(1, `rgba(2,${Math.floor(10 + 60 * c)},23,1)`);
      ctx.ctx2d.fillStyle = g;
      ctx.ctx2d.fillRect(0, 0, ctx.width, ctx.height);
      ctx.ctx2d.restore();

      // Player (no HUD).
      ctx.ctx2d.save();
      ctx.ctx2d.fillStyle = `rgba(255,255,255,${0.75 + 0.2 * c})`;
      ctx.ctx2d.beginPath();
      ctx.ctx2d.arc(px, py, 6, 0, Math.PI * 2);
      ctx.ctx2d.fill();
      ctx.ctx2d.restore();

      // Subtle reactive dots (less in reduced motion).
      if (!ctx.settings.reduceMotion) {
        const dots = Math.floor(18 + e * 60);
        ctx.ctx2d.save();
        ctx.ctx2d.fillStyle = `rgba(255,255,255,${0.05 + e * 0.08})`;
        for (let i = 0; i < dots; i += 1) {
          const x = (Math.sin(t * 0.7 + i) * 0.5 + 0.5) * ctx.width;
          const y = (Math.cos(t * 0.9 + i * 1.3) * 0.5 + 0.5) * ctx.height;
          ctx.ctx2d.fillRect(x, y, 2, 2);
        }
        ctx.ctx2d.restore();
      }

      // One-time end message rendered by the scene itself (no DOM UI).
      if (ended) {
        ctx.ctx2d.save();
        ctx.ctx2d.fillStyle = "rgba(0,0,0,0.55)";
        ctx.ctx2d.fillRect(0, 0, ctx.width, ctx.height);
        ctx.ctx2d.fillStyle = "rgba(255,255,255,0.92)";
        ctx.ctx2d.font = "700 18px system-ui, -apple-system, Segoe UI, sans-serif";
        ctx.ctx2d.fillText("Now you understand.", 18, 44);
        ctx.ctx2d.restore();
      }
    },
    dispose() {
      // no-op
    },
  };
}


