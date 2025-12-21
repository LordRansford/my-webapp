import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = __dirname;

const contentDir = path.join(root, "content");
const cpdDir = path.join(root, "cpd", "courses");
const requiredFrontmatter = ["title", "courseId", "levelId", "estimatedHours"];

const courseStatusPath = path.join(cpdDir, "course-status.json");

function readStatus() {
  if (!fs.existsSync(courseStatusPath)) return {};
  return JSON.parse(fs.readFileSync(courseStatusPath, "utf8"));
}

function walkMdx(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  const stat = fs.statSync(dir);
  if (stat.isFile() && dir.endsWith(".mdx")) {
    out.push(dir);
    return out;
  }
  if (!stat.isDirectory()) return out;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const s = fs.statSync(full);
    if (s.isDirectory()) out.push(...walkMdx(full));
    else if (full.endsWith(".mdx")) out.push(full);
  }
  return out;
}

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function fail(msg) {
  console.error(msg);
  process.exitCode = 1;
}

function parseFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  const front = parsed.data || {};
  if (!front.courseId) return null; // skip non-course pages
  const missing = requiredFrontmatter.filter((k) => front[k] === undefined || front[k] === null || front[k] === "");
  if (missing.length) {
    fail(`Missing frontmatter [${missing.join(", ")}] in ${filePath}`);
  }
  const courseId = String(front.courseId || "").trim();
  const levelId = String(front.levelId || "").trim();
  const title = String(front.title || path.basename(filePath));
  const estimatedHours = Number(front.estimatedHours || 0);
  const stepIndex = Number(front.stepIndex || 0);

  const hasQuiz = parsed.content.includes("<QuizBlock");
  const hasTool = parsed.content.includes("<ToolCard");

  return {
    filePath,
    courseId,
    levelId,
    title,
    estimatedHours,
    stepIndex,
    hasQuiz,
    hasTool,
  };
}

function groupByCourse(files) {
  const map = {};
  files.forEach((f) => {
    if (!f.courseId) return;
    if (!map[f.courseId]) map[f.courseId] = {};
    if (!map[f.courseId][f.levelId]) map[f.courseId][f.levelId] = [];
    map[f.courseId][f.levelId].push(f);
  });
  Object.values(map).forEach((levels) => {
    Object.keys(levels).forEach((levelId) => {
      levels[levelId].sort((a, b) => a.stepIndex - b.stepIndex);
    });
  });
  return map;
}

function writeMapping(courseId, status, grouped) {
  const levels = Object.keys(grouped || {}).map((levelId) => {
    const files = grouped[levelId];
    const estimated = files.reduce((sum, f) => sum + (f.estimatedHours || 0), 0);
    return {
      levelId,
      estimatedHours: estimated,
      sections: files.map((f) => ({
        title: f.title,
        file: path.relative(root, f.filePath),
        stepIndex: f.stepIndex,
      })),
      quizzesPresent: files.some((f) => f.hasQuiz),
      toolsPresent: files.some((f) => f.hasTool),
    };
  });

  const mapping = {
    courseId,
    status,
    generatedAt: new Date().toISOString(),
    levels,
    evidence: {
      progressTracking: "Server CPD state + analytics",
      certificates: "UUID with public verification page",
    },
  };

  const folder = path.join(cpdDir, courseId);
  ensureDir(folder);
  fs.writeFileSync(path.join(folder, "mapping.json"), JSON.stringify(mapping, null, 2), "utf8");

  const lines = [];
  lines.push(`# Mapping – ${courseId}`);
  lines.push("");
  lines.push(`- Status: ${status}`);
  lines.push(`- Generated: ${mapping.generatedAt}`);
  lines.push("");
  levels.forEach((lvl) => {
    lines.push(`## ${lvl.levelId}`);
    lines.push(`- Estimated hours (sum of sections): ${lvl.estimatedHours}`);
    lines.push(`- Sections: ${lvl.sections.length}`);
    lines.push(`- Quiz present: ${lvl.quizzesPresent ? "Yes" : "No"}`);
    lines.push(`- Tool present: ${lvl.toolsPresent ? "Yes" : "No"}`);
    lines.push("");
  });
  fs.writeFileSync(path.join(folder, "mapping.md"), lines.join("\n"), "utf8");
}

export async function generate() {
  const status = readStatus();
  const mdxFiles = walkMdx(contentDir);
  const parsed = mdxFiles.map(parseFile).filter(Boolean);
  const byCourse = groupByCourse(parsed);

  Object.keys(byCourse).forEach((courseId) => {
    writeMapping(courseId, status[courseId] || "Draft", byCourse[courseId]);
  });

  if (process.exitCode) {
    throw new Error("CPD pack generation failed.");
  }
  console.log("CPD packs generated.");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generate().catch((err) => {
    console.error(err.message || err);
    process.exit(1);
  });
}

