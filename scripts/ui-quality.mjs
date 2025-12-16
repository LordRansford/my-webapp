import fs from "node:fs";
import path from "node:path";

const FILES = [
  "src/components/notes/ContentsSidebar.jsx",
  "src/components/notes/ProgressBar.jsx",
  "src/components/notes/PageNav.jsx",
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
const combined = `${sidebar}\n${progress}\n${pagenav}`;

if (!/useReducedMotion|prefers-reduced-motion/i.test(combined)) {
  fail("Reduced motion support not detected in core notes components.");
}

if (!/max-w-\d+|w-\d+|clamp\(/.test(sidebar)) {
  fail("ContentsSidebar appears to lack explicit width constraints. Add a narrow default and responsive tokens.");
}

if (!/showTop|showBottom|Top|Bottom/.test(pagenav)) {
  fail("PageNav missing Top or Bottom controls.");
}

console.log("UI QUALITY PASSED");
