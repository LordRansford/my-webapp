# Server/Client Boundary (Canonical Architecture)

This document defines the strict server/client boundary that must be enforced across the entire RansfordsNotes codebase. **Any violation of these rules causes build failures on Vercel/Turbopack and must be prevented at the source.**

## Mental Model

```
┌─────────────────────────────────────────────────────────┐
│                         Browser                         │
│                                                         │
│  ┌──────────────┐   ┌───────────────────────────────┐ │
│  │   UI Pages   │──▶│   React Components (Client)   │ │
│  │ (/pages,     │   │   - No fs/path                │ │
│  │  /app)       │   │   - No gray-matter             │ │
│  └──────────────┘   │   - No file IO                 │ │
│                     │   - No embeddings              │ │
│                     └──────────────▲────────────────┘ │
│                                    │                  │
└────────────────────────────────────┼──────────────────┘
                                     │ props / JSON
                                     │
┌─────────────────────────────────────┼──────────────────┐
│                   Next.js Server / Vercel               │
│                                                         │
│  ┌───────────────────────────────┐                      │
│  │ getServerSideProps / API      │                      │
│  │ Routes / Server Actions       │                      │
│  └──────────────▲────────────────┘                      │
│                 │ imports                                 │
│  ┌──────────────┴────────────────────────────────────┐ │
│  │        Server-Only Modules (/src/server)           │ │
│  │                                                    │ │
│  │  ✓ fs / path / gray-matter                         │ │
│  │  ✓ content loaders                                 │ │
│  │  ✓ mentor embeddings                               │ │
│  │  ✓ tool metadata                                   │ │
│  │                                                    │ │
│  │  ❌ NEVER imported by components or hooks           │ │
│  └────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Golden Rules (Must Be Enforced)

1. **Client code receives data only, never loads it**
   - React components, hooks, and client-side pages may only receive data via:
     - `getServerSideProps` props
     - API route responses
     - Server Actions
     - Static JSON files (already built)

2. **Filesystem access exists in exactly one layer**
   - All `fs`, `path`, `gray-matter`, and file IO operations MUST live under `src/server/**`
   - Files in `src/server/**` may import Node.js modules freely
   - These files must NEVER be imported by components, hooks, or client-side code

3. **Shared lib/ files must be explicitly server-guarded**
   - If a file in `src/lib/` needs filesystem access:
     - Move the filesystem logic to `src/server/**`
     - Keep only a thin wrapper in `src/lib/` that re-exports
     - Use dynamic imports in `getServerSideProps` or API routes
     - For App Router: use `import "server-only"` package

4. **CI must fail if these boundaries are crossed**
   - ESLint rules prevent `fs`/`path` imports outside `src/server/**`
   - Build must fail if server-only modules leak into client bundles
   - Code reviews must verify boundary compliance

## Examples

### ✅ Correct Pattern

**Server-only module:**
```typescript
// src/server/tools-pages.server.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export function getToolPage(slug: string) {
  const filePath = path.join(process.cwd(), "content/tools", `${slug}.mdx`);
  const source = fs.readFileSync(filePath, "utf8");
  // ... process file
}
```

**Server wrapper (Pages Router):**
```typescript
// src/lib/tools-pages.ts
// Server-only module - only imported via dynamic import in getServerSideProps
import { getToolPage } from "@/server/tools-pages.server";
export { getToolPage };
```

**Page using dynamic import:**
```javascript
// src/pages/tools/[slug].js
export async function getServerSideProps({ params }) {
  const { getToolPage } = await import("@/lib/tools-pages");
  const page = await getToolPage(params.slug);
  return { props: { page } };
}
```

### ❌ Incorrect Patterns

**Direct import in component:**
```typescript
// ❌ WRONG - Component imports server-only code
import { getToolPage } from "@/server/tools-pages.server";

export default function ToolPage() {
  // This will fail at build time
}
```

**Top-level import in page:**
```javascript
// ❌ WRONG - Top-level import leaks into client bundle
import { getToolPage } from "@/lib/tools-pages";

export async function getServerSideProps({ params }) {
  const page = await getToolPage(params.slug);
  return { props: { page } };
}
```

**fs in shared lib:**
```typescript
// ❌ WRONG - fs in shared library
// src/lib/content-loader.ts
import fs from "fs"; // This will break Vercel builds
```

## Enforcement

### ESLint Rules

The repository includes ESLint rules that:
- Block `fs` imports outside `src/server/**`
- Allow `fs`/`path` in `src/server/**` files only
- Fail CI if boundaries are violated

### Build-Time Checks

- Next.js/Turbopack will fail if `fs` is bundled into client code
- Vercel deployment will fail with "Module not found: Can't resolve 'fs'"
- These failures are **intentional** and indicate a boundary violation

### Code Review Checklist

Before merging any PR that touches server/client boundaries:

- [ ] No `fs`, `path`, or `gray-matter` imports in components or hooks
- [ ] All filesystem operations are in `src/server/**`
- [ ] Client code uses dynamic imports or API routes to access server logic
- [ ] Build passes locally (`npm run build`)
- [ ] No ESLint errors related to restricted imports

## Related Files

- `eslint.config.mjs` - Contains `no-restricted-imports` rules
- `src/server/**` - All server-only modules
- `package.json` - Includes `server-only` package for App Router

## Codex Blocking Instruction

**For AI assistants (Codex/Cursor):** When making changes that touch imports or module boundaries, enforce this rule:

```
🚨 CODEX BLOCKING INSTRUCTION — SERVER/CLIENT BOUNDARY

HARD RULE (NON-NEGOTIABLE):

You must enforce a strict server/client boundary in this repository.

1. Any module importing fs, path, gray-matter, or performing file IO:
   - MUST live under src/server/** or be explicitly marked with import "server-only"
   - MUST NOT be imported by React components, hooks, layouts, or shared UI utilities

2. Client-side code (components, pages, hooks):
   - MUST NOT import or transitively depend on fs, path, or server-only modules
   - MAY ONLY receive data via getServerSideProps, server actions, or API routes

3. CI MUST FAIL if:
   - fs/path/gray-matter is imported outside src/server/**
   - a file without import "server-only" imports fs
   - a component or page imports a server-only module

4. If a boundary violation is detected:
   - STOP immediately
   - Refactor by introducing a server-only wrapper
   - Re-run build before proceeding

No new features, tools, pages, or refactors may proceed until these rules pass CI.

If you are unsure whether a module is server-safe, assume it is NOT and block the change.
```

## History

This boundary was established after experiencing Vercel build failures due to `fs` module leakage into client bundles. The fix involved:

1. Moving filesystem logic to `src/server/tools-pages.server.ts`
2. Creating a thin wrapper in `src/lib/tools-pages.ts`
3. Using dynamic imports in `getServerSideProps`
4. Adding ESLint guardrails to prevent future violations

**Date established:** 2024 (after baseline RAG mentor implementation)
**Last updated:** 2024

