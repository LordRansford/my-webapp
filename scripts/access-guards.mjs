/**
 * Stage 9 guardrails:
 * - No premium templates in public/templates
 * - Download route must enforce auth + access
 * - Templates UI must use AccessGate around download actions
 * - No em dash in client-facing text in changed gating/pricing surfaces
 */

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

function fail(msg) {
  console.error(msg);
  process.exitCode = 1;
}

// 1) No premium templates in /public/templates
const publicTemplates = path.join(root, "public", "templates");
if (exists(publicTemplates)) {
  const entries = fs.readdirSync(publicTemplates);
  if (entries.length) {
    fail("Access guard failed: do not store templates under public/templates");
  }
}

// 2) Download route must enforce auth + access
const downloadRoute = path.join(root, "src", "app", "api", "templates", "download", "route.ts");
if (!exists(downloadRoute)) {
  fail("Access guard failed: missing /api/templates/download route");
} else {
  const src = fs.readFileSync(downloadRoute, "utf8");
  if (!src.includes("getServerSession")) fail("Access guard failed: download route must authenticate with getServerSession");
  if (!src.includes("getUserPlan") || !src.includes("templates_download")) {
    fail("Access guard failed: download route must check plan access for templates_download");
  }
}

// 3) Templates UI must use AccessGate on download buttons
const templateCard = path.join(root, "src", "components", "templates", "TemplateCard.jsx");
if (exists(templateCard)) {
  const src = fs.readFileSync(templateCard, "utf8");
  if (!src.includes("AccessGate")) fail("Access guard failed: TemplateCard.jsx must use AccessGate for download actions");
} else {
  fail("Access guard failed: missing TemplateCard.jsx");
}

// 4) No em dash in client facing text in key UX pages/components
const watchFiles = [
  path.join(root, "src", "app", "pricing", "page.jsx"),
  path.join(root, "src", "components", "AccessGate.jsx"),
  path.join(root, "src", "components", "templates", "DownloadOptionsModal.jsx"),
];
for (const file of watchFiles) {
  if (!exists(file)) continue;
  const src = fs.readFileSync(file, "utf8");
  if (src.includes("—")) fail(`Access guard failed: em dash found in ${file}`);
}

if (process.exitCode) {
  console.error("Access guards failed.");
} else {
  console.log("Access guards passed.");
}


