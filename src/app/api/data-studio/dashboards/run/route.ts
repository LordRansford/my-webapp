import { NextRequest } from "next/server";
import { createToolExecutionHandler } from "@/lib/studios/toolExecutionHelper";

type ChartType = "bar" | "line" | "pie" | "area" | "scatter";

interface Chart {
  id: string;
  title: string;
  type: ChartType;
  data: Array<Record<string, unknown>>;
  xAxis: string;
  yAxis: string;
}

function validateDashboard(charts: Chart[]): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (charts.length === 0) {
    errors.push("Dashboard must contain at least one chart");
  }

  charts.forEach((chart, index) => {
    if (!chart.title || chart.title.trim() === "") {
      errors.push(`Chart ${index + 1} must have a title`);
    }

    if (!chart.data || chart.data.length === 0) {
      warnings.push(`Chart "${chart.title || `Chart ${index + 1}`}" has no data`);
    }

    if (!chart.xAxis || chart.xAxis.trim() === "") {
      errors.push(`Chart "${chart.title || `Chart ${index + 1}`}" must specify an X-axis field`);
    }

    if (!chart.yAxis || chart.yAxis.trim() === "") {
      errors.push(`Chart "${chart.title || `Chart ${index + 1}`}" must specify a Y-axis field`);
    }

    if (chart.data && chart.data.length > 0) {
      const firstRow = chart.data[0];
      if (!(chart.xAxis in firstRow)) {
        errors.push(`Chart "${chart.title}" X-axis field "${chart.xAxis}" not found in data`);
      }
      if (!(chart.yAxis in firstRow)) {
        errors.push(`Chart "${chart.title}" Y-axis field "${chart.yAxis}" not found in data`);
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

function generateDashboardConfig(dashboardName: string, charts: Chart[]): string {
  const config = {
    dashboard: {
      name: dashboardName,
      version: "1.0",
      generatedAt: new Date().toISOString(),
    },
    charts: charts.map((chart) => ({
      id: chart.id,
      title: chart.title,
      type: chart.type,
      xAxis: chart.xAxis,
      yAxis: chart.yAxis,
      dataPointCount: chart.data?.length || 0,
    })),
    layout: {
      columns: Math.ceil(Math.sqrt(charts.length)),
      rows: Math.ceil(charts.length / Math.ceil(Math.sqrt(charts.length))),
    },
  };

  return JSON.stringify(config, null, 2);
}

export const POST = createToolExecutionHandler({
  toolId: "data-studio-dashboards",
  executeTool: async (userId, body) => {
    const executionStart = Date.now();
    const dashboardName = body.dashboardName || body.name || "Untitled Dashboard";
    const charts: Chart[] = body.widgets || body.charts || [];

    const validation = validateDashboard(charts);

    if (!validation.valid) {
      return {
        result: {
          success: false,
          errors: validation.errors,
          warnings: validation.warnings,
          dashboard: {
            name: dashboardName,
            charts,
          },
        },
        actualUsage: {
          cpuMs: Date.now() - executionStart,
          memMb: 140,
          durationMs: Date.now() - executionStart,
        },
      };
    }

    const config = generateDashboardConfig(dashboardName, charts);

    const summary = {
      totalCharts: charts.length,
      byType: charts.reduce((acc, c) => {
        acc[c.type] = (acc[c.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      totalDataPoints: charts.reduce((sum, c) => sum + (c.data?.length || 0), 0),
    };

    await new Promise((resolve) => setTimeout(resolve, 220));

    return {
      result: {
        success: true,
        dashboard: {
          name: dashboardName,
          charts,
          config,
          summary,
          validation: {
            valid: true,
            warnings: validation.warnings,
          },
          toolId: "data-studio-dashboards",
          timestamp: new Date().toISOString(),
        },
      },
      actualUsage: {
        cpuMs: Date.now() - executionStart,
        memMb: 140,
        durationMs: Date.now() - executionStart,
      },
    };
  },
});
