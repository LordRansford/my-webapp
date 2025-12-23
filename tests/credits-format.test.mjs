import test from "node:test";
import assert from "node:assert/strict";
import { formatCreditsSafe, formatMsSafe, msOrNull, numberOrNull } from "../src/lib/credits/format.core.js";

test("numberOrNull returns null for non-finite values", () => {
  assert.equal(numberOrNull(undefined), null);
  assert.equal(numberOrNull(null), null);
  assert.equal(numberOrNull(NaN), null);
  assert.equal(numberOrNull(Infinity), null);
  assert.equal(numberOrNull(-Infinity), null);
  assert.equal(numberOrNull(0), 0);
  assert.equal(numberOrNull(12.3), 12.3);
});

test("msOrNull clamps negatives and rounds", () => {
  assert.equal(msOrNull(undefined), null);
  assert.equal(msOrNull(-5), 0);
  assert.equal(msOrNull(1.2), 1);
});

test("formatMsSafe never returns 'NaN' and formats common values", () => {
  assert.equal(formatMsSafe(undefined), null);
  assert.equal(formatMsSafe(NaN), null);
  assert.equal(formatMsSafe(0), "0s");
  assert.equal(formatMsSafe(999), "1s");
  assert.equal(formatMsSafe(60_000), "1m 0s");
});

test("formatCreditsSafe never returns 'NaN' and rounds", () => {
  assert.equal(formatCreditsSafe(undefined), null);
  assert.equal(formatCreditsSafe(NaN), null);
  assert.equal(formatCreditsSafe(-5), "0");
  assert.equal(formatCreditsSafe(1.2), "1");
});


