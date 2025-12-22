import fs from "node:fs";
import path from "node:path";

function fail(msg) {
  console.error(`\nCREDITS QUALITY FAILED\n${msg}\n`);
  process.exit(1);
}

const consumeRoute = path.join(process.cwd(), "src/app/api/credits/consume/route.ts");
if (!fs.existsSync(consumeRoute)) fail("Missing credits consume route.");
const consumeSrc = fs.readFileSync(consumeRoute, "utf8");

if (!consumeSrc.includes("hadPreview")) fail("Consume route must require hadPreview flag.");
if (!consumeSrc.includes("meterRun")) fail("Consume route must use server-side metering.");

const runner = path.join(process.cwd(), "src/hooks/useToolRunner.ts");
if (!fs.existsSync(runner)) fail("Missing useToolRunner.");
const runnerSrc = fs.readFileSync(runner, "utf8");
if (!runnerSrc.includes("/api/credits/consume")) fail("useToolRunner must call /api/credits/consume for paid runs.");
if (!runnerSrc.includes("hadPreview")) fail("useToolRunner must pass hadPreview to /api/credits/consume.");

console.log("CREDITS QUALITY PASSED");


