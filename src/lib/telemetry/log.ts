type Level = "info" | "warn" | "error";

const REDACT_KEYS = new Set([
  "authorization",
  "cookie",
  "set-cookie",
  "stripe-signature",
  "secret",
  "token",
  "password",
  "apiKey",
  "apikey",
  "client_secret",
]);

function isProd() {
  return process.env.NODE_ENV === "production";
}

function redactValue(value: unknown) {
  if (value == null) return value;
  if (typeof value === "string") {
    if (value.length <= 6) return "[REDACTED]";
    return "[REDACTED]";
  }
  return "[REDACTED]";
}

function redactAny(input: any, depth = 0): any {
  if (depth > 4) return "[TRUNCATED]";
  if (input == null) return input;
  if (Array.isArray(input)) return input.slice(0, 20).map((v) => redactAny(v, depth + 1));
  if (typeof input !== "object") return input;

  const out: any = {};
  for (const [k, v] of Object.entries(input)) {
    const key = String(k);
    const lower = key.toLowerCase();
    if (REDACT_KEYS.has(lower) || lower.includes("secret") || lower.includes("token") || lower.includes("password")) {
      out[key] = redactValue(v);
      continue;
    }
    out[key] = redactAny(v, depth + 1);
  }
  return out;
}

function safeFields(fields: Record<string, unknown> | undefined) {
  const base = fields && typeof fields === "object" ? fields : {};
  // In production: always redact aggressively.
  return isProd() ? redactAny(base) : redactAny(base);
}

function write(level: Level, eventName: string, fields?: Record<string, unknown>) {
  const payload = {
    level,
    event: String(eventName || "").slice(0, 80),
    ts: new Date().toISOString(),
    ...safeFields(fields),
  };
  if (level === "error") console.error(payload);
  else if (level === "warn") console.warn(payload);
  else console.log(payload);
}

export function logInfo(eventName: string, fields?: Record<string, unknown>) {
  write("info", eventName, fields);
}

export function logWarn(eventName: string, fields?: Record<string, unknown>) {
  write("warn", eventName, fields);
}

export function logError(eventName: string, fields?: Record<string, unknown>) {
  write("error", eventName, fields);
}


