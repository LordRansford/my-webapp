import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { rateLimit } from "@/lib/security/rateLimit";
import { anonKeyFromRequest } from "@/lib/jobs/identity";
import { enqueueJob } from "@/lib/jobs/enqueue";
import { runWithMetering } from "@/lib/jobs/runWithMetering";
import { getJobHandler } from "@/lib/jobs/registry";
import { getJobRunnerToolLimits } from "@/config/computeLimits";
import { validateCodeRunnerPayloadTs } from "@/lib/jobs/codeRunnerGuard";
import { createNote, createRun, getProject, updateRun } from "@/lib/workspace/store";
import { WORKSPACE_COOKIE, getOrCreateWorkspaceSession, newWorkspaceTokenRaw, signWorkspaceToken, verifyWorkspaceToken } from "@/lib/workspace/session";
import { estimateRunCost, type ComplexityPreset } from "@/lib/billing/estimateRunCost";
import { prisma } from "@/lib/db/prisma";
import type { ComputeError } from "@/lib/contracts/compute";
import { logWarn } from "@/lib/telemetry/log";

type Body = {
  toolId?: string;
  inputBytes?: number;
  idempotencyKey?: string;
  mode?: "enqueue" | "inline";
  payload?: any;
  projectId?: string;
  note?: string;
  requestedComplexityPreset?: ComplexityPreset;
};

