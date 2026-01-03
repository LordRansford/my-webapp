import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";

const ALLOWED_COURSES = new Set(["cybersecurity", "network-models"]);
const ALLOWED_LEVELS = new Set(["foundations", "applied", "practice"]);

export async function GET(req: Request) {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = session?.user?.id || "";
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const courseId = String(searchParams.get("courseId") || "").trim();
  const levelId = String(searchParams.get("levelId") || "").trim();
  if (!courseId || !ALLOWED_COURSES.has(courseId)) {
    return NextResponse.json({ message: "Invalid courseId" }, { status: 400 });
  }
  if (!levelId || !ALLOWED_LEVELS.has(levelId)) {
    return NextResponse.json({ message: "Invalid levelId" }, { status: 400 });
  }

  const assessment = await prisma.assessment.findUnique({
    where: { courseId_levelId: { courseId, levelId } },
    select: { id: true, passThreshold: true, timeLimit: true },
  });
  if (!assessment) return NextResponse.json({ message: "Assessment not found" }, { status: 404 });

  const attempts = await prisma.assessmentAttempt.findMany({
    where: { userId, assessmentId: assessment.id },
    orderBy: { completedAt: "desc" },
    take: 20,
    select: { id: true, score: true, passed: true, timeSpent: true, completedAt: true },
  });

  const activeSession = await prisma.assessmentSession.findUnique({
    where: { userId_assessmentId: { userId, assessmentId: assessment.id } },
    select: { id: true, startedAt: true, expiresAt: true },
  });

  return NextResponse.json(
    {
      assessment: {
        courseId,
        levelId,
        passThreshold: assessment.passThreshold,
        timeLimitMinutes: assessment.timeLimit ?? 75,
      },
      attempts: attempts.map((a) => ({
        id: a.id,
        score: a.score,
        passed: a.passed,
        timeSpentSeconds: a.timeSpent,
        completedAt: a.completedAt.toISOString(),
      })),
      activeSession: activeSession
        ? {
            sessionId: activeSession.id,
            startedAt: activeSession.startedAt.toISOString(),
            expiresAt: activeSession.expiresAt.toISOString(),
          }
        : null,
    },
    { status: 200 },
  );
}

