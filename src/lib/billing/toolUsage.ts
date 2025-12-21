import crypto from "crypto";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { addToolRun, countToolRunsSince } from "@/lib/billing/store";
import { getUserPlan } from "@/lib/billing/access";
import { PLANS } from "@/lib/billing/plans";

const ANON_COOKIE = "rn_anonymous_id";

async function ensureAnonymousId() {
  const jar = await cookies();
  const existing = jar.get?.(ANON_COOKIE)?.value;
  if (existing) return existing;
  const generated = crypto.randomUUID();
  jar.set?.(ANON_COOKIE, generated, { httpOnly: false, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 * 2 });
  return generated;
}

export async function assertToolRunAllowed(toolId: string) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || null;
  if (!userId) {
    const err = new Error("Sign in required");
    (err as any).status = 401;
    throw err;
  }
  const anonymousUserId = null;
  const plan = await getUserPlan(userId);

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const sinceIso = startOfDay.toISOString();

  const used = countToolRunsSince({ userId, anonymousUserId }, sinceIso);
  const limit = PLANS[plan].limits.maxToolRunsPerDay;
  if (used >= limit) {
    const err = new Error("Daily tool run limit reached");
    (err as any).status = 429;
    (err as any).limit = limit;
    throw err;
  }

  addToolRun({
    id: crypto.randomUUID(),
    userId: userId || null,
    anonymousUserId: anonymousUserId || null,
    toolId,
    timestamp: new Date().toISOString(),
  });

  return { plan, remaining: Math.max(0, limit - used - 1) };
}


