import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";
import { withRequestLogging } from "@/lib/security/requestLog";
import { requireSameOrigin } from "@/lib/security/origin";
import { rateLimit } from "@/lib/security/rateLimit";
import { enforceCreditGate, creditGateErrorResponse } from "@/lib/credits/enforceCreditGate";
import { deductCreditsFromLots } from "@/lib/credits/deductFromLots";
import { createCreditUsageEvent } from "@/lib/credits/store";
import { getAssessmentAttemptCredits } from "@/lib/cpd/assessmentCredits";
import { recordEvidence } from "@/lib/cpd/evidence";
import { getActiveCourseVersion } from "@/lib/cpd/courseVersion";

type Body = {
  sessionId?: string;
  answers?: Record<string, any>;
};

function safeJsonString(value: any) {
  try {
    return JSON.stringify(value ?? null);
  } catch {
    return "{}";
  }
}

function extractChoice(raw: any) {
  if (raw == null) return null;
  if (typeof raw === "number" || typeof raw === "string") return raw;
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "object") {
    const c = (raw as any).choice;
    if (typeof c === "number" || typeof c === "string") return c;
    if (Array.isArray(c)) return c;
  }
  return null;
}

function scoreAttempt(params: {
  questions: Array<{ id: string; correctAnswer: string; options?: string | null }>;
  answers: Record<string, any>;
}) {
  let correct = 0;
  const perQuestion: Array<{ questionId: string; correct: boolean; answer: any }> = [];
  for (const q of params.questions) {
    const raw = params.answers[q.id];
    const choice = extractChoice(raw);
    const expected = JSON.parse(q.correctAnswer) as any;
    let ok = false;
    if (typeof expected === "number" && typeof choice === "number" && choice === expected) ok = true;
    if (typeof expected === "string" && typeof choice === "string" && choice === expected) ok = true;
    if (Array.isArray(expected) && Array.isArray(choice)) {
      const a = expected.slice().sort().join("|");
      const b = choice.slice().sort().join("|");
      if (a === b) ok = true;
    }
    if (ok) correct += 1;
    perQuestion.push({ questionId: q.id, correct: ok, answer: raw });
  }
  const total = params.questions.length || 1;
  const percent = Math.round((correct / total) * 100);
  return { correct, total, percent, perQuestion };
}

