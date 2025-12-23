import { prisma } from "@/lib/db/prisma";
import { computeMeteringTs } from "@/lib/jobs/metering";
import { anonKeyFromRequest, getDayUtc } from "@/lib/jobs/identity";
import { getJobRunnerToolLimits } from "@/config/computeLimits";
import { JobDeniedError } from "@/lib/jobs/errors";

type JobStatus = "queued" | "running" | "succeeded" | "failed" | "denied" | "cancelled";

function nowMs() {
  return Date.now();
}

function safeInt(n: unknown) {
  const v = typeof n === "number" ? n : Number(n);
  return Number.isFinite(v) ? Math.max(0, Math.round(v)) : 0;
}

function safeError(err: unknown) {
  const e = err as any;
  return {
    code: typeof e?.code === "string" ? e.code : "JOB_FAILED",
    message: typeof e?.message === "string" ? e.message.slice(0, 500) : "Job failed",
    stack: typeof e?.stack === "string" ? e.stack.slice(0, 2_000) : null,
  };
}

function safeJson(value: unknown, maxBytes = 16_000): any | null {
  try {
    const s = JSON.stringify(value);
    if (Buffer.byteLength(s, "utf8") > maxBytes) return null;
    return JSON.parse(s);
  } catch {
    return null;
  }
}

async function addJobEvent(jobId: string, level: "info" | "warn" | "error", message: string, data?: any) {
  const jobEvent = (prisma as any).jobEvent as { create: (args: any) => Promise<any> };
  await jobEvent.create({ data: { jobId, level, message, data: data ?? null } });
}

async function getOrInitDailyUsage(params: { dayUtc: string; userId: string | null; anonKey: string | null; toolId: string | null }) {
  const dailyUsage = (prisma as any).dailyUsage as {
    upsert: (args: any) => Promise<any>;
  };
  return dailyUsage.upsert({
    where: { dayUtc_userId_anonKey_toolId: { dayUtc: params.dayUtc, userId: params.userId, anonKey: params.anonKey, toolId: params.toolId } },
    create: { dayUtc: params.dayUtc, userId: params.userId, anonKey: params.anonKey, toolId: params.toolId, usedMs: 0, usedCredits: 0, requestCount: 0, lastRequestAt: null },
    update: {},
  });
}

