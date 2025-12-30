/**
 * RSS feed generation endpoint
 * 
 * Generates an RSS 2.0 feed from the latest news snapshot
 */

import { NextResponse } from "next/server";
import { join } from "path";
import type { NewsSnapshot } from "@/lib/updates/types";

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateRSS(snapshot: NewsSnapshot, baseUrl: string): string {
  const items = snapshot.items
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .slice(0, 50); // Limit to 50 most recent

  const rssItems = items
    .map((item) => {
      const pubDate = new Date(item.published_at).toUTCString();
      const description = escapeXml(item.audience_notes.exec_brief || item.title);

      return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.url)}</link>
      <description>${description}</description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="false">${escapeXml(item.id)}</guid>
      <source>${escapeXml(item.publisher)}</source>
    </item>`;
    })
    .join("\n");

  const lastBuildDate = new Date(snapshot.metadata.generated_at).toUTCString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>News and Updates - Ransford's Notes</title>
    <link>${baseUrl}/updates</link>
    <description>Curated index of authoritative sources for energy system digitalisation, cybersecurity, AI governance, and standards</description>
    <language>en-GB</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${baseUrl}/api/updates/rss" rel="self" type="application/rss+xml"/>
    <generator>Ransford's Notes News Ingestion</generator>
${rssItems}
  </channel>
</rss>`;
}

export async function GET(request: Request) {
  try {
    const filePath = join(process.cwd(), "data", "news", "latest.json");
    
    // Check if file exists, try last-good as fallback
    const fs = await import("fs");
    let snapshotPath = filePath;
    if (!fs.existsSync(filePath)) {
      snapshotPath = join(process.cwd(), "data", "news", "last-good.json");
      if (!fs.existsSync(snapshotPath)) {
        return NextResponse.json(
          { error: "No snapshot available" },
          { status: 404 }
        );
      }
    }
    
    const fileContents = fs.readFileSync(snapshotPath, "utf8");
    const snapshot: NewsSnapshot = JSON.parse(fileContents);

    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    const rss = generateRSS(snapshot, baseUrl);

    return new NextResponse(rss, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    return NextResponse.json(
      { error: "Failed to generate RSS feed" },
      { status: 500 }
    );
  }
}
