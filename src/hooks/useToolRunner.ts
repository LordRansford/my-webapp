"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { emitInternalToolEvent } from "@/lib/analytics/internalClient";
import { estimatePostRunCost, estimatePreRunCost, type ComputeCostBreakdown } from "@/lib/compute/estimateCost";
import { getToolComputeProfile } from "@/config/computeLimits";

type RunnerOptions = {
  minIntervalMs?: number;
  timeoutMs?: number;
  toolId?: string;
};

type RunnerState = {
  loading: boolean;
  errorMessage: string;
};

type ComputeMeta = {
  inputBytes?: number;
  steps?: number;
  expectedWallMs?: number;
};

type RunnerComputeState = {
  pre: ComputeCostBreakdown | null;
  post: ComputeCostBreakdown | null;
  sessionFreeUsedUnits: number;
  creditsBalance: number | null;
  creditsVisible: boolean;
  lastInputBytes?: number | null;
  lastConsumedCredits?: number | null;
};

const COMPUTE_SESSION_KEY = "rn_compute_session_units_v1";
const COMPUTE_SIM_CREDITS_KEY = "rn_compute_sim_credits_v1";

function readNumber(key: string): number {
  try {
    const raw = window.sessionStorage.getItem(key);
    const n = raw ? Number(raw) : 0;
    if (!Number.isFinite(n) || n < 0) return 0;
    return Math.floor(n);
  } catch {
    return 0;
  }
}

function writeNumber(key: string, value: number) {
  try {
    window.sessionStorage.setItem(key, String(Math.max(0, Math.floor(value))));
  } catch {
    // ignore
  }
}

