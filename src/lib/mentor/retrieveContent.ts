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

// Expand common variations and synonyms
function expandTerms(terms: string[]): string[] {
  const expanded = new Set<string>(terms);
  
  for (const term of terms) {
    // Handle common variations
    if (term === "digitalisation" || term === "digitalization") {
      expanded.add("digitalisation");
      expanded.add("digitalization");
      expanded.add("digital");
      expanded.add("digitize");
      expanded.add("digitise");
    }
    if (term === "digital") {
      expanded.add("digitalisation");
      expanded.add("digitalization");
    }
  }
  
  return Array.from(expanded);
}

const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "can",
  "do",
  "does",
  "for",
  "from",
  "how",
  "i",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "the",
  "this",
  "to",
  "what",
  "when",
  "where",
  "why",
  "with",
  "you",
  "your",
]);

function scoreSection(terms: string[], section: ContentSection, pageBoost: number) {
  const titleLower = section.title.toLowerCase();
  const excerptLower = (section.excerpt || "").toLowerCase();
  const hay = `${titleLower} ${excerptLower}`;
  let score = 0;
  
  for (const t of terms) {
    if (!t) continue;
    
    // Exact title match gets highest score
    if (titleLower === t || titleLower.includes(` ${t} `) || titleLower.startsWith(`${t} `) || titleLower.endsWith(` ${t}`)) {
      score += 8; // Increased from 4 to 8 for title matches
    } else if (titleLower.includes(t)) {
      score += 5; // Partial title match
    }
    
    // Word boundary matches in excerpt
    const re = new RegExp(`\\b${t}\\b`, "gi");
    const matches = hay.match(re);
    if (matches) {
      score += matches.length * 1.5; // Slightly increased weight
    }
    
    // Also check for partial matches (for longer terms)
    if (t.length >= 4) {
      const partialRe = new RegExp(t, "gi");
      const partialMatches = hay.match(partialRe);
      if (partialMatches && partialMatches.length > (matches?.length || 0)) {
        score += (partialMatches.length - (matches?.length || 0)) * 0.5;
      }
    }
  }
  
  return Math.round(score + pageBoost);
}

export function retrieveContent(question: string, currentRoute: string | null, limit = 6) {
  const q = normalise(question);
  let terms = q
    .split(" ")
    .filter(Boolean)
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t)) // Lowered from 3 to 2 to catch more terms
    .slice(0, 15); // Increased from 12 to 15
  
  // Expand terms with variations and synonyms
  terms = expandTerms(terms);
  
  if (!terms.length) return { matches: [] as Citation[], weak: true };

  const idx = loadIndex();
  const scored: Citation[] = [];

  for (const page of idx.pages) {
    const isCurrent = currentRoute && page.route === currentRoute;
    const pageBoost = isCurrent ? 6 : currentRoute && page.route.startsWith(currentRoute.split("/")[1] || "") ? 1 : 0;
    
    // Also score the page title itself
    const pageTitleLower = page.title.toLowerCase();
    let pageTitleScore = 0;
    for (const term of terms) {
      if (pageTitleLower.includes(term)) {
        pageTitleScore += 3; // Boost for page title matches
      }
    }

    for (const section of page.sections) {
      if (!section.anchor) continue;
      const score = scoreSection(terms, section, pageBoost + pageTitleScore);
      if (score <= 0) continue;
      scored.push({
        title: section.title,
        href: `${page.route}#${section.anchor}`,
        why: section.excerpt ? section.excerpt.slice(0, 200) : "Relevant section in the notes.", // Increased excerpt length
        pageTitle: page.title,
        pageRoute: page.route,
        anchor: section.anchor,
        score,
      });
    }
    
    // If page title matches well but no sections matched, add the page itself
    if (pageTitleScore >= 3 && !scored.some(s => s.pageRoute === page.route)) {
      scored.push({
        title: page.title,
        href: page.route,
        why: `Page about ${page.title}`,
        pageTitle: page.title,
        pageRoute: page.route,
        anchor: "",
        score: pageTitleScore,
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, limit);
  // Much lower threshold: score of 2+ means we found something relevant
  const weak = top.length === 0 || top[0].score < 2;
  return { matches: top, weak };
}


