import { NextResponse } from "next/server";
import net from "net";
import { z } from "zod";
import tls from "tls";

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

const inspectTls = (host) =>
  new Promise((resolve, reject) => {
    const socket = tls.connect({ host, port: 443, servername: host, timeout: 4000 }, () => {
      const cert = socket.getPeerCertificate();
      socket.end();
      resolve(cert && Object.keys(cert).length ? cert : null);
    });
    socket.on("error", (err) => reject(err));
    socket.on("timeout", () => {
      socket.destroy();
      reject(new Error("Timed out"));
    });
  });

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

  try {
    const cert = await inspectTls(target).catch(() => null);
    if (!cert) {
      return NextResponse.json({
        fallback: true,
        message: "Could not retrieve certificate. Verify host allows TLS connections and try again.",
      });
    }
    return NextResponse.json({
      target,
      subject: cert.subject,
      issuer: cert.issuer,
      valid_from: cert.valid_from,
      valid_to: cert.valid_to,
      san: cert.subjectaltname,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message || "Lookup failed" }, { status: 500 });
  }
}
