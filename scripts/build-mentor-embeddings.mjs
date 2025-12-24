import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import matter from "gray-matter";

const ROOT = process.cwd();
const OUT_PATH = path.join(ROOT, "data", "mentor", "embeddings.json");
const EMBED_DIM = 128; // deterministic fallback dimension
const MODEL = "text-embedding-3-small";

function ensureDir(p) {
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadJson(p, fallback = null) {
  if (!fs.existsSync(p)) return fallback;
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function stripInline(md) {
  return String(md || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
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

function loadContentSections() {
  const contentIndexPath = path.join(ROOT, "public", "content-index.json");
  if (!fs.existsSync(contentIndexPath)) {
    throw new Error("Missing public/content-index.json. Run npm run build:content-index first.");
  }
  const idx = JSON.parse(fs.readFileSync(contentIndexPath, "utf8"));
  const corpus = [];
  for (const page of idx.pages || []) {
    for (const section of page.sections || []) {
      const text = [page.title, section.title, section.excerpt].filter(Boolean).join("\n");
      corpus.push({
        id: `${page.route}#${section.anchor}`,
        title: section.title || page.title,
        route: page.route,
        anchor: section.anchor || "",
        kind: "content",
        text,
      });
    }
  }
  return corpus;
}

function loadCourseMeta() {
  const dir = path.join(ROOT, "content", "courses");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  const out = [];
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
    const courseSlug = file.replace(/\.json$/, "");
    const textParts = [data.title, data.description, data.tagline].filter(Boolean);
    out.push({
      id: `/courses/${courseSlug}`,
      title: data.title || courseSlug,
      route: `/courses/${courseSlug}`,
      anchor: "",
      kind: "course",
      text: textParts.join("\n"),
    });
  }
  return out;
}

function loadToolContracts() {
  const toolPath = path.join(ROOT, "data", "tool-contracts.json");
  const json = loadJson(toolPath, { tools: [] });
  return (json.tools || []).map((tool) => {
    const text = [
      tool.purpose,
      `Inputs: ${(tool.inputs || []).map((i) => `${i.name} (${i.type}) ${i.limits || ""}`).join("; ")}`,
      `Limits: ${tool.limits || ""}`,
      `Outputs: ${(tool.outputs || []).join(", ")}`,
      `RunPath: ${tool.runPath}`,
      `Errors: ${(tool.errorTaxonomy || []).join(", ")}`,
    ]
      .filter(Boolean)
      .join("\n");
    return {
      id: tool.id,
      title: tool.id,
      route: tool.route,
      anchor: "",
      kind: "tool",
      text,
    };
  });
}

function hashEmbedding(text) {
  const bytes = crypto.createHash("sha256").update(text).digest();
  const arr = new Float32Array(EMBED_DIM);
  for (let i = 0; i < EMBED_DIM; i += 1) {
    arr[i] = (bytes[i % bytes.length] / 255) * 2 - 1;
  }
  return Array.from(arr);
}

async function openAIEmbed(text) {
  const key = process.env.OPENAI_API_KEY || "";
  if (!key) return hashEmbedding(text);
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({ input: text, model: MODEL }),
  });
  if (!res.ok) {
    console.warn(`OpenAI embed failed (${res.status}); falling back to hash embedding.`);
    return hashEmbedding(text);
  }
  const json = await res.json();
  const emb = json?.data?.[0]?.embedding;
  if (!Array.isArray(emb)) return hashEmbedding(text);
  return emb.map((v) => Number(v));
}

async function main() {
  const corpus = [...loadContentSections(), ...loadCourseMeta(), ...loadToolContracts()];
  console.log(`Corpus size: ${corpus.length}`);
  const vectors = [];
  for (const item of corpus) {
    const embedding = await openAIEmbed(item.text.slice(0, 8000));
    vectors.push({
      ...item,
      embedding,
      model: MODEL,
    });
  }

  const payload = {
    model: MODEL,
    embeddingDim: vectors[0]?.embedding?.length || EMBED_DIM,
    createdAt: new Date().toISOString(),
    vectors,
  };

  ensureDir(OUT_PATH);
  fs.writeFileSync(OUT_PATH, JSON.stringify(payload, null, 2), "utf8");
  console.log(`Wrote ${OUT_PATH} with ${vectors.length} vectors`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

