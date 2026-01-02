export const ASSESSMENT_ATTEMPT_CREDITS_DEFAULT = 80;

const byCourseLevel: Record<string, number> = {
  "cybersecurity:foundations": 80,
  "cybersecurity:applied": 80,
  "cybersecurity:practice": 80,
};

export function getAssessmentAttemptCredits(params: { courseId: string; levelId: string }): number {
  const key = `${params.courseId}:${params.levelId}`;
  const v = byCourseLevel[key];
  const n = typeof v === "number" ? v : ASSESSMENT_ATTEMPT_CREDITS_DEFAULT;
  return Math.max(0, Math.round(n));
}

