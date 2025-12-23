import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { withRequestLogging } from "@/lib/security/requestLog";
import { requireSameOrigin } from "@/lib/security/origin";
import { rateLimit } from "@/lib/security/rateLimit";
import { issueCpdCertificate } from "@/lib/cpd/issueCertificate";

export async function POST(req: Request) {
  return withRequestLogging(req, { route: "POST /api/certificates/issue" }, async () => {
    const originBlock = requireSameOrigin(req);
    if (originBlock) return originBlock;
    const limited = rateLimit(req, { keyPrefix: "cert-issue", limit: 10, windowMs: 60_000 });
    if (limited) return limited;

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ code: "INVALID_BODY", message: "Invalid request body." }, { status: 400 });
    }
    if (typeof (body as any).courseId !== "string") {
      return NextResponse.json({ code: "COURSE_ID_REQUIRED", message: "courseId is required." }, { status: 400 });
    }

    const courseId = (body as any).courseId.trim();
    if (!courseId) {
      return NextResponse.json({ code: "COURSE_ID_REQUIRED", message: "courseId is required." }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    try {
      const issued = await issueCpdCertificate({
        userId: session.user.id,
        userDisplayName: session.user?.name || null,
        userEmail: session.user?.email || null,
        courseId,
        siteUrl,
      });

      return NextResponse.json(
        {
          certificateId: issued.certificateId,
          certificateHash: issued.certificateHash,
          pdfUrl: issued.pdfUrl,
          verifyUrl: issued.verifyUrl,
          issuedAt: issued.issuedAt,
          creditsUsed: issued.creditsUsed,
          courseVersion: issued.courseVersion,
        },
        { status: 200 },
      );
    } catch (err: any) {
      const code = String(err?.message || "CERT_ISSUE_FAILED");
      const status = typeof err?.status === "number" ? err.status : 400;
      const message =
        code === "CERT_NOT_ELIGIBLE"
          ? "Completion is required for the active course version."
          : code === "INSUFFICIENT_CREDITS"
          ? "Not enough credits to issue this CPD certificate."
          : code === "INVALID_COURSE_ID"
          ? "courseId must include a level, for example ai:foundations."
          : "Unable to issue certificate right now.";
      return NextResponse.json({ code, message }, { status });
    }
  });
}


