import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { getUserPlan } from "@/lib/billing/access";

const core = require("./entitlements.core.js");

export const TIERS = core.TIERS as {
  FREE: "free";
  SUPPORTER: "supporter";
  PROFESSIONAL: "professional";
  INSTITUTIONAL: "institutional";
};

export const FEATURES = core.FEATURES as Record<string, string>;

export type TierKey = "free" | "supporter" | "professional" | "institutional";
export type EntitlementFeature =
  | "advanced_dashboards"
  | "advanced_analytics"
  | "templates_download"
  | "reports_export"
  | "priority_feedback";

export function getFeatureFlags() {
  return {
    supporterGatingEnabled: process.env.SUPPORTER_GATING_ENABLED !== "false",
    advancedAnalyticsEnabled: process.env.ADVANCED_ANALYTICS_ENABLED !== "false",
    downloadsEnabled: process.env.DOWNLOADS_ENABLED !== "false",
  };
}

export async function getUserTierForRequest(): Promise<{ userId: string | null; tier: TierKey }> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { userId: null, tier: "free" };

  const plan = await getUserPlan(session.user.id);
  // Map existing plan keys to supporter tiers.
  if (plan === "supporter") return { userId: session.user.id, tier: "supporter" };
  if (plan === "pro") return { userId: session.user.id, tier: "professional" };
  return { userId: session.user.id, tier: "free" };
}

export function hasEntitlement(tier: TierKey, feature: EntitlementFeature) {
  return core.canTierAccessFeature(tier, feature, getFeatureFlags());
}

export async function assertEntitlementOrThrow(feature: EntitlementFeature) {
  const { userId, tier } = await getUserTierForRequest();
  if (!userId) {
    const err = new Error("Authentication required");
    (err as any).status = 401;
    throw err;
  }
  if (!hasEntitlement(tier, feature)) {
    const err = new Error("Upgrade required");
    (err as any).status = 403;
    (err as any).tier = tier;
    (err as any).feature = feature;
    throw err;
  }
  return { userId, tier };
}


