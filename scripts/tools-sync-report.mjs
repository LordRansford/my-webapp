#!/usr/bin/env node

/**
 * Tool metadata sync report (non-blocking).
 *
 * This exists to reduce drift between:
 * - src/pages/tools.js (marketing list)
 * - data/tool-contracts.json (contracts)
 * - data/tools/catalog.json (catalog/explain/examples)
 * - public/tools-index.json (generated merge)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, rel), "utf8"));
}

function extractToolsFromToolsPage() {
  const toolsPagePath = path.join(rootDir, "src", "pages", "tools.js");
  const content = fs.readFileSync(toolsPagePath, "utf8");
  const toolMatches = content.matchAll(/id:\s*"([^"]+)"/g);
  return Array.from(toolMatches, (m) => m[1]);
}

function main() {
  const contracts = readJson("data/tool-contracts.json").tools || [];
  const catalog = readJson("data/tools/catalog.json").tools || [];

  const listedIds = contracts.filter((c) => c && c.listed === true).map((c) => c.id);
  const contractIds = new Set(contracts.map((c) => c.id));
  const catalogIds = new Set(catalog.map((c) => c.id));
  const listedIdSet = new Set(listedIds);

  const missingContract = listedIds.filter((id) => !contractIds.has(id));
  const missingCatalog = listedIds.filter((id) => !catalogIds.has(id));
  const unlistedContracts = contracts.map((c) => c.id).filter((id) => !listedIdSet.has(id));
  const unlistedCatalog = catalog.map((c) => c.id).filter((id) => !listedIdSet.has(id));

  const lines = [];
  lines.push(`# Tools sync report`);
  lines.push(``);
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(``);
  lines.push(`## Summary`);
  lines.push(`- listed tools (contracts): ${listedIds.length}`);
  lines.push(`- contracts: ${contracts.length}`);
  lines.push(`- catalog entries: ${catalog.length}`);
  lines.push(``);
  lines.push(`## Gaps (tools.js → contracts/catalog)`);
  lines.push(`- Missing contract: ${missingContract.length}`);
  for (const id of missingContract) lines.push(`  - ${id}`);
  lines.push(`- Missing catalog: ${missingCatalog.length}`);
  for (const id of missingCatalog) lines.push(`  - ${id}`);
  lines.push(``);
  lines.push(`## Potential drift (contracts/catalog not listed on tools page)`);
  lines.push(`- Contracts not listed in tools.js: ${unlistedContracts.length}`);
  for (const id of unlistedContracts) lines.push(`  - ${id}`);
  lines.push(`- Catalog not listed in tools.js: ${unlistedCatalog.length}`);
  for (const id of unlistedCatalog) lines.push(`  - ${id}`);
  lines.push(``);
  lines.push(`## Recommended next move`);
  lines.push(`- Decide a single source of truth for "what is listed" (suggest: a \`listed: true\` flag in tool contracts).`);
  lines.push(`- Generate tools page from merged tools-index (filtering by listed flag) to eliminate drift.`);

  const out = lines.join("\n") + "\n";
  const outPath = path.join(rootDir, "docs", "development", "tools-sync-report.md");
  fs.writeFileSync(outPath, out, "utf8");
  process.stdout.write(out);
}

main();

