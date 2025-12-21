import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { NextResponse } from "next/server";

// Temporary preview storage:
// - No authentication yet
// - File-based persistence for reliability during preview
// - Upgrade path: migrate to database later (and add auth/roles)

const limiter = new Map<string, { count: number; start: number }>();
const windowMs = 60_000;
const maxRequests = 10;

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

function getIp(req: Request) {
  const xff = req.headers.get("x-forwarded-for") || "";
  const first = xff.split(",")[0]?.trim();
  return first || req.headers.get("x-real-ip") || "";
}

function clean(input: unknown, maxLen: number) {
  const raw = typeof input === "string" ? input : "";
  const s = raw.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
  return s.slice(0, maxLen);
}

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function safeJson(res: unknown, status: number) {
  return NextResponse.json(res, { status });
}

function methodNotAllowed() {
  return safeJson({ message: "Method not allowed" }, 405);
}

export async function GET() {
  return methodNotAllowed();
}
export async function PUT() {
  return methodNotAllowed();
}
export async function PATCH() {
  return methodNotAllowed();
}
export async function DELETE() {
  return methodNotAllowed();
}

export async function POST(req: Request) {
  try {
    const ct = (req.headers.get("content-type") || "").toLowerCase();
    if (!ct.includes("application/json")) {
      return safeJson({ message: "Content type must be application/json" }, 400);
    }

    const ip = getIp(req) || "anon";
    if (!rateLimit(`feedback:${ip}`)) {
      return safeJson({ message: "Too many requests. Please try again shortly." }, 429);
    }

    const body = (await req.json().catch(() => null)) as any;
    const name = clean(body?.name, 80);
    const source = clean(body?.source, 120);
    const message = clean(body?.message, 2000);

    if (!name) return safeJson({ message: "Name is required." }, 400);
    if (!source) return safeJson({ message: "Source is required." }, 400);
    if (!message) return safeJson({ message: "Message is required." }, 400);

    const submittedAt = new Date().toISOString();
    const stamp = submittedAt.replace(/\.\d{3}Z$/, "Z").replace(/:/g, "-");
    const suffix = crypto.randomBytes(2).toString("hex");
    const filename = `${stamp}_${suffix}.json`;

    const dir = path.join(process.cwd(), "data", "feedback");
    ensureDir(dir);
    const abs = path.join(dir, filename);

    const record = {
      name,
      source,
      message,
      submittedAt,
      userAgent: req.headers.get("user-agent") || "",
      ip,
    };

    // Never overwrite.
    fs.writeFileSync(abs, JSON.stringify(record, null, 2), { encoding: "utf8", flag: "wx" });

    return safeJson({ success: true }, 200);
  } catch {
    // Never expose stack traces.
    return safeJson({ message: "Could not save feedback." }, 500);
  }
}


