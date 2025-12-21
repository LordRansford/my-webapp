import { getIndex } from "./indexer";

export type SearchResult = {
  title: string;
  slug: string;
  excerpt: string;
  score: number;
};

function scoreText(text: string, terms: string[]) {
  let score = 0;
  terms.forEach((t) => {
    const regex = new RegExp(`\\b${t}\\b`, "gi");
    const matches = text.match(regex);
    if (matches) score += matches.length;
  });
  return score;
}

export function searchContent(query: string, limit = 3): SearchResult[] {
  const q = query.toLowerCase().replace(/[^a-z0-9\s]/g, " ").trim();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);
  const docs = getIndex();
  const scored = docs
    .map((doc) => {
      const score = scoreText(doc.text.toLowerCase(), terms);
      return { doc, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map(({ doc, score }) => {
    // pick a short excerpt around the first term
    const firstTerm = terms.find((t) => doc.text.toLowerCase().includes(t)) || "";
    const idx = doc.text.toLowerCase().indexOf(firstTerm);
    const start = Math.max(0, idx - 120);
    const end = Math.min(doc.text.length, idx + 180);
    const excerpt = doc.text.slice(start, end).trim();
    return { title: doc.title, slug: doc.slug, excerpt, score };
  });
}


