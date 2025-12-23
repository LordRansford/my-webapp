import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth/options";
import { rateLimit } from "@/lib/security/rateLimit";
import { getAuthEnvStatus, logAuthEnvIfMisconfigured } from "@/lib/auth/env";

// next-auth@4 App Router handler (runtime-typed)
const handler: any = NextAuth(authOptions);

export async function GET(req: Request, ctx: any) {
  const env = getAuthEnvStatus();
  if (!env.ok && process.env.NODE_ENV === "production") {
    logAuthEnvIfMisconfigured("GET /api/auth");
    const path = new URL(req.url).pathname;
    // Keep useSession() stable even when misconfigured.
    if (path.endsWith("/session")) return NextResponse.json({ user: null, expires: new Date(0).toISOString() }, { status: 200 });
    // Send user to a friendly page instead of a raw JSON error.
    return NextResponse.redirect(new URL("/signin?error=configuration", req.url));
  }
  const limited = rateLimit(req, { keyPrefix: "auth", limit: 30, windowMs: 60_000 });
  if (limited) return limited;
  // Pass ctx through so NextAuth can read ctx.params.nextauth in the App Router.
  return handler(req, ctx);
}

export async function POST(req: Request, ctx: any) {
  const env = getAuthEnvStatus();
  if (!env.ok && process.env.NODE_ENV === "production") {
    logAuthEnvIfMisconfigured("POST /api/auth");
    const path = new URL(req.url).pathname;
    if (path.endsWith("/_log")) return new NextResponse(null, { status: 204 });
    return NextResponse.redirect(new URL("/signin?error=configuration", req.url));
  }
  const limited = rateLimit(req, { keyPrefix: "auth", limit: 30, windowMs: 60_000 });
  if (limited) return limited;
  return handler(req, ctx);
}


