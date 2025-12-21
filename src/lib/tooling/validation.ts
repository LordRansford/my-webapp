export function safeTrim(value: unknown, maxLen: number): string {
  const s = typeof value === "string" ? value : String(value ?? "");
  return s.trim().slice(0, maxLen);
}

export function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(n)));
}

export function isProbablyDomain(input: string): boolean {
  const s = input.trim().toLowerCase();
  if (!s) return false;
  if (s.length > 253) return false;
  if (s.includes(" ")) return false;
  if (s.startsWith(".") || s.endsWith(".")) return false;
  if (!s.includes(".")) return false;
  // Basic label validation (not a full RFC parser).
  const labels = s.split(".");
  if (labels.some((l) => !l || l.length > 63)) return false;
  if (labels.some((l) => l.startsWith("-") || l.endsWith("-"))) return false;
  const allowed = /^[a-z0-9-]+$/;
  if (labels.some((l) => !allowed.test(l))) return false;
  return true;
}

export function isProbablyHostname(input: string): boolean {
  // Hostname without scheme/path. Reuse domain checks.
  return isProbablyDomain(input);
}

export function isProbablyIp(input: string): boolean {
  const s = input.trim();
  // IPv4 quick check.
  const v4 = s.split(".");
  if (v4.length === 4 && v4.every((p) => /^\d+$/.test(p) && Number(p) >= 0 && Number(p) <= 255)) return true;
  // IPv6: keep simple, accept hex + colons if it looks plausible.
  if (s.includes(":") && /^[0-9a-fA-F:]+$/.test(s) && s.length <= 39) return true;
  return false;
}

export function normaliseUrl(input: string): { ok: true; url: string } | { ok: false; message: string } {
  const raw = input.trim();
  if (!raw) return { ok: false, message: "Enter a URL to check." };
  if (raw.length > 2048) return { ok: false, message: "That URL is too long. Try a shorter one." };

  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { ok: false, message: "Use a web URL that starts with http or https." };
    }
    return { ok: true, url: parsed.href };
  } catch {
    return { ok: false, message: "This input does not look like a valid URL. Try https://example.com" };
  }
}


