/**
 * NCSC RSS adapter
 * 
 * Fetches NCSC security advisories (metadata only per licence)
 */

import type { SourceRegistryEntry, NormalisedItem } from "../../../src/lib/updates/types";
import { fetchWithRetry } from "../fetch";
import { normalizeItem } from "../normalize";
import { enrichItem } from "../enrich";
import { parseString } from "xml2js";

function parseRSS(xml: string): Promise<any> {
  return new Promise((resolve, reject) => {
    parseString(xml, (err: Error | null, result: any) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

export async function fetchNCSC(
  source: SourceRegistryEntry,
  cursor?: { last_fetched?: string; last_modified?: string; lastModified?: string }
): Promise<{ items: Partial<NormalisedItem>[]; nextCursor?: { lastModified: string } }> {
  const lastModified = cursor?.lastModified || cursor?.last_modified;
  // NCSC advisories RSS
  const url = "https://www.ncsc.gov.uk/api/1/services/v1/all-report-types-feed.xml";
  
  const result = await fetchWithRetry({
    source,
    url,
    lastModified,
  });
  
  if (!result.success || !result.data || typeof result.data !== "string") {
    return { items: [] };
  }
  
  try {
    const parsed = await parseRSS(result.data);
    const items: Partial<NormalisedItem>[] = [];
    const fetchedAt = new Date().toISOString();
    
    const entries = parsed?.rss?.channel?.[0]?.item || [];
    let currentLastModified = lastModified || "";
    
    for (const entry of entries) {
      const pubDate = entry.pubDate?.[0];
      if (pubDate && pubDate > currentLastModified) {
        currentLastModified = pubDate;
      }
      
      const title = entry.title?.[0] || "";
      const link = entry.link?.[0] || "";
      // Metadata only - no description stored
      
      const normalized = await normalizeItem(
        {
          id: entry.guid?.[0]?._ || link,
          title,
          url: link,
          publisher: "NCSC",
          published_at: pubDate || new Date().toISOString(),
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
    console.error("Error parsing NCSC RSS:", error);
    return { items: [] };
  }
}
