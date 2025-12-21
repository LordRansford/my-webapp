import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const COURSE_PAGE_DIRS = [
  "src/pages/ai",
  "src/pages/cybersecurity",
  "src/pages/data",
  "src/pages/digitalisation",
  "src/pages/software-architecture",
];
const COURSE_NOTE_DIRS = [
  "content/notes/ai",
  "content/notes/cybersecurity",
  "content/notes/cybersecurity/practitioner",
  "content/notes/digitalisation",
  "content/notes/software-architecture",
  "content/courses/ai",
  "content/courses/cybersecurity",
  "content/courses/data",
  "content/courses/digitalisation",
  "content/courses/software-architecture",
];
const PAGE_EXTS = [".js", ".jsx", ".ts", ".tsx"];
const MDX_EXTS = [".mdx"];
const COURSE_CONTENT_KEYWORDS = ["beginner", "intermediate", "advanced", "summary", "foundations", "applied", "practice", "practitioner", "ch1", "ch3"];

const failures = [];

function rel(p) {
  return path.relative(ROOT, p).replace(/\\/g, "/");
}

function walk(dir, exts) {
  const entries = fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(full, exts));
    } else if (!exts || exts.some((ext) => entry.name.endsWith(ext))) {
      files.push(path.join(ROOT, full));
    }
  }
  return files;
}

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function note(msg) {
  failures.push(msg);
}

// 1) NotesLayout enforcement on course pages
for (const dir of COURSE_PAGE_DIRS) {
  const files = walk(dir, PAGE_EXTS);
  files.forEach((file) => {
    const contents = read(file);
    if (contents.includes("@/components/Layout")) {
      note(`Course pages must use NotesLayout: ${rel(file)}`);
    }
  });
}

// 2) Exactly one ContentsSidebar per page file
const pageFiles = walk("src/pages", PAGE_EXTS);
pageFiles.forEach((file) => {
  const contents = read(file);
  const count = (contents.match(/<ContentsSidebar/gi) || []).length;
  if (count > 1) {
    note(`Multiple ContentsSidebar instances found in ${rel(file)}`);
  }
});

// 3) Typography tokens present
const globalsPath = path.join(ROOT, "src/styles/globals.css");
const globals = read(globalsPath);
["--text-heading", "--text-body", "--text-muted", "--text-callout"].forEach((token) => {
  if (!globals.includes(token)) {
    note(`Missing typography token ${token} in src/styles/globals.css`);
  }
});

// 4) Block tiny text classes on core notes/app surfaces
const tinyPattern = /text-(?:xs|\[11px\]|\[12px\]|\[13px\])/;
const tinyTargets = [
  ...COURSE_PAGE_DIRS,
  "src/components/notes/Layout.jsx",
  "src/components/notes/ContentsSidebar.jsx",
  "src/components/notes/NotesLayout.js",
  "src/app/admin",
];
tinyTargets.forEach((target) => {
  const full = path.join(ROOT, target);
  if (fs.existsSync(full) && fs.statSync(full).isDirectory()) {
    walk(target, PAGE_EXTS).forEach((file) => {
      if (tinyPattern.test(read(file))) {
        note(`Tiny text class detected in ${rel(file)}`);
      }
    });
  } else if (fs.existsSync(full)) {
    if (tinyPattern.test(read(full))) {
      note(`Tiny text class detected in ${rel(full)}`);
    }
  }
});

// 5) Every course section includes ToolCard and QuizBlock
COURSE_NOTE_DIRS.forEach((dir) => {
  walk(dir, MDX_EXTS).forEach((file) => {
    if (file.endsWith(".bak")) return;
    const base = path.basename(file, path.extname(file)).toLowerCase();
    const isCourseSection = COURSE_CONTENT_KEYWORDS.some((k) => base.includes(k));
    if (!isCourseSection) return;
    const contents = read(file);
    const relPath = rel(file);
    if (!contents.includes("ToolCard")) {
      note(`ToolCard missing from course content: ${relPath}`);
    }
    if (!contents.includes("QuizBlock")) {
      note(`QuizBlock missing from course content: ${relPath}`);
    }
  });
});

// 6) Forbidden characters (em dash) in client-facing text/content
const forbiddenPattern = /\u2014/;
const clientDirs = ["src/pages", "src/components", "content"];
clientDirs.forEach((dir) => {
  const exts = dir === "content" ? [".mdx", ".md"] : PAGE_EXTS;
  walk(dir, exts).forEach((file) => {
    if (forbiddenPattern.test(read(file))) {
      note(`Forbidden character (em dash) found in ${rel(file)}`);
    }
  });
});

if (failures.length) {
  console.error("\nSTAGE 1 GUARDS FAILED\n");
  failures.forEach((f) => console.error(`- ${f}`));
  process.exit(1);
} else {
  console.log("STAGE 1 GUARDS PASSED");
}
