import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const definitionsPath = path.resolve(__dirname, "../content/templates/definitions/index.ts");

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

if (!fs.existsSync(definitionsPath)) {
  fail("definitions file missing");
  process.exit();
}

const src = fs.readFileSync(definitionsPath, "utf8");
const requiredStrings = ["disclaimer", "calcFn", "exportProfile"];
requiredStrings.forEach((token) => {
  if (!src.includes(token)) {
    fail(`missing token in definitions: ${token}`);
  }
});

const templateCount = (src.match(/slug:/g) || []).length;
if (templateCount < 3) {
  fail("expected at least 3 template definitions");
}

if (process.exitCode) {
  console.error("Template definition checks failed.");
} else {
  console.log("Template definition checks passed.");
}
