import { logInfo, logWarn } from "@/lib/telemetry/log";

const limiter = new Map();
const windowMs = 60_000;
const maxRequests = 10;

function rateLimit(ip) {
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
}

function clampText(v, max) {
  const s = typeof v === "string" ? v : "";
  return s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ").trim().slice(0, max);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false });
  }

  const ip = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "anon";
  if (!rateLimit(String(ip))) return res.status(429).json({ ok: false });

  const body = req.body && typeof req.body === "object" ? req.body : {};
  const name = clampText(body.name, 80);
  const email = clampText(body.email, 120);
  const company = clampText(body.company, 120);
  const message = clampText(body.message, 1500);

  if (!name || !email || !message) {
    // Do not reveal which field is missing (anti-enumeration style).
    return res.status(400).json({ ok: false });
  }

  // CAPTCHA stub: if enabled, require a token field (verification integration can be added later).
  if (process.env.CAPTCHA_ENABLED === "true") {
    const token = clampText(body.captchaToken, 500);
    if (!token) {
      logWarn("contact.captcha_missing", { ip: String(ip) });
      return res.status(400).json({ ok: false });
    }
  }

  // Provider stub: store nothing client-visible; just structured server log for now.
  logInfo("contact.request_received", {
    ip: String(ip),
    namePresent: Boolean(name),
    emailPresent: Boolean(email),
    companyPresent: Boolean(company),
    messageLen: message.length,
  });

  // Always return a generic success to prevent account enumeration patterns.
  return res.status(202).json({ ok: true });
}


