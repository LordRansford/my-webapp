import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import matter from "gray-matter";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = __dirname;

const requiredFrontmatter = ["title", "courseId", "levelId", "estimatedHours"];
const packFiles = [
  "cpd-pack.md",
  "mapping.json",
  "mapping.md",
  "outcome-coverage.json",
  "outcome-coverage.md",
  "accreditation-pack.json",
  "quality-and-review.md",
  "assessment.md",
  "provider-and-instructor.md",
  "policies.md",
  "evidence-checklist.md",
];

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  const stat = fs.statSync(dir);
  if (stat.isFile() && dir.endsWith(".mdx")) return [dir];
  if (!stat.isDirectory()) return out;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const s = fs.statSync(full);
    if (s.isDirectory()) out.push(...walk(full));
    else if (full.endsWith(".mdx")) out.push(full);
  }
  return out;
}

async function runGenerator() {
  const mod = await import(pathToFileURL(path.join(root, "scripts", "generate-cpd-packs.mjs")));
  if (typeof mod.generate !== "function") throw new Error("generate-cpd-packs missing generate()");
  await mod.generate();
}

function checkFrontmatter(files, errors) {
  files.forEach((filePath) => {
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = matter(raw);
    const fm = parsed.data || {};
    if (!fm.courseId) return; // skip non-course pages
    const missing = requiredFrontmatter.filter((k) => fm[k] === undefined || fm[k] === null || fm[k] === "");
    if (missing.length) {
      errors.push(`CPD error: missing ${missing.join(", ")} in ${filePath}`);
    }
  });
}

function loadStatus() {
  const p = path.join(root, "cpd", "courses", "course-status.json");
  if (!fs.existsSync(p)) return {};
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function checkReadyPacks(statusMap, errors) {
  Object.entries(statusMap).forEach(([courseId, status]) => {
    if (status !== "Ready") return;
    const folder = path.join(root, "cpd", "courses", courseId);
    packFiles.forEach((file) => {
      const p = path.join(folder, file);
      if (!fs.existsSync(p)) {
        errors.push(`CPD error: missing pack file ${file} for course ${courseId}`);
      }
    });
  });
}

function checkQuizAndTool(parsedFiles, statusMap, errors) {
  const readyCourses = Object.entries(statusMap)
    .filter(([, status]) => status === "Ready")
    .map(([course]) => course);
  parsedFiles.forEach((f) => {
    if (!f.courseId) return;
    if (!readyCourses.includes(f.courseId)) return;
    if (!f.hasQuiz) errors.push(`CPD error: no QuizBlock in ${f.filePath}`);
    if (!f.hasTool) errors.push(`CPD error: no ToolCard in ${f.filePath}`);
  });
}

async function main() {
  const errors = [];
  const files = walk(path.join(root, "content"));
  checkFrontmatter(files, errors);

  // run generator (will set exitCode on failures)
  try {
    await runGenerator();
  } catch (e) {
    errors.push(`CPD error: generator failed (${e.message || e})`);
  }

  const status = loadStatus();
  checkReadyPacks(status, errors);

  // Re-parse to reuse quiz/tool flags from generator outputs (mapping.json)
  const parsed = files.map((filePath) => {
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    return {
      filePath,
      courseId: data.courseId,
      levelId: data.levelId,
      hasQuiz: content.includes("<QuizBlock"),
      hasTool: content.includes("<ToolCard"),
    };
  });
  checkQuizAndTool(parsed, status, errors);

  if (errors.length) {
    errors.forEach((e) => console.error(e));
    process.exit(1);
  }
  console.log("CPD quality check passed.");
}

main();