export async function POST(req: Request) {
  return withRequestLogging(req, { route: "POST /api/assessments/submit" }, async () => {
    const originBlock = requireSameOrigin(req);
    if (originBlock) return originBlock;

    const limited = rateLimit(req, { keyPrefix: "assessments-submit", limit: 20, windowMs: 60_000 });
    if (limited) return limited;

    const session = await getServerSession(authOptions).catch(() => null);
    const userId = session?.user?.id || "";
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = (await req.json().catch(() => null)) as Body | null;
    const sessionId = typeof body?.sessionId === "string" ? body.sessionId.trim() : "";
    const answers = body?.answers && typeof body.answers === "object" ? body.answers : null;
    if (!sessionId || !answers) return NextResponse.json({ message: "Invalid request" }, { status: 400 });

    const examSession = await prisma.assessmentSession.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        userId: true,
        assessmentId: true,
        questionIds: true,
        startedAt: true,
        expiresAt: true,
      },
    });
    if (!examSession || examSession.userId !== userId) {
      return NextResponse.json({ message: "Session not found" }, { status: 404 });
    }

    const now = new Date();
    if (examSession.expiresAt.getTime() <= now.getTime()) {
      await prisma.assessmentSession.delete({ where: { id: examSession.id } }).catch(() => null);
      return NextResponse.json({ message: "Session expired" }, { status: 409 });
    }

    const assessment = await prisma.assessment.findUnique({
      where: { id: examSession.assessmentId },
      select: { id: true, courseId: true, levelId: true, passThreshold: true, timeLimit: true },
    });
    if (!assessment) {
      await prisma.assessmentSession.delete({ where: { id: examSession.id } }).catch(() => null);
      return NextResponse.json({ message: "Assessment not found" }, { status: 404 });
    }

    const estimatedCredits = getAssessmentAttemptCredits({ courseId: assessment.courseId, levelId: assessment.levelId });
    const gate = await enforceCreditGate(estimatedCredits, 1.0);
    if (!gate.ok) return creditGateErrorResponse(gate);

    const questionIds = JSON.parse(examSession.questionIds || "[]") as string[];
    const questions = await prisma.question.findMany({
      where: { id: { in: questionIds } },
      select: { id: true, question: true, options: true, correctAnswer: true, explanation: true, optionRationales: true, tags: true, type: true },
    });
    const byId = new Map(questions.map((q) => [q.id, q]));
    const ordered = questionIds.map((id) => byId.get(id)).filter(Boolean) as any[];

    const scored = scoreAttempt({ questions: ordered, answers });
    const passed = scored.percent >= assessment.passThreshold;

    const timeSpentSeconds = Math.max(0, Math.round((now.getTime() - examSession.startedAt.getTime()) / 1000));
    const courseVersion = getActiveCourseVersion(assessment.courseId);

    const deducted = await deductCreditsFromLots({ userId, credits: estimatedCredits });
    if (!deducted.ok) {
      return NextResponse.json({ message: "Insufficient credits" }, { status: 402 });
    }

    const attempt = await prisma.assessmentAttempt.create({
      data: {
        userId,
        assessmentId: assessment.id,
        courseVersion,
        questionIds: examSession.questionIds || "[]",
        score: scored.percent,
        passed,
        answers: safeJsonString(answers),
        timeSpent: timeSpentSeconds,
      },
      select: { id: true, score: true, passed: true, completedAt: true },
    });

    if (Array.isArray(scored.perQuestion) && scored.perQuestion.length) {
      await prisma.assessmentAttemptItem
        .createMany({
          data: scored.perQuestion.map((p) => ({
            attemptId: attempt.id,
            questionId: p.questionId,
            correct: Boolean(p.correct),
            answer: p.answer === undefined ? null : safeJsonString(p.answer),
          })),
          skipDuplicates: true,
        })
        .catch(() => null);
    }

    await prisma.assessmentSession.delete({ where: { id: examSession.id } }).catch(() => null);

    await createCreditUsageEvent({
      userId,
      toolId: "assessment-attempt",
      consumed: estimatedCredits,
      units: estimatedCredits,
      freeUnits: 0,
      paidUnits: estimatedCredits,
      runId: attempt.id,
      baseFree: false,
      estimatedCredits,
      actualCredits: estimatedCredits,
      meteringUnit: "fixed",
      durationMs: timeSpentSeconds * 1000,
      inputBytes: 0,
      outputBytes: 0,
      freeTierAppliedMs: 0,
      paidMs: 0,
    }).catch(() => null);

    const forwarded = req.headers.get("x-forwarded-for") || "";
    const ip = forwarded.split(",")[0]?.trim() || req.headers.get("x-real-ip") || null;
    const userAgent = req.headers.get("user-agent") || null;

    await recordEvidence({
      userId,
      courseId: assessment.courseId,
      evidenceType: "quiz",
      payload: {
        kind: "assessment",
        levelId: assessment.levelId,
        assessmentId: assessment.id,
        attemptId: attempt.id,
        score: attempt.score,
        passed: attempt.passed,
        timeSpentSeconds,
      },
      requestMeta: { ip, userAgent },
    }).catch(() => null);

    let completionWritten = false;
    if (passed) {
      const completionCourseId = `${assessment.courseId}:${assessment.levelId}`;
      await (prisma as any).courseCompletion
        .upsert({
          where: { userId_courseId_courseVersion: { userId, courseId: completionCourseId, courseVersion } },
          create: {
            userId,
            courseId: completionCourseId,
            courseVersion,
            completedAt: now,
            score: scored.percent,
            passed: true,
          },
          update: { completedAt: now, score: scored.percent, passed: true },
        })
        .catch(() => null);
      completionWritten = true;
    }

    const review = ordered.map((q) => {
      const userAnswer = answers[q.id];
      const choice = extractChoice(userAnswer);
      const expected = JSON.parse(q.correctAnswer);
      const ok =
        (typeof expected === "number" && typeof choice === "number" && choice === expected) ||
        (typeof expected === "string" && typeof choice === "string" && choice === expected) ||
        (Array.isArray(expected) &&
          Array.isArray(choice) &&
          expected.slice().sort().join("|") === choice.slice().sort().join("|"));

      return {
        id: q.id,
        question: q.question,
        options: q.options ? (JSON.parse(q.options) as string[]) : null,
        userAnswer,
        correctAnswer: expected,
        correct: ok,
        explanation: q.explanation,
        optionRationales: q.optionRationales ? (JSON.parse(q.optionRationales) as string[]) : null,
        tags: q.tags,
        type: q.type,
      };
    });

    return NextResponse.json(
      {
        ok: true,
        attempt: {
          id: attempt.id,
          score: attempt.score,
          passed: attempt.passed,
          completedAt: attempt.completedAt.toISOString(),
          timeSpentSeconds,
        },
        assessment: {
          courseId: assessment.courseId,
          levelId: assessment.levelId,
          passThreshold: assessment.passThreshold,
          timeLimitMinutes: assessment.timeLimit ?? 75,
        },
        completionWritten,
        certificateCourseId: passed ? `${assessment.courseId}:${assessment.levelId}` : null,
        review,
      },
      { status: 200 },
    );
  });
}

