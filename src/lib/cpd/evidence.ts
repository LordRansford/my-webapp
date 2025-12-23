export { evidenceFromActivity, buildEvidenceRecords, getEvidenceRulesVersion } from "@/lib/cpd/evidence.core";
export type { EvidenceRecord, EvidenceSource } from "@/lib/cpd/evidence.core";

import { prisma } from "@/lib/db/prisma";

export type EvidenceType = "progress" | "quiz" | "tool" | "manual";

export type RequestMeta = {
  ip?: string | null;
  userAgent?: string | null;
};

function safeJsonValue(value: any, depth = 0): any {
  if (depth > 4) return null;
  if (value === null) return null;
  if (value === undefined) return null;
  if (typeof value === "string") {
    // Avoid storing secrets/tokens. Basic heuristic only.
    const s = value.length > 2_000 ? value.slice(0, 2_000) : value;
    const lower = s.toLowerCase();
    if (lower.includes("sk_") || lower.includes("whsec_") || lower.includes("bearer ")) return "[redacted]";
    return s;
  }
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "boolean") return value;
  if (Array.isArray(value)) return value.slice(0, 50).map((v) => safeJsonValue(v, depth + 1));
  if (typeof value === "object") {
    const out: Record<string, any> = {};
    const keys = Object.keys(value).slice(0, 50);
    for (const k of keys) out[k] = safeJsonValue((value as any)[k], depth + 1);
    return out;
  }
  return null;
}

export async function recordEvidence(params: {
  userId: string;
  courseId: string;
  evidenceType: EvidenceType;
  payload: any;
  requestMeta?: RequestMeta;
}) {
  const userId = String(params.userId || "").trim();
  const courseId = String(params.courseId || "").trim();
  const evidenceType = params.evidenceType;
  const payload = safeJsonValue(params.payload);

  const ip = params.requestMeta?.ip ? String(params.requestMeta.ip).slice(0, 128) : null;
  const userAgent = params.requestMeta?.userAgent ? String(params.requestMeta.userAgent).slice(0, 256) : null;

  const evidence = (prisma as any).courseCompletionEvidence as {
    create: (args: any) => Promise<any>;
  };
  const audit = (prisma as any).auditEvent as {
    create: (args: any) => Promise<any>;
  };

  const created = await evidence.create({
    data: {
      userId,
      courseId,
      evidenceType,
      payload,
    },
  });

  await audit.create({
    data: {
      actorUserId: userId,
      action: "EVIDENCE_RECORDED",
      entityType: "evidence",
      entityId: created.id,
      details: { courseId, evidenceType },
      ip,
      userAgent,
    },
  });

  return created;
}


