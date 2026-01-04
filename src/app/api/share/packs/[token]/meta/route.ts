import { NextResponse } from "next/server";
import { head } from "@vercel/blob";
import { rateLimit } from "@/lib/security/rateLimit";
import { withRequestLogging } from "@/lib/security/requestLog";
import { verifyPackToken, packPathnames } from "@/lib/share/packs";
import { safeFetch } from "@/lib/network/safeFetch";

export async function GET(req: Request, ctx: { params: Promise<{ token: string }> }) {
  return withRequestLogging(req, { route: "GET /api/share/packs/[token]/meta" }, async () => {
    const limited = rateLimit(req, { keyPrefix: "share-packs-meta", limit: 120, windowMs: 60_000 });
    if (limited) return limited;

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ ok: false, error: "Blob storage is not configured for this environment." }, { status: 501 });
    }

    const { token } = await ctx.params;
    const verified = verifyPackToken(token);
    if (!verified.ok) return NextResponse.json({ ok: false, error: verified.error }, { status: 400 });

    const { meta } = packPathnames(verified.payload.packId);
    const metaHead = await head(meta);
    const fetched = await safeFetch(metaHead.downloadUrl, { method: "GET", overallTimeoutMs: 10_000, maxResponseBytes: 500_000 });
    if (!fetched.res.ok) return NextResponse.json({ ok: false, error: "Pack metadata not found." }, { status: 404 });
    const json = (() => {
      try {
        return JSON.parse(fetched.body.toString("utf8"));
      } catch {
        return null;
      }
    })();
    if (!json) return NextResponse.json({ ok: false, error: "Pack metadata not available." }, { status: 404 });

    return NextResponse.json({
      ok: true,
      meta: json,
      expiresAt: new Date(verified.payload.exp).toISOString(),
    });
  });
}

