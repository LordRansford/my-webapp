import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { retrieveContent } from "../src/lib/mentor/retrieveContent.node.mjs";

const root = process.cwd();
const indexPath = path.join(root, "public", "content-index.json");

// This test is a lightweight gate:
// - index must exist
// - retrieval must return citations with anchors

assert.ok(fs.existsSync(indexPath), "public/content-index.json is missing. Run npm run build:content-index.");

const { matches } = retrieveContent("risk appetite", "/cybersecurity/advanced", 6);
assert.ok(Array.isArray(matches), "retrieveContent should return matches array");
assert.ok(matches.length >= 1, "retrieveContent should return at least 1 match for a common query");
assert.ok(matches[0].href.includes("#"), "Top match should include an anchor link");


