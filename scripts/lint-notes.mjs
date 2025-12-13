import fs from "fs";
import path from "path";

/**
 * Simple lint for notes MDX files.
 * - ensures heading order does not skip levels (only h1->h2->h3)
 * - optionally checks presence of Callout/ToolCard/QuizBlock per h2 section when file exists
 * Currently enforced only for beginner file if present.
 */

const ROOT = process.cwd();
const beginnerPath = path.join(ROOT, "content", "notes", "cybersecurity", "beginner.mdx");

function parseHeadings(content) {
  const lines = content.split("\n");
  const headings = [];
  lines.forEach((line, idx) => {
    const match = /^(#{1,6})\s+(.*)/.exec(line.trim());
    if (match) {
      headings.push({ depth: match[1].length, title: match[2].trim(), line: idx + 1 });
    }
  });
  return headings;
}

function checkHeadingOrder(headings) {
  const errors = [];
  let lastDepth = 1;
  headings.forEach((h) => {
    if (h.depth - lastDepth > 1) {
      errors.push(`Heading jump at line ${h.line}: depth ${lastDepth} -> ${h.depth}`);
    }
    lastDepth = h.depth;
  });
  return errors;
}

function checkSections(content) {
  // naive section split by h2
  const sections = content.split("\n## ").slice(1);
  const errors = [];
  sections.forEach((sec, idx) => {
    const hasCallout = sec.includes("<Callout");
    const hasTool = sec.includes("<ToolCard");
    const hasQuiz = sec.includes("<QuizBlock");
    const secName = sec.split("\n")[0].trim();
    if (!hasCallout) errors.push(`Section "${secName}" missing Callout`);
    if (!hasTool) errors.push(`Section "${secName}" missing ToolCard`);
    if (!hasQuiz) errors.push(`Section "${secName}" missing QuizBlock`);
  });
  return errors;
}

function lintFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`Notes lint: ${filePath} not found, skipping.`);
    return [];
  }
  const content = fs.readFileSync(filePath, "utf8");
  const headings = parseHeadings(content);
  const errors = [...checkHeadingOrder(headings), ...checkSections(content)];
  return errors;
}

const errors = lintFile(beginnerPath);

if (errors.length) {
  console.error("Notes lint failed:");
  errors.forEach((e) => console.error(`- ${e}`));
  process.exit(1);
} else {
  console.log("Notes lint passed.");
}
