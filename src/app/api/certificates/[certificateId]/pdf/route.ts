import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";
import { getCertificatePdfBytes } from "@/lib/storage/certificates";
import { withRequestLogging } from "@/lib/security/requestLog";
import { rateLimit } from "@/lib/security/rateLimit";

export async function GET(req: Request, ctx: { params: Promise<{ certificateId: string }> }) {
  return withRequestLogging(req, { route: "GET /api/certificates/[certificateId]/pdf" }, async () => {
    const limited = rateLimit(req, { keyPrefix: "cert-pdf", limit: 30, windowMs: 60_000 });
    if (limited) return limited;

    const session = await getServerSession(authOptions).catch(() => null);
    const userId = session?.user?.id || "";
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { certificateId } = await ctx.params;
    const id = String(certificateId || "").trim();
    if (!id) return NextResponse.json({ message: "Missing certificateId" }, { status: 400 });

    const cert = await (prisma as any).certificate.findUnique({ where: { id } });
    if (!cert || cert.userId !== userId) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const bytes = await getCertificatePdfBytes({ key: cert.pdfKey });
    return new NextResponse(bytes as any, {
      status: 200,
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename="${id}.pdf"`,
        "cache-control": "private, max-age=0, no-store",
      },
    });
  });
}


