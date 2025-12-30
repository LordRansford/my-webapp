/**
 * Performance monitoring hook for games
 * 
 * Tracks frame rate and performance metrics
 * Only active in development mode
 */

import { useEffect, useRef } from "react";

export function usePerformanceMonitor(enabled: boolean = process.env.NODE_ENV === "development") {
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const fpsRef = useRef<number[]>([]);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const measureFPS = () => {
      frameCountRef.current++;
      const now = performance.now();
      const delta = now - lastTimeRef.current;

      if (delta >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / delta);
        fpsRef.current.push(fps);
        if (fpsRef.current.length > 60) {
          fpsRef.current.shift();
        }

        const avgFPS = fpsRef.current.reduce((a, b) => a + b, 0) / fpsRef.current.length;
        if (avgFPS < 50 && fpsRef.current.length >= 10) {
          console.warn(`Low FPS detected: ${avgFPS.toFixed(1)} fps`);
        }

        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      requestAnimationFrame(measureFPS);
    };

    const rafId = requestAnimationFrame(measureFPS);
    return () => cancelAnimationFrame(rafId);
  }, [enabled]);

  return {
    getAverageFPS: () => {
      if (fpsRef.current.length === 0) return 60;
      return fpsRef.current.reduce((a, b) => a + b, 0) / fpsRef.current.length;
    },
  };
}
