import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = __dirname;

const tracks = [
  {
    trackId: "cyber",
    courseIds: ["cybersecurity", "cyber"],
    manifestPath: path.join(projectRoot, "src", "lib", "cyberSections.js"),
    contentGlobs: [
      path.join(projectRoot, "content", "notes", "cybersecurity"),
    ],
  },
  {
    trackId: "ai",
    courseIds: ["ai"],
    manifestPath: path.join(projectRoot, "src", "lib", "aiSections.js"),
    contentGlobs: [
      path.join(projectRoot, "content", "notes", "ai", "beginner.mdx"),
      path.join(projectRoot, "content", "courses", "ai"),
    ],
  },
  {
    trackId: "software-architecture",
    courseIds: ["software-architecture", "architecture"],
    manifestPath: path.join(projectRoot, "src", "lib", "softwareArchitectureSections.js"),
    contentGlobs: [
      path.join(projectRoot, "content", "courses", "software-architecture"),
    ],
  },
];

const readDirRecursive = (dir) => {
  const entries = [];
  if (!fs.existsSync(dir)) return entries;
  const statRoot = fs.statSync(dir);
  if (statRoot.isFile()) {
    if (dir.endsWith(".mdx") || dir.endsWith(".jsx") || dir.endsWith(".js")) entries.push(dir);
    return entries;
  }
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      entries.push(...readDirRecursive(full));
    } else if (full.endsWith(".mdx") || full.endsWith(".jsx") || full.endsWith(".js")) {
      entries.push(full);
    }
  }
  return entries;
};

const loadManifest = (filePath, exportName) => {
  const raw = fs.readFileSync(filePath, "utf8");
  const transformed = raw.replace(/export const\s+/g, "exports.");
  const moduleShim = { exports: {} };
  const func = new Function("exports", "module", transformed);
  func(moduleShim.exports, moduleShim);
  return moduleShim.exports[exportName];
};

const getManifest = (trackId, manifestPath) => {
  if (trackId === "cyber") return loadManifest(manifestPath, "cyberSections");
  if (trackId === "ai") return loadManifest(manifestPath, "aiSectionManifest");
  return loadManifest(manifestPath, "softwareArchitectureSectionManifest");
};

const getAttr = (str, name) => {
  const quoted = new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`).exec(str);
  if (quoted) return quoted[1];
  const braced = new RegExp(`${name}\\s*=\\s*{([^}]+)}`).exec(str);
  if (braced) return braced[1].trim();
  return null;
};

const errors = [];

tracks.forEach((track) => {
  const manifest = getManifest(track.trackId, track.manifestPath) || {};
  const levelKeys = Object.keys(manifest);
  const foundSections = new Set();

  const files = track.contentGlobs.flatMap((dir) => readDirRecursive(dir));

  files.forEach((filePath) => {
    const content = fs.readFileSync(filePath, "utf8");

    const toggleRegex = /<SectionProgressToggle[\s\S]*?>/g;
    let toggleMatch;
    while ((toggleMatch = toggleRegex.exec(content))) {
      const snippet = toggleMatch[0];
      const courseId = getAttr(snippet, "courseId");
      const levelId = getAttr(snippet, "levelId");
      const sectionId = getAttr(snippet, "sectionId");
      if (!courseId || !levelId || !sectionId) {
        errors.push(`CPD error: Missing attrs on SectionProgressToggle in ${filePath}`);
        continue;
      }
      if (!track.courseIds.includes(courseId)) continue;
      if (!manifest[levelId]) {
        errors.push(`CPD error: Level ${levelId} not in manifest for ${track.trackId} (${filePath})`);
        continue;
      }
      if (!manifest[levelId].includes(sectionId)) {
        errors.push(`CPD error: section ${sectionId} not in manifest level ${levelId} (${filePath})`);
        continue;
      }
      foundSections.add(sectionId);
    }

    const quizRegex = /<QuizBlock[\s\S]*?>/g;
    let quizMatch;
    while ((quizMatch = quizRegex.exec(content))) {
      const snippet = quizMatch[0];
      const courseId = getAttr(snippet, "courseId");
      const levelId = getAttr(snippet, "levelId");
      const sectionId = getAttr(snippet, "sectionId");
      if (!courseId && !levelId && !sectionId) continue;
      if (!courseId || !levelId || !sectionId) {
        errors.push(`CPD error: QuizBlock missing CPD props in ${filePath}`);
        continue;
      }
      if (!track.courseIds.includes(courseId)) continue;
      if (!manifest[levelId]) {
        errors.push(`CPD error: QuizBlock level ${levelId} not in manifest for ${track.trackId} (${filePath})`);
        continue;
      }
      if (!manifest[levelId].includes(sectionId)) {
        errors.push(`CPD error: QuizBlock section ${sectionId} not in manifest (${filePath})`);
        continue;
      }
      foundSections.add(sectionId);
    }

    const toolRegex = /<ToolCard[\s\S]*?>/g;
    let toolMatch;
    while ((toolMatch = toolRegex.exec(content))) {
      const snippet = toolMatch[0];
      const courseId = getAttr(snippet, "courseId");
      const levelId = getAttr(snippet, "levelId");
      const sectionId = getAttr(snippet, "sectionId");
      const hasAnyCpdProp = courseId || levelId || sectionId;
      if (!hasAnyCpdProp) continue;

      const minutes = getAttr(snippet, "cpdMinutesOnUse");
      if (!courseId || !levelId || !sectionId) {
        errors.push(`CPD error: ToolCard missing CPD props in ${filePath}`);
        continue;
      }
      if (!track.courseIds.includes(courseId)) continue;
      if (!manifest[levelId]) {
        errors.push(`CPD error: ToolCard level ${levelId} not in manifest for ${track.trackId} (${filePath})`);
        continue;
      }
      if (!manifest[levelId].includes(sectionId)) {
        errors.push(`CPD error: ToolCard section ${sectionId} not in manifest (${filePath})`);
        continue;
      }
      if (!minutes) {
        errors.push(`CPD error: ToolCard ${sectionId} missing cpdMinutesOnUse (${filePath})`);
      }
      foundSections.add(sectionId);
    }
  });

  levelKeys.forEach((levelId) => {
    (manifest[levelId] || []).forEach((sectionId) => {
      if (!foundSections.has(sectionId)) {
        errors.push(`CPD error: section ${sectionId} is defined for ${track.trackId} ${levelId} but not referenced in content.`);
      }
    });
  });
});

if (errors.length) {
  errors.forEach((msg) => console.error(msg));
  process.exit(1);
}

console.log("CPD quality check passed.");
