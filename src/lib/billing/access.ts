import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { PLANS, type FeatureKey, type PlanKey } from "@/lib/billing/plans";
import { getUserById } from "@/lib/auth/store";
import { getUserPlanRecord } from "@/lib/billing/store";
import { getTestingOverrideDecision, TESTING_MODE_ENABLED } from "@/lib/testingMode";

export type SafePlanSummary = {
  plan: PlanKey;
  features: FeatureKey[];
  limits: (typeof PLANS)[PlanKey]["limits"];
};

export async function getUserPlan(userId: string): Promise<PlanKey> {
  // Temporary QA override: treat all users as pro so everything is reachable for testing.
  if (getTestingOverrideDecision().allowed || TESTING_MODE_ENABLED) return "pro";

  const explicit = getUserPlanRecord(userId);
  if (explicit?.plan) return explicit.plan;

  const user = getUserById(userId);
  const entitlements = Array.isArray((user as any)?.entitlements) ? ((user as any).entitlements as string[]) : ["free"];
  if (entitlements.includes("commercial")) return "pro";
  if (entitlements.includes("supporter")) return "supporter";
  return "free";
}

export function hasFeature(plan: PlanKey, feature: FeatureKey) {
  if (getTestingOverrideDecision().allowed || TESTING_MODE_ENABLED) return true;
  return PLANS[plan].features.includes(feature);
}

export async function getSafePlanSummaryForRequest() {
  if (getTestingOverrideDecision().allowed || TESTING_MODE_ENABLED) {
    return { plan: "pro", features: PLANS.pro.features, limits: PLANS.pro.limits } satisfies SafePlanSummary;
  }
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { plan: "free", features: [], limits: PLANS.free.limits } satisfies SafePlanSummary;
  const plan = await getUserPlan(session.user.id);
  return { plan, features: PLANS[plan].features, limits: PLANS[plan].limits } satisfies SafePlanSummary;
}

export async function assertFeatureOrThrow(feature: FeatureKey) {
  if (getTestingOverrideDecision().allowed || TESTING_MODE_ENABLED) {
    const session = await getServerSession(authOptions);
    return { userId: session?.user?.id || "testing", plan: "pro" as const };
  }
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    const err = new Error("Authentication required");
    (err as any).status = 401;
    throw err;
  }
  const plan = await getUserPlan(session.user.id);
  if (!hasFeature(plan, feature)) {
    const err = new Error("Upgrade required");
    (err as any).status = 403;
    (err as any).plan = plan;
    (err as any).feature = feature;
    throw err;
  }
  return { userId: session.user.id, plan };
}

export function getRateLimitConfig(plan: PlanKey) {
  const limits = PLANS[plan].limits;
  return {
    maxToolRunsPerDay: limits.maxToolRunsPerDay,
    maxUploadBytes: limits.maxUploadBytes,
    maxExportsPerDay: limits.maxExportsPerDay,
  };
}


