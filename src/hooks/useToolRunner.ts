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
  live: ComputeCostBreakdown | null;
  sessionFreeUsedUnits: number;
  creditsBalance: number | null;
  creditsVisible: boolean;
  creditsExpiresAt: string | null;
  usageHistory: any[];
  lastInputBytes?: number | null;
  lastConsumedCredits?: number | null;
  hadPreview: boolean;
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
    live: null,
    sessionFreeUsedUnits: 0,
    creditsBalance: null,
    creditsVisible: false,
    creditsExpiresAt: null,
    usageHistory: [],
    lastInputBytes: null,
    lastConsumedCredits: null,
    hadPreview: false,
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
        const expiresAt = typeof d?.expiresAt === "string" ? d.expiresAt : d?.expiresAt ? String(d.expiresAt) : null;
        const usage = Array.isArray(d?.usage) ? d.usage : [];
        setCompute((c) => ({ ...c, creditsBalance: bal, creditsVisible: true, creditsExpiresAt: expiresAt, usageHistory: usage }));
      })
      .catch(() => {
        // Not signed in or endpoint not available; keep credits hidden.
      });
  }, []);

  const resetError = useCallback(() => {
    setState((s) => ({ ...s, errorMessage: "" }));
  }, []);

  const clearCompute = useCallback(() => {
    setCompute((c) => ({ ...c, pre: null, post: null, live: null, lastConsumedCredits: null, hadPreview: false }));
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
      setCompute((c) => ({ ...c, pre, post: null, live: null, lastInputBytes: inputBytes, hadPreview: true }));
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

      // Enforce: if this run exceeds free tier, guest users cannot proceed unless they confirm a downgrade attempt.
      // Downgrade here means "try a light run" by enforcing a strict client-side timeout (partial results possible).
      const preForGate = compute.pre || prepare({ inputBytes, steps, expectedWallMs: meta.expectedWallMs });
      const exceedsFree = preForGate.estimate.paidUnitsUsed > 0;
      let downgradeFreeTierOnly = false;
      if (exceedsFree && !compute.creditsVisible) {
        const ok = window.confirm(
          "This run may exceed the free tier. Guests cannot spend credits. Continue with a light run that may return partial results?"
        );
        if (!ok) return null;
        downgradeFreeTierOnly = true;
      }
      if (exceedsFree && compute.creditsVisible && preForGate.estimate.creditShortfall) {
        const ok = window.confirm(
          "This run may exceed the free tier and you may not have enough credits for the paid portion. Continue with a light run that may return partial results?"
        );
        if (!ok) return null;
        downgradeFreeTierOnly = true;
      }

      setState({ loading: true, errorMessage: "" });
      const start = Date.now();

      // Live meter: update a running estimate from elapsed time.
      const liveInterval = window.setInterval(() => {
        const elapsed = Date.now() - start;
        const live = estimatePostRunCost({
          toolId: toolId || undefined,
          computeClass: profile?.computeClass,
          inputBytes,
          steps,
          actualWallMs: elapsed,
          sessionFreeUsedUnits: compute.sessionFreeUsedUnits,
          creditsBalance: compute.creditsVisible ? compute.creditsBalance : null,
        });
        setCompute((c) => ({ ...c, live }));
      }, 250);

      const timeout =
        timeoutMs > 0
          ? setTimeout(() => {
              abortRef.current?.abort();
              if (toolId) {
                emitInternalToolEvent({ type: "tool_timeout", toolId, durationMs: Date.now() - start, success: false });
              }
            }, timeoutMs)
          : null;

      // Free-tier-only attempt: enforce a tighter timeout to avoid surprise usage.
      // This is approximate and is meant to keep runs safely bounded on weak devices.
      const freeTierTimeout =
        downgradeFreeTierOnly && profile?.computeClass !== "A"
          ? setTimeout(() => {
              abortRef.current?.abort();
            }, 2500)
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

        // Deduct credits for paid portion (signed in only), but never for the free portion.
        let consumedCredits = 0;
        let remainingCredits: number | null = compute.creditsVisible ? (compute.creditsBalance ?? 0) : null;
        if (toolId && compute.creditsVisible && post.estimate.estimatedCredits > 0 && !downgradeFreeTierOnly) {
          const hadPreview = Boolean(compute.hadPreview || compute.pre);
          const r = await fetch("/api/credits/consume", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              toolId,
              inputBytes,
              durationMs: actualMs,
              featureFlags: {},
              hadPreview,
            }),
          });
          if (r.ok) {
            const d = await r.json().catch(() => ({}));
            consumedCredits = typeof d?.consumed === "number" ? d.consumed : 0;
            remainingCredits = typeof d?.remaining === "number" ? d.remaining : remainingCredits;
          } else if (r.status === 402) {
            // Paid portion denied by server. Keep the run result but inform the user.
            setState((s) => ({ ...s, errorMessage: "Your run finished, but the paid portion could not be applied due to insufficient credits." }));
          }
        }

        setCompute((c) => ({
          ...c,
          post,
          live: null,
          sessionFreeUsedUnits: newSessionUsed,
          lastConsumedCredits: consumedCredits,
          creditsBalance: remainingCredits ?? c.creditsBalance,
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
        if (liveInterval) clearInterval(liveInterval);
        if (freeTierTimeout) clearTimeout(freeTierTimeout);
        inFlightRef.current = false;
      }
    },
    [minIntervalMs, timeoutMs, toolId, profile, compute.pre, compute.lastInputBytes, compute.sessionFreeUsedUnits, compute.creditsBalance, compute.creditsVisible, compute.hadPreview, prepare]
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


