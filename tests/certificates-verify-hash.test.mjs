import test from "node:test";
import assert from "node:assert/strict";

import { sha256Hex } from "../src/lib/certificates/verify.core.js";

test("sha256Hex is deterministic", () => {
  const a = new Uint8Array([1, 2, 3, 4]);
  const b = new Uint8Array([1, 2, 3, 4]);
  assert.equal(sha256Hex(a), sha256Hex(b));
});

test("sha256Hex changes when bytes change", () => {
  const a = new Uint8Array([1, 2, 3, 4]);
  const b = new Uint8Array([1, 2, 3, 5]);
  assert.notEqual(sha256Hex(a), sha256Hex(b));
});


