import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";
import { rateLimit } from "@/lib/security/rateLimit";
import { withRequestLogging } from "@/lib/security/requestLog";
import { canUserDownloadCertificate } from "@/lib/certificates/access";
import { getCertificatePdfBytes } from "@/lib/storage/certificates";

export async function GET(req: Request) {
  return withRequestLogging(req, { route: "GET /api/certificates/download" }, async () => {
    const limited = rateLimit(req, { keyPrefix: "cert-download", limit: 30, windowMs: 60_000 });
    if (limited) return limited;

    const session = await getServerSession(authOptions).catch(() => null);
    const userId = session?.user?.id || "";
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const url = new URL(req.url);
    const certificateId = String(url.searchParams.get("certificateId") || "").trim();
    const key = String(url.searchParams.get("key") || "").trim();
    if (!certificateId && !key) return NextResponse.json({ message: "Missing certificateId" }, { status: 400 });

    const issuanceModel = (prisma as any).certificateIssuance as {
      findUnique: (args: any) => Promise<any>;
      findFirst: (args: any) => Promise<any>;
    };
    const audit = (prisma as any).auditEvent as { create: (args: any) => Promise<any> };

    const issuance = certificateId
      ? await issuanceModel.findUnique({ where: { certificateId } })
      : await issuanceModel.findFirst({ where: { pdfStorageKey: key, userId } });
    if (!issuance || !canUserDownloadCertificate({ userId, issuanceUserId: issuance.userId })) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    await audit.create({
      data: {
        actorUserId: userId,
        action: "CERT_DOWNLOADED",
        entityType: "certificate",
        entityId: issuance.id,
        details: { certificateId: issuance.certificateId },
        ip: (req.headers.get("x-forwarded-for") || "").split(",")[0]?.trim() || req.headers.get("x-real-ip") || null,
        userAgent: req.headers.get("user-agent") || null,
      },
    });

    const bytes = await getCertificatePdfBytes({ key: issuance.pdfStorageKey });
    return new NextResponse(bytes as any, {
      status: 200,
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename="${certificateId}.pdf"`,
        "cache-control": "private, max-age=0, no-store",
      },
    });
  });
}


