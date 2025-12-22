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

console.log("CREDITS QUALITY PASSED");


