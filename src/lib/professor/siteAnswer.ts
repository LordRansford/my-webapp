import fs from "fs";
import path from "path";

type Citation = { title: string; href: string; why?: string };

type ContentIndexRow = {
  slug: string;
  title?: string;
  excerpt?: string;
  section?: string;
};

type ToolsIndexRow = {
  id: string;
  title: string;
  route: string;
  category?: string;
  description?: string;
};

function readJsonFile<T>(p: string): T | null {
  try {
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, "utf8")) as T;
  } catch {
    return null;
  }
}

function tokenize(text: string) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s/-]+/g, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 3)
    .slice(0, 50);
}

function scoreRow(tokens: string[], haystack: string) {
  const h = String(haystack || "").toLowerCase();
  let score = 0;
  for (const t of tokens) {
    if (h.includes(t)) score += 1;
  }
  return score;
}

let cachedContent: ContentIndexRow[] | null = null;
let cachedTools: ToolsIndexRow[] | null = null;

function loadContentIndex(): ContentIndexRow[] {
  if (cachedContent) return cachedContent;
  const p = path.join(process.cwd(), "public", "content-index.json");
  const rows = readJsonFile<ContentIndexRow[]>(p) || [];
  cachedContent = rows;
  return rows;
}

function loadToolsIndex(): ToolsIndexRow[] {
  if (cachedTools) return cachedTools;
  const p = path.join(process.cwd(), "public", "tools-index.json");
  const rows = readJsonFile<ToolsIndexRow[]>(p) || [];
  cachedTools = rows;
  return rows;
}

function buildCitations(params: { question: string; pageUrl: string }) {
  const tokens = tokenize(params.question);
  const content = loadContentIndex();
  const tools = loadToolsIndex();

  const scoredContent = content
    .map((r) => ({
      row: r,
      score: scoreRow(tokens, `${r.title || ""} ${r.excerpt || ""} ${r.slug || ""}`) + (params.pageUrl && r.slug === params.pageUrl ? 2 : 0),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((x) => ({
      title: String(x.row.title || x.row.slug),
      href: String(x.row.slug),
      why: x.row.excerpt ? String(x.row.excerpt).slice(0, 90) : "Relevant page on this site",
    }));

  const scoredTools = tools
    .map((t) => ({
      row: t,
      score: scoreRow(tokens, `${t.title} ${t.description || ""} ${t.route} ${t.category || ""}`),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((x) => ({
      title: x.row.title,
      href: x.row.route,
      why: x.row.description ? x.row.description.slice(0, 90) : "Relevant tool on this site",
    }));

  const base: Citation[] = [
    ...scoredContent,
    ...scoredTools,
    { title: "Pricing", href: "/pricing", why: "Donations, CPD assessment, and compute credits" },
  ];

  const seen = new Set<string>();
  return base.filter((c) => {
    if (!c.href) return false;
    if (seen.has(c.href)) return false;
    seen.add(c.href);
    return true;
  });
}

function buildAnswer(params: { question: string; citations: Citation[] }) {
  const q = String(params.question || "").trim();
  const t = q.toLowerCase();

  if (t.includes("pricing") || t.includes("price") || t.includes("pay") || t.includes("credits")) {
    return [
      "This site has three payments.",
      "1. Donations support keeping learning free.",
      "2. CPD assessments and certificates are paid so you can prove competence professionally.",
      "3. Compute credits are for heavy server runs that go beyond your browser.",
      "",
      "If you want CPD and certificates you should sign in before you start learning so your progress can be recorded.",
      "You can find details on the pricing page.",
    ].join("\n");
  }

  if (t.includes("cpd") || t.includes("certificate") || t.includes("assessment")) {
    return [
      "For CPD on this site.",
      "1. Sign in so progress and attempts attach to your account.",
      "2. Study the course path for your level.",
      "3. When ready take the timed assessment for that level.",
      "4. After submission you get explanations and revision links based on what you missed.",
      "",
      "If you tell me which course and level you are on I can point you to the best next page and tools.",
    ].join("\n");
  }

  if (t.includes("tool") || t.includes("lab") || t.includes("not working") || t.includes("error")) {
    return [
      "If a tool is not working, the fastest way to fix it is to narrow the problem.",
      "1. Check the input format and keep it short.",
      "2. Try one example input first.",
      "3. If the tool has a compute mode, confirm you have credits and are signed in when required.",
      "",
      "Tell me the tool name and what you entered and I will point to the exact tool page and the most common fixes.",
    ].join("\n");
  }

  const cites = params.citations.slice(0, 3).map((c) => `- ${c.title} ${c.href}`);
  return [
    "I can help using this site content.",
    "Here are the most relevant pages and tools to answer your question.",
    ...cites,
    "",
    "Ask one focused question at a time and I will point you to the exact sections to read next.",
  ].join("\n");
}

export async function answerWithSiteContext(params: { question: string; pageUrl: string; pageTitle: string }) {
  const citations = buildCitations({ question: params.question, pageUrl: params.pageUrl });
  const answer = buildAnswer({ question: params.question, citations });

  return {
    answer,
    citations,
    lowConfidence: citations.length === 0,
  };
}

