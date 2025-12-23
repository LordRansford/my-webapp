import test from "node:test";
import assert from "node:assert/strict";
import { computeMetering } from "../src/lib/jobs/metering.core.js";

test("computeMetering applies free tier then charges credits for paid portion", () => {
  const out = computeMetering({
    durationMs: 12_000,
    freeRemainingMsAtStart: 10_000,
    creditsPerMsPaid: 1 / 10_000, // 1 credit per 10s paid
    maxRunMsHardCap: 60_000,
  });

  assert.equal(out.durationMs, 12_000);
  assert.equal(out.freeTierAppliedMs, 10_000);
  assert.equal(out.paidMs, 2_000);
  // Any paid portion should charge at least 1 credit.
  assert.equal(out.chargedCredits, 1);
});