export async function runWithMetering<T>(params: {
  req: Request;
  toolId: string;
  userId?: string | null;
  anonKey?: string | null;
  inputBytes?: number | null;
  requestId?: string | null;
  idempotencyKey?: string | null;
  execute: (ctx: { jobId: string }) => Promise<T>;
}): Promise<{
  jobId: string;
  status: JobStatus;
  durationMs: number;
  freeTierAppliedMs: number;
  chargedCredits: number;
  remainingFreeMsToday: number;
  result?: T;
}> {
  const toolId = String(params.toolId || "").trim();
  const limits = getJobRunnerToolLimits(toolId);
  if (!limits) throw new Error("UNKNOWN_TOOL");

  const userId = params.userId || null;
  const anonKey = params.anonKey || (!userId ? anonKeyFromRequest(params.req) : null);

  if (userId && !limits.allowAuthed) throw new Error("TOOL_DENIED");
  if (!userId && !limits.allowAnonymous) throw new Error("TOOL_DENIED");
  if (!userId && !anonKey) throw new Error("ANON_KEY_REQUIRED");

  const inputBytes = params.inputBytes == null ? null : safeInt(params.inputBytes);
  const maxInput = userId ? limits.maxInputBytesFreeAuthed : limits.maxInputBytesFreeAnon;
  if (inputBytes != null && inputBytes > maxInput) throw new Error("INPUT_TOO_LARGE");

  const idempotencyKey = params.idempotencyKey ? String(params.idempotencyKey).trim() : null;

  const jobModel = (prisma as any).job as {
    findUnique: (args: any) => Promise<any>;
    create: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
  };

  if (idempotencyKey) {
    const existing = await jobModel.findUnique({ where: { idempotencyKey } });
    if (existing && existing.status === "succeeded") {
      return {
        jobId: existing.id,
        status: existing.status,
        durationMs: safeInt(existing.durationMs),
        freeTierAppliedMs: safeInt(existing.freeTierAppliedMs),
        chargedCredits: safeInt(existing.chargedCredits),
        remainingFreeMsToday: 0,
        result: existing.resultJson as T,
      };
    }
    if (existing && existing.status === "running") {
      return {
        jobId: existing.id,
        status: existing.status,
        durationMs: safeInt(existing.durationMs),
        freeTierAppliedMs: safeInt(existing.freeTierAppliedMs),
        chargedCredits: safeInt(existing.chargedCredits),
        remainingFreeMsToday: 0,
      };
    }
  }

  const job = await jobModel.create({
    data: {
      userId,
      anonKey,
      toolId,
      status: "queued",
      inputBytes,
      requestId: params.requestId ? String(params.requestId).slice(0, 120) : null,
      idempotencyKey,
    },
    select: { id: true },
  });
  const jobId = String(job.id);
  await addJobEvent(jobId, "info", "job_queued", { toolId });

  const dayUtc = getDayUtc();
  const usageRow = await getOrInitDailyUsage({ dayUtc, userId, anonKey, toolId: null });
  const toolUsageRow = await getOrInitDailyUsage({ dayUtc, userId, anonKey, toolId });

  const requestCount = safeInt(toolUsageRow.requestCount);
  const maxRequestsPerDay = 200;
  if (requestCount >= maxRequestsPerDay) {
    await jobModel.update({ where: { id: jobId }, data: { status: "denied", errorCode: "RATE_LIMITED", finishedAt: new Date() } });
    await addJobEvent(jobId, "warn", "job_denied_rate_limit", { requestCount });
    return { jobId, status: "denied", durationMs: 0, freeTierAppliedMs: 0, chargedCredits: 0, remainingFreeMsToday: 0 };
  }

  const freeLimit = userId ? limits.freeMsPerDayAuthed : limits.freeMsPerDayAnon;
  const usedMsToday = safeInt(toolUsageRow.usedMs);
  const remainingFreeMsToday = Math.max(0, freeLimit - usedMsToday);

  await jobModel.update({ where: { id: jobId }, data: { status: "running", startedAt: new Date() } });
  await addJobEvent(jobId, "info", "job_started", {});

  const start = nowMs();
  try {
    const result = await params.execute({ jobId });
    const durationMs = Math.min(limits.maxRunMsHardCap, Math.max(0, nowMs() - start));

    const metered = computeMeteringTs({
      durationMs,
      freeRemainingMsAtStart: remainingFreeMsToday,
      creditsPerMsPaid: limits.creditsPerMsPaid,
      maxRunMsHardCap: limits.maxRunMsHardCap,
    });

    const newRemaining = Math.max(0, remainingFreeMsToday - metered.freeTierAppliedMs);

    await prisma.$transaction(async (tx) => {
      const dailyUsage = (tx as any).dailyUsage as { update: (args: any) => Promise<any> };
      const jobUpdate = (tx as any).job as { update: (args: any) => Promise<any> };

      await dailyUsage.update({
        where: { id: toolUsageRow.id },
        data: {
          usedMs: safeInt(toolUsageRow.usedMs) + metered.durationMs,
          usedCredits: safeInt(toolUsageRow.usedCredits) + metered.chargedCredits,
          requestCount: safeInt(toolUsageRow.requestCount) + 1,
          lastRequestAt: new Date(),
        },
      });
      await dailyUsage.update({
        where: { id: usageRow.id },
        data: {
          usedMs: safeInt(usageRow.usedMs) + metered.durationMs,
          usedCredits: safeInt(usageRow.usedCredits) + metered.chargedCredits,
          requestCount: safeInt(usageRow.requestCount) + 1,
          lastRequestAt: new Date(),
        },
      });

      await jobUpdate.update({
        where: { id: jobId },
        data: {
          status: "succeeded",
          finishedAt: new Date(),
          durationMs: metered.durationMs,
          freeTierAppliedMs: metered.freeTierAppliedMs,
          chargedCredits: metered.chargedCredits,
          resultJson: safeJson(result),
        },
      });
    });

    await addJobEvent(jobId, "info", "job_succeeded", { durationMs: metered.durationMs, chargedCredits: metered.chargedCredits });

    return {
      jobId,
      status: "succeeded",
      durationMs: metered.durationMs,
      freeTierAppliedMs: metered.freeTierAppliedMs,
      chargedCredits: metered.chargedCredits,
      remainingFreeMsToday: newRemaining,
      result,
    };
  } catch (err) {
    const durationMs = Math.min(limits.maxRunMsHardCap, Math.max(0, nowMs() - start));
    if (err instanceof JobDeniedError) {
      await jobModel.update({
        where: { id: jobId },
        data: {
          status: "denied",
          finishedAt: new Date(),
          durationMs,
          errorCode: err.code,
          errorMessage: String(err.message || "").slice(0, 500),
        },
      });
      await addJobEvent(jobId, "warn", "job_denied", { code: err.code });
      return { jobId, status: "denied", durationMs, freeTierAppliedMs: 0, chargedCredits: 0, remainingFreeMsToday };
    }
    const se = safeError(err);

    await jobModel.update({
      where: { id: jobId },
      data: {
        status: "failed",
        finishedAt: new Date(),
        durationMs,
        errorCode: se.code,
        errorMessage: se.message,
        errorStack: se.stack,
      },
    });
    await addJobEvent(jobId, "error", "job_failed", { code: se.code });

    return { jobId, status: "failed", durationMs, freeTierAppliedMs: 0, chargedCredits: 0, remainingFreeMsToday };
  }
}


