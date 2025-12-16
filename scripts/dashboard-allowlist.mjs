import fs from "node:fs";

const p = "src/lib/dashboard/allowlist.ts";
if (!fs.existsSync(p)) {
  console.error("Missing allowlist.ts");
  process.exit(1);
}

const t = fs.readFileSync(p, "utf8");
if (!t.includes("ALLOWED_ORIGINS")) {
  console.error("allowlist.ts must define ALLOWED_ORIGINS");
  process.exit(1);
}

console.log("Dashboard allowlist gate passed");
