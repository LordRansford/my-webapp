import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { retrieveContent } from "../src/lib/mentor/retrieveContent.node.mjs";

const root = process.cwd();
const indexPath = path.join(root, "public", "content-index.json");
assert.ok(fs.existsSync(indexPath), "public/content-index.json is missing. Run npm run build:content-index.");

const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));

function anchorExists(href) {
  const [route, hash] = String(href).split("#");
  if (!route || !hash) return false;
  const page = (index.pages || []).find((p) => p.route === route);
  if (!page) return false;
  return (page.sections || []).some((s) => s.anchor === hash);
}

const { matches } = retrieveContent("risk appetite", "/cybersecurity/advanced", 6);
assert.ok(matches.length >= 1, "Expected at least one match");
for (const m of matches.slice(0, 5)) {
  assert.ok(anchorExists(m.href), `Citation anchor does not exist: ${m.href}`);
}


