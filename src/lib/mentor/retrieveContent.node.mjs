import fs from "node:fs";
import path from "node:path";

function loadIndex() {
  const abs = path.join(process.cwd(), "public", "content-index.json");
  if (!fs.existsSync(abs)) throw new Error("Missing public/content-index.json. Run npm run build:content-index.");
  return JSON.parse(fs.readFileSync(abs, "utf8"));
}

function normalise(text) {
  return String(text || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function scoreSection(terms, section, pageBoost) {
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

export function retrieveContent(question, currentRoute, limit = 6) {
  const q = normalise(question);
  const terms = q.split(" ").filter(Boolean).slice(0, 12);
  if (!terms.length) return { matches: [], weak: true };

  const idx = loadIndex();
  const scored = [];

  for (const page of idx.pages) {
    const isCurrent = currentRoute && page.route === currentRoute;
    const pageBoost = isCurrent ? 6 : 0;
    for (const section of page.sections || []) {
      if (!section.anchor) continue;
      const score = scoreSection(terms, section, pageBoost);
      if (score <= 0) continue;
      scored.push({
        title: section.title,
        href: `${page.route}#${section.anchor}`,
        why: section.excerpt ? section.excerpt.slice(0, 140) : "Relevant section in the notes.",
        score,
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, limit);
  const weak = top.length === 0 || top[0].score < 5;
  return { matches: top, weak };
}


