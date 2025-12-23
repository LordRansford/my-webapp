import { NextResponse } from "next/server";
import net from "net";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { runWithMetering } from "@/lib/tools/runWithMetering";

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

const isHostLike = (value) => /^[a-zA-Z0-9.-]+$/.test(value) && value.includes(".");

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

  let parsed;
  try {
    parsed = schema.parse(await req.json());
  } catch {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  const target = parsed.target.trim().toLowerCase();
  if (!isHostLike(target) || isPrivate(target)) {
    return NextResponse.json({ message: "Provide a valid public hostname" }, { status: 400 });
  }

  // Simple educational fallback; real WHOIS often needs paid services.
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = session?.user?.id || null;

  const metered = await runWithMetering({
    req,
    userId,
    toolId: "whois-summary",
    inputBytes: Buffer.byteLength(target),
    requestedComplexityPreset: "light",
    execute: async () => {
      const payload = {
        target,
        fallback: true,
        registrar: "Use your registrar WHOIS portal",
        ageHint: "Check creation and expiry dates via WHOIS or RDAP",
        tip: "Compare domain age to the context. Newly registered domains can be higher risk.",
      };
      return { output: payload, outputBytes: Buffer.byteLength(JSON.stringify(payload)) };
    },
  });

  if (!metered.ok) return NextResponse.json({ message: metered.message, estimate: metered.estimate }, { status: metered.status });

  return NextResponse.json({ ...(metered.output || {}), receipt: metered.receipt });
}
