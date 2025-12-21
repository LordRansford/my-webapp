import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { rateLimit } from "@/lib/security/rateLimit";

const handler = NextAuth(authOptions);

export async function GET(req: Request) {
  const limited = rateLimit(req, { keyPrefix: "auth", limit: 30, windowMs: 60_000 });
  if (limited) return limited;
  return handler(req as any, {} as any) as any;
}

export async function POST(req: Request) {
  const limited = rateLimit(req, { keyPrefix: "auth", limit: 30, windowMs: 60_000 });
  if (limited) return limited;
  return handler(req as any, {} as any) as any;
}


