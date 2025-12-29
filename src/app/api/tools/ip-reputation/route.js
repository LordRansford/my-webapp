import { NextResponse } from "next/server";
import net from "net";
import { z } from "zod";
import { assertToolRunAllowed } from "@/lib/billing/toolUsage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { enforceCreditGate, creditGateErrorResponse } from "@/lib/credits/enforceCreditGate";
import { deductCredits } from "@/lib/credits/deductCredits";

const ESTIMATED_CREDITS = 1; // IP reputation check cost

const limiter = new Map();
const windowMs = 60 * 1000;
const maxRequests = 20;

const schema = z.object({ target: z.string().trim().min(1) });

const isPrivate = (value) => {
  const ip = net.isIP(value) ? value : null;
  if (!ip) return false;
  const segments = ip.split(".").map((n) => parseInt(n, 10));
  if (segments[0] === 10) return true;
  if (segments[0] === 172 && segments[1] >= 16 && segments[1] <= 31) return true;
  if (segments[0] === 192 && segments[1] === 168) return true;
  if (segments[0] === 127) return true;
  return false;
};

const rateLimit = (ip) => {
  const now = Date.now();
  const entry = limiter.get(ip) || { count: 0, start: now };
  if (now - entry.start > windowMs) {
    limiter.set(ip, { count: 1, start: now });
    return true;
  }
  if (entry.count >= maxRequests) return false;
  entry.count += 1;
  limiter.set(ip, entry);
  return true;
};

export async function POST(req) {
  const ip = req.headers.get("x-forwarded-for") || "anon";
  if (!rateLimit(ip)) return NextResponse.json({ message: "Rate limit exceeded" }, { status: 429 });
  try {
    await assertToolRunAllowed("ip-reputation");
  } catch (e) {
    return NextResponse.json({ message: e.message || "Limit reached" }, { status: e.status || 429 });
  }

  let parsed;
  try {
    parsed = schema.parse(await req.json());
  } catch {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  const target = parsed.target.trim();
  if (!net.isIP(target) || isPrivate(target)) {
    return NextResponse.json({ message: "Provide a valid public IP address" }, { status: 400 });
  }

  // Enforce credit gate (requires authentication)
  const session = await getServerSession(authOptions).catch(() => null);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Authentication required. Please sign in to use this tool." }, { status: 401 });
  }

  const gateResult = await enforceCreditGate(ESTIMATED_CREDITS);
  if (!gateResult.ok) {
    return creditGateErrorResponse(gateResult);
  }

  try {
    const payload = {
      target,
      fallback: true,
      reputation: "No automated reputation feed configured. Check trusted threat intel sources.",
      guidance: "Combine IP checks with context, logs, and behavioural indicators."
    };

    // Deduct credits after successful check
    await deductCredits({
      userId: gateResult.userId,
      credits: ESTIMATED_CREDITS,
      toolId: "ip-reputation",
    });

    return NextResponse.json(payload);
  } catch (error) {
    // Don't deduct credits if check fails
    console.error("[ip-reputation] Error:", error);
    return NextResponse.json({ message: "Failed to check IP reputation" }, { status: 500 });
  }
}