export function useToolRunner(options: RunnerOptions = {}) {
  const minIntervalMs = options.minIntervalMs ?? 600;
  const timeoutMs = options.timeoutMs ?? 15_000;
  const toolId = options.toolId;
  const [state, setState] = useState<RunnerState>({ loading: false, errorMessage: "" });
  const lastRunAtRef = useRef<number>(0);
  const inFlightRef = useRef<boolean>(false);
  const abortRef = useRef<AbortController | null>(null);

  const [compute, setCompute] = useState<RunnerComputeState>({
    pre: null,
    post: null,
    sessionFreeUsedUnits: 0,
    creditsBalance: null,
    creditsVisible: false,
    lastInputBytes: null,
    lastConsumedCredits: null,
  });

  const profile = useMemo(() => (toolId ? getToolComputeProfile(toolId) : null), [toolId]);

  useEffect(() => {
    const used = readNumber(COMPUTE_SESSION_KEY);
    const simulated = readNumber(COMPUTE_SIM_CREDITS_KEY);
    // Fetch credits if signed in, else keep unknown.
    setCompute((c) => ({ ...c, sessionFreeUsedUnits: used, creditsBalance: simulated, creditsVisible: false }));

    fetch("/api/credits/status")
      .then(async (r) => {
        if (!r.ok) throw new Error("No credits");
        const d = await r.json().catch(() => ({}));
        const bal = typeof d?.balance === "number" ? d.balance : 0;
        setCompute((c) => ({ ...c, creditsBalance: bal, creditsVisible: true }));
      })
      .catch(() => {
        // Not signed in or endpoint not available; keep credits hidden.
      });
  }, []);

  const resetError = useCallback(() => {
    setState((s) => ({ ...s, errorMessage: "" }));
  }, []);

  const clearCompute = useCallback(() => {
    setCompute((c) => ({ ...c, pre: null, post: null, lastConsumedCredits: null }));
  }, []);

  const prepare = useCallback(
    (meta: ComputeMeta = {}) => {
      const inputBytes = typeof meta.inputBytes === "number" ? meta.inputBytes : profile?.typicalInputBytes ?? 0;
      const steps = typeof meta.steps === "number" ? meta.steps : profile?.typicalSteps ?? 1;
      const expectedWallMs = typeof meta.expectedWallMs === "number" ? meta.expectedWallMs : 900;

      const pre = estimatePreRunCost({
        toolId: toolId || undefined,
        computeClass: profile?.computeClass,
        inputBytes,
        steps,
        expectedWallMs,
        sessionFreeUsedUnits: compute.sessionFreeUsedUnits,
        creditsBalance: compute.creditsVisible ? compute.creditsBalance : null,
      });
      setCompute((c) => ({ ...c, pre, post: null, lastInputBytes: inputBytes }));
      return pre;
    },
    [toolId, profile, compute.sessionFreeUsedUnits, compute.creditsBalance, compute.creditsVisible]
  );

  const run = useCallback(
    async <T,>(fn: (signal: AbortSignal) => Promise<T>, meta: ComputeMeta = {}): Promise<T | null> => {
      const now = Date.now();
      if (inFlightRef.current) return null;
      if (now - lastRunAtRef.current < minIntervalMs) return null;

      inFlightRef.current = true;
      lastRunAtRef.current = now;
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      const signal = abortRef.current.signal;

      const inputBytes = typeof meta.inputBytes === "number" ? meta.inputBytes : compute.lastInputBytes ?? profile?.typicalInputBytes ?? 0;
      const steps = typeof meta.steps === "number" ? meta.steps : profile?.typicalSteps ?? 1;
      if (!compute.pre) {
        prepare({ inputBytes, steps, expectedWallMs: meta.expectedWallMs });
      }

      // Hard block when signed in and credits are insufficient for the estimated paid portion.
      const preSnapshot = compute.pre || estimatePreRunCost({ toolId: toolId || undefined, computeClass: profile?.computeClass, inputBytes, steps });
      if (compute.creditsVisible && preSnapshot.estimate.creditShortfall) {
        setState({ loading: false, errorMessage: "Not enough credits for the paid portion of this run. Reduce inputs or disable expensive options." });
        inFlightRef.current = false;
        return null;
      }

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

        const actualMs = Date.now() - start;
        const post = estimatePostRunCost({
          toolId: toolId || undefined,
          computeClass: profile?.computeClass,
          inputBytes,
          steps,
          actualWallMs: actualMs,
          sessionFreeUsedUnits: compute.sessionFreeUsedUnits,
          creditsBalance: compute.creditsVisible ? compute.creditsBalance : null,
        });

        const newSessionUsed = compute.sessionFreeUsedUnits + post.estimate.freeUnitsUsed;
        writeNumber(COMPUTE_SESSION_KEY, newSessionUsed);

        // Server-authoritative credit deduction for above-free portion (signed-in users only).
        let consumed = 0;
        let remaining: number | null = null;
        if (compute.creditsVisible && toolId) {
          const res = await fetch("/api/credits/consume", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              toolId,
              inputBytes,
              durationMs: actualMs,
              featureFlags: {},
              hadPreview: Boolean(compute.pre),
            }),
          });
          const data = await res.json().catch(() => ({}));
          if (res.ok) {
            consumed = typeof data?.consumed === "number" ? data.consumed : 0;
            remaining = typeof data?.remaining === "number" ? data.remaining : null;
          } else {
            // If consume fails due to insufficient credits, surface a clear error and stop.
            const msg = typeof data?.message === "string" ? data.message : "Not enough credits for the paid portion of this run.";
            setState({ loading: false, errorMessage: msg });
            setCompute((c) => ({ ...c, post, sessionFreeUsedUnits: newSessionUsed, lastConsumedCredits: 0 }));
            return null;
          }
        } else {
          // Fallback simulated counter for anonymous users, for transparency only.
          const simulatedUsed = readNumber(COMPUTE_SIM_CREDITS_KEY);
          writeNumber(COMPUTE_SIM_CREDITS_KEY, simulatedUsed + post.estimate.estimatedCredits);
        }

        setCompute((c) => ({
          ...c,
          post,
          sessionFreeUsedUnits: newSessionUsed,
          creditsBalance: typeof remaining === "number" ? remaining : c.creditsBalance,
          lastConsumedCredits: consumed,
        }));
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
    [minIntervalMs, timeoutMs, toolId, profile, compute.pre, compute.lastInputBytes, compute.sessionFreeUsedUnits, compute.creditsBalance, compute.creditsVisible, prepare]
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
    prepare,
    clearCompute,
    compute,
  };
}


