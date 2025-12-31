import { NextRequest } from "next/server";
import { createToolExecutionHandler } from "@/lib/studios/toolExecutionHelper";

type MetricType = "count" | "percentage" | "rate" | "time" | "score";
type Trend = "improving" | "stable" | "degrading";

interface SecurityMetric {
  id: string;
  name: string;
  type: MetricType;
  currentValue: number;
  targetValue?: number;
  trend: Trend;
  description: string;
  category: string;
}

function validateMetrics(metrics: SecurityMetric[]): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (metrics.length === 0) {
    errors.push("Dashboard must contain at least one metric");
  }

  const metricNames = new Set<string>();
  metrics.forEach((metric, index) => {
    if (!metric.name || metric.name.trim() === "") {
      errors.push(`Metric ${index + 1} must have a name`);
    } else if (metricNames.has(metric.name)) {
      warnings.push(`Duplicate metric name: ${metric.name}`);
    } else {
      metricNames.add(metric.name);
    }

    if (metric.currentValue < 0 && (metric.type === "count" || metric.type === "percentage" || metric.type === "rate")) {
      warnings.push(`Metric "${metric.name}" has negative value for ${metric.type} type`);
    }

    if (metric.targetValue !== undefined && metric.currentValue > metric.targetValue * 2) {
      warnings.push(`Metric "${metric.name}" is significantly above target (${metric.currentValue} vs ${metric.targetValue})`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

function calculateKPIs(metrics: SecurityMetric[]): Record<string, number> {
  const kpis: Record<string, number> = {};

  const metricsWithTargets = metrics.filter((m) => m.targetValue !== undefined);
  if (metricsWithTargets.length > 0) {
    const meetingTarget = metricsWithTargets.filter(
      (m) => m.currentValue >= (m.targetValue || 0)
    ).length;
    kpis.targetAchievementRate = (meetingTarget / metricsWithTargets.length) * 100;
  }

  const improvingMetrics = metrics.filter((m) => m.trend === "improving").length;
  kpis.improvingMetrics = (improvingMetrics / metrics.length) * 100;

  const averageValue = metrics.reduce((sum, m) => sum + m.currentValue, 0) / metrics.length;
  kpis.averageMetricValue = averageValue;

  return kpis;
}

function generateMetricsReport(dashboardName: string, metrics: SecurityMetric[]): string {
  let report = `SECURITY METRICS DASHBOARD REPORT\n`;
  report += `==================================\n\n`;
  report += `Dashboard: ${dashboardName}\n`;
  report += `Generated: ${new Date().toISOString()}\n\n`;

  const kpis = calculateKPIs(metrics);

  report += `KEY PERFORMANCE INDICATORS\n`;
  report += `=========================\n`;
  report += `Target Achievement Rate: ${kpis.targetAchievementRate?.toFixed(1) || 0}%\n`;
  report += `Improving Metrics: ${kpis.improvingMetrics?.toFixed(1) || 0}%\n`;
  report += `Average Metric Value: ${kpis.averageMetricValue?.toFixed(2) || 0}\n\n`;

  report += `METRICS BY CATEGORY\n`;
  report += `===================\n\n`;

  const byCategory = metrics.reduce((acc, m) => {
    if (!acc[m.category]) {
      acc[m.category] = [];
    }
    acc[m.category].push(m);
    return acc;
  }, {} as Record<string, SecurityMetric[]>);

  Object.entries(byCategory).forEach(([category, categoryMetrics]) => {
    report += `${category.toUpperCase()}\n`;
    report += `${"-".repeat(category.length)}\n\n`;

    categoryMetrics.forEach((metric) => {
      report += `${metric.name}\n`;
      report += `  Type: ${metric.type}\n`;
      report += `  Current Value: ${metric.currentValue}\n`;
      if (metric.targetValue !== undefined) {
        report += `  Target Value: ${metric.targetValue}\n`;
        const status = metric.currentValue >= metric.targetValue ? "MEETING" : "BELOW";
        report += `  Status: ${status} TARGET\n`;
      }
      report += `  Trend: ${metric.trend.toUpperCase()}\n`;
      if (metric.description) {
        report += `  Description: ${metric.description}\n`;
      }
      report += `\n`;
    });
  });

  report += `\n--- END OF REPORT ---\n`;
  return report;
}

export const POST = createToolExecutionHandler({
  toolId: "cyber-studio-metrics",
  executeTool: async (userId, body) => {
    const executionStart = Date.now();
    const dashboardName = body.dashboardName || body.name || "Security Metrics Dashboard";
    const period = body.period || "30d";
    const metrics: SecurityMetric[] = body.metrics || [];

    const validation = validateMetrics(metrics);

    if (!validation.valid) {
      return {
        result: {
          success: false,
          errors: validation.errors,
          warnings: validation.warnings,
          metrics: {
            dashboard: dashboardName,
            period,
            metrics,
          },
        },
        actualUsage: {
          cpuMs: Date.now() - executionStart,
          memMb: 130,
          durationMs: Date.now() - executionStart,
        },
      };
    }

    const kpis = calculateKPIs(metrics);
    const report = generateMetricsReport(dashboardName, metrics);

    const summary = {
      totalMetrics: metrics.length,
      byCategory: metrics.reduce((acc, m) => {
        acc[m.category] = (acc[m.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byTrend: metrics.reduce((acc, m) => {
        acc[m.trend] = (acc[m.trend] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      meetingTargets: metrics.filter(
        (m) => m.targetValue !== undefined && m.currentValue >= (m.targetValue || 0)
      ).length,
    };

    await new Promise((resolve) => setTimeout(resolve, 200));

    return {
      result: {
        success: true,
        metrics: {
          dashboard: dashboardName,
          period,
          metrics: metrics.map((m) => ({
            ...m,
            status:
              m.targetValue !== undefined
                ? m.currentValue >= m.targetValue
                  ? "meeting_target"
                  : "below_target"
                : "no_target",
          })),
          kpis,
          summary,
          report,
          validation: {
            valid: true,
            warnings: validation.warnings,
          },
          toolId: "cyber-studio-metrics",
          timestamp: new Date().toISOString(),
        },
      },
      actualUsage: {
        cpuMs: Date.now() - executionStart,
        memMb: 130,
        durationMs: Date.now() - executionStart,
      },
    };
  },
});
