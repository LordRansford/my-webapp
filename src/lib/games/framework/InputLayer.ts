/**
 * Input Layer - Unified keyboard and touch input handling
 * 
 * Provides:
 * - Keyboard mapping for desktop
 * - Touch gestures and on-screen controls for mobile
 * - Consistent pause/resume/quit behavior
 * - Event normalization
 */

export type InputEvent = {
  type: "keyboard" | "touch" | "mouse";
  action: string;
  timestamp: number;
  data?: unknown;
};

export type InputHandler = (event: InputEvent) => void;

export class InputLayer {
  private handlers: Map<string, InputHandler[]> = new Map();
  private isEnabled: boolean = true;
  private touchStartPos: { x: number; y: number } | null = null;
  private readonly SWIPE_THRESHOLD = 50; // pixels
  private keyboardHandler: ((e: KeyboardEvent) => void) | null = null;
  private touchStartHandler: ((e: TouchEvent) => void) | null = null;
  private touchEndHandler: ((e: TouchEvent) => void) | null = null;

  constructor() {
    // Don't set up listeners in constructor - let components do it via setup methods
  }

  /**
   * Register handler for specific action
   */
  on(action: string, handler: InputHandler): () => void {
    if (!this.handlers.has(action)) {
      this.handlers.set(action, []);
    }
    this.handlers.get(action)!.push(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.handlers.get(action);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }

  /**
   * Enable/disable input
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Setup keyboard listeners (call from component useEffect)
   */
  setupKeyboardListeners(): () => void {
    if (typeof window === "undefined") return () => {};

    this.keyboardHandler = (e: KeyboardEvent) => {
      if (!this.isEnabled) return;

      const action = this.mapKeyToAction(e.key, e);
      if (action) {
        this.emit(action, {
          type: "keyboard",
          action,
          timestamp: Date.now(),
          data: { key: e.key, code: e.code, modifiers: this.getModifiers(e) },
        });
      }
    };

    window.addEventListener("keydown", this.keyboardHandler);
    return () => {
      if (this.keyboardHandler) {
        window.removeEventListener("keydown", this.keyboardHandler);
        this.keyboardHandler = null;
      }
    };
  }

  /**
   * Setup touch listeners (call from component useEffect)
   */
  setupTouchListeners(): () => void {
    if (typeof window === "undefined") return () => {};

    this.touchStartHandler = (e: TouchEvent) => {
      if (!this.isEnabled) return;
      const touch = e.touches[0];
      if (touch) {
        this.touchStartPos = { x: touch.clientX, y: touch.clientY };
      }
    };

    this.touchEndHandler = (e: TouchEvent) => {
      if (!this.isEnabled || !this.touchStartPos) return;

      const touch = e.changedTouches[0];
      if (!touch) return;

      const deltaX = touch.clientX - this.touchStartPos.x;
      const deltaY = touch.clientY - this.touchStartPos.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance > this.SWIPE_THRESHOLD) {
        const action = this.detectSwipe(deltaX, deltaY);
        if (action) {
          this.emit(action, {
            type: "touch",
            action,
            timestamp: Date.now(),
            data: { deltaX, deltaY, distance },
          });
        }
      } else {
        // Tap
        this.emit("tap", {
          type: "touch",
          action: "tap",
          timestamp: Date.now(),
          data: { x: touch.clientX, y: touch.clientY },
        });
      }

      this.touchStartPos = null;
    };

    window.addEventListener("touchstart", this.touchStartHandler, { passive: true });
    window.addEventListener("touchend", this.touchEndHandler, { passive: true });

    return () => {
      if (this.touchStartHandler) {
        window.removeEventListener("touchstart", this.touchStartHandler);
        this.touchStartHandler = null;
      }
      if (this.touchEndHandler) {
        window.removeEventListener("touchend", this.touchEndHandler);
        this.touchEndHandler = null;
      }
    };
  }

  /**
   * Map keyboard key to game action
   */
  private mapKeyToAction(key: string, event: KeyboardEvent): string | null {
    // Standard game controls
    const keyMap: Record<string, string> = {
      ArrowUp: "move-up",
      ArrowDown: "move-down",
      ArrowLeft: "move-left",
      ArrowRight: "move-right",
      " ": "action", // Spacebar
      Enter: "confirm",
      Escape: "pause",
      "p": "pause",
      "P": "pause",
      "q": "quit",
      "Q": "quit",
    };

    return keyMap[key] || null;
  }

  /**
   * Detect swipe direction
   */
  private detectSwipe(deltaX: number, deltaY: number): string | null {
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX > absY) {
      return deltaX > 0 ? "swipe-right" : "swipe-left";
    } else {
      return deltaY > 0 ? "swipe-down" : "swipe-up";
    }
  }

  /**
   * Get keyboard modifiers
   */
  private getModifiers(event: KeyboardEvent): {
    shift: boolean;
    ctrl: boolean;
    alt: boolean;
    meta: boolean;
  } {
    return {
      shift: event.shiftKey,
      ctrl: event.ctrlKey,
      alt: event.altKey,
      meta: event.metaKey,
    };
  }

  /**
   * Emit event to handlers
   */
  private emit(action: string, event: InputEvent): void {
    const handlers = this.handlers.get(action);
    if (handlers) {
      handlers.forEach((handler) => handler(event));
    }
  }

  /**
   * Setup all listeners (convenience method)
   */
  setupAllListeners(): () => void {
    const cleanupKeyboard = this.setupKeyboardListeners();
    const cleanupTouch = this.setupTouchListeners();
    return () => {
      cleanupKeyboard();
      cleanupTouch();
    };
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.keyboardHandler) {
      window.removeEventListener("keydown", this.keyboardHandler);
      this.keyboardHandler = null;
    }
    if (this.touchStartHandler) {
      window.removeEventListener("touchstart", this.touchStartHandler);
      this.touchStartHandler = null;
    }
    if (this.touchEndHandler) {
      window.removeEventListener("touchend", this.touchEndHandler);
      this.touchEndHandler = null;
    }
    this.handlers.clear();
  }
}
