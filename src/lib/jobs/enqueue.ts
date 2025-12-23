import { prisma } from "@/lib/db/prisma";
import { getJobRunnerToolLimits } from "@/config/computeLimits";

function safeJson(value: unknown, maxBytes = 16_000): any | null {
  try {
    const s = JSON.stringify(value);
    if (Buffer.byteLength(s, "utf8") > maxBytes) return null;
    return JSON.parse(s);
  } catch {
    return null;
  }
}

export async function enqueueJob(params: {
  toolId: string;
  userId: string | null;
  anonKey: string | null;
  inputBytes: number | null;
  idempotencyKey: string | null;
  requestId: string | null;
  payload: any;
}) {
  const toolId = String(params.toolId || "").trim();
  const limits = getJobRunnerToolLimits(toolId);
  if (!limits) throw new Error("UNKNOWN_TOOL");

  const jobModel = (prisma as any).job as {
    findUnique: (args: any) => Promise<any>;
    create: (args: any) => Promise<any>;
  };

  if (params.idempotencyKey) {
    const existing = await jobModel.findUnique({ where: { idempotencyKey: params.idempotencyKey } });
    if (existing) return { jobId: String(existing.id), status: String(existing.status) };
  }

  const job = await jobModel.create({
    data: {
      toolId,
      userId: params.userId,
      anonKey: params.anonKey,
      inputBytes: params.inputBytes ?? null,
      status: "queued",
      idempotencyKey: params.idempotencyKey,
      requestId: params.requestId,
      payloadJson: safeJson(params.payload),
    },
    select: { id: true, status: true },
  });

  return { jobId: String(job.id), status: String(job.status) };
}


