import { NextResponse } from "next/server";
import { revokeCertificate } from "@/lib/certificates/store";
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

    const revoked = revokeCertificate(certificateId, reason);
    if (!revoked) return NextResponse.json({ message: "Not found" }, { status: 404 });

    console.info("certificate:revoked", { certificateId, reason: reason || undefined });
    return NextResponse.json({ ok: true, revokedAt: revoked.revokedAt });
  });
}


