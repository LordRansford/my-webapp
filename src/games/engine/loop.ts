import type { GameContext, GameScene, GameSettings, InputState } from "./types";

export type LoopHandle = {
  start: () => void;
  stop: () => void;
  setPaused: (paused: boolean) => void;
  isPaused: () => boolean;
  dispose: () => void;
};

export function createFixedTimestepLoop(opts: {
  canvas: HTMLCanvasElement;
  ctx2d: CanvasRenderingContext2D;
  getSize: () => { width: number; height: number; dpr: number };
  scene: GameScene;
  getInput: () => InputState;
  getSettings: () => GameSettings;
  onFrameEnd?: () => void;
}): LoopHandle {
  const dtMs = 1000 / 60;
  const maxFrameMs = 1000 / 10;
  const maxSteps = 6;

  let running = false;
  let paused = false;
  let raf = 0;
  let last = 0;
  let acc = 0;

  const onVis = () => {
    if (document.visibilityState === "hidden") {
      acc = 0;
      last = performance.now();
    }
  };
  document.addEventListener("visibilitychange", onVis);

  const tick = (now: number) => {
    if (!running) return;
    raf = requestAnimationFrame(tick);
    if (paused) return;

    if (!last) last = now;
    const frameMs = Math.min(maxFrameMs, Math.max(0, now - last));
    last = now;
    acc += frameMs;

    const size = opts.getSize();
    const input = opts.getInput();
    const settings = opts.getSettings();

    let steps = 0;
    while (acc >= dtMs && steps < maxSteps) {
      const ctx: GameContext = {
        nowMs: now,
        dtMs,
        canvas: opts.canvas,
        ctx2d: opts.ctx2d,
        width: size.width,
        height: size.height,
        dpr: size.dpr,
        input,
        settings,
      };
      opts.scene.update(ctx);
      acc -= dtMs;
      steps += 1;
    }

    const renderCtx: GameContext = {
      nowMs: now,
      dtMs,
      canvas: opts.canvas,
      ctx2d: opts.ctx2d,
      width: size.width,
      height: size.height,
      dpr: size.dpr,
      input,
      settings,
    };
    opts.scene.render(renderCtx);
    opts.onFrameEnd?.();
  };

  return {
    start: () => {
      if (running) return;
      running = true;
      paused = false;
      last = 0;
      acc = 0;
      opts.scene.init();
      raf = requestAnimationFrame(tick);
    },
    stop: () => {
      running = false;
      paused = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      acc = 0;
      last = 0;
    },
    setPaused: (p) => {
      paused = Boolean(p);
      if (!paused) {
        acc = 0;
        last = performance.now();
      }
    },
    isPaused: () => paused,
    dispose: () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
    },
  };
}


