import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdminJson } from "@/lib/security/adminAuth";
import { rateLimit } from "@/lib/security/rateLimit";

const ALLOWED_COURSES = new Set(["cybersecurity", "network-models"]);
const ALLOWED_LEVELS = new Set(["foundations", "applied", "practice"]);

function safeJsonParse(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function scoreOne(expectedRaw: string, actual: any) {
  const expected = safeJsonParse(expectedRaw);
  if (typeof expected === "number" && typeof actual === "number") return expected === actual;
  if (typeof expected === "string" && typeof actual === "string") return expected === actual;
  if (Array.isArray(expected) && Array.isArray(actual)) {
    return expected.slice().sort().join("|") === actual.slice().sort().join("|");
  }
  return false;
}

export async function GET(req: Request) {
  const auth = await requireAdminJson("VIEW_ASSESSMENTS");
  if (!auth.ok) return auth.response;
  const admin = auth.session?.user;
  if (!admin?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const keySuffix = admin.email || admin.id;
  const limited = rateLimit(req, { keyPrefix: "admin-assessments-analysis", limit: 30, windowMs: 60_000, keySuffix });
  if (limited) return limited;

  const { searchParams } = new URL(req.url);
  const courseId = String(searchParams.get("courseId") || "").trim();
  const levelId = String(searchParams.get("levelId") || "").trim();
  const version = String(searchParams.get("version") || "").trim();

  if (!courseId || !ALLOWED_COURSES.has(courseId)) return NextResponse.json({ error: "Invalid courseId" }, { status: 400 });
  if (!levelId || !ALLOWED_LEVELS.has(levelId)) return NextResponse.json({ error: "Invalid levelId" }, { status: 400 });
  if (!version || version.length > 20) return NextResponse.json({ error: "Invalid version" }, { status: 400 });

  const assessment = await prisma.assessment.findUnique({
    where: { courseId_levelId: { courseId, levelId } },
    select: { id: true },
  });
  if (!assessment) return NextResponse.json({ error: "Assessment not found" }, { status: 404 });

  const attempts = await prisma.assessmentAttempt.findMany({
    where: { assessmentId: assessment.id, courseVersion: version },
    orderBy: { completedAt: "desc" },
    take: 200,
    select: { id: true, score: true, passed: true, answers: true },
  });

  const total = attempts.length;
  const passed = attempts.filter((a) => a.passed).length;
  const avgScore = total ? Math.round(attempts.reduce((s, a) => s + (a.score || 0), 0) / total) : 0;
  const passRatePercent = total ? Math.round((passed / total) * 100) : 0;

  const versionTag = `v:${version}`;
  const questions = await prisma.question.findMany({
    where: { assessmentId: assessment.id, tags: { contains: versionTag } },
    select: { id: true, correctAnswer: true },
    take: 500,
  });
  const correctById = new Map(questions.map((q) => [q.id, q.correctAnswer]));

  const counters = new Map<string, { attempts: number; correct: number }>();
  for (const a of attempts) {
    const answers = safeJsonParse(a.answers) as any;
    if (!answers || typeof answers !== "object") continue;
    for (const [qid, raw] of Object.entries(answers)) {
      const expectedRaw = correctById.get(String(qid));
      if (!expectedRaw) continue;
      const entry = counters.get(String(qid)) || { attempts: 0, correct: 0 };
      entry.attempts += 1;
      if (scoreOne(expectedRaw, raw)) entry.correct += 1;
      counters.set(String(qid), entry);
    }
  }

  const perQuestion = Array.from(counters.entries())
    .map(([questionId, v]) => ({
      questionId,
      attempts: v.attempts,
      correct: v.correct,
      correctRatePercent: v.attempts ? Math.round((v.correct / v.attempts) * 100) : 0,
    }))
    .sort((a, b) => a.correctRatePercent - b.correctRatePercent)
    .slice(0, 50);

  return NextResponse.json(
    {
      attempts: { total, passed, passRatePercent, avgScore },
      perQuestion,
    },
    { status: 200 },
  );
}

