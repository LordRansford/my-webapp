import type { GameScene } from "../engine/types";
import { clear, drawHudText } from "../engine/ui";

export function createDemoScene(): GameScene {
  let x = 80;
  let y = 80;
  let vx = 0;
  let vy = 0;

  return {
    init() {
      x = 80;
      y = 80;
      vx = 0;
      vy = 0;
    },
    update(ctx) {
      const speed = ctx.settings.reduceMotion ? 120 : 180;
      vx = ctx.input.moveX * speed;
      vy = ctx.input.moveY * speed;
      x += (vx * ctx.dtMs) / 1000;
      y += (vy * ctx.dtMs) / 1000;
      x = Math.max(12, Math.min(ctx.width - 12, x));
      y = Math.max(12, Math.min(ctx.height - 12, y));
    },
    render(ctx) {
      clear(ctx.ctx2d, ctx.width, ctx.height);

      // background
      ctx.ctx2d.save();
      ctx.ctx2d.fillStyle = "rgba(2,6,23,0.92)";
      ctx.ctx2d.fillRect(0, 0, ctx.width, ctx.height);
      ctx.ctx2d.restore();

      // player dot
      ctx.ctx2d.save();
      ctx.ctx2d.fillStyle = "rgba(0,122,255,0.95)";
      ctx.ctx2d.beginPath();
      ctx.ctx2d.arc(x, y, 10, 0, Math.PI * 2);
      ctx.ctx2d.fill();
      ctx.ctx2d.restore();

      drawHudText(ctx.ctx2d, "Demo scene: move with arrows/WASD or swipe", 16, 26);
      drawHudText(ctx.ctx2d, `Muted: ${ctx.settings.muted ? "on" : "off"}  Reduce motion: ${ctx.settings.reduceMotion ? "on" : "off"}`, 16, 48);
    },
    dispose() {
      // nothing
    },
  };
}


