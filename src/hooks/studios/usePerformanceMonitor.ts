/**
 * Performance Monitoring Hook for Studios
 * 
 * Tracks performance metrics for studio operations
 */

"use client";

import { useEffect, useRef, useCallback } from "react";
import { auditLogger, AuditActions } from "@/lib/studios/security/auditLogger";

export interface PerformanceMetric {
  operation: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface UsePerformanceMonitorOptions {
  enabled?: boolean;
  logToAudit?: boolean;
  threshold?: number; // Log if operation takes longer than threshold (ms)
}

/**
 * Hook for monitoring performance of operations
 * 
 * @param options - Configuration options
 * @returns Object with measure function and metrics
 * 
 * @example
 * ```typescript
 * const { measure, metrics } = usePerformanceMonitor({
 *   enabled: true,
 *   threshold: 1000
 * });
 * 
 * const handleOperation = async () => {
 *   await measure('data-load', async () => {
 *     // Your async operation
 *     await loadData();
 *   });
 * };
 * ```
 */
export function usePerformanceMonitor(
  options: UsePerformanceMonitorOptions = {}
) {
  const {
    enabled = true,
    logToAudit = true,
    threshold = 1000
  } = options;

  const metricsRef = useRef<PerformanceMetric[]>([]);
  const activeOperationsRef = useRef<Map<string, number>>(new Map());

  const measure = useCallback(async <T,>(
    operation: string,
    fn: () => Promise<T>,
    metadata?: Record<string, unknown>
  ): Promise<T> => {
    if (!enabled) {
      return fn();
    }

    const startTime = performance.now();
    activeOperationsRef.current.set(operation, startTime);

    try {
      const result = await fn();
      const endTime = performance.now();
      const duration = endTime - startTime;

      const metric: PerformanceMetric = {
        operation,
        duration,
        timestamp: Date.now(),
        metadata
      };

      metricsRef.current.push(metric);

      // Keep only last 100 metrics
      if (metricsRef.current.length > 100) {
        metricsRef.current.shift();
      }

      // Log slow operations
      if (duration > threshold && logToAudit) {
        auditLogger.log(AuditActions.PERFORMANCE_ISSUE, "studios", {
          operation,
          duration,
          threshold,
          metadata
        });
      }

      activeOperationsRef.current.delete(operation);
      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      activeOperationsRef.current.delete(operation);

      if (logToAudit) {
        auditLogger.log(AuditActions.ERROR_OCCURRED, "studios", {
          operation,
          duration,
          error: error instanceof Error ? error.message : "Unknown error",
          metadata
        });
      }

      throw error;
    }
  }, [enabled, logToAudit, threshold]);

  const getMetrics = useCallback(() => {
    return [...metricsRef.current];
  }, []);

  const getActiveOperations = useCallback(() => {
    const now = performance.now();
    const active: Array<{ operation: string; duration: number }> = [];
    
    activeOperationsRef.current.forEach((startTime, operation) => {
      active.push({
        operation,
        duration: now - startTime
      });
    });
    
    return active;
  }, []);

  const clearMetrics = useCallback(() => {
    metricsRef.current = [];
  }, []);

  // Log metrics on unmount (development only)
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      return () => {
        if (metricsRef.current.length > 0) {
          console.log("[Performance Monitor] Metrics:", metricsRef.current);
        }
      };
    }
  }, []);

  return {
    measure,
    getMetrics,
    getActiveOperations,
    clearMetrics
  };
}



