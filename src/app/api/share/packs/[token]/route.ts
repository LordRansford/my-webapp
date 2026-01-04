import { NextResponse } from "next/server";
import { head, getDownloadUrl } from "@vercel/blob";
import { rateLimit } from "@/lib/security/rateLimit";
import { withRequestLogging } from "@/lib/security/requestLog";
import { verifyPackToken, packPathnames } from "@/lib/share/packs";
import { safeFetch } from "@/lib/network/safeFetch";

export async function GET(req: Request, ctx: { params: Promise<{ token: string }> }) {
  return withRequestLogging(req, { route: "GET /api/share/packs/[token]" }, async () => {
    const limited = rateLimit(req, { keyPrefix: "share-packs-download", limit: 120, windowMs: 60_000 });
    if (limited) return limited;

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ ok: false, error: "Blob storage is not configured for this environment." }, { status: 501 });
    }

    const { token } = await ctx.params;
    const verified = verifyPackToken(token);
    if (!verified.ok) return NextResponse.json({ ok: false, error: verified.error }, { status: 400 });

    const { zip } = packPathnames(verified.payload.packId);
    const zipHead = await head(zip);

    // Stream via the blob download URL; avoid exposing raw blob URL in the UI.
    const downloadUrl = getDownloadUrl(zipHead.downloadUrl || zipHead.url);
    const fetched = await safeFetch(downloadUrl, { method: "GET", overallTimeoutMs: 15_000, maxResponseBytes: 15_000_000 });
    if (!fetched.res.ok) return NextResponse.json({ ok: false, error: "Pack not found." }, { status: 404 });

    const filename = `ai-studio-pack-${verified.payload.packId}.zip`;
    return new NextResponse(fetched.body, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  });
}

