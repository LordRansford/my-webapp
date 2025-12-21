import test from "node:test";
import assert from "node:assert/strict";

import { TIERS, FEATURES, canTierAccessFeature } from "../src/lib/billing/entitlements.core.js";

test("free tier has no supporter features", async () => {
  assert.equal(canTierAccessFeature(TIERS.FREE, FEATURES.ADVANCED_DASHBOARDS), false);
  assert.equal(canTierAccessFeature(TIERS.FREE, FEATURES.DOWNLOAD_TEMPLATES), false);
});

test("supporter tier gets advanced dashboards but not downloads", async () => {
  assert.equal(canTierAccessFeature(TIERS.SUPPORTER, FEATURES.ADVANCED_DASHBOARDS), true);
  assert.equal(canTierAccessFeature(TIERS.SUPPORTER, FEATURES.DOWNLOAD_TEMPLATES), false);
});

test("professional tier gets downloads and exports", async () => {
  assert.equal(canTierAccessFeature(TIERS.PROFESSIONAL, FEATURES.DOWNLOAD_TEMPLATES), true);
  assert.equal(canTierAccessFeature(TIERS.PROFESSIONAL, FEATURES.REPORT_EXPORT), true);
});

test("feature flags can disable downloads", async () => {
  const flags = { supporterGatingEnabled: true, downloadsEnabled: false, advancedAnalyticsEnabled: true };
  assert.equal(canTierAccessFeature(TIERS.PROFESSIONAL, FEATURES.DOWNLOAD_TEMPLATES, flags), false);
});


