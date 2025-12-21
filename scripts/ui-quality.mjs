import fs from "node:fs";
import path from "node:path";

const FILES = [
  "src/components/notes/ContentsSidebar.jsx",
  "src/components/notes/ProgressBar.jsx",
  "src/components/notes/PageNav.jsx",
  "src/components/templates/TemplateFilters.jsx",
  "src/components/templates/TemplateCard.jsx",
  "src/styles/globals.css",
];

function fail(msg) {
  console.error(`\nUI QUALITY FAILED\n${msg}\n`);
  process.exit(1);
}

function read(p) {
  const full = path.resolve(process.cwd(), p);
  if (!fs.existsSync(full)) fail(`File not found: ${p}`);
  return fs.readFileSync(full, "utf8");
}

const sidebar = read(FILES[0]);
const progress = read(FILES[1]);
const pagenav = read(FILES[2]);
const templateFilters = read(FILES[3]);
const templateCard = read(FILES[4]);
const globals = read(FILES[5]);
const combined = `${sidebar}\n${progress}\n${pagenav}\n${templateFilters}\n${templateCard}\n${globals}`;

if (!/useReducedMotion|prefers-reduced-motion/i.test(combined)) {
  fail("Reduced motion support not detected in core notes components.");
}

if (!/max-w-\d+|w-\d+|clamp\(/.test(sidebar)) {
  fail("ContentsSidebar appears to lack explicit width constraints. Add a narrow default and responsive tokens.");
}

if (!/showTop|showBottom|Top|Bottom/.test(pagenav)) {
  fail("PageNav missing Top or Bottom controls.");
}

if (!/<label[\s>]/.test(templateFilters)) {
  fail("TemplateFilters should use <label> elements for accessibility.");
}

if (!/focus-visible:outline|focus:outline|focus:ring/.test(templateFilters + templateCard)) {
  fail("Templates UI missing focus styles on interactive controls.");
}

if (!/py-2|h-10|min-h-\[44px\]/.test(templateFilters + templateCard)) {
  fail("Templates UI may not meet minimum tap target size. Use at least ~44px height on key controls.");
}

if (!/overflow-x-auto|flex-wrap/.test(templateFilters + templateCard)) {
  fail("Templates UI may overflow on small screens. Use flex-wrap and overflow-x-auto where needed.");
}

if (!/max-w-|w-|clamp\(|min-w-/.test(templateFilters)) {
  fail("TemplateFilters appears to lack explicit width constraints.");
}

if (/-/.test(combined)) {
  fail("UI text must not contain an em dash. Use a hyphen instead.");
}

if (!templateCard.includes("Download options")) {
  fail("TemplateCard must expose the Download options control for gating.");
}

console.log("UI QUALITY PASSED");
