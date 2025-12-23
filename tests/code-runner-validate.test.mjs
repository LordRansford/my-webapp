import test from "node:test";
import assert from "node:assert/strict";
import { validateCodeRunnerPayload } from "../src/lib/codeRunner/validate.core.js";

test("validateCodeRunnerPayload rejects unknown language", () => {
  const out = validateCodeRunnerPayload({ language: "rb", code: "puts 1" });
  assert.equal(out.ok, false);
});

test("validateCodeRunnerPayload rejects oversized code", () => {
  const big = "a".repeat(7000);
  const out = validateCodeRunnerPayload({ language: "js", code: big });
  assert.equal(out.ok, false);
});


