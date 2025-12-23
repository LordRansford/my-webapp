function intFromEnv(name, fallback) {
  const raw = process.env[name];
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : fallback;
}

export const FREE_TIER_MS_PER_DAY = intFromEnv("FREE_TIER_MS_PER_DAY", 60_000);
export const CREDIT_MS_PER_1 = intFromEnv("CREDIT_MS_PER_1", 10_000);
export const MAX_RUN_MS_HARD_CAP = intFromEnv("MAX_RUN_MS_HARD_CAP", 300_000);
export const MAX_UPLOAD_BYTES_FREE = intFromEnv("MAX_UPLOAD_BYTES_FREE", 300 * 1024);
export const MAX_UPLOAD_BYTES_PAID = intFromEnv("MAX_UPLOAD_BYTES_PAID", 2 * 1024 * 1024);


