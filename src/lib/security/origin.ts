import { NextResponse } from "next/server";

function getSiteOrigin() {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").origin;
  } catch {
    return "http://localhost:3000";
  }
}

export function requireSameOrigin(req: Request) {
  // Lightweight CSRF protection for browser-invoked state changes:
  // require Origin/Referer to match our configured site origin.
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const siteOrigin = getSiteOrigin();
  let requestOrigin: string | null = null;
  try {
    requestOrigin = new URL(req.url).origin;
  } catch {
    requestOrigin = null;
  }

  const candidate = origin || (referer ? (() => { try { return new URL(referer).origin; } catch { return null; } })() : null);
  // Some same-site requests may not include Origin or Referer.
  // For CSRF prevention we only need to reject cross-site browser requests, which do send Origin.
  // If the request has no Origin/Referer we allow it when the request origin is known.
  if (!candidate) {
    if (requestOrigin) return null;
    return NextResponse.json({ error: "Missing origin" }, { status: 403 });
  }
  // Accept either:
  // - the configured canonical site origin (e.g. production custom domain), or
  // - the request origin (e.g. Vercel preview domain), as long as the browser supplies Origin/Referer.
  if (candidate !== siteOrigin && (!requestOrigin || candidate !== requestOrigin)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }
  return null;
}


