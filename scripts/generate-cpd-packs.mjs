import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, "..");

const contentDir = path.join(root, "content");
const cpdDir = path.join(root, "cpd", "courses");
const requiredFrontmatter = ["title", "courseId", "levelId", "estimatedHours"];

const courseStatusPath = path.join(cpdDir, "course-status.json");

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function courseLessonUrlFromContentPath(filePath) {
  const rel = String(path.relative(root, filePath)).replace(/\\/g, "/");
  if (!rel.startsWith("content/")) return null;
  const without = rel.replace(/^content\//, "").replace(/\.mdx$/, "");
  // Course MDX is served under /courses/*
  if (without.startsWith("courses/")) return `/${without}`;
  return null;
}

function learnerLevelUrl(courseId, levelId) {
  // Map to the learner-facing canonical URLs.
  const c = String(courseId || "").trim();
  const l = String(levelId || "").trim();

  if (c === "cybersecurity") {
    if (l === "foundations") return "/cybersecurity/beginner";
    if (l === "applied") return "/cybersecurity/intermediate";
    if (l === "practice") return "/cybersecurity/advanced";
    if (l === "summary") return "/cybersecurity/summary";
    return "/cybersecurity";
  }

  if (c === "network-models") {
    if (l === "foundations") return "/network-models/beginner";
    if (l === "applied") return "/network-models/intermediate";
    if (l === "practice") return "/network-models/advanced";
    if (l === "summary") return "/network-models/summary";
    return "/network-models";
  }

  // Most other courses use /courses/<course>/<level>
  if (l === "foundations") return `/courses/${c}/foundations`;
  if (l === "intermediate") return `/courses/${c}/intermediate`;
  if (l === "advanced") return `/courses/${c}/advanced`;
  if (l === "summary") return `/courses/${c}/summary`;
  return `/courses/${c}`;
}

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
  const summary = String(front.summary || front.description || "").trim();
  const estimatedHours = Number(front.estimatedHours || 0);
  const stepIndex = Number(front.stepIndex || 0);
  const learningObjectives = Array.isArray(front.learningObjectives)
    ? front.learningObjectives.map((x) => String(x)).filter(Boolean)
    : [];

  const content = String(parsed.content || "");
  const hasQuiz = content.includes("<QuizBlock");
  const hasTool = content.includes("<ToolCard");

  const sectionIds = Array.from(content.matchAll(/<SectionProgressToggle\b[^>]*\bsectionId="([^"]+)"[^>]*\/?>/g))
    .map((m) => String(m[1] || "").trim())
    .filter(Boolean);

  // Quizzes: some blocks have explicit IDs, others don't. Generate stable IDs using title when needed.
  const quizBlocks = Array.from(content.matchAll(/<QuizBlock\b([^>]*)>/g))
    .map((m) => String(m[1] || ""))
    .map((attrs, idx) => {
      const id = /(?:^|\s)id="([^"]+)"/.exec(attrs)?.[1] || "";
      const title = /(?:^|\s)title="([^"]+)"/.exec(attrs)?.[1] || "";
      const sectionId = /(?:^|\s)sectionId="([^"]+)"/.exec(attrs)?.[1] || "";
      const stable = id
        ? String(id).trim()
        : title
          ? `quiz-${slugify(title)}`
          : sectionId
            ? `quiz-${slugify(sectionId)}-${idx + 1}`
            : `quiz-${slugify(path.basename(filePath))}-${idx + 1}`;
      return { id: stable, title: title ? String(title).trim() : null, sectionId: sectionId ? String(sectionId).trim() : null, explicitId: Boolean(id) };
    });

  const toolCards = Array.from(content.matchAll(/<ToolCard\b([^>]*)>/g))
    .map((m) => String(m[1] || ""))
    .map((attrs) => {
      const id = /(?:^|\s)id="([^"]+)"/.exec(attrs)?.[1] || "";
      const title = /(?:^|\s)title="([^"]+)"/.exec(attrs)?.[1] || "";
      return { id: String(id).trim(), title: String(title).trim() };
    })
    .filter((t) => t.id || t.title);

  return {
    filePath,
    courseId,
    levelId,
    title,
    summary,
    estimatedHours,
    stepIndex,
    hasQuiz,
    hasTool,
    learningObjectives,
    sectionIds,
    quizBlocks,
    toolCards,
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
    const estimated = files.reduce((sum, f) => sum + (Number(f.estimatedHours) || 0), 0);

    const learningObjectives = Array.from(
      new Set(files.flatMap((f) => (Array.isArray(f.learningObjectives) ? f.learningObjectives : [])).map((x) => String(x).trim()).filter(Boolean))
    );

    const sections = Array.from(new Set(files.flatMap((f) => (Array.isArray(f.sectionIds) ? f.sectionIds : [])).map((x) => String(x).trim()).filter(Boolean)));
    const quizzes = Array.from(
      new Map(
        files
          .flatMap((f) => (Array.isArray(f.quizBlocks) ? f.quizBlocks : []))
          .map((q) => [String(q.id || "").trim(), q])
          .filter(([id]) => id)
      ).values()
    );

    const toolsByKey = new Map();
    for (const t of files.flatMap((f) => (Array.isArray(f.toolCards) ? f.toolCards : []))) {
      const key = (t.id || t.title || "").trim();
      if (!key) continue;
      if (!toolsByKey.has(key)) toolsByKey.set(key, { id: t.id || null, title: t.title || null });
    }
    const tools = Array.from(toolsByKey.values());

    return {
      levelId,
      estimatedHours: estimated,
      sourceFiles: files.map((f) => ({
        title: f.title,
        file: path.relative(root, f.filePath),
        stepIndex: f.stepIndex,
      })),
      learningObjectives,
      sectionIds: sections,
      quizzes,
      tools,
      evidenceSignals: {
        quizzesPresent: quizzes.length > 0,
        toolsPresent: files.some((f) => f.hasTool),
        learningObjectivesPresent: learningObjectives.length > 0,
        sectionTrackingPresent: sections.length > 0,
      },
    };
  });

  const overallObjectives = levels.reduce((sum, lvl) => sum + (lvl.learningObjectives?.length || 0), 0);
  const overallSections = levels.reduce((sum, lvl) => sum + (lvl.sectionIds?.length || 0), 0);
  const overallQuizzes = levels.reduce((sum, lvl) => sum + (lvl.quizzes?.length || 0), 0);
  const overallTools = levels.reduce((sum, lvl) => sum + (lvl.tools?.length || 0), 0);

  const mapping = {
    courseId,
    status,
    generatedAt: new Date().toISOString(),
    version: "1.0.0",
    levels,
    evidence: {
      progressTracking: "Server CPD state + analytics",
      certificates: "UUID with public verification page",
    },
    coverageSummary: {
      totalEstimatedHours: Math.round(levels.reduce((sum, lvl) => sum + (Number(lvl.estimatedHours) || 0), 0) * 10) / 10,
      totalLearningObjectives: overallObjectives,
      totalTrackedSections: overallSections,
      totalQuizBlocks: overallQuizzes,
      totalTools: overallTools,
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
  lines.push(`- Total estimated hours: ${mapping.coverageSummary.totalEstimatedHours}`);
  lines.push(`- Total learning objectives: ${mapping.coverageSummary.totalLearningObjectives}`);
  lines.push(`- Total tracked sections: ${mapping.coverageSummary.totalTrackedSections}`);
  lines.push(`- Total quiz blocks: ${mapping.coverageSummary.totalQuizBlocks}`);
  lines.push(`- Total tools: ${mapping.coverageSummary.totalTools}`);
  lines.push("");
  levels.forEach((lvl) => {
    lines.push(`## ${lvl.levelId}`);
    lines.push(`- Estimated hours (sum of sections): ${lvl.estimatedHours}`);
    lines.push(`- Source files: ${lvl.sourceFiles.length}`);
    lines.push(`- Learning objectives: ${lvl.learningObjectives.length}`);
    lines.push(`- Tracked sections: ${lvl.sectionIds.length}`);
    lines.push(`- Quiz blocks: ${lvl.quizzes.length}`);
    lines.push(`- Tools: ${lvl.tools.length}`);
    if (!lvl.learningObjectives.length) lines.push(`- ⚠ Missing learning objectives`);
    lines.push("");
  });
  fs.writeFileSync(path.join(folder, "mapping.md"), lines.join("\n"), "utf8");

  // Outcome coverage report: focuses on “clear learning objectives & outcomes” + evidence instrumentation.
  const byLevel = levels.map((lvl) => ({
    levelId: lvl.levelId,
    estimatedHours: lvl.estimatedHours,
    learningObjectivesCount: lvl.learningObjectives.length,
    learningObjectivesMissing: lvl.learningObjectives.length === 0,
    trackedSectionsCount: lvl.sectionIds.length,
    quizBlocksCount: lvl.quizzes.length,
    toolsCount: lvl.tools.length,
    signals: lvl.evidenceSignals,
  }));

  const missingObjectivesLevels = byLevel.filter((x) => x.learningObjectivesMissing).map((x) => x.levelId);
  const levelsMissingQuizzes = byLevel.filter((x) => x.quizBlocksCount === 0).map((x) => x.levelId);
  const levelsMissingTools = byLevel.filter((x) => x.toolsCount === 0).map((x) => x.levelId);
  const levelsMissingSectionTracking = byLevel.filter((x) => x.trackedSectionsCount === 0).map((x) => x.levelId);

  const outcomeCoverage = {
    courseId,
    generatedAt: mapping.generatedAt,
    status,
    version: "1.0.0",
    coverage: {
      levels: byLevel,
      totals: mapping.coverageSummary,
      gaps: {
        levelsMissingLearningObjectives: missingObjectivesLevels,
        levelsMissingQuizBlocks: levelsMissingQuizzes,
        levelsMissingToolActivities: levelsMissingTools,
        levelsMissingSectionTracking: levelsMissingSectionTracking,
        recommendations: [
          ...(missingObjectivesLevels.length
            ? ["Add `learningObjectives` frontmatter to the listed levels (3–8 measurable outcomes per level)."]
            : []),
          ...(levelsMissingQuizzes.length ? ["Add at least one QuizBlock per level (8–12 questions is ideal)."] : []),
          ...(levelsMissingTools.length ? ["Add at least one ToolCard per level to evidence practical learning."] : []),
          ...(levelsMissingSectionTracking.length ? ["Ensure sections use SectionProgressToggle so completion is evidenced."] : []),
        ],
      },
    },
  };
  fs.writeFileSync(path.join(folder, "outcome-coverage.json"), JSON.stringify(outcomeCoverage, null, 2), "utf8");

  const cov = [];
  cov.push(`# Outcome coverage – ${courseId}`);
  cov.push("");
  cov.push(`Generated: ${mapping.generatedAt}`);
  cov.push(`Status: ${status}`);
  cov.push("");
  cov.push(`## Summary`);
  cov.push(`- Total estimated hours: ${mapping.coverageSummary.totalEstimatedHours}`);
  cov.push(`- Total learning objectives: ${mapping.coverageSummary.totalLearningObjectives}`);
  cov.push(`- Total tracked sections: ${mapping.coverageSummary.totalTrackedSections}`);
  cov.push(`- Total quiz blocks: ${mapping.coverageSummary.totalQuizBlocks}`);
  cov.push(`- Total tools: ${mapping.coverageSummary.totalTools}`);
  cov.push("");
  cov.push(`## Gaps`);
  if (!missingObjectivesLevels.length && !levelsMissingQuizzes.length && !levelsMissingTools.length && !levelsMissingSectionTracking.length) {
    cov.push(`- None detected for core CPD structural signals (objectives, quizzes, tools, section tracking).`);
  } else {
    if (missingObjectivesLevels.length) cov.push(`- Missing learning objectives in: ${missingObjectivesLevels.join(", ")}`);
    if (levelsMissingQuizzes.length) cov.push(`- Missing quiz blocks in: ${levelsMissingQuizzes.join(", ")}`);
    if (levelsMissingTools.length) cov.push(`- Missing tool activities in: ${levelsMissingTools.join(", ")}`);
    if (levelsMissingSectionTracking.length) cov.push(`- Missing section tracking in: ${levelsMissingSectionTracking.join(", ")}`);
  }
  if (outcomeCoverage.coverage.gaps.recommendations.length) {
    cov.push("");
    cov.push(`## Recommendations`);
    for (const r of outcomeCoverage.coverage.gaps.recommendations) cov.push(`- ${r}`);
  }
  cov.push("");
  cov.push(`## Level breakdown`);
  byLevel.forEach((x) => {
    cov.push(`### ${x.levelId}`);
    cov.push(`- Estimated hours: ${x.estimatedHours}`);
    cov.push(`- Learning objectives: ${x.learningObjectivesCount}${x.learningObjectivesMissing ? " (MISSING)" : ""}`);
    cov.push(`- Tracked sections: ${x.trackedSectionsCount}`);
    cov.push(`- Quiz blocks: ${x.quizBlocksCount}`);
    cov.push(`- Tools: ${x.toolsCount}`);
    cov.push("");
  });
  fs.writeFileSync(path.join(folder, "outcome-coverage.md"), cov.join("\n"), "utf8");

  // Accreditor-ready pack: a single, structured JSON bundle per course.
  // This is designed for CPD assessors to scan quickly:
  // - course structure + timings
  // - learning objectives/outcomes per level
  // - evidence signals (sections/quizzes/tools)
  // - links to learner-facing pages
  const packLevels = levels
    .slice()
    .sort((a, b) => String(a.levelId).localeCompare(String(b.levelId)))
    .map((lvl) => {
      // enrich source files with URLs and per-file hours if available
      const enrichedFiles = lvl.sourceFiles
        .slice()
        .sort((a, b) => (Number(a.stepIndex) || 0) - (Number(b.stepIndex) || 0))
        .map((sf) => {
          const full = path.join(root, sf.file);
          let perFileHours = null;
          let perFileSummary = null;
          try {
            const raw = fs.readFileSync(full, "utf8");
            const parsed = matter(raw);
            perFileHours = Number(parsed?.data?.estimatedHours) || null;
            perFileSummary = String(parsed?.data?.summary || parsed?.data?.description || "").trim() || null;
          } catch {
            // ignore
          }
          return {
            title: sf.title,
            sourcePath: sf.file,
            url: courseLessonUrlFromContentPath(full),
            estimatedHours: perFileHours,
            summary: perFileSummary,
          };
        });

      return {
        levelId: lvl.levelId,
        url: learnerLevelUrl(courseId, lvl.levelId),
        estimatedHours: lvl.estimatedHours,
        learningObjectives: lvl.learningObjectives,
        trackedSectionIds: lvl.sectionIds,
        quizzes: lvl.quizzes,
        tools: lvl.tools,
        syllabus: {
          modules: enrichedFiles,
        },
        evidenceSignals: lvl.evidenceSignals,
      };
    });

  const accreditorPack = {
    generatedAt: mapping.generatedAt,
    version: "1.0.0",
    course: {
      courseId,
      status,
      totalEstimatedHours: mapping.coverageSummary.totalEstimatedHours,
    },
    policy: {
      cpdHoursPolicy: "1 hour = 1 CPD hour (point).",
      timeRecordingPolicy:
        "Fixed-hours model. Learners cannot self-declare CPD time. Progress is tracked via completion signals and timed assessment is counted once on completion.",
      certificatePolicy: "Certificates use UUIDs and a public verification page. Certificates do not imply third-party accreditation unless explicitly stated.",
    },
    syllabus: {
      levels: packLevels,
    },
    outcomeCoverage: outcomeCoverage.coverage,
  };
  fs.writeFileSync(path.join(folder, "accreditation-pack.json"), JSON.stringify(accredititorPackSafe(accreditorPack), null, 2), "utf8");
}

function accredititorPackSafe(pack) {
  // Defensive: ensure the output never includes undefined values (keeps diffs clean, avoids null/undefined ambiguity).
  return JSON.parse(JSON.stringify(pack));
}

export async function generate() {
  const status = readStatus();
  const mdxFiles = walkMdx(contentDir);
  const parsed = mdxFiles.map(parseFile).filter(Boolean);
  const byCourse = groupByCourse(parsed);

  Object.keys(byCourse).forEach((courseId) => {
    writeMapping(courseId, status[courseId] || "Draft", byCourse[courseId]);
  });

  // Cross-course coverage summary (useful for accreditation readiness review).
  const summary = Object.keys(byCourse)
    .sort()
    .map((courseId) => {
      const folder = path.join(cpdDir, courseId);
      const covPath = path.join(folder, "outcome-coverage.json");
      const cov = fs.existsSync(covPath) ? JSON.parse(fs.readFileSync(covPath, "utf8")) : null;
      return {
        courseId,
        status: status[courseId] || "Draft",
        totals: cov?.coverage?.totals || null,
        gaps: cov?.coverage?.gaps || null,
      };
    });
  fs.writeFileSync(path.join(cpdDir, "outcome-coverage-summary.json"), JSON.stringify({ generatedAt: new Date().toISOString(), courses: summary }, null, 2), "utf8");

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

