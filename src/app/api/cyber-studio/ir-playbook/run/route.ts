import { NextRequest } from "next/server";
import { createToolExecutionHandler } from "@/lib/studios/toolExecutionHelper";

type IncidentType = "malware" | "phishing" | "data_breach" | "ddos" | "unauthorized_access" | "other";
type Severity = "low" | "medium" | "high" | "critical";

interface PlaybookStep {
  id: string;
  title: string;
  description: string;
  order: number;
  assignee?: string;
  estimatedTime?: string;
}

interface Playbook {
  name: string;
  incidentType: IncidentType;
  severity: Severity;
  steps: PlaybookStep[];
}

function validatePlaybook(playbook: Playbook): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!playbook.name || playbook.name.trim() === "") {
    errors.push("Playbook name cannot be empty");
  }

  if (playbook.steps.length === 0) {
    errors.push("Playbook must contain at least one step");
  }

  const stepOrders = new Set<number>();
  playbook.steps.forEach((step, index) => {
    if (!step.title || step.title.trim() === "") {
      errors.push(`Step ${index + 1} must have a title`);
    }

    if (stepOrders.has(step.order)) {
      errors.push(`Duplicate step order: ${step.order}`);
    } else {
      stepOrders.add(step.order);
    }

    if (!step.description || step.description.trim() === "") {
      warnings.push(`Step "${step.title || `Step ${index + 1}`}" has no description`);
    }

    if (!step.assignee || step.assignee.trim() === "") {
      warnings.push(`Step "${step.title}" has no assignee specified`);
    }

    if (playbook.severity === "critical" && !step.estimatedTime) {
      warnings.push(`Critical incident step "${step.title}" should have estimated time`);
    }
  });

  const sortedSteps = [...playbook.steps].sort((a, b) => a.order - b.order);
  for (let i = 0; i < sortedSteps.length; i++) {
    if (sortedSteps[i].order !== i + 1) {
      warnings.push(`Step order should be sequential (found gap at step ${i + 1})`);
      break;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

function generatePlaybookDocument(playbook: Playbook): string {
  let doc = `INCIDENT RESPONSE PLAYBOOK\n`;
  doc += `==========================\n\n`;
  doc += `Playbook Name: ${playbook.name}\n`;
  doc += `Incident Type: ${playbook.incidentType.replace(/_/g, " ").toUpperCase()}\n`;
  doc += `Severity: ${playbook.severity.toUpperCase()}\n`;
  doc += `Generated: ${new Date().toISOString()}\n\n`;

  doc += `OVERVIEW\n`;
  doc += `========\n`;
  doc += `This playbook provides step-by-step procedures for responding to ${playbook.incidentType.replace(/_/g, " ")} incidents of ${playbook.severity} severity.\n\n`;

  doc += `RESPONSE PROCEDURES\n`;
  doc += `===================\n\n`;

  const sortedSteps = [...playbook.steps].sort((a, b) => a.order - b.order);
  sortedSteps.forEach((step, index) => {
    doc += `STEP ${index + 1}: ${step.title}\n`;
    doc += `${"-".repeat(step.title.length + 10)}\n\n`;
    doc += `Description: ${step.description || "Not provided"}\n`;
    if (step.assignee) {
      doc += `Assignee: ${step.assignee}\n`;
    }
    if (step.estimatedTime) {
      doc += `Estimated Time: ${step.estimatedTime}\n`;
    }
    doc += `\n`;
  });

  doc += `\n--- END OF PLAYBOOK ---\n`;
  return doc;
}

export const POST = createToolExecutionHandler({
  toolId: "cyber-studio-ir-playbook",
  executeTool: async (userId, body) => {
    const executionStart = Date.now();
    const playbook: Playbook = {
      name: body.playbookName || body.name || "Incident Response Playbook",
      incidentType: body.incidentType || "malware",
      severity: body.severity || "medium",
      steps: body.procedures || body.steps || [],
    };

    const validation = validatePlaybook(playbook);

    if (!validation.valid) {
      return {
        result: {
          success: false,
          errors: validation.errors,
          warnings: validation.warnings,
          playbook,
        },
        actualUsage: {
          cpuMs: Date.now() - executionStart,
          memMb: 120,
          durationMs: Date.now() - executionStart,
        },
      };
    }

    const document = generatePlaybookDocument(playbook);

    const sortedSteps = [...playbook.steps].sort((a, b) => a.order - b.order);
    const totalEstimatedTime = sortedSteps.reduce((sum, step) => {
      if (step.estimatedTime) {
        const match = step.estimatedTime.match(/(\d+)/);
        if (match) {
          return sum + parseInt(match[1]);
        }
      }
      return sum;
    }, 0);

    const summary = {
      totalSteps: playbook.steps.length,
      stepsWithAssignees: playbook.steps.filter((s) => s.assignee && s.assignee.trim() !== "").length,
      stepsWithTimeEstimates: playbook.steps.filter((s) => s.estimatedTime && s.estimatedTime.trim() !== "").length,
      totalEstimatedTimeMinutes: totalEstimatedTime,
    };

    await new Promise((resolve) => setTimeout(resolve, 220));

    return {
      result: {
        success: true,
        playbook: {
          ...playbook,
          steps: sortedSteps,
          document,
          summary,
          validation: {
            valid: true,
            warnings: validation.warnings,
          },
          toolId: "cyber-studio-ir-playbook",
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
