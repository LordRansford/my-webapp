export const TIERS = {
  FREE: "free",
  SUPPORTER: "supporter",
  PROFESSIONAL: "professional",
  INSTITUTIONAL: "institutional",
};

export const FEATURES = {
  ADVANCED_DASHBOARDS: "advanced_dashboards",
  ADVANCED_ANALYTICS: "advanced_analytics",
  DOWNLOAD_TEMPLATES: "templates_download",
  REPORT_EXPORT: "reports_export",
  PRIORITY_FEEDBACK: "priority_feedback",
};

export function tierRank(tier) {
  if (tier === TIERS.INSTITUTIONAL) return 4;
  if (tier === TIERS.PROFESSIONAL) return 3;
  if (tier === TIERS.SUPPORTER) return 2;
  return 1;
}

export function featuresForTier(tier) {
  if (tier === TIERS.INSTITUTIONAL) {
    return [
      FEATURES.ADVANCED_DASHBOARDS,
      FEATURES.ADVANCED_ANALYTICS,
      FEATURES.DOWNLOAD_TEMPLATES,
      FEATURES.REPORT_EXPORT,
      FEATURES.PRIORITY_FEEDBACK,
    ];
  }
  if (tier === TIERS.PROFESSIONAL) {
    return [
      FEATURES.ADVANCED_DASHBOARDS,
      FEATURES.ADVANCED_ANALYTICS,
      FEATURES.DOWNLOAD_TEMPLATES,
      FEATURES.REPORT_EXPORT,
      FEATURES.PRIORITY_FEEDBACK,
    ];
  }
  if (tier === TIERS.SUPPORTER) {
    return [FEATURES.ADVANCED_DASHBOARDS, FEATURES.ADVANCED_ANALYTICS, FEATURES.PRIORITY_FEEDBACK];
  }
  return [];
}

export function isFeatureEnabled(flags, feature) {
  const gatingEnabled = flags?.supporterGatingEnabled !== false;
  const downloadsEnabled = flags?.downloadsEnabled !== false;
  const analyticsEnabled = flags?.advancedAnalyticsEnabled !== false;

  if (!gatingEnabled) return true;
  if (feature === FEATURES.DOWNLOAD_TEMPLATES || feature === FEATURES.REPORT_EXPORT) return downloadsEnabled;
  if (feature === FEATURES.ADVANCED_ANALYTICS) return analyticsEnabled;
  return true;
}

export function canTierAccessFeature(tier, feature, flags) {
  if (!isFeatureEnabled(flags, feature)) return false;
  const features = featuresForTier(tier);
  return features.includes(feature);
}


