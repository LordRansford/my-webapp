import { NextRequest } from "next/server";
import { createToolExecutionHandler } from "@/lib/studios/toolExecutionHelper";

type RiskLevel = "low" | "medium" | "high" | "critical";
type RiskStatus = "open" | "mitigated" | "accepted" | "transferred";

interface Risk {
  id: string;
  title: string;
  description: string;
  category: string;
  likelihood: RiskLevel;
  impact: RiskLevel;
  status: RiskStatus;
  mitigation: string;
  owner: string;
  dueDate?: string;
}

function calculateRiskScore(likelihood: RiskLevel, impact: RiskLevel): number {
  const likelihoodScores: Record<RiskLevel, number> = { low: 1, medium: 2, high: 3, critical: 4 };
  const impactScores: Record<RiskLevel, number> = { low: 1, medium: 2, high: 3, critical: 4 };
  return likelihoodScores[likelihood] * impactScores[impact];
}

function getRiskLevel(score: number): RiskLevel {
  if (score >= 12) return "critical";
  if (score >= 9) return "high";
  if (score >= 6) return "medium";
  return "low";
}

function validateRisk(risk: Risk): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!risk.title || risk.title.trim() === "") {
    errors.push("Risk title cannot be empty");
  }

  if (!risk.description || risk.description.trim() === "") {
    errors.push("Risk description cannot be empty");
  }

  if (!risk.category || risk.category.trim() === "") {
    errors.push("Risk category cannot be empty");
  }

  if (!risk.owner || risk.owner.trim() === "") {
    errors.push("Risk owner cannot be empty");
  }

  if (risk.status === "open" && (!risk.mitigation || risk.mitigation.trim() === "")) {
    errors.push("Open risks should have a mitigation plan");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function generateRiskReport(risks: Risk[]): string {
  let report = `RISK REGISTER REPORT\n`;
  report += `====================\n\n`;
  report += `Generated: ${new Date().toISOString()}\n\n`;

  // Summary
  const summary = {
    total: risks.length,
    byStatus: risks.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byLevel: risks.reduce((acc, r) => {
      const score = calculateRiskScore(r.likelihood, r.impact);
      const level = getRiskLevel(score);
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  report += `SUMMARY\n`;
  report += `-------\n`;
  report += `Total Risks: ${summary.total}\n\n`;

  report += `By Status:\n`;
  Object.entries(summary.byStatus).forEach(([status, count]) => {
    report += `  ${status}: ${count}\n`;
  });

  report += `\nBy Risk Level:\n`;
  Object.entries(summary.byLevel).forEach(([level, count]) => {
    report += `  ${level}: ${count}\n`;
  });

  report += `\n\nDETAILED RISKS\n`;
  report += `===============\n\n`;

  // Sort risks by score (highest first)
  const risksWithScores = risks.map((risk) => ({
    ...risk,
    riskScore: calculateRiskScore(risk.likelihood, risk.impact),
    riskLevel: getRiskLevel(calculateRiskScore(risk.likelihood, risk.impact)),
  }));

  risksWithScores.sort((a, b) => b.riskScore - a.riskScore);

  risksWithScores.forEach((risk, index) => {
    report += `${index + 1}. ${risk.title}\n`;
    report += `   Category: ${risk.category}\n`;
    report += `   Likelihood: ${risk.likelihood.toUpperCase()}\n`;
    report += `   Impact: ${risk.impact.toUpperCase()}\n`;
    report += `   Risk Score: ${risk.riskScore} (${risk.riskLevel.toUpperCase()})\n`;
    report += `   Status: ${risk.status.toUpperCase()}\n`;
    report += `   Owner: ${risk.owner}\n`;
    if (risk.dueDate) {
      report += `   Due Date: ${risk.dueDate}\n`;
    }
    report += `   Description: ${risk.description}\n`;
    if (risk.mitigation) {
      report += `   Mitigation: ${risk.mitigation}\n`;
    }
    report += `\n`;
  });

  report += `\n--- END OF REPORT ---\n`;
  return report;
}

export const POST = createToolExecutionHandler({
  toolId: "cyber-studio-risk-register",
  executeTool: async (userId, body) => {
    const executionStart = Date.now();

    const risks: Risk[] = body.risks || [];

    // Validate all risks
    const validationResults = risks.map((risk) => ({
      riskId: risk.id,
      ...validateRisk(risk),
    }));

    const allValid = validationResults.every((v) => v.valid);
    const allErrors = validationResults.flatMap((v) =>
      v.errors.map((error) => `Risk "${v.riskId}": ${error}`)
    );

    if (!allValid) {
      return {
        result: {
          success: false,
          errors: allErrors,
          riskRegister: {
            name: body.registerName || body.name || "Untitled Risk Register",
            risks,
          },
        },
        actualUsage: {
          cpuMs: Date.now() - executionStart,
          memMb: 120,
          durationMs: Date.now() - executionStart,
        },
      };
    }

    // Calculate risk matrix
    const riskMatrix: Record<string, number> = {};
    risks.forEach((risk) => {
      const key = `${risk.likelihood}-${risk.impact}`;
      riskMatrix[key] = (riskMatrix[key] || 0) + 1;
    });

    // Generate report
    const riskReport = risks.length > 0 ? generateRiskReport(risks) : "";

    // Calculate summary statistics
    const risksWithScores = risks.map((risk) => ({
      ...risk,
      riskScore: calculateRiskScore(risk.likelihood, risk.impact),
      riskLevel: getRiskLevel(calculateRiskScore(risk.likelihood, risk.impact)),
    }));

    const summary = {
      total: risks.length,
      byStatus: risks.reduce((acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byLevel: risksWithScores.reduce((acc, r) => {
        acc[r.riskLevel] = (acc[r.riskLevel] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      averageScore: risks.length > 0
        ? risksWithScores.reduce((sum, r) => sum + r.riskScore, 0) / risks.length
        : 0,
      criticalCount: risksWithScores.filter((r) => r.riskLevel === "critical").length,
    };

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 200));

    return {
      result: {
        success: true,
        riskRegister: {
          name: body.registerName || body.name || "Untitled Risk Register",
          risks: risksWithScores,
          riskMatrix,
          summary,
          report: riskReport,
          toolId: "cyber-studio-risk-register",
          timestamp: new Date().toISOString(),
        },
      },
      actualUsage: {
        cpuMs: Date.now() - executionStart,
        memMb: 120,
        durationMs: Date.now() - executionStart,
      },
    };
  },
});
