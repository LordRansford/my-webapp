import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";
import { getCourseLevelMeta, type CourseId } from "@/lib/cpd/courseEvidence";
import { isEligibleForCertificate } from "@/lib/cpd/eligibility";
import { formatCertificateId } from "@/lib/certificates/id";
import { generateCertificatePdf } from "@/lib/certificates/pdf";
import { putCertificatePdf } from "@/lib/storage/certificates";
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
    if (!courseId) return NextResponse.json({ message: "Missing courseId" }, { status: 400 });

    const entitlement = (prisma as any).certificateEntitlement as {
      findUnique: (args: any) => Promise<any>;
      update: (args: any) => Promise<any>;
    };
    const issuanceModel = (prisma as any).certificateIssuance as {
      findFirst: (args: any) => Promise<any>;
      create: (args: any) => Promise<any>;
      count: (args: any) => Promise<number>;
    };
    const audit = (prisma as any).auditEvent as { create: (args: any) => Promise<any> };

    const ent = await entitlement.findUnique({ where: { userId_courseId: { userId: session.user.id, courseId } } });
    if (!ent || ent.status !== "eligible") {
      return NextResponse.json({ message: "Entitlement not eligible" }, { status: 409 });
    }

    const elig = await isEligibleForCertificate(session.user.id, courseId);
    if (!elig.eligible) {
      return NextResponse.json({ message: "Not eligible", reasons: elig.reasons, summary: elig.summary }, { status: 400 });
    }

    // If already issued, return existing issuance.
    const existing = await issuanceModel.findFirst({ where: { userId: session.user.id, courseId } });
    if (existing) {
      return NextResponse.json(
        {
          certificateId: existing.certificateId,
          downloadUrl: `/api/certificates/download?certificateId=${encodeURIComponent(existing.certificateId)}`,
        },
        { status: 200 },
      );
    }

    // Certificate IDs must be unguessable (public verification). Retry on collision.
    const year = new Date().getUTCFullYear();
    let certificateId = "";
    for (let attempt = 0; attempt < 5; attempt++) {
      certificateId = formatCertificateId({ courseId, year });
      try {
        const learnerName = String(session.user?.name || "").trim();
        const email = String(session.user?.email || "").trim();
        const learnerIdentifier = email ? email.split("@")[0] : session.user.id;

        const meta = getCourseLevelMeta(courseId as CourseId, "foundations" as any);
        const courseTitle = meta?.title || courseId;
        const cpdHours = meta?.estimatedHours ?? null;

        const issuedAtIso = new Date().toISOString();
        const pdf = await generateCertificatePdf({
          learnerName: learnerName || learnerIdentifier,
          learnerIdentifier,
          courseTitle,
          courseId,
          issuedDateISO: issuedAtIso,
          certificateId,
          cpdHours,
        });

        const pdfKey = `certificates/${session.user.id}/${certificateId}.pdf`;
        await putCertificatePdf({ key: pdfKey, bytes: pdf.bytes, contentType: "application/pdf" });

        const issuance = await issuanceModel.create({
          data: {
            userId: session.user.id,
            courseId,
            certificateId,
            entitlementId: ent.id,
            pdfStorageKey: pdfKey,
            pdfSha256: pdf.sha256,
            version: 1,
            metadata: {
              learnerName: learnerName || learnerIdentifier,
              courseTitle,
              cpdHours,
              issuedAt: issuedAtIso,
              evidenceSummary: elig.summary,
            },
          },
        });

        await entitlement.update({
          where: { id: ent.id },
          data: { status: "issued", issuedAt: new Date(), issuedCertificateId: certificateId },
        });

        await audit.create({
          data: {
            actorUserId: session.user.id,
            action: "CERT_ISSUED",
            entityType: "certificate",
            entityId: issuance.id,
            details: { certificateId, courseId },
            ip: (req.headers.get("x-forwarded-for") || "").split(",")[0]?.trim() || req.headers.get("x-real-ip") || null,
            userAgent: req.headers.get("user-agent") || null,
          },
        });

        return NextResponse.json(
          {
            certificateId,
            downloadUrl: `/api/certificates/download?certificateId=${encodeURIComponent(certificateId)}`,
          },
          { status: 200 },
        );
      } catch (err: any) {
        if (err?.code === "P2002") continue;
        throw err;
      }
    }

    return NextResponse.json({ message: "Unable to issue certificate right now" }, { status: 500 });
  });
}


