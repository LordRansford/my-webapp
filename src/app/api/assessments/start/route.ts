import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";
import { withRequestLogging } from "@/lib/security/requestLog";
import { requireSameOrigin } from "@/lib/security/origin";
import { rateLimit } from "@/lib/security/rateLimit";
import { enforceCreditGate, creditGateErrorResponse } from "@/lib/credits/enforceCreditGate";
import { getAssessmentAttemptCredits } from "@/lib/cpd/assessmentCredits";
import { getActiveCourseVersion } from "@/lib/cpd/courseVersion";

type Body = {
  courseId?: string;
  levelId?: string;
  certificateName?: string;
};

const ALLOWED_COURSES = new Set(["cybersecurity"]);
const ALLOWED_LEVELS = new Set(["foundations", "applied", "practice"]);

const BLUEPRINT: Record<string, Array<{ domain: string; count: number }>> = {
  foundations: [
    { domain: "basics", count: 10 },
    { domain: "identity", count: 10 },
    { domain: "network", count: 10 },
    { domain: "crypto", count: 8 },
    { domain: "risk", count: 6 },
    { domain: "response", count: 6 },
  ],
  applied: [
    { domain: "web", count: 16 },
    { domain: "api", count: 10 },
    { domain: "auth", count: 8 },
    { domain: "secrets", count: 6 },
    { domain: "cloud", count: 5 },
    { domain: "logging", count: 5 },
  ],
  practice: [
    { domain: "sdlc", count: 10 },
    { domain: "zero-trust", count: 8 },
    { domain: "runtime", count: 8 },
    { domain: "vulnerability", count: 8 },
    { domain: "detection", count: 8 },
    { domain: "governance", count: 8 },
  ],
};

function domainFromTags(tags: string) {
  const parts = String(tags || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const p of parts) {
    if (p.startsWith("domain:")) return p.slice("domain:".length);
  }
  return "";
}

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

function parseJsonArray(value: string) {
  try {
    const v = JSON.parse(value);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
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
    const courseVersion = getActiveCourseVersion(courseId);
    const versionTag = `v:${courseVersion}`;

    const recentAttempts = await prisma.assessmentAttempt.findMany({
      where: { userId, assessmentId: assessment.id, courseVersion },
      orderBy: { completedAt: "desc" },
      take: 2,
      select: { questionIds: true },
    });
    const lastAttemptIds = recentAttempts[0]?.questionIds ? parseJsonArray(recentAttempts[0].questionIds) : [];
    const avoid = new Set<string>();
    if (recentAttempts[1]?.questionIds) {
      for (const id of parseJsonArray(recentAttempts[1].questionIds || "[]")) avoid.add(String(id));
    }

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

    const pool = await prisma.question.findMany({
      where: {
        assessmentId: assessment.id,
        AND: [{ tags: { contains: versionTag } }, { tags: { contains: "published" } }],
      },
      select: { id: true, tags: true },
      take: 500,
    });

    if (pool.length < 150) {
      return NextResponse.json({ message: "Not enough questions available for randomised attempts" }, { status: 503 });
    }

    const byDomain = new Map<string, string[]>();
    const all = pool.map((r) => ({ id: r.id, tags: String(r.tags || "") }));
    for (const row of all) {
      const d = domainFromTags(row.tags);
      if (!d) continue;
      const list = byDomain.get(d) || [];
      list.push(row.id);
      byDomain.set(d, list);
    }

    const picked: string[] = [];
    const pickedSet = new Set<string>();
    const blueprint = BLUEPRINT[levelId] || [];

    function takeFrom(list: string[], count: number) {
      const shuffled = shuffle(list);
      const primary = shuffled.filter((id) => !pickedSet.has(id) && !avoid.has(id));
      const secondary = shuffled.filter((id) => !pickedSet.has(id));
      const out: string[] = [];
      for (const id of primary) {
        if (out.length >= count) break;
        out.push(id);
      }
      if (out.length < count) {
        for (const id of secondary) {
          if (out.length >= count) break;
          if (out.includes(id)) continue;
          out.push(id);
        }
      }
      return out;
    }

    // Retake mix: include a fixed overlap of previously missed questions when possible.
    const overlapTarget = 15;
    const overlapPicked: string[] = [];
    if (lastAttemptIds.length) {
      const lastAttempt = await prisma.assessmentAttempt.findFirst({
        where: { userId, assessmentId: assessment.id, courseVersion },
        orderBy: { completedAt: "desc" },
        select: { id: true },
      });
      if (lastAttempt?.id) {
        const missed = await prisma.assessmentAttemptItem.findMany({
          where: { attemptId: lastAttempt.id, correct: false },
          select: { questionId: true },
          take: 200,
        });
        const missedIds = shuffle(missed.map((m) => m.questionId)).filter((id) => all.some((x) => x.id === id));
        overlapPicked.push(...missedIds.slice(0, overlapTarget));
      }
      // Fill overlap with random from last attempt if not enough missed
      if (overlapPicked.length < overlapTarget) {
        const remaining = shuffle(lastAttemptIds.map((x) => String(x)));
        for (const id of remaining) {
          if (overlapPicked.length >= overlapTarget) break;
          if (overlapPicked.includes(id)) continue;
          if (!all.some((x) => x.id === id)) continue;
          overlapPicked.push(id);
        }
      }
    }

    const overlapDomainCounts = new Map<string, number>();
    if (overlapPicked.length) {
      const overlapRows = all.filter((r) => overlapPicked.includes(r.id));
      for (const r of overlapRows) {
        const d = domainFromTags(r.tags);
        if (!d) continue;
        overlapDomainCounts.set(d, (overlapDomainCounts.get(d) || 0) + 1);
      }
      for (const id of overlapPicked) {
        picked.push(id);
        pickedSet.add(id);
      }
      // Avoid the rest of the last attempt so the mix feels fresh.
      for (const id of lastAttemptIds.map((x) => String(x))) {
        if (pickedSet.has(id)) continue;
        avoid.add(id);
      }
    }

    for (const b of blueprint) {
      const already = overlapDomainCounts.get(b.domain) || 0;
      const needed = Math.max(0, b.count - already);
      const list = byDomain.get(b.domain) || [];
      const out = takeFrom(list, needed);
      for (const id of out) {
        if (pickedSet.has(id)) continue;
        picked.push(id);
        pickedSet.add(id);
      }
    }

    if (picked.length < 50) {
      const fallback = takeFrom(all.map((r) => r.id), 50 - picked.length);
      for (const id of fallback) {
        if (pickedSet.has(id)) continue;
        picked.push(id);
        pickedSet.add(id);
      }
    }

    if (picked.length < 50) {
      return NextResponse.json({ message: "Not enough questions available" }, { status: 503 });
    }

    const finalPicked = shuffle(picked).slice(0, 50);

    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + timeLimitMinutes * 60_000);

    const created = await prisma.assessmentSession.create({
      data: {
        userId,
        assessmentId: assessment.id,
        questionIds: JSON.stringify(finalPicked),
        startedAt,
        expiresAt,
      },
      select: { id: true, startedAt: true, expiresAt: true },
    });

    const questions = await prisma.question.findMany({
      where: { id: { in: finalPicked } },
      select: { id: true, question: true, options: true, type: true },
    });
    const byId = new Map(questions.map((q) => [q.id, q]));
    const ordered = finalPicked.map((id) => byId.get(id)).filter(Boolean) as any[];

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

