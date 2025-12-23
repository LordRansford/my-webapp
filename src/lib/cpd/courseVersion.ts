const DEFAULT_VERSION = "2025.01";

export const activeCourseVersionByCourseId: Record<string, string> = {
  ai: DEFAULT_VERSION,
  cybersecurity: DEFAULT_VERSION,
  "software-architecture": DEFAULT_VERSION,
  data: DEFAULT_VERSION,
  digitalisation: DEFAULT_VERSION,
};

export function getActiveCourseVersion(courseId: string) {
  const v = activeCourseVersionByCourseId[courseId];
  return typeof v === "string" && v.trim() ? v.trim() : DEFAULT_VERSION;
}


