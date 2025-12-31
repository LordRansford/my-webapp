import { NextResponse } from "next/server";
import { getSystemHealth } from "@/lib/studios/systemHealth";

/**
 * System Health Check Endpoint
 * 
 * Provides comprehensive health status for monitoring and alerting.
 * Returns detailed component health, system metrics, and overall status.
 */
export async function GET() {
  try {
    const health = await getSystemHealth();
    
    // Return appropriate HTTP status based on health
    const statusCode = health.status === "healthy" ? 200 : health.status === "degraded" ? 200 : 503;
    
    return NextResponse.json(
      {
        ...health,
        buildTime: process.env.BUILD_TIME || null,
        environment: process.env.NODE_ENV || "development",
      },
      {
        status: statusCode,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "X-Health-Status": health.status,
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Health check failed",
        version: process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_SHA || "dev",
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "X-Health-Status": "unhealthy",
        },
      }
    );
  }
}


