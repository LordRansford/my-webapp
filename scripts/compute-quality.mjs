import fs from "node:fs";
import path from "node:path";

function fail(msg) {
  console.error(`\nCOMPUTE QUALITY FAILED\n${msg}\n`);
  process.exit(1);
}

function listFiles(dir) {
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...listFiles(p));
    else out.push(p);
  }
  return out;
}

const roots = ["src/components", "src/pages", "src/app"].map((p) => path.join(process.cwd(), p)).filter((p) => fs.existsSync(p));
const files = roots.flatMap((r) => listFiles(r)).filter((p) => /\.(tsx|ts|jsx|js)$/.test(p));

const offenders = [];

for (const f of files) {
  const rel = path.relative(process.cwd(), f);
  const src = fs.readFileSync(f, "utf8");

  if (!src.includes("useToolRunner")) continue;

  // If this file uses the runner, it must render compute transparency UI.
  // Either legacy metering (ComputeMeterPanel) or read-only transparency (ComputeEstimatePanel / ComputeSummaryPanel).
  const hasLegacy = src.includes("ComputeMeterPanel");
  const hasEstimate = src.includes("ComputeEstimatePanel");
  const hasSummary = src.includes("ComputeSummaryPanel");
  if (!(hasLegacy || (hasEstimate && hasSummary))) {
    offenders.push(
      `${rel} uses useToolRunner but does not render compute UI (ComputeMeterPanel or ComputeEstimatePanel+ComputeSummaryPanel)`
    );
  }

  // Runner should always have toolId for consistent metering.
  if (src.includes("useToolRunner(") && !src.includes("toolId:")) {
    offenders.push(`${rel} uses useToolRunner without toolId`);
  }
}

if (offenders.length) {
  fail(offenders.slice(0, 20).join("\n"));
}

// Stage 4 safety envelope enforcement (server side)
// 1) Prevent bypassing compute runner contract.
// 2) Prevent server-side fetch usage outside safeFetch.
// 3) Prevent upload handling via formData without validateUpload.
const guardFiles = listFiles(path.join(process.cwd(), "src"))
  .filter((p) => /\.(tsx|ts|jsx|js)$/.test(p))
  .map((p) => ({ rel: path.relative(process.cwd(), p), src: fs.readFileSync(p, "utf8") }));

const apiRoutes = guardFiles.filter((f) => f.rel.startsWith("src/app/api/") || f.rel.startsWith("src/pages/api/"));
const jobHandlers = guardFiles.filter((f) => f.rel === "src/lib/jobs/registry.ts");

for (const f of jobHandlers) {
  if (f.src.includes("runInRunner(")) {
    offenders.push(`${f.rel} calls runInRunner directly. Use runComputeJob from src/lib/compute/runner.ts`);
  }
}

for (const f of apiRoutes) {
  if (f.rel.includes("safeFetch")) continue;
  // No direct fetch in API routes (defense in depth against SSRF).
  if (f.src.includes("fetch(")) {
    offenders.push(`${f.rel} uses fetch() in an API route. Use safeFetch from src/lib/network/safeFetch.ts`);
  }
  // Uploads must go through validateUpload (when formData is used).
  if (f.src.includes(".formData(") || f.src.includes("formData()")) {
    if (!f.src.includes("validateUpload")) {
      offenders.push(`${f.rel} uses formData but does not call validateUpload`);
    }
  }
}

if (offenders.length) {
  fail(offenders.slice(0, 20).join("\n"));
}

console.log("COMPUTE QUALITY PASSED");


