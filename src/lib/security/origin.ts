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

  const candidate = origin || (referer ? (() => { try { return new URL(referer).origin; } catch { return null; } })() : null);
  if (!candidate) {
    return NextResponse.json({ error: "Missing origin" }, { status: 403 });
  }
  if (candidate !== siteOrigin) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }
  return null;
}


