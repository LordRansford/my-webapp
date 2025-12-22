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

  // If this file uses the runner, it must render a compute meter panel.
  if (!src.includes("ComputeMeterPanel")) {
    offenders.push(`${rel} uses useToolRunner but does not render ComputeMeterPanel`);
  }

  // Runner should always have toolId for consistent metering.
  if (src.includes("useToolRunner(") && !src.includes("toolId:")) {
    offenders.push(`${rel} uses useToolRunner without toolId`);
  }
}

if (offenders.length) {
  fail(offenders.slice(0, 20).join("\n"));
}

console.log("COMPUTE QUALITY PASSED");


