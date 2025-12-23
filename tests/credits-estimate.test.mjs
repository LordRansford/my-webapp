import test from "node:test";
import assert from "node:assert/strict";

import { FREE_TIER_MS_PER_DAY, CREDIT_MS_PER_1, MAX_RUN_MS_HARD_CAP } from "../src/lib/billing/creditsConfig.core.js";

test("creditsConfig has sane defaults", () => {
  assert.ok(FREE_TIER_MS_PER_DAY > 0);
  assert.ok(CREDIT_MS_PER_1 > 0);
  assert.ok(MAX_RUN_MS_HARD_CAP >= 60_000);
});


