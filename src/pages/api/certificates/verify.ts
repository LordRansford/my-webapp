import type { NextApiRequest, NextApiResponse } from "next";
import { getCertificateById } from "@/lib/certificates/store";

const bucket = new Map();
const WINDOW_MS = 60_000;
const LIMIT = 30;

function rateLimit(ip: string) {
  const now = Date.now();
  const entry = bucket.get(ip) || { count: 0, windowStart: now };
  if (now - entry.windowStart > WINDOW_MS) {
    entry.count = 0;
    entry.windowStart = now;
  }
  entry.count += 1;
  bucket.set(ip, entry);
  return entry.count > LIMIT;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });
  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
  if (rateLimit(ip)) return res.status(429).json({ message: "Too many requests" });

  const certificateId = String(req.query.certificateId || "").trim();
  if (!certificateId) return res.status(400).json({ message: "Missing certificateId" });

  const cert = getCertificateById(certificateId);
  if (!cert) {
    console.info("certificate:verify_lookup", { certificateId, found: false });
    return res.status(404).json({ message: "Not found" });
  }

  const status = cert.revokedAt ? "revoked" : "valid";
  console.info("certificate:verify_lookup", { certificateId, found: true, status });
  // Safe summary: no email, no internal ids beyond certificateId.
  return res.status(200).json({
    certificateId: cert.certificateId,
    courseId: cert.courseId,
    levelId: cert.levelId,
    courseTitle: cert.courseTitle,
    hoursEarned: cert.hoursEarned,
    completionDate: cert.completionDate,
    issuedAt: cert.issuedAt,
    version: cert.version,
    status,
    revokedAt: cert.revokedAt || null,
  });
}


