import { prisma } from "@/lib/db/prisma";
import { runWithMetering } from "@/lib/jobs/runWithMetering";
import { getJobHandler } from "@/lib/jobs/registry";
import { createNote, updateRun } from "@/lib/workspace/store";

export async function runWorkerTick(params: { limit: number }) {
  const limit = Math.max(1, Math.min(25, params.limit));
  const jobModel = (prisma as any).job as {
    findMany: (args: any) => Promise<any[]>;
    update: (args: any) => Promise<any>;
  };

  const queued = await jobModel.findMany({
    where: { status: "queued" },
    orderBy: { createdAt: "asc" },
    take: limit,
    select: { id: true, toolId: true, userId: true, anonKey: true, inputBytes: true, payloadJson: true, idempotencyKey: true, requestId: true },
  });

  const processed: Array<{ jobId: string; status: string }> = [];

  for (const j of queued) {
    const jobId = String(j.id);
    const toolId = String(j.toolId);
    const handler = getJobHandler(toolId);
    if (!handler) {
      await jobModel.update({ where: { id: jobId }, data: { status: "failed", errorCode: "HANDLER_MISSING", errorMessage: "No handler registered" } });
      processed.push({ jobId, status: "failed" });
      continue;
    }

    // Worker uses same metering wrapper. For queued jobs, we still create a metered job row,
    // but we also keep the original queued job updated for status visibility.
    try {
      await jobModel.update({ where: { id: jobId }, data: { status: "running", startedAt: new Date() } });

      const out = await runWithMetering({
        req: new Request("http://localhost/worker"), // no real headers
        toolId,
        userId: j.userId ? String(j.userId) : null,
        anonKey: j.anonKey ? String(j.anonKey) : null,
        inputBytes: j.inputBytes ?? null,
        requestId: j.requestId ? String(j.requestId) : null,
        idempotencyKey: j.idempotencyKey ? String(j.idempotencyKey) : null,
        execute: async ({ jobId: meteredJobId }) =>
          handler({
            jobId: meteredJobId,
            toolId,
            userId: j.userId ? String(j.userId) : null,
            anonKey: j.anonKey ? String(j.anonKey) : null,
            payload: j.payloadJson,
          }),
      });

      await jobModel.update({
        where: { id: jobId },
        data: {
          status: out.status,
          finishedAt: new Date(),
          durationMs: out.durationMs,
          freeTierAppliedMs: out.freeTierAppliedMs,
          chargedCredits: out.chargedCredits,
          resultJson: (out as any).result ?? null,
        },
      });

      const ws = (j.payloadJson as any)?.__workspace;
      if (ws?.runId && ws?.projectId) {
        await updateRun({
          runId: String(ws.runId),
          status: out.status,
          outputJson: (out as any).result ?? null,
          metricsJson: { durationMs: out.durationMs, freeTierAppliedMs: out.freeTierAppliedMs, chargedCredits: out.chargedCredits },
          errorJson: out.status === "succeeded" ? null : { code: out.status, message: "Run did not succeed." },
        }).catch(() => null);
        if (typeof ws.note === "string" && ws.note.trim()) {
          await createNote({ projectId: String(ws.projectId), runId: String(ws.runId), content: ws.note.trim() }).catch(() => null);
        }
      }

      console.log("worker:job", { jobId, toolId, status: out.status, durationMs: out.durationMs, chargedCredits: out.chargedCredits });
      processed.push({ jobId, status: out.status });
    } catch (err: any) {
      await jobModel.update({
        where: { id: jobId },
        data: { status: "failed", finishedAt: new Date(), errorCode: "WORKER_FAILED", errorMessage: String(err?.message || "Worker failed").slice(0, 500) },
      });
      console.log("worker:job_failed", { jobId, toolId, message: String(err?.message || "unknown") });
      processed.push({ jobId, status: "failed" });
    }
  }

  return { processedCount: processed.length, processed };
}


