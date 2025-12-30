/**
 * Deterministic enrichment
 * 
 * Adds computed fields: tags, severity buckets, KEV flag, attention scores
 * No AI generation - all rules-based
 */

import type { NormalisedItem } from "../../src/lib/updates/types";

/**
 * Enrich item with deterministic tags based on content
 */
export function enrichTags(item: NormalisedItem): string[] {
  const tags: string[] = [...(item.topic_tags || [])];
  
  // Add tags based on source
  if (item.source_id === "nvd" || item.source_id === "cisa-kev") {
    tags.push("vulnerability", "security");
  }
  
  if (item.source_id === "govuk-ai") {
    tags.push("regulation", "ai", "uk-government");
  }
  
  if (item.source_id === "ncsc-advisories") {
    tags.push("advisory", "cybersecurity", "uk");
  }
  
  if (item.source_id === "arxiv-cs-ai") {
    tags.push("research", "ai", "academic");
  }
  
  // Add tags based on CVE data
  if (item.cve) {
    tags.push("cve");
    
    if (item.cve.kev) {
      tags.push("kev", "exploited");
    }
    
    // Severity tags based on CVSS
    if (item.cve.cvss) {
      const cvss = item.cve.cvss.v31 || item.cve.cvss.v3 || item.cve.cvss.v2 || 0;
      if (cvss >= 9.0) {
        tags.push("critical");
      } else if (cvss >= 7.0) {
        tags.push("high");
      } else if (cvss >= 4.0) {
        tags.push("medium");
      } else {
        tags.push("low");
      }
    }
  }
  
  // Add tags based on title/content keywords
  const titleLower = item.title.toLowerCase();
  const keywords: Record<string, string[]> = {
    "kubernetes": ["kubernetes", "k8s"],
    "identity": ["identity", "authentication", "authorization"],
    "cloud": ["aws", "azure", "gcp", "cloud"],
    "data": ["data", "database", "sql"],
    "api": ["api", "rest", "graphql"],
    "ai": ["ai", "machine learning", "ml", "llm"],
    "cyber": ["cyber", "security", "threat"],
  };
  
  for (const [tag, patterns] of Object.entries(keywords)) {
    if (patterns.some((pattern) => titleLower.includes(pattern))) {
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    }
  }
  
  return [...new Set(tags)];  // Deduplicate
}

/**
 * Calculate attention score (0-100)
 * Higher = more important
 */
export function calculateAttentionScore(item: NormalisedItem): number {
  let score = 0;
  
  // Base score from recency (newer = higher)
  const publishedDate = new Date(item.published_at);
  const daysSincePublished = (Date.now() - publishedDate.getTime()) / (1000 * 60 * 60 * 24);
  score += Math.max(0, 30 - daysSincePublished);  // Max 30 points for recency
  
  // CVE-specific scoring
  if (item.cve) {
    // KEV items get high score
    if (item.cve.kev) {
      score += 40;
    }
    
    // CVSS-based scoring
    if (item.cve.cvss) {
      const cvss = item.cve.cvss.v31 || item.cve.cvss.v3 || item.cve.cvss.v2 || 0;
      score += cvss * 2;  // Max 20 points for CVSS
    }
  }
  
  // Source authority boost
  const authorityScores: Record<string, number> = {
    "cisa-kev": 20,
    "nvd": 15,
    "ncsc-advisories": 15,
    "govuk-ai": 10,
    "arxiv-cs-ai": 5,
  };
  
  score += authorityScores[item.source_id] || 0;
  
  return Math.min(100, Math.max(0, Math.round(score)));
}

/**
 * Enrich item with computed fields
 */
export function enrichItem(item: NormalisedItem): NormalisedItem {
  // Enrich tags
  const enrichedTags = enrichTags(item);
  
  // Calculate attention score
  const attentionScore = calculateAttentionScore(item);
  
  // Add to raw metadata
  const enrichedRaw = {
    ...item.raw,
    attention_score: attentionScore,
    enriched_at: new Date().toISOString(),
  };
  
  return {
    ...item,
    topic_tags: enrichedTags,
    raw: enrichedRaw,
  };
}
