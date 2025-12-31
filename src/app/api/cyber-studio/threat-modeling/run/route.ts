import { NextRequest } from "next/server";
import { createToolExecutionHandler } from "@/lib/studios/toolExecutionHelper";

type ThreatCategory = "spoofing" | "tampering" | "repudiation" | "information_disclosure" | "denial_of_service" | "elevation_of_privilege";
type Severity = "low" | "medium" | "high" | "critical";

interface Threat {
  id: string;
  description: string;
  category: ThreatCategory;
  severity: Severity;
  mitigation: string;
}

function calculateThreatScore(threat: Threat): number {
  const severityScores: Record<Severity, number> = { low: 1, medium: 2, high: 3, critical: 4 };
  const categoryWeights: Record<ThreatCategory, number> = {
    spoofing: 1.0,
    tampering: 1.2,
    repudiation: 0.8,
    information_disclosure: 1.3,
    denial_of_service: 1.1,
    elevation_of_privilege: 1.4,
  };

  return severityScores[threat.severity] * categoryWeights[threat.category];
}

function calculateOverallRiskLevel(threats: Threat[]): Severity {
  if (threats.length === 0) return "low";

  const scores = threats.map(calculateThreatScore);
  const averageScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;

  if (averageScore >= 4.5) return "critical";
  if (averageScore >= 3.5) return "high";
  if (averageScore >= 2.0) return "medium";
  return "low";
}

function validateThreatModel(
  systemName: string,
  systemDescription: string,
  assets: string[],
  threats: Threat[]
): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!systemName || systemName.trim() === "") {
    errors.push("System name cannot be empty");
  }

  if (!systemDescription || systemDescription.trim() === "") {
    warnings.push("System description is empty");
  }

  const validAssets = assets.filter((a) => a && a.trim() !== "");
  if (validAssets.length === 0) {
    errors.push("At least one asset must be specified");
  }

  threats.forEach((threat, index) => {
    if (!threat.description || threat.description.trim() === "") {
      errors.push(`Threat ${index + 1} must have a description`);
    }

    if ((threat.severity === "critical" || threat.severity === "high") && !threat.mitigation?.trim()) {
      warnings.push(`High/critical threat "${threat.description}" should have a mitigation plan`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

function generateThreatModelReport(
  systemName: string,
  systemDescription: string,
  assets: string[],
  threats: Threat[],
  overallRisk: Severity
): string {
  let report = `THREAT MODEL REPORT\n`;
  report += `===================\n\n`;
  report += `System: ${systemName}\n`;
  report += `Generated: ${new Date().toISOString()}\n\n`;

  report += `SYSTEM OVERVIEW\n`;
  report += `===============\n`;
  report += `Description: ${systemDescription || "Not provided"}\n\n`;

  report += `ASSETS\n`;
  report += `======\n`;
  assets.filter((a) => a && a.trim() !== "").forEach((asset, index) => {
    report += `${index + 1}. ${asset}\n`;
  });

  const threatScores = threats.map((t) => ({ threat: t, score: calculateThreatScore(t) }));
  threatScores.sort((a, b) => b.score - a.score);

  report += `\n\nTHREAT ANALYSIS\n`;
  report += `===============\n`;
  report += `Overall Risk Level: ${overallRisk.toUpperCase()}\n`;
  report += `Total Threats: ${threats.length}\n\n`;

  const byCategory = threats.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  report += `Threats by Category:\n`;
  Object.entries(byCategory).forEach(([category, count]) => {
    report += `  ${category.replace(/_/g, " ")}: ${count}\n`;
  });

  report += `\n\nDETAILED THREATS (Sorted by Risk Score)\n`;
  report += `========================================\n\n`;

  threatScores.forEach(({ threat, score }, index) => {
    report += `${index + 1}. ${threat.description}\n`;
    report += `   Category: ${threat.category.replace(/_/g, " ").toUpperCase()}\n`;
    report += `   Severity: ${threat.severity.toUpperCase()}\n`;
    report += `   Risk Score: ${score.toFixed(2)}\n`;
    if (threat.mitigation) {
      report += `   Mitigation: ${threat.mitigation}\n`;
    } else {
      report += `   Mitigation: Not specified\n`;
    }
    report += `\n`;
  });

  report += `\n--- END OF REPORT ---\n`;
  return report;
}

export const POST = createToolExecutionHandler({
  toolId: "cyber-studio-threat-modeling",
  executeTool: async (userId, body) => {
    const executionStart = Date.now();
    const systemName = body.systemName || body.name || "Untitled System";
    const systemDescription = body.systemDescription || body.description || "";
    const assets: string[] = body.assets || [];
    const threats: Threat[] = body.identifiedThreats || body.threats || [];

    const validation = validateThreatModel(systemName, systemDescription, assets, threats);

    if (!validation.valid) {
      return {
        result: {
          success: false,
          errors: validation.errors,
          warnings: validation.warnings,
          threatModel: {
            system: systemName,
            description: systemDescription,
            assets,
            threats,
          },
        },
        actualUsage: {
          cpuMs: Date.now() - executionStart,
          memMb: 140,
          durationMs: Date.now() - executionStart,
        },
      };
    }

    const overallRisk = calculateOverallRiskLevel(threats);
    const threatScores = threats.map((t) => ({
      threat: t,
      score: calculateThreatScore(t),
    }));

    const report = generateThreatModelReport(systemName, systemDescription, assets, threats, overallRisk);

    await new Promise((resolve) => setTimeout(resolve, 280));

    return {
      result: {
        success: true,
        threatModel: {
          system: systemName,
          description: systemDescription,
          assets: assets.filter((a) => a && a.trim() !== ""),
          threats: threatScores.map(({ threat, score }) => ({
            ...threat,
            riskScore: score,
          })),
          overallRiskLevel: overallRisk,
          report,
          summary: {
            totalThreats: threats.length,
            byCategory: threats.reduce((acc, t) => {
              acc[t.category] = (acc[t.category] || 0) + 1;
              return acc;
            }, {} as Record<string, number>),
            bySeverity: threats.reduce((acc, t) => {
              acc[t.severity] = (acc[t.severity] || 0) + 1;
              return acc;
            }, {} as Record<string, number>),
            averageRiskScore: threatScores.length > 0
              ? threatScores.reduce((sum, { score }) => sum + score, 0) / threatScores.length
              : 0,
          },
          validation: {
            valid: true,
            warnings: validation.warnings,
          },
          toolId: "cyber-studio-threat-modeling",
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
