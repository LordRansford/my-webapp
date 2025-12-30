/**
 * API route to serve latest.json snapshot with rate limiting
 */

import { NextResponse } from "next/server";
import { join } from "path";

// Simple in-memory rate limiting (for production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 100; // requests per window
const WINDOW_MS = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

export async function GET(request: Request) {
  // Rate limiting
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  try {
    const filePath = join(process.cwd(), "data", "news", "latest.json");
    
    // Check if file exists
    const fs = await import("fs");
    if (!fs.existsSync(filePath)) {
      // Try last-good.json as fallback
      const fallbackPath = join(process.cwd(), "data", "news", "last-good.json");
      if (fs.existsSync(fallbackPath)) {
        const fileContents = fs.readFileSync(fallbackPath, "utf8");
        const data = JSON.parse(fileContents);
        return NextResponse.json(data, {
          headers: {
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
            "X-Fallback": "true",
          },
        });
      }
      return NextResponse.json(
        { error: "No snapshot available" },
        { status: 404 }
      );
    }
    
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContents);
    
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error loading latest snapshot:", error);
    return NextResponse.json(
      { error: "Failed to load latest snapshot" },
      { status: 500 }
    );
  }
}
