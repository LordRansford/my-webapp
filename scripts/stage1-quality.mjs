import fs from "node:fs";
import path from "node:path";

const COURSE_DIRS = [
  "src/pages/ai",
  "src/pages/data",
  "src/pages/digitalisation",
  "src/pages/software-architecture",
  "src/pages/cybersecurity",
  "src/pages/notes/cybersecurity",
];

const COURSE_FILES = COURSE_DIRS.flatMap((dir) => {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".js") || file.endsWith(".jsx") || file.endsWith(".tsx"))
    .map((file) => path.join(dir, file));
});

const MDX_LEVEL_PATTERN = /(advanced|intermediate|foundations|beginner|summary)\.mdx$/;

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function fail(message) {
  console.error(`STAGE1 QUALITY FAILED: ${message}`);
  process.exitCode = 1;
}

function collectMdxTargets() {
  const root = path.join(process.cwd(), "content", "courses");
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile() && entry.name.endsWith(".mdx") && MDX_LEVEL_PATTERN.test(entry.name)) {
        files.push(full);
      }
    }
  };
  if (fs.existsSync(root)) walk(root);
  return files;
}

function checkSingleSidebar() {
  const layoutPath = "src/components/notes/Layout.jsx";
  const layout = read(layoutPath);
  const count = (layout.match(/<ContentsSidebar/g) || []).length;
  if (count !== 1) {
    fail(`${layoutPath}: NotesLayout must render exactly one ContentsSidebar (found ${count}).`);
  }
}

function checkNotesLayoutUsage() {
  COURSE_FILES.forEach((file) => {
    const contents = read(file);
    const redirectPatterns = ["router.replace(", "res.writeHead(", "redirect:", "Redirect", "NextResponse.redirect"];
    const isRedirectOnly = redirectPatterns.some((p) => contents.includes(p));
    if (isRedirectOnly) {
      return;
    }
    const uses = contents.includes("NotesLayout");
    if (!uses) {
      fail(`${file}: course pages must use NotesLayout as the page shell.`);
    }
  });
}

function checkTextTokens() {
  const globals = read("src/styles/globals.css");
  const tokens = ["--text-body", "--text-muted", "--text-heading", "--text-callout"];
  tokens.forEach((token) => {
    if (!globals.includes(token)) {
      fail(`src/styles/globals.css: missing required typography token ${token}.`);
    }
  });
}

function checkTinyText() {
  const tinyPattern = /(text-xs|text-\\[11px\\]|text-\\[12px\\])/;
  const targets = [...COURSE_FILES, "src/components/notes/Layout.jsx", "src/components/notes/ContentsSidebar.jsx"];
  targets.forEach((file) => {
    const contents = read(file);
    const hit = tinyPattern.test(contents);
    if (hit) {
      fail(`${file}: contains tiny text classes; use text-sm or larger.`);
    }
  });
}

function checkCourseContentComponents() {
  const mdxFiles = collectMdxTargets();
  mdxFiles.forEach((file) => {
    const contents = read(file);
    const hasTool = contents.includes("ToolCard");
    const hasQuiz = contents.includes("QuizBlock");
    if (!hasTool) {
      fail(`${file}: missing ToolCard component.`);
    }
    if (!hasQuiz) {
      fail(`${file}: missing QuizBlock component.`);
    }
  });
}

function checkForbiddenCharacters() {
  const mdxFiles = collectMdxTargets();
  const targets = [...COURSE_FILES, ...mdxFiles];
  targets.forEach((file) => {
    const contents = read(file);
    const hasEmDash = contents.includes("—");
    if (hasEmDash) {
      fail(`${file}: contains forbidden em dash character.`);
    }
  });
}

checkSingleSidebar();
checkNotesLayoutUsage();
checkTextTokens();
checkTinyText();
checkCourseContentComponents();
checkForbiddenCharacters();

if (process.exitCode) {
  process.exit(process.exitCode);
} else {
  console.log("STAGE1 QUALITY PASSED");
}
