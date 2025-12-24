export type CanvasView = {
  canvas: HTMLCanvasElement;
  ctx2d: CanvasRenderingContext2D;
  width: number;
  height: number;
  dpr: number;
  dispose: () => void;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function createCanvasView(canvas: HTMLCanvasElement): CanvasView {
  const ctx2d = canvas.getContext("2d", { alpha: true, desynchronized: true });
  if (!ctx2d) throw new Error("Canvas 2D context unavailable");

  const state: CanvasView = {
    canvas,
    ctx2d,
    width: 1,
    height: 1,
    dpr: 1,
    dispose: () => {},
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = clamp(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 1, 3);
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    state.dpr = dpr;
    state.width = w;
    state.height = h;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const ro = new ResizeObserver(() => resize());
  ro.observe(canvas);
  resize();

  state.dispose = () => {
    try {
      ro.disconnect();
    } catch {
      // ignore
    }
  };

  return state;
}


