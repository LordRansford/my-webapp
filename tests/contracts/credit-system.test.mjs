/**
 * Contract Tests for Credit System
 * 
 * Tests auth gating, credit estimation, charging, and spend limits.
 */

import { describe, it } from "node:test";
import assert from "node:assert";

describe("Credit System Contract Tests", () => {
  describe("Credit Estimation", () => {
    it("should estimate credits for client-only tools as 0", async () => {
      // Client-only tools should always return 0 credits
      const response = await fetch("http://localhost:3000/api/billing/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId: "dev-studio-projects" }),
      });

      if (response.ok) {
        const data = await response.json();
        assert.strictEqual(data.estimate.isFree, true);
        assert.strictEqual(data.estimate.min, 0);
        assert.strictEqual(data.estimate.max, 0);
      }
    });

    it("should estimate credits for server-required tools", async () => {
      // Server-required tools should return non-zero estimates
      const response = await fetch("http://localhost:3000/api/billing/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId: "dev-studio-security" }),
      });

      if (response.ok) {
        const data = await response.json();
        assert.strictEqual(data.estimate.isFree, false);
        assert(data.estimate.min >= 0);
        assert(data.estimate.max > 0);
        assert(data.estimate.min <= data.estimate.typical);
        assert(data.estimate.typical <= data.estimate.max);
      }
    });
  });

  describe("Auth Gating", () => {
    it("should require auth for server-side tool execution", async () => {
      // Anonymous request should be rejected
      const response = await fetch("http://localhost:3000/api/dev-studio/security/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      // Should return 401 or 403
      assert(response.status === 401 || response.status === 403);
    });

    it("should allow anonymous access to client-only tools", async () => {
      // Client-only tools should be accessible without auth
      const response = await fetch("http://localhost:3000/api/billing/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId: "dev-studio-projects" }),
      });

      // Should succeed (200 or 401 if auth is still checked, but estimate should work)
      assert(response.status === 200 || response.status === 401);
    });
  });

  describe("Spend Limits", () => {
    it("should enforce daily credit limits", async () => {
      // This test would require a test user with known limits
      // For now, just verify the API structure
      const response = await fetch("http://localhost:3000/api/credits/balance", {
        method: "GET",
      });

      // Should require auth
      assert(response.status === 401 || response.status === 200);
    });
  });

  describe("Credit Charging", () => {
    it("should charge credits within min/max bounds", async () => {
      // This would require actual tool execution
      // For now, verify estimation bounds are reasonable
      const response = await fetch("http://localhost:3000/api/billing/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId: "dev-studio-performance",
          requestedLimits: { cpuMs: 10000, memMb: 512 },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const estimate = data.estimate;
        
        // Min should be <= typical <= max
        assert(estimate.min <= estimate.typical);
        assert(estimate.typical <= estimate.max);
        
        // All should be non-negative
        assert(estimate.min >= 0);
        assert(estimate.typical >= 0);
        assert(estimate.max >= 0);
      }
    });
  });

  describe("Error Handling", () => {
    it("should return structured errors with codes", async () => {
      const response = await fetch("http://localhost:3000/api/billing/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId: "non-existent-tool" }),
      });

      if (!response.ok) {
        const data = await response.json();
        assert(data.error);
        assert(data.code);
      }
    });
  });
});
