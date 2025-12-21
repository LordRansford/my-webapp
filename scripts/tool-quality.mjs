import fs from "node:fs";
import path from "node:path";

function fail(msg) {
  console.error(`\nTOOL QUALITY FAILED\n${msg}\n`);
  process.exit(1);
}

function read(relativePath) {
  const full = path.resolve(process.cwd(), relativePath);
  if (!fs.existsSync(full)) fail(`Missing file: ${relativePath}`);
  return fs.readFileSync(full, "utf8");
}

const registryPath = "content/templates/registry.json";
const registryRaw = read(registryPath);

if (/-/.test(registryRaw)) {
  fail("Registry contains an em dash. Replace with a hyphen.");
}

const registry = JSON.parse(registryRaw);
const requiredFields = [
  "id",
  "category",
  "title",
  "description",
  "route",
  "tags",
  "difficulty",
  "estimatedMinutes",
  "exportFormatsSupported",
  "gatingLevel",
  "safetyClass",
];

const categorySlugs = {
  AI: "ai",
  Data: "data",
  "Software Architecture": "software-architecture",
  Digitalisation: "digitalisation",
  Cybersecurity: "cybersecurity",
};

for (const [catName, slug] of Object.entries(categorySlugs)) {
  if (slug === "cybersecurity") continue; // legacy pre-stage coverage
  const entries = registry.filter((r) => (r.category || "").toLowerCase() === slug.toLowerCase());
  if (entries.length !== 20) {
    fail(`Category ${catName} should have 20 entries. Found ${entries.length}.`);
  }
  for (const entry of entries) {
    requiredFields.forEach((field) => {
      if (entry[field] === undefined || entry[field] === null || entry[field] === "") {
        fail(`Entry ${entry.id} is missing field: ${field}`);
      }
    });
    if (!entry.route.startsWith(`/templates/${slug}`)) {
      fail(`Route for ${entry.id} should start with /templates/${slug}`);
    }
    if (!Array.isArray(entry.tags) || entry.tags.length === 0) {
      fail(`Entry ${entry.id} must include tags array`);
    }
    if (!Array.isArray(entry.exportFormatsSupported) || entry.exportFormatsSupported.length === 0) {
      fail(`Entry ${entry.id} must include exportFormatsSupported formats`);
    }
  }
}

[
  "src/app/templates/ai/[slug]/page.jsx",
  "src/app/templates/data/[slug]/page.jsx",
  "src/app/templates/software-architecture/[slug]/page.jsx",
  "src/app/templates/digitalisation/[slug]/page.jsx",
].forEach((p) => read(p));

const templateFilters = read("src/components/templates/TemplateFilters.jsx");
if (!/<label[\s>]/.test(templateFilters)) {
  fail("TemplateFilters should use labels for accessibility.");
}

const downloadApi = read("src/app/api/templates/request-download/route.ts");
if (!/evaluateTemplateAccess/.test(downloadApi)) {
  fail("Download API must call evaluateTemplateAccess.");
}

console.log("TOOL QUALITY PASSED");
