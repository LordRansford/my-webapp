import { defineConfig } from "@playwright/test";

// NOTE:
// CI invokes Playwright without "-c", so we need a conventionally-named config
// file for auto-discovery (playwright.config.ts/js). The previous
// playwright.config.mjs was not being picked up, causing "--project=tools-smoke"
// to fail in GitHub Actions.

export default defineConfig({
  testDir: "tests",
  testMatch: /.*\.(spec|test)\.(ts|js|mjs)/,
  timeout: 60_000,
  use: {
    // Use localhost to avoid cross-origin dev asset warnings in Next.js.
    baseURL: "http://localhost:3000",
    headless: true,
  },
  webServer: {
    command: "npm run dev -- --port 3000",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    {
      name: "tools-smoke",
      testMatch: "**/tools-smoke.spec.ts",
    },
    {
      name: "mentor-e2e",
      testMatch: "**/mentor-e2e.test.ts",
    },
    {
      name: "mentor-contract",
      testMatch: "**/mentor-contract.test.ts",
    },
    {
      name: "e2e",
      testMatch: "**/e2e/**/*.spec.*",
    },
  ],
});


