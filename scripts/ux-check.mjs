/**
 * Lightweight UX checks:
 * - no em dash in client-facing text (project convention)
 * - no duplicate Header components by filename
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

const files = walk(path.join(root, "src")).filter((f) => /\.(js|jsx|ts|tsx)$/.test(f));
const offenders = [];

for (const f of files) {
  const src = read(f);
  if (src.includes("—")) offenders.push({ file: f, why: "em dash found" });
}

const headerFiles = files.filter((f) => /Header\.(t|j)sx?$/.test(f));
if (headerFiles.length > 1) {
  offenders.push({ file: headerFiles.join(", "), why: "multiple Header components found" });
}

if (offenders.length) {
  console.error("UX checks failed:");
  offenders.slice(0, 40).forEach((o) => console.error(`- ${o.file}: ${o.why}`));
  process.exit(1);
}

console.log("UX checks passed.");


