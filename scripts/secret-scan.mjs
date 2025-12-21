/**
 * Minimal secret scanning (pattern based).
 * This is intentionally lightweight and dependency-free.
 */

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const out = [];
  for (const e of entries) {
    if (e.name === "node_modules" || e.name.startsWith(".next")) continue;
    if (e.name.startsWith(".")) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

function read(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return "";
  }
}

const patterns = [
  { re: /\bsk_live_[A-Za-z0-9]+/g, why: "Stripe live secret key" },
  { re: /\bpk_live_[A-Za-z0-9]+/g, why: "Stripe live publishable key" },
  { re: /\bwhsec_[A-Za-z0-9]+/g, why: "Stripe webhook secret" },
  { re: /\bAKIA[0-9A-Z]{16}\b/g, why: "AWS access key id" },
  { re: /-----BEGIN (RSA|EC|OPENSSH) PRIVATE KEY-----/g, why: "Private key material" },
  { re: /\bghp_[A-Za-z0-9]{30,}\b/g, why: "GitHub token" },
];

const textFiles = walk(root).filter((f) => /\.(js|jsx|ts|tsx|mjs|json|md|yml|yaml|env|txt)$/.test(f));
const offenders = [];

for (const file of textFiles) {
  if (file.includes(`${path.sep}node_modules${path.sep}`)) continue;
  const src = read(file);
  for (const p of patterns) {
    if (p.re.test(src)) offenders.push({ file, why: p.why });
  }
}

if (offenders.length) {
  console.error("Secret scan failed:");
  offenders.slice(0, 30).forEach((o) => console.error(`- ${o.file}: ${o.why}`));
  process.exit(1);
}

console.log("Secret scan passed.");


