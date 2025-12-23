import test from "node:test";
import assert from "node:assert/strict";

import { evaluateCertificateEligibility } from "../src/lib/cpd/eligibility.core.js";

test("evaluateCertificateEligibility: requires entitlement eligible, 3 evidence, and 1 quiz", () => {
  const res = evaluateCertificateEligibility({
    entitlementStatus: "eligible",
    evidenceTypes: ["progress", "quiz", "manual"],
  });
  assert.equal(res.eligible, true);
  assert.equal(res.summary.evidenceCount, 3);
  assert.equal(res.summary.quizzesCompleted, 1);
});

test("evaluateCertificateEligibility: rejects missing quiz evidence", () => {
  const res = evaluateCertificateEligibility({
    entitlementStatus: "eligible",
    evidenceTypes: ["progress", "manual", "tool"],
  });
  assert.equal(res.eligible, false);
  assert.ok(res.reasons.some((r) => r.toLowerCase().includes("quiz")));
});

test("evaluateCertificateEligibility: rejects non-eligible entitlement", () => {
  const res = evaluateCertificateEligibility({
    entitlementStatus: "pending_payment",
    evidenceTypes: ["progress", "quiz", "manual"],
  });
  assert.equal(res.eligible, false);
  assert.ok(res.reasons.some((r) => r.toLowerCase().includes("entitlement")));
});


