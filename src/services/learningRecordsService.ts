import { getCpdState } from "@/lib/auth/store";
import { getUserAnalytics } from "@/lib/analytics/store";
import { deriveLearningRecord, upsertLearningRecord } from "@/lib/learning/records";
import { getCourseLevelMeta } from "@/lib/cpd/courseEvidence";
import { prisma } from "@/lib/db/prisma";
import { getActiveCourseVersion } from "@/lib/cpd/courseVersion";

export function mapCourseToTrack(courseId: string) {
  if (courseId === "cybersecurity") return "cyber";
  if (courseId === "software-architecture") return "software-architecture";
  if (courseId === "digitalisation") return "digitalisation";
  if (courseId === "data") return "data";
  return "ai";
}

function totalSectionsFromCpdState(state: any, trackId: string, levelId: string) {
  const ids = new Set(
    (state?.sections || [])
      .filter((s: any) => s.trackId === trackId && s.levelId === levelId && s.sectionId !== "overall")
      .map((s: any) => String(s.sectionId)),
  );
  return ids.size;
}

export function refreshLearningRecordForUser(params: {
  userId: string;
  courseId: string;
  levelId: string;
}) {
  const { userId, courseId, levelId } = params;

  const row = getCpdState(userId);
  const cpdState = row?.stateJson ? JSON.parse(row.stateJson) : { sections: [], activity: [] };
  const analytics = getUserAnalytics(userId);

  const trackId = mapCourseToTrack(courseId);

  // Completion signals:
  const completedFromCpd = new Set(
    (cpdState.sections || [])
      .filter((s: any) => s.trackId === trackId && s.levelId === levelId && s.completed && s.sectionId !== "overall")
      .map((s: any) => `${trackId}:${levelId}:${String(s.sectionId)}`),
  );
  const completedFromAnalytics = new Set(
    (analytics.events || [])
      .filter((e: any) => e.type === "section_completed" && e.trackId === trackId && e.levelId === levelId)
      .map((e: any) => `${trackId}:${levelId}:${String(e.sectionId)}`),
  );

  // Conservative: only count as "completed" when both sources agree.
  const completedSectionKeys = new Set([...completedFromCpd].filter((k) => completedFromAnalytics.has(k)));

  const quizIdsCompleted = new Set(
    (analytics.events || [])
      .filter((e: any) => e.type === "quiz_completed" && e.trackId === trackId && e.levelId === levelId)
      .map((e: any) => String(e.quizId || ""))
      .filter(Boolean),
  );

  const toolIdsUsed = new Set(
    (analytics.events || [])
      .filter((e: any) => e.type === "tool_used" && e.trackId === trackId && e.levelId === levelId)
      .map((e: any) => String(e.toolId || ""))
      .filter(Boolean),
  );

  const totalSections = totalSectionsFromCpdState(cpdState, trackId, levelId);
  const meta = getCourseLevelMeta(courseId as any, levelId as any);
  const estimatedMinutes = Math.round((Number(meta?.estimatedHours || 0) || 0) * 60);

  const record = deriveLearningRecord({
    userId,
    courseId,
    levelId,
    totalSections,
    completedSectionKeys,
    quizIdsCompleted,
    toolIdsUsed,
    estimatedMinutes,
  });

  const saved = upsertLearningRecord(record);

  // Persist a minimal, immutable completion marker in the database for certificates.
  // This does not lock access and does not change learning behaviour.
  if (saved.completionStatus === "completed") {
    const certCourseId = `${courseId}:${levelId}`;
    const courseVersion = getActiveCourseVersion(courseId);
    (prisma as any).courseCompletion
      .upsert({
        where: { userId_courseId_courseVersion: { userId, courseId: certCourseId, courseVersion } },
        create: { userId, courseId: certCourseId, courseVersion, completedAt: new Date(saved.completionDate || new Date().toISOString()), passed: true },
        update: { passed: true },
      })
      .catch(() => null);
  }

  return saved;
}


