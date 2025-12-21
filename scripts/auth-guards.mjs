/**
 * Stage 6 guardrails:
 * - Passwordless only: forbid password/credentials auth providers.
 * - Keep identity logic server-side: forbid auth secrets or NextAuth config in client components.
 * - Prevent accidental secret leakage in the repo.
 */

import fs from "fs";
import path from "path";

const root = process.cwd();

// Only forbid password-based AUTH mechanisms (not educational mentions of passwords).
const forbidAuthPatterns = [
  { re: /CredentialsProvider|credentials provider/i, why: "Password-based auth (credentials) is forbidden" },
  { re: /type:\s*["']credentials["']/i, why: "Password-based auth (credentials) is forbidden" },
];

const forbidClientAuthPatterns = [
  { re: /NEXTAUTH_SECRET|GOOGLE_CLIENT_SECRET|GITHUB_CLIENT_SECRET|EMAIL_SERVER/i, why: "Auth secrets must not appear in client code" },
  { re: /NextAuth\(/, why: "NextAuth config must remain server-side" },
];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const out = [];
  for (const e of entries) {
    if (e.name === "node_modules" || e.name.startsWith(".")) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

function readText(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return "";
  }
}

const files = walk(path.join(root, "src")).filter((f) => /\.(js|jsx|ts|tsx|mjs)$/.test(f));
const offenders = [];

for (const file of files) {
  const text = readText(file);
  const isAuthSurface =
    file.includes(`${path.sep}api${path.sep}auth${path.sep}`) ||
    file.endsWith(`${path.sep}signin.js`) ||
    file.endsWith(`${path.sep}signin.jsx`) ||
    file.endsWith(`${path.sep}signin.tsx`) ||
    file.endsWith(`${path.sep}signin.ts`);

  for (const p of forbidAuthPatterns) {
    if (p.re.test(text)) offenders.push({ file, why: p.why, match: String(p.re) });
  }

  // Only forbid password inputs on auth surfaces (not in educational tools).
  if (isAuthSurface && /type=["']password["']/i.test(text)) {
    offenders.push({ file, why: "Password inputs are forbidden (passwordless only)", match: "type=password" });
  }
  const isClient = /^\s*["']use client["'];/m.test(text);
  if (isClient) {
    for (const p of forbidClientAuthPatterns) {
      if (p.re.test(text)) offenders.push({ file, why: p.why, match: String(p.re) });
    }
  }
}

if (offenders.length) {
  console.error("Auth guard failed:");
  offenders.slice(0, 20).forEach((o) => console.error(`- ${o.file}: ${o.why} (${o.match})`));
  process.exit(1);
}

console.log("Auth guard passed.");


