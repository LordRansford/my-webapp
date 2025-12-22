import fs from "node:fs";
import path from "node:path";

export type ContentSection = {
  depth: number;
  title: string;
  anchor: string;
  excerpt: string;
};

export type ContentPage = {
  route: string;
  title: string;
  sourcePath: string;
  sections: ContentSection[];
};

export type ContentIndex = {
  generatedAt: string;
  pages: ContentPage[];
};

export type Citation = {
  title: string;
  href: string;
  why: string;
  pageTitle: string;
  pageRoute: string;
  anchor: string;
  score: number;
};

function loadIndex(): ContentIndex {
  const abs = path.join(process.cwd(), "public", "content-index.json");
  if (!fs.existsSync(abs)) {
    throw new Error("Missing public/content-index.json. Run npm run build:content-index.");
  }
  const raw = fs.readFileSync(abs, "utf8");
  return JSON.parse(raw);
}

function normalise(text: string) {
  return String(text || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function scoreSection(terms: string[], section: ContentSection, pageBoost: number) {
  const hay = `${section.title} ${section.excerpt}`.toLowerCase();
  let score = 0;
  for (const t of terms) {
    if (!t) continue;
    if (section.title.toLowerCase().includes(t)) score += 4;
    const re = new RegExp(`\\b${t}\\b`, "g");
    const matches = hay.match(re);
    if (matches) score += matches.length;
  }
  return score + pageBoost;
}

export function retrieveContent(question: string, currentRoute: string | null, limit = 6) {
  const q = normalise(question);
  const terms = q.split(" ").filter(Boolean).slice(0, 12);
  if (!terms.length) return { matches: [] as Citation[], weak: true };

  const idx = loadIndex();
  const scored: Citation[] = [];

  for (const page of idx.pages) {
    const isCurrent = currentRoute && page.route === currentRoute;
    const pageBoost = isCurrent ? 6 : currentRoute && page.route.startsWith(currentRoute.split("/")[1] || "") ? 1 : 0;

    for (const section of page.sections) {
      if (!section.anchor) continue;
      const score = scoreSection(terms, section, pageBoost);
      if (score <= 0) continue;
      scored.push({
        title: section.title,
        href: `${page.route}#${section.anchor}`,
        why: section.excerpt ? section.excerpt.slice(0, 140) : "Relevant section in the notes.",
        pageTitle: page.title,
        pageRoute: page.route,
        anchor: section.anchor,
        score,
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, limit);
  const weak = top.length === 0 || top[0].score < 5;
  return { matches: top, weak };
}


