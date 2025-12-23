import { NextResponse } from "next/server";
import { revokeCertificate } from "@/lib/certificates/store";
import { prisma } from "@/lib/db/prisma";
import { withRequestLogging } from "@/lib/security/requestLog";
import { rateLimit } from "@/lib/security/rateLimit";

const ADMIN_KEY = process.env.CERT_ADMIN_KEY || "";

export async function POST(req: Request) {
  return withRequestLogging(req, { route: "POST /api/certificates/revoke" }, async () => {
    const limited = rateLimit(req, { keyPrefix: "cert-revoke", limit: 5, windowMs: 60_000 });
    if (limited) return limited;

    const key = req.headers.get("x-cert-admin-key");
    if (!ADMIN_KEY || key !== ADMIN_KEY) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = (await req.json().catch(() => null)) as any;
    const certificateId = String(body?.certificateId || "").trim();
    const reason = String(body?.reason || "").trim();
    if (!certificateId) return NextResponse.json({ message: "Missing certificateId" }, { status: 400 });

    // DB-backed certificates (Step 4+) revocation.
    const issuanceModel = (prisma as any).certificateIssuance as {
      findUnique: (args: any) => Promise<any>;
      update: (args: any) => Promise<any>;
    };
    const audit = (prisma as any).auditEvent as { create: (args: any) => Promise<any> };

    const issuance = await issuanceModel.findUnique({ where: { certificateId } });
    if (issuance) {
      const updated = await issuanceModel.update({
        where: { certificateId },
        data: { revokedAt: new Date(), revokedReason: reason || null },
      });
      await audit.create({
        data: {
          actorUserId: null,
          action: "CERT_REVOKED",
          entityType: "certificate",
          entityId: updated.id,
          details: { certificateId, reason: reason || null },
          ip: (req.headers.get("x-forwarded-for") || "").split(",")[0]?.trim() || req.headers.get("x-real-ip") || null,
          userAgent: req.headers.get("user-agent") || null,
        },
      });
      console.info("certificate:revoked", { certificateId, reason: reason || undefined });
      return NextResponse.json({ ok: true, revokedAt: updated.revokedAt }, { status: 200 });
    }

    const revoked = revokeCertificate(certificateId, reason);
    if (!revoked) return NextResponse.json({ message: "Not found" }, { status: 404 });

    console.info("certificate:revoked", { certificateId, reason: reason || undefined });
    return NextResponse.json({ ok: true, revokedAt: revoked.revokedAt });
  });
}