function getCookie(req: Request, name: string) {
  const raw = req.headers.get("cookie") || "";
  const parts = raw.split(";").map((p) => p.trim());
  for (const p of parts) {
    const idx = p.indexOf("=");
    if (idx <= 0) continue;
    const k = p.slice(0, idx);
    const v = p.slice(idx + 1);
    if (k === name) return decodeURIComponent(v);
  }
  return null;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Body | null;
  const toolId = typeof body?.toolId === "string" ? body.toolId.trim() : "";

  const baseLimited = rateLimit(req, { keyPrefix: "jobs-create", limit: 30, windowMs: 60_000 });
  if (baseLimited) return baseLimited;

  if (toolId === "code-runner") {
    const strict = rateLimit(req, { keyPrefix: "jobs-create-code-runner", limit: 10, windowMs: 60_000 });
    if (strict) return strict;
  }
  if (!toolId) return NextResponse.json({ error: "Missing toolId" }, { status: 400 });

  const limits = getJobRunnerToolLimits(toolId);
  if (!limits) return NextResponse.json({ error: "Unknown toolId" }, { status: 400 });

  const session = await getServerSession(authOptions).catch(() => null);
  const userId = session?.user?.id || null;
  const anonKey = userId ? null : anonKeyFromRequest(req);

  // Optional workspace association
  const projectId = typeof body?.projectId === "string" ? body.projectId.trim() : "";
  const note = typeof body?.note === "string" ? body.note.slice(0, 8000) : "";

  let workspaceSessionId: string | null = null;
  let tokenRawToSet: string | null = null;
  if (!userId) {
    const signed = getCookie(req, WORKSPACE_COOKIE.name);
    const raw = signed ? verifyWorkspaceToken(signed) : null;
    const tokenRaw = raw || newWorkspaceTokenRaw();
    const ws = await getOrCreateWorkspaceSession({ tokenRaw });
    workspaceSessionId = String(ws.id);
    if (!raw) tokenRawToSet = tokenRaw;
  }

  if (!userId && !limits.allowAnonymous) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  if (!userId && !anonKey) return NextResponse.json({ error: "Anonymous key unavailable" }, { status: 400 });

  const inputBytes = typeof body?.inputBytes === "number" ? Math.max(0, Math.round(body.inputBytes)) : null;
  const idempotencyKey = typeof body?.idempotencyKey === "string" ? body.idempotencyKey.trim() : null;
  const mode = body?.mode === "inline" ? "inline" : "enqueue";
  const requestedComplexityPreset = (body?.requestedComplexityPreset || "standard") as ComplexityPreset;

  const requestId = req.headers.get("x-request-id") || null;

  if (toolId === "code-runner") {
    const tight = rateLimit(req, { keyPrefix: "code-runner", limit: 10, windowMs: 60_000 });
    if (tight) return tight;
    const v = validateCodeRunnerPayloadTs(body?.payload);
    if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });
  }

  // Server-side cost estimate and gating (authoritative).
  // This reuses the same billing rule logic as the credits UI.
  const estimate = await estimateRunCost({
    req,
    userId,
    toolId,
    inputBytes: inputBytes ?? 0,
    requestedComplexityPreset,
  });
  if (!estimate.allowed) {
    const alt =
      requestedComplexityPreset === "light"
        ? null
        : await estimateRunCost({
            req,
            userId,
            toolId,
            inputBytes: inputBytes ?? 0,
            requestedComplexityPreset: "light",
          });
    const hint =
      estimate.reason && estimate.reason.toLowerCase().includes("sign in")
        ? "Sign in to run paid compute."
        : estimate.reason && estimate.reason.toLowerCase().includes("credits")
          ? "Try the free tier mode, use a lighter preset, or reduce input size."
          : "Use a lighter preset or reduce input size.";
    const failureReason =
      estimate.reason && estimate.reason.toLowerCase().includes("sign in")
        ? "auth_required"
        : estimate.reason && estimate.reason.toLowerCase().includes("credits")
          ? "credits_insufficient"
          : estimate.reason && estimate.reason.toLowerCase().includes("too large")
            ? "estimate_exceeded"
            : "estimate_exceeded";
    const errorObj: ComputeError = {
      code: "RUN_BLOCKED",
      message: estimate.reason || "Run blocked.",
      hint,
    };
    logWarn("compute.run_blocked", { toolId, userId: userId || null, reason: estimate.reason || null });
    const res = NextResponse.json(
      {
        error: errorObj.message,
        code: errorObj.code,
        failureReason,
        errorObj,
        estimate,
        alternativeFreeTier: alt?.allowed ? { preset: "light", estimate: alt } : null,
      },
      { status: 402 }
    );
    if (tokenRawToSet) res.headers.append("set-cookie", `${WORKSPACE_COOKIE.name}=${encodeURIComponent(signWorkspaceToken(tokenRawToSet))}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${WORKSPACE_COOKIE.maxAgeSeconds}`);
    return res;
  }

  if (mode === "inline") {
    const handler = getJobHandler(toolId);
    if (!handler) return NextResponse.json({ error: "Tool not available for inline execution" }, { status: 503 });

    let runId: string | null = null;
    if (projectId) {
      const p = await getProject({ projectId });
      const allowed = userId ? p?.ownerId === userId : p?.ownerId == null && p?.workspaceSessionId === workspaceSessionId;
      if (!p || !allowed) return NextResponse.json({ error: "Project not found." }, { status: 404 });
      const run = await createRun({ projectId, toolId, status: "running", inputJson: body?.payload ?? null });
      runId = String(run.id);
    }

    const out = await runWithMetering({
      req,
      toolId,
      userId,
      anonKey,
      inputBytes,
      idempotencyKey,
      requestId,
      execute: async ({ jobId }) => handler({ jobId, toolId, userId, anonKey, payload: body?.payload ?? null }),
    });

    if (runId && projectId) {
      await updateRun({
        runId,
        status: out.status,
        outputJson: (out as any).result ?? null,
        metricsJson: { durationMs: out.durationMs, freeTierAppliedMs: out.freeTierAppliedMs, chargedCredits: out.chargedCredits },
        errorJson: out.status === "succeeded" ? null : { code: "JOB_FAILED", message: "Run did not succeed." },
      });
      if (note.trim()) await createNote({ projectId, runId, content: note.trim() });
    }

    // Attach the estimate for client-side transparency (matches Job.estimatedCostCredits where possible).
    const res = NextResponse.json({ ...out, estimate }, { status: 200 });
    if (tokenRawToSet) res.headers.append("set-cookie", `${WORKSPACE_COOKIE.name}=${encodeURIComponent(signWorkspaceToken(tokenRawToSet))}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${WORKSPACE_COOKIE.maxAgeSeconds}`);
    return res;
  }

  let workspaceMeta: any = null;
  if (projectId) {
    const p = await getProject({ projectId });
    const allowed = userId ? p?.ownerId === userId : p?.ownerId == null && p?.workspaceSessionId === workspaceSessionId;
    if (!p || !allowed) return NextResponse.json({ error: "Project not found." }, { status: 404 });
    const run = await createRun({ projectId, toolId, status: "queued", inputJson: body?.payload ?? null });
    workspaceMeta = { projectId, runId: String(run.id), note: note.trim() || null };
  }

  const created = await enqueueJob({
    toolId,
    userId,
    anonKey,
    inputBytes,
    idempotencyKey,
    requestId,
    payload: workspaceMeta ? { ...(body?.payload ?? null), __workspace: workspaceMeta } : body?.payload ?? null,
  });

  // Best effort: persist estimate on the queued job row for history.
  try {
    const jobModel = (prisma as any).job as { update: (args: any) => Promise<any> };
    if (created?.jobId) {
      await jobModel.update({ where: { id: String(created.jobId) }, data: { estimatedCostCredits: estimate?.estimatedCredits ?? 0 } });
    }
  } catch {
    // ignore
  }

  const res = NextResponse.json({ ...created, estimate }, { status: 200 });
  if (tokenRawToSet) res.headers.append("set-cookie", `${WORKSPACE_COOKIE.name}=${encodeURIComponent(signWorkspaceToken(tokenRawToSet))}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${WORKSPACE_COOKIE.maxAgeSeconds}`);
  return res;
}


