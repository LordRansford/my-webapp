import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth/options";
import { rateLimit } from "@/lib/security/rateLimit";

const handler = NextAuth(authOptions);

export async function GET(req: Request, ctx: any) {
  // Defensive: if NextAuth is misconfigured in production (e.g. missing NEXTAUTH_SECRET),
  // avoid 500s that crash pages calling useSession(). Do not weaken security—disable auth cleanly.
  if (process.env.NODE_ENV === "production" && !process.env.NEXTAUTH_SECRET) {
    const path = new URL(req.url).pathname;
    // next-auth client expects the session payload to be spreadable; returning JSON null can crash it.
    if (path.endsWith("/session")) return NextResponse.json({ user: null, expires: new Date(0).toISOString() }, { status: 200 });
    return NextResponse.json({ error: "Auth is misconfigured" }, { status: 503 });
  }
  const limited = rateLimit(req, { keyPrefix: "auth", limit: 30, windowMs: 60_000 });
  if (limited) return limited;
  return (handler as any)(req as any, ctx as any) as any;
}

export async function POST(req: Request, ctx: any) {
  if (process.env.NODE_ENV === "production" && !process.env.NEXTAUTH_SECRET) {
    const path = new URL(req.url).pathname;
    // next-auth posts diagnostic logs here; acknowledge to avoid noisy client errors.
    if (path.endsWith("/_log")) return new NextResponse(null, { status: 204 });
    return NextResponse.json({ error: "Auth is misconfigured" }, { status: 503 });
  }
  const limited = rateLimit(req, { keyPrefix: "auth", limit: 30, windowMs: 60_000 });
  if (limited) return limited;
  return (handler as any)(req as any, ctx as any) as any;
}


