import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  testMatch: /.*\.(spec|test)\.(ts|js|mjs)/,
  timeout: 60_000,
  use: {
    baseURL: "http://127.0.0.1:3000",
    headless: true,
  },
  webServer: {
    command: "npm run dev -- --port 3000",
    url: "http://127.0.0.1:3000",
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


