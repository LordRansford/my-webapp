import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    rules: {
      // Relax React Compiler strictness so existing patterns (localStorage hydration,
      // simple memo helpers, etc.) can continue without refactors.
      "react-hooks/purity": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "react-hooks/set-state-in-render": "off",
      "react-hooks/immutability": "off",
      // Prevent server-only modules from being imported in client/shared code
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "fs",
              message: "fs is server-only. Import from server modules (e.g., @/server/tools-pages.server) instead.",
            },
          ],
        },
      ],
      // Design System Enforcement
      // Warn against hardcoded spacing values (should use design tokens)
      "no-magic-numbers": [
        "warn",
        {
          ignore: [0, 1, -1, 2, 4, 8, 16, 24, 32, 48, 64, 100, 360, 720], // Common CSS values
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
          detectObjects: false,
        },
      ],
      // Encourage use of CSS variables for colors
      "no-restricted-syntax": [
        "warn",
        {
          selector: "Literal[value=/^#[0-9a-fA-F]{3,6}$/]",
          message: "Prefer design system color tokens (e.g., var(--color-text-primary)) over hardcoded hex colors for consistency and theme support.",
        },
      ],
    },
  },
  // Allow fs/path in server-only files
  {
    files: ["src/server/**/*.ts", "src/server/**/*.js"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
  // Allow Node built-ins (fs, path) in server-only contexts and scripts
  {
    files: [
      "scripts/**/*.{js,mjs,ts}",
      "src/lib/**/*.{js,ts,tsx,mjs}",
      "src/app/api/**/*.{js,ts,tsx}",
      "src/pages/api/**/*.{js,ts,tsx}",
      "src/pages/tools/**/*.{js,ts,tsx}",
      "src/pages/cybersecurity/course.js",
    ],
    rules: {
      "no-restricted-imports": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

