import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { getUserById } from "@/lib/auth/store";
import { appendAnalyticsEvents, type AnalyticsEvent } from "@/lib/analytics/store";

const limiter = new Map<string, { count: number; start: number }>();
const windowMs = 60_000;
const maxRequests = 60;

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
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });

  const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "anon";
  if (!rateLimit(`analytics:${ip}:${userId}`)) return res.status(429).json({ message: "Rate limit exceeded" });

  const user = getUserById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const consent = (user as any).consent || {};
  if (!consent.cpdDataUseAcceptedAt) {
    return res.status(403).json({ message: "Consent required" });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const events = Array.isArray(body?.events) ? (body.events as AnalyticsEvent[]) : [];
  if (events.length === 0) return res.status(400).json({ message: "No events" });

  appendAnalyticsEvents(
    userId,
    events.map((e) => ({
      type: e.type,
      timestamp: e.timestamp || new Date().toISOString(),
      trackId: e.trackId,
      levelId: e.levelId,
      sectionId: e.sectionId,
      quizId: e.quizId,
      success: typeof e.success === "boolean" ? e.success : undefined,
      toolId: e.toolId,
    }))
  );

  return res.status(200).json({ ok: true });
}


