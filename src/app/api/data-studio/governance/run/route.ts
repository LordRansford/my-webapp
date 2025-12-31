import { NextRequest } from "next/server";
import { createToolExecutionHandler } from "@/lib/studios/toolExecutionHelper";

type PolicyCategory = "data_classification" | "access_control" | "retention" | "quality" | "privacy" | "security";
type PolicyStatus = "draft" | "active" | "archived";

interface GovernancePolicy {
  id: string;
  title: string;
  category: PolicyCategory;
  status: PolicyStatus;
  description: string;
  owner: string;
  lastReviewed?: string;
  content: string;
}

function validateFramework(policies: GovernancePolicy[]): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (policies.length === 0) {
    errors.push("Framework must contain at least one policy");
  }

  const policyTitles = new Set<string>();
  policies.forEach((policy, index) => {
    if (!policy.title || policy.title.trim() === "") {
      errors.push(`Policy ${index + 1} must have a title`);
    } else if (policyTitles.has(policy.title)) {
      warnings.push(`Duplicate policy title: ${policy.title}`);
    } else {
      policyTitles.add(policy.title);
    }

    if (!policy.owner || policy.owner.trim() === "") {
      errors.push(`Policy "${policy.title || `Policy ${index + 1}`}" must have an owner`);
    }

    if (!policy.content || policy.content.trim() === "") {
      warnings.push(`Policy "${policy.title}" has no content`);
    }

    if (policy.status === "active" && !policy.lastReviewed) {
      warnings.push(`Active policy "${policy.title}" should have a last reviewed date`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

function generateFrameworkDocument(frameworkName: string, policies: GovernancePolicy[]): string {
  let doc = `DATA GOVERNANCE FRAMEWORK\n`;
  doc += `========================\n\n`;
  doc += `Framework Name: ${frameworkName}\n`;
  doc += `Generated: ${new Date().toISOString()}\n\n`;

  const byCategory = policies.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const byStatus = policies.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  doc += `SUMMARY\n`;
  doc += `-------\n`;
  doc += `Total Policies: ${policies.length}\n\n`;

  doc += `By Category:\n`;
  Object.entries(byCategory).forEach(([category, count]) => {
    doc += `  ${category.replace(/_/g, " ")}: ${count}\n`;
  });

  doc += `\nBy Status:\n`;
  Object.entries(byStatus).forEach(([status, count]) => {
    doc += `  ${status}: ${count}\n`;
  });

  doc += `\n\nPOLICIES\n`;
  doc += `========\n\n`;

  const categoryOrder: PolicyCategory[] = ["data_classification", "access_control", "retention", "quality", "privacy", "security"];
  categoryOrder.forEach((category) => {
    const categoryPolicies = policies.filter((p) => p.category === category);
    if (categoryPolicies.length > 0) {
      doc += `${category.replace(/_/g, " ").toUpperCase()}\n`;
      doc += `${"=".repeat(category.length)}\n\n`;

      categoryPolicies.forEach((policy, index) => {
        doc += `${index + 1}. ${policy.title}\n`;
        doc += `   Status: ${policy.status.toUpperCase()}\n`;
        doc += `   Owner: ${policy.owner}\n`;
        if (policy.lastReviewed) {
          doc += `   Last Reviewed: ${policy.lastReviewed}\n`;
        }
        doc += `   Description: ${policy.description}\n`;
        if (policy.content) {
          doc += `   Content: ${policy.content.substring(0, 200)}${policy.content.length > 200 ? "..." : ""}\n`;
        }
        doc += `\n`;
      });
    }
  });

  doc += `\n--- END OF FRAMEWORK DOCUMENT ---\n`;
  return doc;
}

export const POST = createToolExecutionHandler({
  toolId: "data-studio-governance",
  executeTool: async (userId, body) => {
    const executionStart = Date.now();
    const frameworkName = body.frameworkName || body.name || "Untitled Framework";
    const policies: GovernancePolicy[] = body.policies || [];

    const validation = validateFramework(policies);

    if (!validation.valid) {
      return {
        result: {
          success: false,
          errors: validation.errors,
          warnings: validation.warnings,
          framework: {
            name: frameworkName,
            policies,
          },
        },
        actualUsage: {
          cpuMs: Date.now() - executionStart,
          memMb: 180,
          durationMs: Date.now() - executionStart,
        },
      };
    }

    const frameworkDoc = generateFrameworkDocument(frameworkName, policies);

    const summary = {
      totalPolicies: policies.length,
      byCategory: policies.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byStatus: policies.reduce((acc, p) => {
        acc[p.status] = (acc[p.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      activePolicies: policies.filter((p) => p.status === "active").length,
    };

    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      result: {
        success: true,
        framework: {
          name: frameworkName,
          policies,
          summary,
          document: frameworkDoc,
          validation: {
            valid: true,
            warnings: validation.warnings,
          },
          toolId: "data-studio-governance",
          timestamp: new Date().toISOString(),
        },
      },
      actualUsage: {
        cpuMs: Date.now() - executionStart,
        memMb: 180,
        durationMs: Date.now() - executionStart,
      },
    };
  },
});
