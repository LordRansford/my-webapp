import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { getCpdState } from "@/lib/auth/store";
import { getUserAnalytics } from "@/lib/analytics/store";
import { deriveLearningRecord, upsertLearningRecord } from "@/lib/learning/records";
import { getCourseLevelMeta } from "@/lib/cpd/courseEvidence";
import { withRequestLogging } from "@/lib/security/requestLog";
import { requireSameOrigin } from "@/lib/security/origin";
import { rateLimit } from "@/lib/security/rateLimit";

function totalSectionsFromCpdState(state: any, trackId: string, levelId: string) {
  // Use unique sectionIds seen in stored CPD state as a lower bound.
  const ids = new Set(
    (state?.sections || [])
      .filter((s: any) => s.trackId === trackId && s.levelId === levelId && s.sectionId !== "overall")
      .map((s: any) => String(s.sectionId))
  );
  return ids.size;
}

function mapCourseToTrack(courseId: string) {
  if (courseId === "cybersecurity") return "cyber";
  if (courseId === "software-architecture") return "software-architecture";
  if (courseId === "digitalisation") return "digitalisation";
  if (courseId === "data") return "data";
  return "ai";
}

export async function POST(req: Request) {
  return withRequestLogging(req, { route: "POST /api/learning/records/refresh" }, async () => {
    const originBlock = requireSameOrigin(req);
    if (originBlock) return originBlock;
    const limited = rateLimit(req, { keyPrefix: "learning-records-refresh", limit: 20, windowMs: 60_000 });
    if (limited) return limited;

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = (await req.json().catch(() => null)) as any;
    const courseId = String(body?.courseId || "").trim();
    const levelId = String(body?.levelId || "").trim();
    if (!courseId || !levelId) return NextResponse.json({ message: "Missing courseId or levelId" }, { status: 400 });

    const row = getCpdState(session.user.id);
    const cpdState = row?.stateJson ? JSON.parse(row.stateJson) : { sections: [], activity: [] };
    const analytics = getUserAnalytics(session.user.id);

    // Derive completion signals:
    const trackId = mapCourseToTrack(courseId);

    // Count section completions from both CPD state and analytics events (deduped).
    const completedFromCpd = new Set(
      (cpdState.sections || [])
        .filter((s: any) => s.trackId === trackId && s.levelId === levelId && s.completed && s.sectionId !== "overall")
        .map((s: any) => `${trackId}:${levelId}:${String(s.sectionId)}`)
    );
    const completedFromAnalytics = new Set(
      (analytics.events || [])
        .filter((e: any) => e.type === "section_completed" && e.trackId === trackId && e.levelId === levelId)
        .map((e: any) => `${trackId}:${levelId}:${String(e.sectionId)}`)
    );
    const completedSectionKeys = new Set([...completedFromCpd].filter((k) => completedFromAnalytics.has(k)));

    const quizIdsCompleted = new Set(
      (analytics.events || [])
        .filter((e: any) => e.type === "quiz_completed" && e.trackId === trackId && e.levelId === levelId)
        .map((e: any) => String(e.quizId || ""))
        .filter(Boolean)
    );

    const toolIdsUsed = new Set(
      (analytics.events || [])
        .filter((e: any) => e.type === "tool_used" && e.trackId === trackId && e.levelId === levelId)
        .map((e: any) => String(e.toolId || ""))
        .filter(Boolean)
    );

    const totalSections = totalSectionsFromCpdState(cpdState, trackId, levelId);
    const meta = getCourseLevelMeta(courseId as any, levelId as any);
    const estimatedMinutes = Math.round((Number(meta?.estimatedHours || 0) || 0) * 60);

    const record = deriveLearningRecord({
      userId: session.user.id,
      courseId,
      levelId,
      totalSections,
      completedSectionKeys,
      quizIdsCompleted,
      toolIdsUsed,
      estimatedMinutes,
    });

    upsertLearningRecord(record);
    console.info("learning:record_refreshed", { userId: session.user.id, courseId, levelId, status: record.completionStatus });

    return NextResponse.json({ record }, { status: 200 });
  });
}


