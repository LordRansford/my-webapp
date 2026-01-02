import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";
import { withRequestLogging } from "@/lib/security/requestLog";
import { requireSameOrigin } from "@/lib/security/origin";
import { rateLimit } from "@/lib/security/rateLimit";
import { enforceCreditGate, creditGateErrorResponse } from "@/lib/credits/enforceCreditGate";
import { getAssessmentAttemptCredits } from "@/lib/cpd/assessmentCredits";

type Body = {
  courseId?: string;
  levelId?: string;
  certificateName?: string;
};

const ALLOWED_COURSES = new Set(["cybersecurity"]);
const ALLOWED_LEVELS = new Set(["foundations", "applied", "practice"]);

function shuffle<T>(items: T[]) {
  const arr = items.slice();
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j] as T;
    arr[j] = tmp as T;
  }
  return arr;
}

export async function POST(req: Request) {
  return withRequestLogging(req, { route: "POST /api/assessments/start" }, async () => {
    const originBlock = requireSameOrigin(req);
    if (originBlock) return originBlock;

    const limited = rateLimit(req, { keyPrefix: "assessments-start", limit: 20, windowMs: 60_000 });
    if (limited) return limited;

    const session = await getServerSession(authOptions).catch(() => null);
    const userId = session?.user?.id || "";
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = (await req.json().catch(() => null)) as Body | null;
    const courseId = typeof body?.courseId === "string" ? body.courseId.trim() : "";
    const levelId = typeof body?.levelId === "string" ? body.levelId.trim() : "";
    const certificateName = typeof body?.certificateName === "string" ? body.certificateName.trim() : "";

    if (!courseId || !ALLOWED_COURSES.has(courseId)) {
      return NextResponse.json({ message: "Invalid courseId" }, { status: 400 });
    }
    if (!levelId || !ALLOWED_LEVELS.has(levelId)) {
      return NextResponse.json({ message: "Invalid levelId" }, { status: 400 });
    }

    if (!certificateName || certificateName.length < 2 || certificateName.length > 120) {
      return NextResponse.json({ message: "Name required" }, { status: 400 });
    }

    const existingProfile = await prisma.learnerProfile.findUnique({
      where: { userId },
      select: { certificateName: true },
    });
    if (existingProfile && existingProfile.certificateName !== certificateName) {
      return NextResponse.json({ message: "Name does not match locked value" }, { status: 409 });
    }
    if (!existingProfile) {
      await prisma.learnerProfile.create({
        data: { userId, certificateName },
        select: { userId: true },
      });
    }

    const estimatedCredits = getAssessmentAttemptCredits({ courseId, levelId });
    const gate = await enforceCreditGate(estimatedCredits, 1.0);
    if (!gate.ok) return creditGateErrorResponse(gate);

    const assessment = await prisma.assessment.findUnique({
      where: { courseId_levelId: { courseId, levelId } },
      select: { id: true, passThreshold: true, timeLimit: true },
    });
    if (!assessment) return NextResponse.json({ message: "Assessment not found" }, { status: 404 });

    const timeLimitMinutes = assessment.timeLimit ?? 75;
    const now = new Date();

    const existing = await prisma.assessmentSession.findUnique({
      where: { userId_assessmentId: { userId, assessmentId: assessment.id } },
      select: { id: true, questionIds: true, startedAt: true, expiresAt: true },
    });

    if (existing && existing.expiresAt.getTime() > now.getTime()) {
      const ids = JSON.parse(existing.questionIds || "[]") as string[];
      const questions = await prisma.question.findMany({
        where: { id: { in: ids } },
        select: { id: true, question: true, options: true, type: true },
      });
      const byId = new Map(questions.map((q) => [q.id, q]));
      const ordered = ids.map((id) => byId.get(id)).filter(Boolean) as any[];
      return NextResponse.json(
        {
          sessionId: existing.id,
          startedAt: existing.startedAt.toISOString(),
          expiresAt: existing.expiresAt.toISOString(),
          timeLimitMinutes,
          passThreshold: assessment.passThreshold,
          requiredCredits: estimatedCredits,
          questions: ordered.map((q) => ({
            id: q.id,
            type: q.type,
            question: q.question,
            options: q.options ? (JSON.parse(q.options) as string[]) : null,
          })),
        },
        { status: 200 },
      );
    }

    if (existing) {
      await prisma.assessmentSession.delete({
        where: { userId_assessmentId: { userId, assessmentId: assessment.id } },
      });
    }

    const ids = await prisma.question.findMany({
      where: { assessmentId: assessment.id },
      select: { id: true },
      take: 500,
    });
    const picked = shuffle(ids.map((r) => r.id)).slice(0, 50);
    if (picked.length < 50) {
      return NextResponse.json({ message: "Not enough questions available" }, { status: 503 });
    }

    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + timeLimitMinutes * 60_000);

    const created = await prisma.assessmentSession.create({
      data: {
        userId,
        assessmentId: assessment.id,
        questionIds: JSON.stringify(picked),
        startedAt,
        expiresAt,
      },
      select: { id: true, startedAt: true, expiresAt: true },
    });

    const questions = await prisma.question.findMany({
      where: { id: { in: picked } },
      select: { id: true, question: true, options: true, type: true },
    });
    const byId = new Map(questions.map((q) => [q.id, q]));
    const ordered = picked.map((id) => byId.get(id)).filter(Boolean) as any[];

    return NextResponse.json(
      {
        sessionId: created.id,
        startedAt: created.startedAt.toISOString(),
        expiresAt: created.expiresAt.toISOString(),
        timeLimitMinutes,
        passThreshold: assessment.passThreshold,
        requiredCredits: estimatedCredits,
        questions: ordered.map((q) => ({
          id: q.id,
          type: q.type,
          question: q.question,
          options: q.options ? (JSON.parse(q.options) as string[]) : null,
        })),
      },
      { status: 200 },
    );
  });
}

