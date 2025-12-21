"use client";

import { useCallback, useRef, useState } from "react";
import { emitInternalToolEvent } from "@/lib/analytics/internalClient";

type RunnerOptions = {
  minIntervalMs?: number;
  timeoutMs?: number;
  toolId?: string;
};

type RunnerState = {
  loading: boolean;
  errorMessage: string;
};

export function useToolRunner(options: RunnerOptions = {}) {
  const minIntervalMs = options.minIntervalMs ?? 600;
  const timeoutMs = options.timeoutMs ?? 15_000;
  const toolId = options.toolId;
  const [state, setState] = useState<RunnerState>({ loading: false, errorMessage: "" });
  const lastRunAtRef = useRef<number>(0);
  const inFlightRef = useRef<boolean>(false);
  const abortRef = useRef<AbortController | null>(null);

  const resetError = useCallback(() => {
    setState((s) => ({ ...s, errorMessage: "" }));
  }, []);

  const run = useCallback(
    async <T,>(fn: (signal: AbortSignal) => Promise<T>): Promise<T | null> => {
      const now = Date.now();
      if (inFlightRef.current) return null;
      if (now - lastRunAtRef.current < minIntervalMs) return null;

      inFlightRef.current = true;
      lastRunAtRef.current = now;
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      const signal = abortRef.current.signal;

      setState({ loading: true, errorMessage: "" });
      const start = Date.now();

      const timeout =
        timeoutMs > 0
          ? setTimeout(() => {
              abortRef.current?.abort();
              if (toolId) {
                emitInternalToolEvent({ type: "tool_timeout", toolId, durationMs: Date.now() - start, success: false });
              }
            }, timeoutMs)
          : null;

      try {
        const out = await fn(signal);
        if (toolId) emitInternalToolEvent({ type: "tool_executed", toolId, durationMs: Date.now() - start, success: true });
        setState({ loading: false, errorMessage: "" });
        return out;
      } catch (e) {
        if ((e as any)?.name === "AbortError") {
          setState({ loading: false, errorMessage: "" });
          return null;
        }
        if (toolId) emitInternalToolEvent({ type: "tool_error", toolId, durationMs: Date.now() - start, success: false });
        setState({
          loading: false,
          errorMessage: "This did not work as expected. Please adjust your input and try again.",
        });
        return null;
      } finally {
        if (timeout) clearTimeout(timeout);
        inFlightRef.current = false;
      }
    },
    [minIntervalMs, timeoutMs, toolId]
  );

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    inFlightRef.current = false;
    setState((s) => ({ ...s, loading: false }));
  }, []);

  return {
    loading: state.loading,
    errorMessage: state.errorMessage,
    run,
    cancel,
    resetError,
  };
}


