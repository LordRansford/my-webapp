/**
 * System Health Monitoring
 * 
 * Provides comprehensive health checks for system components,
 * dependencies, and service availability.
 */

import fs from "fs";
import path from "path";

export interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    database: ComponentHealth;
    storage: ComponentHealth;
    credits: ComponentHealth;
    tools: ComponentHealth;
  };
  metrics: {
    memoryUsage: NodeJS.MemoryUsage;
    nodeVersion: string;
    platform: string;
  };
}

export interface ComponentHealth {
  status: "healthy" | "degraded" | "unhealthy";
  message?: string;
  latencyMs?: number;
  lastChecked: string;
}

/**
 * Check database health
 */
async function checkDatabase(): Promise<ComponentHealth> {
  const startTime = Date.now();
  try {
    // Try to import and use Prisma
    const { prisma } = await import("@/lib/db/prisma");
    if (prisma) {
      // Simple query to check connectivity
      await prisma.$queryRaw`SELECT 1`;
      return {
        status: "healthy",
        latencyMs: Date.now() - startTime,
        lastChecked: new Date().toISOString(),
      };
    }
    return {
      status: "degraded",
      message: "Prisma client not available, using fallback storage",
      latencyMs: Date.now() - startTime,
      lastChecked: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: "unhealthy",
      message: error instanceof Error ? error.message : "Database check failed",
      latencyMs: Date.now() - startTime,
      lastChecked: new Date().toISOString(),
    };
  }
}

/**
 * Check file storage health
 */
function checkStorage(): ComponentHealth {
  const startTime = Date.now();
  try {
    const dataDir = path.join(process.cwd(), "data");
    
    // Check if data directory exists and is writable
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch (error) {
        return {
          status: "unhealthy",
          message: `Cannot create data directory: ${error instanceof Error ? error.message : "Unknown error"}`,
          latencyMs: Date.now() - startTime,
          lastChecked: new Date().toISOString(),
        };
      }
    }

    // Test write access
    const testFile = path.join(dataDir, ".health-check");
    try {
      fs.writeFileSync(testFile, "ok");
      fs.unlinkSync(testFile);
    } catch (error) {
      return {
        status: "unhealthy",
        message: `Storage not writable: ${error instanceof Error ? error.message : "Unknown error"}`,
        latencyMs: Date.now() - startTime,
        lastChecked: new Date().toISOString(),
      };
    }

    return {
      status: "healthy",
      latencyMs: Date.now() - startTime,
      lastChecked: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: "unhealthy",
      message: error instanceof Error ? error.message : "Storage check failed",
      latencyMs: Date.now() - startTime,
      lastChecked: new Date().toISOString(),
    };
  }
}

/**
 * Check credits system health
 */
async function checkCredits(): Promise<ComponentHealth> {
  const startTime = Date.now();
  try {
    const { getCreditBalance } = await import("@/lib/billing/creditStore");
    
    // Try to access credit store (using a test user ID)
    try {
      await getCreditBalance("health-check-test");
      return {
        status: "healthy",
        latencyMs: Date.now() - startTime,
        lastChecked: new Date().toISOString(),
      };
    } catch (error) {
      // If it fails with "not found" that's okay - system is working
      if (error instanceof Error && error.message.includes("not found")) {
        return {
          status: "healthy",
          latencyMs: Date.now() - startTime,
          lastChecked: new Date().toISOString(),
        };
      }
      throw error;
    }
  } catch (error) {
    return {
      status: "degraded",
      message: error instanceof Error ? error.message : "Credits system check failed",
      latencyMs: Date.now() - startTime,
      lastChecked: new Date().toISOString(),
    };
  }
}

/**
 * Check tools registry health
 */
function checkTools(): ComponentHealth {
  const startTime = Date.now();
  try {
    const { getToolDefinition, getAllTools } = require("@/lib/tools/registry");
    
    // Check if tools registry is accessible
    const tools = getAllTools();
    if (!tools || tools.length === 0) {
      return {
        status: "degraded",
        message: "No tools registered",
        latencyMs: Date.now() - startTime,
        lastChecked: new Date().toISOString(),
      };
    }

    // Check if we can get a tool definition
    const testTool = getToolDefinition(tools[0]?.id || "");
    if (!testTool) {
      return {
        status: "degraded",
        message: "Tools registry accessible but tool definitions not loading",
        latencyMs: Date.now() - startTime,
        lastChecked: new Date().toISOString(),
      };
    }

    return {
      status: "healthy",
      latencyMs: Date.now() - startTime,
      lastChecked: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: "unhealthy",
      message: error instanceof Error ? error.message : "Tools registry check failed",
      latencyMs: Date.now() - startTime,
      lastChecked: new Date().toISOString(),
    };
  }
}

/**
 * Get overall system health
 */
export async function getSystemHealth(): Promise<HealthStatus> {
  const processStartTime = process.uptime();
  const [database, storage, credits, tools] = await Promise.all([
    checkDatabase(),
    Promise.resolve(checkStorage()),
    checkCredits(),
    Promise.resolve(checkTools()),
  ]);

  // Determine overall status
  const statuses = [database.status, storage.status, credits.status, tools.status];
  let overallStatus: "healthy" | "degraded" | "unhealthy" = "healthy";
  
  if (statuses.includes("unhealthy")) {
    overallStatus = "unhealthy";
  } else if (statuses.includes("degraded")) {
    overallStatus = "degraded";
  }

  return {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_SHA || "dev",
    uptime: Math.floor(processStartTime),
    checks: {
      database,
      storage,
      credits,
      tools,
    },
    metrics: {
      memoryUsage: process.memoryUsage(),
      nodeVersion: process.version,
      platform: process.platform,
    },
  };
}

/**
 * Get health check for specific component
 */
export async function getComponentHealth(component: "database" | "storage" | "credits" | "tools"): Promise<ComponentHealth> {
  switch (component) {
    case "database":
      return checkDatabase();
    case "storage":
      return checkStorage();
    case "credits":
      return checkCredits();
    case "tools":
      return checkTools();
    default:
      throw new Error(`Unknown component: ${component}`);
  }
}
