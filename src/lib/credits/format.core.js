export function numberOrNull(value) {
  if (typeof value !== "number") return null;
  if (!Number.isFinite(value)) return null;
  return value;
}

export function msOrNull(value) {
  const n = numberOrNull(value);
  if (n == null) return null;
  return Math.max(0, Math.round(n));
}

export function formatMsSafe(ms) {
  const n = msOrNull(ms);
  if (n == null) return null;
  const s = Math.max(0, Math.round(n / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}m ${r}s`;
}

export function formatCreditsSafe(credits) {
  const n = numberOrNull(credits);
  if (n == null) return null;
  return String(Math.max(0, Math.round(n)));
}


