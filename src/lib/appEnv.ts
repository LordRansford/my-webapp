export type AppEnv = "local" | "staging" | "production";

export function getAppEnv(): AppEnv {
  const raw = String(process.env.NEXT_PUBLIC_APP_ENV || "").toLowerCase().trim();
  if (raw === "local" || raw === "staging" || raw === "production") return raw;
  // Safe default: treat unknown as production to avoid accidental banners and debug posture in prod.
  return "production";
}

export function isProductionEnv() {
  return getAppEnv() === "production";
}


