export const ALLOWED_ORIGINS = new Set([
  "http://localhost:3000",
  "https://localhost:3000",
  process.env.NEXT_PUBLIC_SITE_URL || ""
].filter(Boolean));

export function assertAllowedRequest(req) {
  if (!req?.headers) return;
  const origin = req.headers.origin || req.headers.referer || "";
  if (!origin) return;
  const match = origin.match(/^https?:\/\/[^/]+/i);
  const originHost = match ? match[0] : origin;
  if (ALLOWED_ORIGINS.size === 0) return;
  if (!ALLOWED_ORIGINS.has(originHost)) {
    throw new Error("Dashboard API origin not allowed");
  }
}
