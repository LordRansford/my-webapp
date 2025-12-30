/**
 * arXiv Atom adapter
 * 
 * Fetches arXiv CS.AI feed (metadata only per policy)
 */

import type { SourceRegistryEntry, NormalisedItem } from "../../../src/lib/updates/types";
import { fetchWithRetry } from "../fetch";
import { normalizeItem } from "../normalize";
import { enrichItem } from "../enrich";
import { parseString } from "xml2js";

function parseAtom(xml: string): Promise<any> {
  return new Promise((resolve, reject) => {
    parseString(xml, (err: Error | null, result: any) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

export async function fetchArxiv(
  source: SourceRegistryEntry,
  cursor?: { last_fetched?: string; last_modified?: string; lastModified?: string }
): Promise<{ items: Partial<NormalisedItem>[]; nextCursor?: { lastModified: string } }> {
  const lastModified = cursor?.lastModified || cursor?.last_modified;
  // arXiv CS.AI feed
  const url = "http://export.arxiv.org/api/query?search_query=cat:cs.AI&sortBy=submittedDate&sortOrder=descending&max_results=50";
  
  const result = await fetchWithRetry({
    source,
    url,
    lastModified,
  });
  
  if (!result.success || !result.data || typeof result.data !== "string") {
    return { items: [] };
  }
  
  try {
    const parsed = await parseAtom(result.data);
    const items: Partial<NormalisedItem>[] = [];
    const fetchedAt = new Date().toISOString();
    
    const entries = parsed?.feed?.entry || [];
    let currentLastModified = lastModified || "";
    
    for (const entry of entries) {
      const updated = entry.updated?.[0];
      if (updated && updated > currentLastModified) {
        currentLastModified = updated;
      }
      
      const title = entry.title?.[0] || "";
      const link = entry.link?.find((l: any) => l.$.rel === "alternate")?.$.href || entry.link?.[0]?.$.href || "";
      const summary = entry.summary?.[0]?._ || entry.summary?.[0] || "";
      const id = entry.id?.[0] || link;
      
      // Metadata only - store abstract only if policy permits (conservative: metadata only)
      const normalized = await normalizeItem(
        {
          id,
          title,
          url: link,
          publisher: "arXiv",
          published_at: entry.published?.[0] || updated,
          summary: summary.substring(0, 200),  // Short excerpt only
        },
        source,
        fetchedAt
      );
      
      if (normalized) {
        const enriched = enrichItem(normalized as NormalisedItem);
        items.push(enriched);
      }
    }
    
    return {
      items,
      nextCursor: currentLastModified ? { lastModified: currentLastModified } : undefined,
    };
  } catch (error) {
    console.error("Error parsing arXiv Atom:", error);
    return { items: [] };
  }
}
