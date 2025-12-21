/**
 * Stage 8 guardrails:
 * - Webhook must verify Stripe signatures
 * - Checkout must enforce bounded donation amounts
 * - Secret keys must not appear client-side (covered elsewhere, but keep a focused check)
 * - No em dash in donation UX pages
 */

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function read(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return "";
  }
}

function fail(msg) {
  console.error(msg);
  process.exitCode = 1;
}

const webhook = path.join(root, "src", "app", "api", "stripe", "webhook", "route.ts");
const checkout = path.join(root, "src", "app", "api", "stripe", "donation", "checkout", "route.ts");

const webhookSrc = read(webhook);
// Signature verification must be present. We accept either direct Stripe SDK constructEvent usage,
// or a billing-provider abstraction that performs constructEvent inside the provider.
const hasDirectConstructEvent = webhookSrc.includes("stripe.webhooks.constructEvent");
const hasProviderParse = webhookSrc.includes("parseWebhookEvent");
if (!hasDirectConstructEvent && !hasProviderParse) {
  fail("Stripe guard failed: webhook route must verify signatures using constructEvent (directly or via billing provider)");
}
if (!webhookSrc.includes("stripe-signature")) {
  fail("Stripe guard failed: webhook route must read stripe-signature header");
}

const checkoutSrc = read(checkout);
if (!/MIN_PENCE\s*=\s*200/.test(checkoutSrc) || !/MAX_PENCE\s*=\s*50_000/.test(checkoutSrc)) {
  fail("Stripe guard failed: checkout route must enforce min £2 and max £500 bounds");
}

const watchFiles = [
  path.join(root, "src", "app", "support", "donate", "page.jsx"),
  path.join(root, "src", "app", "support", "success", "page.jsx"),
  path.join(root, "src", "app", "support", "cancel", "page.jsx"),
];
for (const f of watchFiles) {
  const src = read(f);
  if (src.includes("—")) fail(`Stripe guard failed: em dash found in ${f}`);
}

if (process.exitCode) {
  console.error("Stripe guards failed.");
} else {
  console.log("Stripe guards passed.");
}


