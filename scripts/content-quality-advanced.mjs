import fs from "node:fs";
import path from "node:path";

// Advanced AI content is authored as MDX. Validate the MDX source rather than
// the Next.js wrapper page.
const FILE = process.argv[2] || "content/notes/ai/advanced.mdx";

function fail(msg) {
  console.error(`\nADVANCED QUALITY FAILED\n${msg}\n`);
  process.exit(1);
}

function readFile(p) {
  const full = path.resolve(process.cwd(), p);
  if (!fs.existsSync(full)) fail(`File not found: ${p}`);
  return fs.readFileSync(full, "utf8");
}

const raw = readFile(FILE);

// Required section markers for Advanced
const requiredSections = [
  "Transformers and attention as a system",
  "Large language models as probabilistic systems",
  "Embeddings, retrieval, and grounding",
  "Agentic systems and tool use",
  "Diffusion models and generative systems",
  "System level failure modes",
  "Governance, safety, and regulation",
];

requiredSections.forEach((title) => {
  if (!raw.includes(title)) fail(`Missing required section: ${title}`);
});

// Basic checks for structure and depth proxies
const sectionCount = (raw.match(/<SectionHeader\b/g) || []).length + (raw.match(/\n##\s+/g) || []).length;
if (sectionCount < requiredSections.length) {
  fail(`Need at least ${requiredSections.length} sections. Found ${sectionCount}.`);
}

const toolCards = (raw.match(/<ToolCard\b/g) || []).length;
if (toolCards < 5) fail(`Need at least 5 ToolCard components. Found ${toolCards}.`);

const quizBlocks = (raw.match(/<QuizBlock\b/g) || []).length;
if (quizBlocks < 1) fail(`Need at least 1 QuizBlock. Found ${quizBlocks}.`);

// Word count proxy to catch shallowness
const textOnly = raw
  // Drop MDX imports/frontmatter quickly
  .replace(/^\s*---[\s\S]*?---\s*/m, " ")
  .replace(/^\s*import .+$/gm, " ")
  // Drop JSX tags (keep the text outside them)
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .trim();
const words = textOnly.split(" ").filter(Boolean).length;
if (words < 1800) fail(`Content too shallow. Found about ${words} words; need at least 1800 for Advanced.`);

console.log("ADVANCED QUALITY PASSED");
