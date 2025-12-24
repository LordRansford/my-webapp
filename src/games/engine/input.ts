import type { InputState } from "./types";

export type InputBindings = {
  left: string[];
  right: string[];
  up: string[];
  down: string[];
  pause: string[];
};

const DEFAULT_BINDINGS: InputBindings = {
  left: ["ArrowLeft", "a"],
  right: ["ArrowRight", "d"],
  up: ["ArrowUp", "w"],
  down: ["ArrowDown", "s"],
  pause: ["Escape", "p"],
};

export type InputController = {
  getState: () => InputState;
  resetFrame: () => void;
  dispose: () => void;
  bindings: InputBindings;
};

export function createInputController(target: HTMLElement | Window, bindings: Partial<InputBindings> = {}): InputController {
  const b: InputBindings = { ...DEFAULT_BINDINGS, ...bindings };
  const pressed = new Set<string>();
  let pausePressed = false;

  const state: InputState = {
    moveX: 0,
    moveY: 0,
    pausePressed: false,
  };

  const recomputeAxes = () => {
    const left = b.left.some((k) => pressed.has(k));
    const right = b.right.some((k) => pressed.has(k));
    const up = b.up.some((k) => pressed.has(k));
    const down = b.down.some((k) => pressed.has(k));
    state.moveX = (right ? 1 : 0) + (left ? -1 : 0);
    state.moveY = (down ? 1 : 0) + (up ? -1 : 0);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    pressed.add(e.key);
    if (b.pause.includes(e.key)) pausePressed = true;
    recomputeAxes();
  };
  const onKeyUp = (e: KeyboardEvent) => {
    pressed.delete(e.key);
    recomputeAxes();
  };

  // Pointer/touch swipe detection => maps to move axis impulses.
  let swipeStart: { x: number; y: number; t: number } | null = null;
  const SWIPE_MIN_PX = 22;
  const SWIPE_MAX_MS = 700;

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    swipeStart = { x: e.clientX, y: e.clientY, t: Date.now() };
  };
  const onPointerUp = (e: PointerEvent) => {
    if (!swipeStart) return;
    const dt = Date.now() - swipeStart.t;
    const dx = e.clientX - swipeStart.x;
    const dy = e.clientY - swipeStart.y;
    swipeStart = null;
    if (dt > SWIPE_MAX_MS) return;
    const adx = Math.abs(dx);
    const ady = Math.abs(dy);
    if (Math.max(adx, ady) < SWIPE_MIN_PX) return;
    // impulse for one frame
    if (adx >= ady) {
      state.moveX = dx > 0 ? 1 : -1;
      state.moveY = 0;
    } else {
      state.moveY = dy > 0 ? 1 : -1;
      state.moveX = 0;
    }
  };

  const add = (t: any, type: string, fn: any, opts?: any) => t.addEventListener(type, fn, opts);
  const remove = (t: any, type: string, fn: any, opts?: any) => t.removeEventListener(type, fn, opts);

  add(target, "keydown", onKeyDown);
  add(target, "keyup", onKeyUp);
  // Pointer events only if target is an Element
  if (typeof (target as any).addEventListener === "function") {
    add(target, "pointerdown", onPointerDown, { passive: true } as any);
    add(target, "pointerup", onPointerUp, { passive: true } as any);
  }

  return {
    bindings: b,
    getState: () => {
      state.pausePressed = pausePressed;
      return { ...state };
    },
    resetFrame: () => {
      pausePressed = false;
      // Clear swipe impulses (keyboard state will be recomputed via key events).
      recomputeAxes();
    },
    dispose: () => {
      remove(target, "keydown", onKeyDown);
      remove(target, "keyup", onKeyUp);
      if (typeof (target as any).removeEventListener === "function") {
        remove(target, "pointerdown", onPointerDown, { passive: true } as any);
        remove(target, "pointerup", onPointerUp, { passive: true } as any);
      }
    },
  };
}


