export type PlanKey = "free" | "supporter" | "pro";

export type FeatureKey =
  | "templates_download"
  | "history_export"
  | "advanced_dashboards"
  | "larger_limits"
  | "reports_export"
  | "cpd_evidence_export"
  | "early_access"
  | "api_access"
  | "webhooks";

export type UsageLimits = {
  maxUploadBytes: number;
  maxExportsPerDay: number;
  // Credit-based limits (replaces maxToolRunsPerDay)
  monthlyCredits: number;
  dailyCreditCap: number;
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
    description: "Small monthly bundle, hard daily cap, no rollovers. Enough to taste, not enough to farm.",
    features: [],
    limits: {
      maxUploadBytes: 1_000_000, // 1 MB
      maxExportsPerDay: 3,
      monthlyCredits: 300, // 300 credits/month
      dailyCreditCap: 30, // Max 30 credits/day
    },
  },
  supporter: {
    key: "supporter",
    label: "Supporter",
    description: "Aimed at learners and hobbyists. Higher limits and basic cloud save.",
    features: ["advanced_dashboards", "larger_limits"],
    limits: {
      maxUploadBytes: 20_000_000, // 20 MB
      maxExportsPerDay: 25,
      monthlyCredits: 3_000, // 3,000 credits/month
      dailyCreditCap: 300, // Max 300 credits/day
    },
  },
  pro: {
    key: "pro",
    label: "Professional",
    description: "Aimed at serious builders. API access, webhooks, and higher concurrency.",
    features: [
      "templates_download",
      "history_export",
      "reports_export",
      "cpd_evidence_export",
      "early_access",
      "advanced_dashboards",
      "larger_limits",
      "api_access",
      "webhooks",
    ],
    limits: {
      maxUploadBytes: 100_000_000, // 100 MB
      maxExportsPerDay: 100,
      monthlyCredits: 12_000, // 12,000 credits/month
      dailyCreditCap: 2_000, // Max 2,000 credits/day
    },
  },
};

// Credit top-up packs
export const CREDIT_PACKS = [
  { id: "starter", label: "Starter", price: 10, credits: 500, pricePerCredit: 0.02 },
  { id: "standard", label: "Standard", price: 25, credits: 1_400, pricePerCredit: 0.0179 }, // 10% bulk discount
  { id: "professional", label: "Professional", price: 50, credits: 3_000, pricePerCredit: 0.0167 }, // 17% bulk discount
] as const;

// Public credit price (per credit)
export const CREDIT_PRICE = 0.02; // £0.02 per credit

export function planRank(plan: PlanKey) {
  if (plan === "pro") return 3;
  if (plan === "supporter") return 2;
  return 1;
}


