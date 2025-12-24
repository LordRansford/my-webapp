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
    },
  },
  // Allow fs/path in server-only files
  {
    files: ["src/server/**/*.ts", "src/server/**/*.js"],
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
