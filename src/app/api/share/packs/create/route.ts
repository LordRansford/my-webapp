import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "node:crypto";
import { put } from "@vercel/blob";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { requireSameOrigin } from "@/lib/security/origin";
import { rateLimit } from "@/lib/security/rateLimit";
import { withRequestLogging } from "@/lib/security/requestLog";
import { createPackToken, packPathnames } from "@/lib/share/packs";

const bodySchema = z.object({
  title: z.string().trim().min(1).max(140),
  projectId: z.string().trim().min(1).max(80).optional(),
  zipBase64: z.string().min(50),
  expiresInDays: z.number().int().min(1).max(30).optional(),
});

export async function POST(req: Request) {
  return withRequestLogging(req, { route: "POST /api/share/packs/create" }, async () => {
    const originBlock = requireSameOrigin(req);
    if (originBlock) return originBlock;

    const limited = rateLimit(req, { keyPrefix: "share-packs-create", limit: 20, windowMs: 60_000 });
    if (limited) return limited;

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || null;
    if (!userId) return NextResponse.json({ ok: false, error: "Sign in required." }, { status: 401 });

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ ok: false, error: "Blob storage is not configured for this environment." }, { status: 501 });
    }

    const parsed = bodySchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });

    const expiresInDays = parsed.data.expiresInDays || 7;
    const expiresAt = Date.now() + expiresInDays * 24 * 60 * 60 * 1000;

    // Size guard: base64 inflates by ~33%. Keep reasonably small for serverless.
    if (parsed.data.zipBase64.length > 8_000_000) {
      return NextResponse.json({ ok: false, error: "Pack is too large to share via link. Export ZIP instead." }, { status: 413 });
    }

    const packId = crypto.randomUUID();
    const { zip, meta } = packPathnames(packId);

    const zipBytes = Buffer.from(parsed.data.zipBase64, "base64");
    const metaObj = {
      packId,
      title: parsed.data.title,
      projectId: parsed.data.projectId || null,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(expiresAt).toISOString(),
      createdBy: { userId },
      bytes: zipBytes.length,
      kind: "ai-studio-pack",
    };

    await put(zip, zipBytes, { access: "public", contentType: "application/zip" });
    await put(meta, JSON.stringify(metaObj, null, 2), { access: "public", contentType: "application/json" });

    const token = createPackToken({ packId, expiresAt });
    return NextResponse.json({
      ok: true,
      token,
      sharePath: `/share/pack/${token}`,
      expiresAt: metaObj.expiresAt,
    });
  });
}

