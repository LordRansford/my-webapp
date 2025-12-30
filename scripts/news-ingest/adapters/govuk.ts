/**
 * GOV.UK RSS adapter
 * 
 * Fetches from GOV.UK RSS feeds (OGL licence)
 */

import type { SourceRegistryEntry, NormalisedItem } from "../../../src/lib/updates/types";
import { fetchWithRetry } from "../fetch";
import { normalizeItem } from "../normalize";
import { enrichItem } from "../enrich";
import { parseString } from "xml2js";

// Simple RSS parser (we'll use xml2js or native parsing)
function parseRSS(xml: string): Promise<any> {
  return new Promise((resolve, reject) => {
    parseString(xml, (err: Error | null, result: any) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

export async function fetchGOVUK(
  source: SourceRegistryEntry,
  cursor?: { last_fetched?: string; last_modified?: string; lastModified?: string }
): Promise<{ items: Partial<NormalisedItem>[]; nextCursor?: { lastModified: string } }> {
  const lastModified = cursor?.lastModified || cursor?.last_modified;
  // GOV.UK AI/tech publications RSS
  const url = "https://www.gov.uk/government/publications.atom?departments[]=department-for-science-innovation-technology";
  
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
    
    const entries = parsed?.feed?.entry || [];
    let currentLastModified = lastModified || "";
    
    for (const entry of entries) {
      const published = entry.published?.[0] || entry.updated?.[0];
      if (published > currentLastModified) {
        currentLastModified = published;
      }
      
      const title = entry.title?.[0]?._ || entry.title?.[0] || "";
      const link = entry.link?.find((l: any) => l.$.rel === "alternate")?.$.href || entry.link?.[0]?.$.href || "";
      const summary = entry.summary?.[0]?._ || entry.summary?.[0] || entry.content?.[0]?._ || "";
      
      const normalized = await normalizeItem(
        {
          id: entry.id?.[0] || link,
          title,
          url: link,
          publisher: "GOV.UK",
          published_at: published,
          summary,
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
    console.error("Error parsing GOV.UK RSS:", error);
    return { items: [] };
  }
}
