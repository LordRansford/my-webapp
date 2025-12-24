import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const MODEL = "text-embedding-3-small";
const DEFAULT_DIM = 128;
let cached = null;

function loadStore() {
  if (cached) return cached;
  const p = path.join(process.cwd(), "data", "mentor", "embeddings.json");
  if (!fs.existsSync(p)) {
    throw new Error("Missing data/mentor/embeddings.json. Run npm run build:mentor-embeddings.");
  }
  const json = JSON.parse(fs.readFileSync(p, "utf8"));
  cached = json;
  return cached;
}

function hashEmbedding(text, dim) {
  const bytes = crypto.createHash("sha256").update(text).digest();
  const arr = new Float32Array(dim);
  for (let i = 0; i < dim; i += 1) {
    arr[i] = (bytes[i % bytes.length] / 255) * 2 - 1;
  }
  return Array.from(arr);
}

async function embedQuery(text, dim) {
  const key = process.env.OPENAI_API_KEY || "";
  if (!key) return hashEmbedding(text, dim);
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({ input: text, model: MODEL }),
  });
  if (!res.ok) return hashEmbedding(text, dim);
  const json = await res.json();
  const emb = json?.data?.[0]?.embedding;
  if (!Array.isArray(emb)) return hashEmbedding(text, dim);
  return emb.map((v) => Number(v));
}

function cosine(a, b) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i += 1) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (!na || !nb) return 0;
  return dot / Math.sqrt(na * nb);
}

export async function retrieveVectorContent(question, currentRoute, limit = 6) {
  const store = loadStore();
  const dim = store.embeddingDim || DEFAULT_DIM;
  const queryEmbedding = await embedQuery(question.slice(0, 8000), dim);
  const tokens = String(question || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const scored = store.vectors.map((v) => {
    const score = cosine(queryEmbedding, v.embedding);
    const href = v.anchor ? `${v.route}#${v.anchor}` : v.route;
    const why = `Relevant ${v.kind} section${v.anchor ? ` (${v.anchor})` : ""}`;
    const hay = `${v.title} ${href}`.toLowerCase();
    const matchCount = tokens.filter((t) => hay.includes(t)).length;
    const textBonus = matchCount ? 0.12 + matchCount * 0.08 : 0;
    const kindBonus = v.kind === "tool" ? 0.25 : 0;
    return {
      title: v.title,
      href,
      why,
      pageTitle: v.title,
      pageRoute: v.route,
      anchor: v.anchor,
      score: score + textBonus + kindBonus,
      matchCount,
    };
  });
  scored.sort((a, b) => b.score - a.score);
  let top = scored.slice(0, limit);
  const hasTokenMatch = top.some((m) => tokens.some((t) => m.href.toLowerCase().includes(t)));
  const bestStudio = scored
    .filter((m) => m.href.includes("/studios/") || m.kind === "tool")
    .sort((a, b) => b.matchCount - a.matchCount || b.score - a.score)[0];
  if (!hasTokenMatch) {
    const candidate = scored.find((m) => m.matchCount > 0);
    if (candidate) {
      top = [candidate, ...top.filter((m) => m.href !== candidate.href)].slice(0, limit);
    }
  }
  if (bestStudio && !top.find((m) => m.href === bestStudio.href)) {
    top = [bestStudio, ...top].slice(0, limit);
  }
  const weak = top.length === 0 || top[0].score < 0.12;
  return { matches: top, weak };
}

