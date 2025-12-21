import { ACCREDITATION_MAP } from "@/lib/cpd/accreditation-map";

export type { AccreditationMapping, AccreditorBody, LearningOutcome } from "@/lib/cpd/accreditation-map";

/**
 * Mapping layer between internal learning units and external accreditation frameworks.
 * This is intentionally table-driven so new bodies can be added without rewriting CPD logic or UI code.
 */
export const ACCREDITATION_MAPPING = ACCREDITATION_MAP;

export function listAccreditationMappings() {
  return ACCREDITATION_MAPPING;
}

export function getAccreditationForCourse(courseId: string) {
  return ACCREDITATION_MAPPING.find((m) => m.courseId === courseId);
}

export function getAccreditationForTemplate(templateId: string) {
  return ACCREDITATION_MAPPING.find((m) => m.templateId === templateId);
}


