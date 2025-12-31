/**
 * Tool Execution Metrics and Monitoring
 * 
 * Provides utilities for tracking and analyzing tool execution performance,
 * success rates, and usage patterns.
 */

import fs from "fs";
import path from "path";

const METRICS_DIR = path.join(process.cwd(), "data", "metrics");
const TOOL_METRICS_FILE = path.join(METRICS_DIR, "tool-execution-metrics.jsonl");

interface ToolExecutionMetric {
  id: string;
  timestamp: string;
  toolId: string;
  userId: string;
  requestId: string;
  success: boolean;
  durationMs: number;
  phaseDurations: Record<string, number>;
  creditEstimate: number;
  creditCharged: number;
  errorType?: string;
  errorCode?: string;
  retryCount?: number;
  timeout?: boolean;
}

function ensureMetricsDir(): void {
  if (!fs.existsSync(METRICS_DIR)) {
    fs.mkdirSync(METRICS_DIR, { recursive: true });
  }
}

/**
 * Record a tool execution metric
 */
export function recordToolMetric(metric: Omit<ToolExecutionMetric, "id" | "timestamp">): void {
  try {
    ensureMetricsDir();

    const fullMetric: ToolExecutionMetric = {
      ...metric,
      id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toISOString(),
    };

    const line = JSON.stringify(fullMetric) + "\n";
    fs.appendFileSync(TOOL_METRICS_FILE, line, "utf-8");
  } catch (error) {
    // Don't throw - metrics should never break the application
    console.error("Failed to record tool metric:", error);
  }
}

/**
 * Get tool performance statistics
 */
export function getToolPerformanceStats(
  toolId?: string,
  startDate?: Date,
  endDate?: Date
): {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageDurationMs: number;
  p50DurationMs: number;
  p95DurationMs: number;
  p99DurationMs: number;
  totalCreditsCharged: number;
  averageCreditsPerExecution: number;
  errorBreakdown: Record<string, number>;
  timeoutRate: number;
  retryRate: number;
} {
  try {
    if (!fs.existsSync(TOOL_METRICS_FILE)) {
      return getEmptyStats();
    }

    const content = fs.readFileSync(TOOL_METRICS_FILE, "utf-8");
    const lines = content.trim().split("\n").filter(Boolean);
    let metrics: ToolExecutionMetric[] = lines.map((line) => JSON.parse(line));

    // Apply filters
    if (toolId) {
      metrics = metrics.filter((m) => m.toolId === toolId);
    }

    if (startDate) {
      metrics = metrics.filter((m) => new Date(m.timestamp) >= startDate);
    }

    if (endDate) {
      metrics = metrics.filter((m) => new Date(m.timestamp) <= endDate);
    }

    if (metrics.length === 0) {
      return getEmptyStats();
    }

    const durations = metrics.map((m) => m.durationMs).sort((a, b) => a - b);
    const successful = metrics.filter((m) => m.success);
    const failed = metrics.filter((m) => !m.success);
    const timeouts = metrics.filter((m) => m.timeout).length;
    const retries = metrics.filter((m) => (m.retryCount || 0) > 0).length;

    const errorBreakdown: Record<string, number> = {};
    failed.forEach((m) => {
      const errorKey = m.errorCode || m.errorType || "unknown";
      errorBreakdown[errorKey] = (errorBreakdown[errorKey] || 0) + 1;
    });

    const totalCredits = metrics.reduce((sum, m) => sum + m.creditCharged, 0);

    return {
      totalExecutions: metrics.length,
      successfulExecutions: successful.length,
      failedExecutions: failed.length,
      averageDurationMs: durations.reduce((a, b) => a + b, 0) / durations.length,
      p50DurationMs: durations[Math.floor(durations.length * 0.5)] || 0,
      p95DurationMs: durations[Math.floor(durations.length * 0.95)] || 0,
      p99DurationMs: durations[Math.floor(durations.length * 0.99)] || 0,
      totalCreditsCharged: totalCredits,
      averageCreditsPerExecution: totalCredits / metrics.length,
      errorBreakdown,
      timeoutRate: timeouts / metrics.length,
      retryRate: retries / metrics.length,
    };
  } catch (error) {
    console.error("Failed to get tool performance stats:", error);
    return getEmptyStats();
  }
}

function getEmptyStats() {
  return {
    totalExecutions: 0,
    successfulExecutions: 0,
    failedExecutions: 0,
    averageDurationMs: 0,
    p50DurationMs: 0,
    p95DurationMs: 0,
    p99DurationMs: 0,
    totalCreditsCharged: 0,
    averageCreditsPerExecution: 0,
    errorBreakdown: {},
    timeoutRate: 0,
    retryRate: 0,
  };
}

/**
 * Get user tool usage statistics
 */
export function getUserToolStats(
  userId: string,
  startDate?: Date,
  endDate?: Date
): {
  totalExecutions: number;
  toolsUsed: string[];
  totalCreditsSpent: number;
  averageExecutionTime: number;
  mostUsedTool: string | null;
} {
  try {
    if (!fs.existsSync(TOOL_METRICS_FILE)) {
      return {
        totalExecutions: 0,
        toolsUsed: [],
        totalCreditsSpent: 0,
        averageExecutionTime: 0,
        mostUsedTool: null,
      };
    }

    const content = fs.readFileSync(TOOL_METRICS_FILE, "utf-8");
    const lines = content.trim().split("\n").filter(Boolean);
    let metrics: ToolExecutionMetric[] = lines
      .map((line) => JSON.parse(line))
      .filter((m) => m.userId === userId);

    if (startDate) {
      metrics = metrics.filter((m) => new Date(m.timestamp) >= startDate);
    }

    if (endDate) {
      metrics = metrics.filter((m) => new Date(m.timestamp) <= endDate);
    }

    const toolCounts: Record<string, number> = {};
    let totalCredits = 0;
    let totalDuration = 0;

    metrics.forEach((m) => {
      toolCounts[m.toolId] = (toolCounts[m.toolId] || 0) + 1;
      totalCredits += m.creditCharged;
      totalDuration += m.durationMs;
    });

    const toolsUsed = Object.keys(toolCounts);
    const mostUsedTool =
      toolsUsed.length > 0
        ? toolsUsed.reduce((a, b) => (toolCounts[a] > toolCounts[b] ? a : b))
        : null;

    return {
      totalExecutions: metrics.length,
      toolsUsed,
      totalCreditsSpent: totalCredits,
      averageExecutionTime: metrics.length > 0 ? totalDuration / metrics.length : 0,
      mostUsedTool,
    };
  } catch (error) {
    console.error("Failed to get user tool stats:", error);
    return {
      totalExecutions: 0,
      toolsUsed: [],
      totalCreditsSpent: 0,
      averageExecutionTime: 0,
      mostUsedTool: null,
    };
  }
}
