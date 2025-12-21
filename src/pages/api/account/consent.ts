import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { updateUserConsent } from "@/lib/auth/store";

const limiter = new Map<string, { count: number; start: number }>();
const windowMs = 60_000;
const maxRequests = 30;

function rateLimit(key: string) {
  const now = Date.now();
  const entry = limiter.get(key) || { count: 0, start: now };
  if (now - entry.start > windowMs) {
    limiter.set(key, { count: 1, start: now });
    return true;
  }
  if (entry.count >= maxRequests) return false;
  entry.count += 1;
  limiter.set(key, entry);
  return true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") return res.status(405).json({ message: "Method not allowed" });

  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });

  const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "anon";
  if (!rateLimit(`consent:${ip}:${userId}`)) return res.status(429).json({ message: "Rate limit exceeded" });

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const termsAccepted = Boolean(body?.termsAccepted);
  const privacyAccepted = Boolean(body?.privacyAccepted);
  const cpdDataUseAccepted = Boolean(body?.cpdDataUseAccepted);

  const updated = updateUserConsent({ userId, termsAccepted, privacyAccepted, cpdDataUseAccepted });
  if (!updated) return res.status(404).json({ message: "User not found" });

  console.info("account:consent_updated", { userId });
  return res.status(200).json({ ok: true });
}


