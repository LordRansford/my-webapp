import { prisma } from "@/lib/db/prisma";
import { getJobRunnerToolLimits } from "@/config/computeLimits";
import { getOrCreateCredits } from "@/lib/credits/store";
import { runInRunner } from "@/lib/runner/client";

export type ComputeMetrics = {
  cpuMs: number;
  memoryMb: number;
  wallTimeMs: number;
  aborted: boolean;
};

export async function runComputeJob<T>(params: {
  userId: string | null;
  anonKey: string | null;
  toolId: string;
  inputs: unknown;
  limits: {
    maxRunMs: number;
    maxOutputBytes: number;
    maxMemoryMb: number;
    maxSteps?: number;
  };
}): Promise<{ result: T; metrics: ComputeMetrics }> {
  const started = Date.now();
  const toolId = String(params.toolId || "").trim();
  const limits = getJobRunnerToolLimits(toolId);
  if (!limits) {
    return {
      result: null as any,
      metrics: { cpuMs: 0, memoryMb: 0, wallTimeMs: 0, aborted: false },
    };
  }

  // Hard caps (deny by default, bounded execution only).
  const maxRunMs = Math.max(1, Math.min(limits.maxRunMsHardCap, Math.round(params.limits.maxRunMs)));
  const maxOutputBytes = Math.max(1, Math.min(200_000, Math.round(params.limits.maxOutputBytes)));
  const maxMemoryMb = Math.max(1, Math.min(256, Math.round(params.limits.maxMemoryMb)));
  const maxSteps = typeof params.limits.maxSteps === "number" ? Math.max(1, Math.min(1_000_000, Math.round(params.limits.maxSteps))) : undefined;

  // Credit check (simple, conservative): if user is authed and has zero credits, deny runs that likely exceed free tier.
  // Free tier is still applied in metering, but we fail closed when the worst case cannot be covered.
  if (params.userId) {
    const credits = await getOrCreateCredits(params.userId);
    const dayUtc = new Date().toISOString().slice(0, 10);
    const dailyUsage = (prisma as any).dailyUsage as { findUnique: (args: any) => Promise<any> };
    const usage = await dailyUsage
      .findUnique({ where: { dayUtc_userId_anonKey_toolId: { dayUtc, userId: params.userId, anonKey: null, toolId } } })
      .catch(() => null);
    const usedMs = typeof usage?.usedMs === "number" ? usage.usedMs : 0;
    const remainingFree = Math.max(0, limits.freeMsPerDayAuthed - usedMs);
    const worstPaidMs = Math.max(0, maxRunMs - remainingFree);
    const worstCredits = worstPaidMs > 0 ? Math.ceil(worstPaidMs * limits.creditsPerMsPaid) : 0;
    if (worstCredits > 0 && (credits.balance ?? 0) < worstCredits) {
      return {
        result: { ok: false, error: { code: "INSUFFICIENT_CREDITS", message: "Not enough credits for the selected limits." } } as any,
        metrics: { cpuMs: 0, memoryMb: 0, wallTimeMs: Date.now() - started, aborted: false },
      };
    }
  }

  // Only allow compute via the runner boundary in this repo stage.
  const response = await runInRunner({
    toolId,
    jobId: "n/a",
    payload: params.inputs,
    limits: { maxRunMs, maxOutputBytes, maxMemoryMb, maxSteps },
  });

  const wallTimeMs = Date.now() - started;
  const runMs = typeof response.metrics?.runMs === "number" ? response.metrics.runMs : wallTimeMs;
  const peakMemoryMb = typeof response.metrics?.peakMemoryMb === "number" ? response.metrics.peakMemoryMb : undefined;
  const aborted = response.error?.code === "SAFE_FETCH_TIMEOUT" || response.error?.code === "TIMEOUT";

  // Observability without leakage
  console.log("compute:run", {
    toolId,
    wallTimeMs,
    cpuMs: runMs,
    memoryMb: peakMemoryMb ?? maxMemoryMb,
    aborted,
    ok: response.ok,
  });

  return {
    result: response as any,
    metrics: {
      cpuMs: Math.max(0, Math.round(runMs)),
      memoryMb: Math.max(0, Math.round(peakMemoryMb ?? maxMemoryMb)),
      wallTimeMs: Math.max(0, Math.round(wallTimeMs)),
      aborted,
    },
  };
}


