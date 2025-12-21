import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

type Doc = {
  id: string;
  title: string;
  slug: string;
  text: string;
};

let cached: Doc[] | null = null;

function stripMarkdown(input: string) {
  return input
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/\!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/[#>*_\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readMdxFiles(dir: string): string[] {
  const out: string[] = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) out.push(...readMdxFiles(full));
    else if (full.endsWith(".mdx")) out.push(full);
  }
  return out;
}

function buildIndex(): Doc[] {
  const contentRoot = path.join(process.cwd(), "content");
  const files = readMdxFiles(contentRoot);
  const docs: Doc[] = files.map((file) => {
    const raw = fs.readFileSync(file, "utf8");
    const parsed = matter(raw);
    const text = stripMarkdown(parsed.content || "");
    const title = (parsed.data?.title as string) || path.basename(file);
    const slug = file.replace(contentRoot, "").replace(/\\/g, "/");
    return { id: file, title, slug, text };
  });
  return docs;
}

export function getIndex() {
  if (cached) return cached;
  cached = buildIndex();
  return cached;
}


