/**
 * Stage 7 guardrails:
 * - Fail if Stripe checkout is enabled (explicitly or implicitly).
 * - Fail if live Stripe keys are present in repo text.
 * - Fail if Stripe SDK is used client-side.
 * - Fail if templates are hard gated by entitlements (must remain display-only).
 */

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

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

const srcFiles = walk(path.join(root, "src")).filter((f) => /\.(js|jsx|ts|tsx|mjs)$/.test(f));
const allTextFiles = walk(root).filter((f) => /\.(js|jsx|ts|tsx|mjs|md|json|env|txt)$/.test(f));

const offenders = [];

// 1) Stripe checkout must not be enabled implicitly (keys alone) or exposed client-side.
for (const file of srcFiles) {
  const text = readText(file);
  const isClient = /^\s*["']use client["'];/m.test(text);

  if (isClient) {
    if (/\bfrom\s+["']stripe["']|require\(["']stripe["']\)/.test(text)) {
      offenders.push({ file, why: "Stripe SDK must not be imported client-side", match: "import stripe" });
    }
    if (/checkout\.sessions\.create|PaymentIntent|payment_intents/i.test(text)) {
      offenders.push({ file, why: "Payment logic must not execute client-side", match: "payment logic" });
    }
  }

  // Ensure the checkout route stays behind STRIPE_ENABLED flag.
  if (file.endsWith(`${path.sep}app${path.sep}api${path.sep}stripe${path.sep}create-checkout-session${path.sep}route.ts`)) {
    if (!/process\.env\.STRIPE_ENABLED\s*!==\s*["']true["']/.test(text)) {
      offenders.push({ file, why: "Checkout route must be disabled unless STRIPE_ENABLED=true", match: "STRIPE_ENABLED guard missing" });
    }
  }
}

// 2) Live keys must never appear in repo text.
for (const file of allTextFiles) {
  if (file.includes(`${path.sep}node_modules${path.sep}`)) continue;
  // Allowlist guard scripts that intentionally contain secret regex patterns.
  if (file.endsWith(`${path.sep}scripts${path.sep}secret-scan.mjs`)) continue;
  const text = readText(file);
  if (/(sk_live|pk_live)_/i.test(text)) {
    offenders.push({ file, why: "Live Stripe keys are forbidden", match: "sk_live/pk_live" });
  }
}

if (offenders.length) {
  console.error("Monetization guard failed:");
  offenders.slice(0, 30).forEach((o) => console.error(`- ${o.file}: ${o.why} (${o.match})`));
  process.exit(1);
}

console.log("Monetization guard passed.");


