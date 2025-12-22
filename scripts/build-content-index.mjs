import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const CONTENT_DIRS = [
  path.join(ROOT, "content", "courses"),
  path.join(ROOT, "content", "notes"),
  path.join(ROOT, "content", "posts"),
];

const OUT_PATH = path.join(ROOT, "public", "content-index.json");
const EXCERPT_MAX = 360;

function ensureDir(p) {
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function stripInline(md) {
  return String(md || "")
    .replace(/`[^`]+`/g, "")
    .replace(/\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function readMdxFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) out.push(...readMdxFiles(full));
    else if (full.endsWith(".mdx")) out.push(full);
  }
  return out;
}

function routeForFile(file) {
  const rel = file.replace(ROOT, "").replace(/\\/g, "/");

  // Courses: content/courses/<course>/<lesson>.mdx -> /courses/<course>/<lesson>
  const courseMatch = rel.match(/^\/content\/courses\/([^/]+)\/([^/]+)\.mdx$/);
  if (courseMatch) return `/courses/${courseMatch[1]}/${courseMatch[2]}`;

  // Notes: default to /notes/<...> route.
  // Special-case common top-level course pages that are mapped directly (cybersecurity, ai, data, digitalisation, software-architecture).
  const notesMatch = rel.match(/^\/content\/notes\/([^/]+)\/([^/]+)\.mdx$/);
  if (notesMatch) {
    const course = notesMatch[1];
    const base = notesMatch[2];
    const direct = new Set(["beginner", "intermediate", "advanced", "summary", "course"]);
    if (["cybersecurity", "ai", "data", "digitalisation", "software-architecture"].includes(course) && direct.has(base)) {
      return `/${course}/${base}`;
    }
    return `/notes/${course}/${base}`;
  }

  // Posts: content/posts/<slug>.mdx -> /posts/<slug>
  const postMatch = rel.match(/^\/content\/posts\/([^/]+)\.mdx$/);
  if (postMatch) return `/posts/${postMatch[1]}`;

  // Fallback: expose as a notes-style path.
  return rel.replace(/^\/content\//, "/").replace(/\.mdx$/, "");
}

function extractHeadingsAndExcerpts(content) {
  const lines = String(content || "").split("\n");
  const sections = [];
  const seen = new Map();
  let inCode = false;

  const isFence = (line) => /^\s*```/.test(line);
  const isHeading = (line) => /^(#{2,3})\s+(.+?)\s*$/.exec(line);

  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i];
    if (isFence(raw)) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;

    const m = isHeading(raw);
    if (!m) continue;

    const depth = m[1].length;
    const title = stripInline(m[2]);
    if (!title) continue;

    const base = slugify(title);
    const count = (seen.get(base) || 0) + 1;
    seen.set(base, count);
    const anchor = count === 1 ? base : `${base}-${count}`;

    // Excerpt: first paragraph after heading, skipping blank lines and mdx tags.
    let excerpt = "";
    for (let j = i + 1; j < lines.length; j += 1) {
      const l = lines[j];
      if (isFence(l)) break;
      if (isHeading(l)) break;
      if (!l.trim()) {
        if (excerpt) break;
        continue;
      }
      if (/^\s*</.test(l.trim())) continue; // skip mdx component lines
      excerpt += (excerpt ? " " : "") + stripInline(l);
      if (excerpt.length >= EXCERPT_MAX) break;
    }
    excerpt = excerpt.slice(0, EXCERPT_MAX).trim();

    sections.push({ depth, title, anchor, excerpt });
  }

  return sections;
}

function buildIndex() {
  const pages = [];
  for (const dir of CONTENT_DIRS) {
    const files = readMdxFiles(dir);
    for (const file of files) {
      const raw = fs.readFileSync(file, "utf8");
      const parsed = matter(raw);
      const title = String(parsed.data?.title || path.basename(file));
      const route = routeForFile(file);
      const sections = extractHeadingsAndExcerpts(parsed.content || "");
      pages.push({
        route,
        title,
        sourcePath: file.replace(ROOT, "").replace(/\\/g, "/"),
        sections,
      });
    }
  }
  return { generatedAt: new Date().toISOString(), pages };
}

const index = buildIndex();
ensureDir(OUT_PATH);
fs.writeFileSync(OUT_PATH, JSON.stringify(index, null, 2), "utf8");
console.log(`Wrote ${OUT_PATH} (${index.pages.length} pages)`);


