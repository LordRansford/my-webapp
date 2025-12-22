import { ArchitectureDiagramInputSchema } from "../schema";
import type { ArchitectureTemplate, ArchitectureTemplateId } from "./types";
import { kidsSchoolLibraryTemplate } from "./kids-school-library";
import { studentsTodoLoginTemplate } from "./students-todo-login";
import { proPaymentsPlatformTemplate } from "./pro-payments-platform";
import { cyberZeroTrustWebAppTemplate } from "./cyber-zero-trust-web-app";
import { dataAnalyticsPipelineTemplate } from "./data-analytics-pipeline";

export const ARCHITECTURE_TEMPLATES: ArchitectureTemplate[] = [
  kidsSchoolLibraryTemplate,
  studentsTodoLoginTemplate,
  proPaymentsPlatformTemplate,
  cyberZeroTrustWebAppTemplate,
  dataAnalyticsPipelineTemplate,
];

export function getArchitectureTemplate(id: ArchitectureTemplateId) {
  return ARCHITECTURE_TEMPLATES.find((t) => t.id === id) || null;
}

export function validateArchitectureTemplates() {
  const problems: string[] = [];
  for (const t of ARCHITECTURE_TEMPLATES) {
    const parsed = ArchitectureDiagramInputSchema.safeParse(t.input);
    if (!parsed.success) {
      problems.push(`Template ${t.id} failed validation.`);
    }
  }
  return { ok: problems.length === 0, problems };
}


