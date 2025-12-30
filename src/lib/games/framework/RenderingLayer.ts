/**
 * Rendering Layer - Abstraction for canvas and React rendering
 * 
 * Provides:
 * - Canvas games: requestAnimationFrame loop isolated from React
 * - Board games: React components with minimal state updates
 * - DevicePixelRatio scaling for canvas
 * - Consistent rendering interface
 */

"use client";

import React, { useEffect, useRef, useCallback } from "react";

export type RenderCallback = (ctx: CanvasRenderingContext2D, deltaTime: number) => void;

export interface CanvasRendererOptions {
  width: number;
  height: number;
  pixelRatio?: number;
  onRender: RenderCallback;
  enabled?: boolean;
}

/**
 * Hook for canvas-based games
 * Manages requestAnimationFrame loop isolated from React re-renders
 */
export function useCanvasRenderer({
  width,
  height,
  pixelRatio = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
  onRender,
  enabled = true,
}: CanvasRendererOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);

  const render = useCallback(
    (currentTime: number) => {
      if (!canvasRef.current || !enabled) return;

      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      // Clear canvas
      ctx.clearRect(0, 0, width * pixelRatio, height * pixelRatio);

      // Scale context for high DPI
      ctx.save();
      ctx.scale(pixelRatio, pixelRatio);

      // Render
      onRender(ctx, deltaTime);

      ctx.restore();

      // Continue loop
      frameRef.current = requestAnimationFrame(render);
    },
    [width, height, pixelRatio, onRender, enabled]
  );

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    if (enabled) {
      lastTimeRef.current = performance.now();
      frameRef.current = requestAnimationFrame(render);
    }

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [width, height, pixelRatio, enabled, render]);

  return canvasRef;
}

/**
 * Hook for React-based board games
 * Provides optimized rendering with minimal re-renders
 */
export function useBoardRenderer<T>(state: T, renderFn: (state: T) => React.ReactNode) {
  // For React games, we just return the render function
  // The component using this hook will handle memoization
  return useCallback(() => renderFn(state), [state, renderFn]);
}
