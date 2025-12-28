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
  let actionPressed = false;

  const state: InputState = {
    moveX: 0,
    moveY: 0,
    pausePressed: false,
    actionPressed: false,
  };

  const recomputeAxes = () => {
    // Keyboard input
    const left = b.left.some((k) => pressed.has(k));
    const right = b.right.some((k) => pressed.has(k));
    const up = b.up.some((k) => pressed.has(k));
    const down = b.down.some((k) => pressed.has(k));
    
    let keyX = (right ? 1 : 0) + (left ? -1 : 0);
    let keyY = (down ? 1 : 0) + (up ? -1 : 0);
    
    // Touch input: continuous movement relative to touch start
    if (touchActive) {
      const touchDx = touchCurrentX - touchStartX;
      const touchDy = touchCurrentY - touchStartY;
      const touchDist = Math.sqrt(touchDx * touchDx + touchDy * touchDy);
      
      if (touchDist > CONTINUOUS_TOUCH_THRESHOLD) {
        // Normalize and scale touch input
        const scale = Math.min(1, touchDist / 100); // Max movement at 100px
        const touchX = (touchDx / touchDist) * scale;
        const touchY = (touchDy / touchDist) * scale;
        // Touch takes priority over keyboard
        state.moveX = touchX;
        state.moveY = touchY;
        return;
      }
    }
    
    // Use keyboard input
    state.moveX = keyX;
    state.moveY = keyY;
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

  // Pointer/touch input: supports both continuous movement (for touch) and swipe impulses
  let touchActive = false;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchCurrentX = 0;
  let touchCurrentY = 0;
  let swipeStart: { x: number; y: number; t: number } | null = null;
  const SWIPE_MIN_PX = 22;
  const SWIPE_MAX_MS = 700;
  const TAP_MAX_PX = 10;
  const TAP_MAX_MS = 350;
  const CONTINUOUS_TOUCH_THRESHOLD = 5; // Pixels to move before registering continuous input

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    
    // For touch devices, enable continuous movement
    if (e.pointerType === "touch") {
      touchActive = true;
      touchStartX = e.clientX;
      touchStartY = e.clientY;
      touchCurrentX = e.clientX;
      touchCurrentY = e.clientY;
      swipeStart = { x: e.clientX, y: e.clientY, t: Date.now() };
    } else {
      // For mouse, use swipe behavior
      swipeStart = { x: e.clientX, y: e.clientY, t: Date.now() };
    }
  };
  
  const onPointerMove = (e: PointerEvent) => {
    if (!touchActive || e.pointerType !== "touch") return;
    touchCurrentX = e.clientX;
    touchCurrentY = e.clientY;
  };
  
  const onPointerUp = (e: PointerEvent) => {
    if (!swipeStart) {
      touchActive = false;
      state.moveX = 0;
      state.moveY = 0;
      return;
    }
    
    const dt = Date.now() - swipeStart.t;
    const dx = e.clientX - swipeStart.x;
    const dy = e.clientY - swipeStart.y;
    
    if (touchActive && e.pointerType === "touch") {
      // Touch device: check if it was a swipe or continuous movement
      touchActive = false;
      const moveDx = touchCurrentX - touchStartX;
      const moveDy = touchCurrentY - touchStartY;
      
      // If moved significantly, treat as continuous (already handled in move handler)
      if (Math.abs(moveDx) > CONTINUOUS_TOUCH_THRESHOLD || Math.abs(moveDy) > CONTINUOUS_TOUCH_THRESHOLD) {
        swipeStart = null;
        state.moveX = 0;
        state.moveY = 0;
        return;
      }
    }
    
    swipeStart = null;
    touchActive = false;
    
    if (dt > SWIPE_MAX_MS) return;
    const adx = Math.abs(dx);
    const ady = Math.abs(dy);
    // Tap => one-frame action
    if (dt <= TAP_MAX_MS && Math.max(adx, ady) <= TAP_MAX_PX) {
      actionPressed = true;
      return;
    }
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
  
  const onPointerCancel = () => {
    touchActive = false;
    swipeStart = null;
    state.moveX = 0;
    state.moveY = 0;
  };

  const add = (t: any, type: string, fn: any, opts?: any) => t.addEventListener(type, fn, opts);
  const remove = (t: any, type: string, fn: any, opts?: any) => t.removeEventListener(type, fn, opts);

  add(target, "keydown", onKeyDown);
  add(target, "keyup", onKeyUp);
  // Pointer events only if target is an Element
  if (typeof (target as any).addEventListener === "function") {
    add(target, "pointerdown", onPointerDown, { passive: true } as any);
    add(target, "pointermove", onPointerMove, { passive: true } as any);
    add(target, "pointerup", onPointerUp, { passive: true } as any);
    add(target, "pointercancel", onPointerCancel, { passive: true } as any);
  }

  return {
    bindings: b,
    getState: () => {
      recomputeAxes(); // Always recompute to handle continuous touch input
      state.pausePressed = pausePressed;
      state.actionPressed = actionPressed;
      return { ...state };
    },
    resetFrame: () => {
      pausePressed = false;
      actionPressed = false;
      // Clear swipe impulses (keyboard state will be recomputed via key events).
      recomputeAxes();
    },
    dispose: () => {
      remove(target, "keydown", onKeyDown);
      remove(target, "keyup", onKeyUp);
      if (typeof (target as any).removeEventListener === "function") {
        remove(target, "pointerdown", onPointerDown, { passive: true } as any);
        remove(target, "pointermove", onPointerMove, { passive: true } as any);
        remove(target, "pointerup", onPointerUp, { passive: true } as any);
        remove(target, "pointercancel", onPointerCancel, { passive: true } as any);
      }
      touchActive = false;
      swipeStart = null;
    },
  };
}


