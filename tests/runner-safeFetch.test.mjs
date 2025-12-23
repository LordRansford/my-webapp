import test from "node:test";
import assert from "node:assert/strict";
import { safeFetch } from "../src/lib/net/safeFetch.core.js";

test("safeFetch blocks localhost", async () => {
  await assert.rejects(
    () =>
      safeFetch("http://localhost:5055/run", {
        method: "GET",
        maxResponseBytes: 10,
        overallTimeoutMs: 1000,
        allowHttpInDev: true,
        allowLocalhostInDev: false,
      }),
    (err) => Boolean(err && String(err.message).toLowerCase().includes("blocked"))
  );
});

test("safeFetch blocks private IP ranges", async () => {
  await assert.rejects(
    () =>
      safeFetch("http://127.0.0.1:5055/run", {
        method: "GET",
        maxResponseBytes: 10,
        overallTimeoutMs: 1000,
        allowHttpInDev: true,
        allowLocalhostInDev: false,
      }),
    (err) => Boolean(err && String(err.message).toLowerCase().includes("blocked"))
  );
});


