import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { listLearningRecordsForUser } from "@/lib/learning/records";
import { issueCertificate } from "@/lib/certificates/store";
import { getCourseLevelMeta } from "@/lib/cpd/courseEvidence";
import { withRequestLogging } from "@/lib/security/requestLog";
import { requireSameOrigin } from "@/lib/security/origin";
import { rateLimit } from "@/lib/security/rateLimit";

export async function POST(req: Request) {
  return withRequestLogging(req, { route: "POST /api/certificates/issue" }, async () => {
    const originBlock = requireSameOrigin(req);
    if (originBlock) return originBlock;
    const limited = rateLimit(req, { keyPrefix: "cert-issue", limit: 10, windowMs: 60_000 });
    if (limited) return limited;

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = (await req.json().catch(() => null)) as any;
    const courseId = String(body?.courseId || "").trim();
    const levelId = String(body?.levelId || "").trim();
    if (!courseId || !levelId) return NextResponse.json({ message: "Missing courseId or levelId" }, { status: 400 });

    const records = listLearningRecordsForUser(session.user.id);
    const record = records.find((r) => r.courseId === courseId && r.levelId === levelId) || null;
    if (!record || record.completionStatus !== "completed" || !record.completionDate) {
      return NextResponse.json({ message: "Completion required" }, { status: 409 });
    }

    const meta = getCourseLevelMeta(courseId as any, levelId as any);
    const courseTitle = meta?.title || courseId;
    const hoursEarned = Math.round((Number(record.timeSpentMinutes || 0) / 60) * 10) / 10;

    const cert = issueCertificate({
      userId: session.user.id,
      courseId,
      levelId,
      courseTitle,
      hoursEarned,
      completionDate: record.completionDate,
      learnerName: session.user?.name || "",
    });

    if (cert.revokedAt) {
      return NextResponse.json({ message: "Certificate revoked" }, { status: 409 });
    }

    console.info("certificate:issued", { userId: session.user.id, certificateId: cert.certificateId, courseId, levelId });

    return NextResponse.json({ certificateId: cert.certificateId }, { status: 200 });
  });
}


