import { NextRequest } from "next/server";
import { createToolExecutionHandler } from "@/lib/studios/toolExecutionHelper";

type DataCategory = "personal" | "sensitive" | "public" | "confidential";
type RiskLevel = "low" | "medium" | "high" | "critical";
type ComplianceFramework = "GDPR" | "CCPA" | "HIPAA" | "PIPEDA" | "LGPD";

interface PrivacyRisk {
  id: string;
  description: string;
  dataCategory: DataCategory;
  riskLevel: RiskLevel;
  impact: string;
  likelihood: RiskLevel;
}

interface Mitigation {
  id: string;
  riskId: string;
  description: string;
  effectiveness: "low" | "medium" | "high";
}

function calculatePrivacyScore(risks: PrivacyRisk[]): number {
  const riskScores: Record<RiskLevel, number> = { low: 1, medium: 2, high: 3, critical: 4 };
  if (risks.length === 0) return 0;

  const totalScore = risks.reduce((sum, risk) => {
    const impactScore = riskScores[risk.riskLevel] || 1;
    const likelihoodScore = riskScores[risk.likelihood] || 1;
    return sum + impactScore * likelihoodScore;
  }, 0);

  return Math.round((totalScore / risks.length) * 10) / 10;
}

function getOverallRiskLevel(score: number): RiskLevel {
  if (score >= 12) return "critical";
  if (score >= 9) return "high";
  if (score >= 6) return "medium";
  return "low";
}

