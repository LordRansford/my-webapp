/**
 * Performance monitoring hook for News and Updates
 */

import { useEffect, useRef } from "react";

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  itemCount: number;
}

export function usePerformanceMonitor(
  itemCount: number,
  onMetrics?: (metrics: PerformanceMetrics) => void
) {
  const loadStartRef = useRef<number>(Date.now());
  const renderStartRef = useRef<number>(Date.now());

  useEffect(() => {
    const loadTime = Date.now() - loadStartRef.current;
    const renderTime = Date.now() - renderStartRef.current;

    if (onMetrics) {
      onMetrics({
        loadTime,
        renderTime,
        itemCount,
      });
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log("Performance metrics:", {
        loadTime: `${loadTime}ms`,
        renderTime: `${renderTime}ms`,
        itemCount,
      });
    }
  }, [itemCount, onMetrics]);

  useEffect(() => {
    renderStartRef.current = Date.now();
  }, [itemCount]);
}
