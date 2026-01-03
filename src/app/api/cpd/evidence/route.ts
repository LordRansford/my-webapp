import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { withRequestLogging } from "@/lib/security/requestLog";
import { requireSameOrigin } from "@/lib/security/origin";
import { rateLimit } from "@/lib/security/rateLimit";
import { recordEvidence, type EvidenceType } from "@/lib/cpd/evidence";
import type { CourseId } from "@/lib/cpd/courseEvidence";

type Body = {
  courseId?: string;
  evidenceType?: EvidenceType;
  payload?: any;
};

const ALLOWED_TYPES = new Set<EvidenceType>(["progress", "quiz", "tool", "manual"]);
const ALLOWED_COURSES = new Set<CourseId>(["cybersecurity", "ai", "software-architecture", "data", "digitalisation", "network-models"]);

export async function POST(req: Request) {
  return withRequestLogging(req, { route: "POST /api/cpd/evidence" }, async () => {
    const originBlock = requireSameOrigin(req);
    if (originBlock) return originBlock;

    const limited = rateLimit(req, { keyPrefix: "cpd-evidence", limit: 30, windowMs: 60_000 });
    if (limited) return limited;

    const session = await getServerSession(authOptions).catch(() => null);
    const userId = session?.user?.id || "";
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = (await req.json().catch(() => null)) as Body | null;
    const courseId = typeof body?.courseId === "string" ? body.courseId.trim() : "";
    const evidenceType = body?.evidenceType;
    const payload = body?.payload;

    if (!courseId || !ALLOWED_COURSES.has(courseId as CourseId)) {
      return NextResponse.json({ message: "Invalid courseId" }, { status: 400 });
    }
    if (!evidenceType || !ALLOWED_TYPES.has(evidenceType)) {
      return NextResponse.json({ message: "Invalid evidenceType" }, { status: 400 });
    }

    // Basic payload guardrails: prevent large blobs.
    const payloadStr = JSON.stringify(payload ?? null);
    if (payloadStr.length > 25_000) {
      return NextResponse.json({ message: "Payload too large" }, { status: 413 });
    }

    const forwarded = req.headers.get("x-forwarded-for") || "";
    const ip = forwarded.split(",")[0]?.trim() || req.headers.get("x-real-ip") || null;
    const userAgent = req.headers.get("user-agent") || null;

    const row = await recordEvidence({
      userId,
      courseId,
      evidenceType,
      payload,
      requestMeta: { ip, userAgent },
    });

    return NextResponse.json({ ok: true, evidenceId: row.id }, { status: 200 });
  });
}


