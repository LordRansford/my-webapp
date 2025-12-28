/**
 * Enhanced Content Retrieval for Mentor
 * 
 * Retrieves content from multiple sources:
 * 1. Course content (from content-index.json)
 * 2. Tool documentation (from tools-index.json)
 * 3. Full page content for better context
 */

import fs from "node:fs";
import path from "node:path";
import { retrieveContent } from "./retrieveContent";
import { retrieveVectorContent, type VectorRetrieval } from "./vectorStore";

export type EnhancedRetrievalResult = {
  title: string;
  href: string;
  excerpt: string;
  text?: string;
  why?: string;
  kind: "course" | "tool" | "page" | "section";
  score: number;
};

/**
 * Load tools index for tool-specific queries
 */
function loadToolsIndex() {
  const toolsPath = path.join(process.cwd(), "public", "tools-index.json");
  if (!fs.existsSync(toolsPath)) return null;
  try {
    const raw = fs.readFileSync(toolsPath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Retrieve tool information for tool-related questions
 */
function retrieveToolInfo(
  question: string,
  limit = 3
): EnhancedRetrievalResult[] {
  const toolsIndex = loadToolsIndex();
  if (!toolsIndex || !Array.isArray(toolsIndex.tools)) return [];

  const q = question.toLowerCase();
  let terms = q
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 2) // Lowered from 3 to 2
    .slice(0, 12); // Increased from 8 to 12
  
  // Expand with variations
  if (terms.some(t => t.includes("digital"))) {
    terms.push("digitalisation", "digitalization", "digital");
  }

  const scored = toolsIndex.tools
    .map((tool: any) => {
      const title = String(tool.title || "").toLowerCase();
      const description = String(tool.description || "").toLowerCase();
      const explain = String(tool.explain || "").toLowerCase();
      const fullText = `${title} ${description} ${explain}`;

      let score = 0;
      for (const term of terms) {
        if (title.includes(term)) score += 5;
        if (description.includes(term)) score += 2;
        if (explain.includes(term)) score += 3;
        const matches = fullText.match(new RegExp(`\\b${term}\\b`, "g"));
        if (matches) score += matches.length;
      }

      if (score <= 0) return null;

      const excerpt = tool.explain || tool.description || `Tool: ${tool.title}`;
      const route = tool.route || `/tools/${tool.id}`;

      return {
        title: tool.title || "Tool",
        href: route,
        excerpt: excerpt.slice(0, 300),
        text: `${tool.description || ""}\n\n${tool.explain || ""}`.trim().slice(0, 1000),
        kind: "tool" as const,
        score,
      };
    })
    .filter((item): item is EnhancedRetrievalResult => item !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
}

/**
 * Enhanced retrieval combining multiple sources
 */
export async function enhancedRetrieve(
  question: string,
  currentRoute: string | null,
  limit = 8
): Promise<EnhancedRetrievalResult[]> {
  const results: EnhancedRetrievalResult[] = [];

  // 1. Try vector search first (semantic similarity)
  try {
    const vectorResults = await retrieveVectorContent(question, currentRoute, limit);
    for (const match of vectorResults.matches) {
      // Vector results have: title, href, why, pageTitle, pageRoute, anchor, score
      const excerpt = match.why || "";
      results.push({
        title: match.title || match.pageTitle || "Content",
        href: match.href,
        excerpt,
        text: excerpt,
        why: match.why,
        kind: match.href.includes("/tools/") ? "tool" : match.href.includes("#") ? "section" : "page",
        score: match.score || 0,
      });
    }
  } catch (err) {
    console.error("[MENTOR] Vector retrieval failed:", err);
  }

  // 2. Keyword-based content retrieval
  const keywordResults = retrieveContent(question, currentRoute, limit);
  for (const match of keywordResults.matches) {
    // Avoid duplicates from vector search
    if (!results.some((r) => r.href === match.href)) {
      const excerpt = match.why || "";
      results.push({
        title: match.title,
        href: match.href,
        excerpt,
        text: excerpt,
        why: match.why,
        kind: match.href.includes("#") ? "section" : "course",
        score: match.score || 0.5,
      });
    }
  }

  // 3. Tool-specific retrieval (if question seems tool-related)
  const toolKeywords = ["tool", "how to use", "how do i", "tutorial", "guide", "playground", "lab", "workshop"];
  const isToolQuestion = toolKeywords.some((kw) => question.toLowerCase().includes(kw));
  
  if (isToolQuestion || question.toLowerCase().includes("use")) {
    const toolResults = retrieveToolInfo(question, 3);
    for (const tool of toolResults) {
      if (!results.some((r) => r.href === tool.href)) {
        results.push(tool);
      }
    }
  }

  // Sort by score and return top results
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

