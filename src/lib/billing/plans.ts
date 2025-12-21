export type PlanKey = "free" | "supporter" | "pro";

export type FeatureKey =
  | "templates_download"
  | "history_export"
  | "advanced_dashboards"
  | "larger_limits"
  | "reports_export"
  | "cpd_evidence_export"
  | "early_access";

export type UsageLimits = {
  maxToolRunsPerDay: number;
  maxUploadBytes: number;
  maxExportsPerDay: number;
};

export type Plan = {
  key: PlanKey;
  label: string;
  description: string;
  features: FeatureKey[];
  limits: UsageLimits;
};

// Single source of truth for product ladder.
// Keep limits as constants so they can be tuned later without chasing usage logic across the codebase.
export const PLANS: Record<PlanKey, Plan> = {
  free: {
    key: "free",
    label: "Free",
    description: "Registered learner access for tracking and basic tools.",
    features: [],
    limits: {
      maxToolRunsPerDay: 25,
      maxUploadBytes: 1_000_000, // 1 MB
      maxExportsPerDay: 3,
    },
  },
  supporter: {
    key: "supporter",
    label: "Supporter",
    description: "Advanced dashboards and higher usage limits. Supports sustainable free learning.",
    features: ["advanced_dashboards", "larger_limits"],
    limits: {
      maxToolRunsPerDay: 250,
      maxUploadBytes: 20_000_000, // 20 MB
      maxExportsPerDay: 25,
    },
  },
  pro: {
    key: "pro",
    label: "Professional",
    description: "Templates and export features for professional use, plus early access.",
    features: [
      "templates_download",
      "history_export",
      "reports_export",
      "cpd_evidence_export",
      "early_access",
      "advanced_dashboards",
      "larger_limits",
    ],
    limits: {
      maxToolRunsPerDay: 1_000,
      maxUploadBytes: 100_000_000, // 100 MB
      maxExportsPerDay: 100,
    },
  },
};

export function planRank(plan: PlanKey) {
  if (plan === "pro") return 3;
  if (plan === "supporter") return 2;
  return 1;
}


