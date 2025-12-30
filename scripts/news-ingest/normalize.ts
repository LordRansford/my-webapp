/**
 * Normalisation logic
 * 
 * Converts source-specific formats to normalised item shape
 */

import type { NormalisedItem, SourceRegistryEntry } from "../../src/lib/updates/types";
import { sanitizeTitle, sanitizeSummary, sanitizeUrl, sanitizeDate, sanitizeStringArray, generateContentHash } from "../../src/lib/updates/sanitization";
import { applyLicenceGate } from "../../src/lib/updates/validation";

/**
 * Base normalisation function
 * Creates a normalised item from raw data
 */
export async function normalizeItem(
  rawData: Record<string, unknown>,
  source: SourceRegistryEntry,
  fetchedAt: string
): Promise<Partial<NormalisedItem>> {
  // Extract common fields
  const title = sanitizeTitle(rawData.title || rawData.name || "");
  const url = sanitizeUrl(rawData.url || rawData.link || "");
  const publisher = sanitizeTitle(rawData.publisher || source.name || "");
  const publishedAt = sanitizeDate(rawData.published_at || rawData.pubDate || rawData.date || rawData.created);
  
  // Generate stable ID: source_id + canonical identifier
  const canonicalId = String(rawData.id || rawData.guid || rawData.cve_id || rawData.url || Date.now());
  const id = `${source.id}:${canonicalId}`;
  
  // Extract tags (if available)
  const tags = sanitizeStringArray(rawData.tags || rawData.categories || []);
  
  // Create audience notes (template-driven, deterministic)
  const audienceNotes = {
    exec_brief: generateExecBrief(rawData, source),
    engineer_detail: generateEngineerDetail(rawData, source),
    learner_explain: generateLearnerExplain(rawData, source),
  };
  
  // Create minimal raw object for traceability
  const raw = {
    source_url: url,
    source_title: title,
    canonical_id: canonicalId,
  };
  
  // Generate content hash
  const contentForHash = JSON.stringify({
    title,
    url,
    publisher,
    published_at: publishedAt,
    audience_notes: audienceNotes,
    raw,
  });
  const contentHash = await generateContentHash(contentForHash);
  
  // Build base item
  const item: Partial<NormalisedItem> = {
    id,
    title,
    url,
    publisher,
    published_at: publishedAt,
    fetched_at: fetchedAt,
    source_id: source.id,
    source_type: source.type,
    licence_posture: source.licence_posture,
    content_hash: contentHash,
    topic_tags: tags,
    audience_notes: audienceNotes,
    raw,
  };
  
  // Apply licence gate
  return applyLicenceGate(item, source);
}

/**
 * Generate executive brief (deterministic template)
 */
function generateExecBrief(rawData: Record<string, unknown>, source: SourceRegistryEntry): string {
  const title = sanitizeTitle(rawData.title || "");
  const summary = sanitizeSummary(rawData.summary || rawData.description || "");
  
  if (summary && summary.length > 0) {
    // Limit to 500 chars for exec brief
    return summary.length > 500 ? summary.substring(0, 497) + "..." : summary;
  }
  
  return `${title} from ${source.name}. See original source for details.`;
}

/**
 * Generate engineer detail (deterministic template)
 */
function generateEngineerDetail(rawData: Record<string, unknown>, source: SourceRegistryEntry): string {
  const title = sanitizeTitle(rawData.title || "");
  const summary = sanitizeSummary(rawData.summary || rawData.description || "");
  const technicalDetails = sanitizeSummary(rawData.technical_details || rawData.details || "");
  
  let detail = `${title} from ${source.name}.\n\n`;
  
  if (summary) {
    detail += `Summary: ${summary}\n\n`;
  }
  
  if (technicalDetails) {
    detail += `Technical details: ${technicalDetails}`;
  } else {
    detail += "See original source for technical details.";
  }
  
  // Limit to 2000 chars for engineer detail
  const sanitized = sanitizeSummary(detail);
  return sanitized.length > 2000 ? sanitized.substring(0, 1997) + "..." : sanitized;
}

/**
 * Generate learner explanation (deterministic template)
 */
function generateLearnerExplain(rawData: Record<string, unknown>, source: SourceRegistryEntry): string {
  const title = sanitizeTitle(rawData.title || "");
  const summary = sanitizeSummary(rawData.summary || rawData.description || "");
  
  let explain = `This is an update from ${source.name} about: ${title}.\n\n`;
  
  if (summary) {
    explain += `What it means: ${summary}\n\n`;
  }
  
  explain += "Click the link to read more and learn about this topic.";
  
  // Limit to 1000 chars for learner explain
  const sanitized = sanitizeSummary(explain);
  return sanitized.length > 1000 ? sanitized.substring(0, 997) + "..." : sanitized;
}