function validateAssessment(
  projectName: string,
  dataTypes: string[],
  risks: PrivacyRisk[],
  mitigations: Mitigation[]
): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!projectName || projectName.trim() === "") {
    errors.push("Project name cannot be empty");
  }

  if (dataTypes.length === 0) {
    warnings.push("No data types specified");
  }

  risks.forEach((risk, index) => {
    if (!risk.description || risk.description.trim() === "") {
      errors.push(`Risk ${index + 1} must have a description`);
    }

    if (risk.riskLevel === "critical" || risk.riskLevel === "high") {
      const hasMitigation = mitigations.some((m) => m.riskId === risk.id);
      if (!hasMitigation) {
        warnings.push(`High/critical risk "${risk.description}" should have a mitigation plan`);
      }
    }
  });

  mitigations.forEach((mitigation) => {
    const riskExists = risks.some((r) => r.id === mitigation.riskId);
    if (!riskExists) {
      errors.push(`Mitigation references non-existent risk: ${mitigation.riskId}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

function getRelevantFrameworks(dataTypes: string[], risks: PrivacyRisk[]): ComplianceFramework[] {
  const frameworks: ComplianceFramework[] = [];

  const hasPersonalData = dataTypes.some((dt) =>
    dt.toLowerCase().includes("personal") || dt.toLowerCase().includes("pii")
  );
  const hasHealthData = dataTypes.some((dt) => dt.toLowerCase().includes("health") || dt.toLowerCase().includes("medical"));

  if (hasPersonalData) {
    frameworks.push("GDPR", "CCPA");
  }
  if (hasHealthData) {
    frameworks.push("HIPAA");
  }
  if (risks.some((r) => r.dataCategory === "sensitive" || r.dataCategory === "confidential")) {
    frameworks.push("PIPEDA", "LGPD");
  }

  return Array.from(new Set(frameworks));
}

function generateAssessmentReport(
  projectName: string,
  dataTypes: string[],
  risks: PrivacyRisk[],
  mitigations: Mitigation[],
  frameworks: ComplianceFramework[]
): string {
  let report = `PRIVACY IMPACT ASSESSMENT\n`;
  report += `=========================\n\n`;
  report += `Project: ${projectName}\n`;
  report += `Generated: ${new Date().toISOString()}\n\n`;

  const score = calculatePrivacyScore(risks);
  const overallRisk = getOverallRiskLevel(score);

  report += `EXECUTIVE SUMMARY\n`;
  report += `=================\n`;
  report += `Overall Privacy Risk Score: ${score}/16\n`;
  report += `Overall Risk Level: ${overallRisk.toUpperCase()}\n`;
  report += `Total Risks Identified: ${risks.length}\n`;
  report += `Total Mitigations: ${mitigations.length}\n`;
  report += `Relevant Frameworks: ${frameworks.join(", ") || "None identified"}\n\n`;

  report += `DATA TYPES\n`;
  report += `==========\n`;
  if (dataTypes.length > 0) {
    dataTypes.forEach((dt, index) => {
      report += `${index + 1}. ${dt}\n`;
    });
  } else {
    report += `No data types specified\n`;
  }

  report += `\n\nPRIVACY RISKS\n`;
  report += `=============\n\n`;

  const riskOrder: RiskLevel[] = ["critical", "high", "medium", "low"];
  riskOrder.forEach((level) => {
    const levelRisks = risks.filter((r) => r.riskLevel === level);
    if (levelRisks.length > 0) {
      report += `${level.toUpperCase()} RISKS\n`;
      report += `${"-".repeat(level.length + 6)}\n\n`;

      levelRisks.forEach((risk, index) => {
        report += `${index + 1}. ${risk.description}\n`;
        report += `   Category: ${risk.dataCategory}\n`;
        report += `   Impact: ${risk.impact || "Not specified"}\n`;
        report += `   Likelihood: ${risk.likelihood}\n`;

        const riskMitigations = mitigations.filter((m) => m.riskId === risk.id);
        if (riskMitigations.length > 0) {
          report += `   Mitigations:\n`;
          riskMitigations.forEach((mit) => {
            report += `     - ${mit.description} (Effectiveness: ${mit.effectiveness})\n`;
          });
        } else {
          report += `   Mitigations: None specified\n`;
        }
        report += `\n`;
      });
    }
  });

  report += `\n--- END OF ASSESSMENT ---\n`;
  return report;
}

export const POST = createToolExecutionHandler({
  toolId: "data-studio-privacy",
  executeTool: async (userId, body) => {
    const executionStart = Date.now();
    const projectName = body.projectName || body.name || "Untitled Project";
    const dataTypes: string[] = body.dataTypes || [];
    const risks: PrivacyRisk[] = body.privacyRisks || body.risks || [];
    const mitigations: Mitigation[] = body.mitigations || [];

    const validation = validateAssessment(projectName, dataTypes, risks, mitigations);

    if (!validation.valid) {
      return {
        result: {
          success: false,
          errors: validation.errors,
          warnings: validation.warnings,
          assessment: {
            project: projectName,
            dataTypes,
            risks,
            mitigations,
          },
        },
        actualUsage: {
          cpuMs: Date.now() - executionStart,
          memMb: 150,
          durationMs: Date.now() - executionStart,
        },
      };
    }

    const frameworks = getRelevantFrameworks(dataTypes, risks);
    const score = calculatePrivacyScore(risks);
    const overallRisk = getOverallRiskLevel(score);
    const report = generateAssessmentReport(projectName, dataTypes, risks, mitigations, frameworks);

    await new Promise((resolve) => setTimeout(resolve, 250));

    return {
      result: {
        success: true,
        assessment: {
          project: projectName,
          dataTypes,
          risks,
          mitigations,
          compliance: frameworks,
          privacyScore: score,
          overallRiskLevel: overallRisk,
          report,
          summary: {
            totalRisks: risks.length,
            byLevel: risks.reduce((acc, r) => {
              acc[r.riskLevel] = (acc[r.riskLevel] || 0) + 1;
              return acc;
            }, {} as Record<string, number>),
            totalMitigations: mitigations.length,
          },
          validation: {
            valid: true,
            warnings: validation.warnings,
          },
          toolId: "data-studio-privacy",
          timestamp: new Date().toISOString(),
        },
      },
      actualUsage: {
        cpuMs: Date.now() - executionStart,
        memMb: 150,
        durationMs: Date.now() - executionStart,
      },
    };
  },
});
