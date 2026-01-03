import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireSameOrigin } from "@/lib/security/origin";
import { requireAdminJson } from "@/lib/security/adminAuth";
import { rateLimit } from "@/lib/security/rateLimit";

const ALLOWED_COURSES = new Set(["cybersecurity", "network-models"]);
const ALLOWED_LEVELS = new Set(["foundations", "applied", "practice"]);

function parsePublished(tags: string) {
  const set = new Set(
    String(tags || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
  return set.has("published");
}

function safeJsonParse(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const auth = await requireAdminJson("VIEW_ASSESSMENTS");
  if (!auth.ok) return auth.response;
  const admin = auth.session?.user;
  if (!admin?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const keySuffix = admin.email || admin.id;
  const limited = rateLimit(req, { keyPrefix: "admin-assessments-questions", limit: 60, windowMs: 60_000, keySuffix });
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
    select: { id: true, passThreshold: true, timeLimit: true },
  });
  if (!assessment) return NextResponse.json({ error: "Assessment not found" }, { status: 404 });

  const versionTag = `v:${version}`;
  const questions = await prisma.question.findMany({
    where: { assessmentId: assessment.id, tags: { contains: versionTag } },
    orderBy: { createdAt: "asc" },
    select: { id: true, type: true, bloomLevel: true, question: true, options: true, correctAnswer: true, explanation: true, optionRationales: true, tags: true },
    take: 500,
  });

  return NextResponse.json(
    {
      assessmentId: assessment.id,
      courseId,
      levelId,
      version,
      passThreshold: assessment.passThreshold,
      timeLimitMinutes: assessment.timeLimit ?? 75,
      questions: questions.map((q) => ({
        id: q.id,
        type: q.type,
        bloomLevel: q.bloomLevel,
        question: q.question,
        options: q.options ? (safeJsonParse(q.options) as any) : null,
        correctAnswer: safeJsonParse(q.correctAnswer),
        explanation: q.explanation,
        optionRationales: q.optionRationales ? (safeJsonParse(q.optionRationales) as any) : null,
        tags: q.tags,
        published: parsePublished(q.tags),
      })),
    },
    { status: 200 },
  );
}

export async function POST(req: Request) {
  const originBlock = requireSameOrigin(req);
  if (originBlock) return originBlock;

  const auth = await requireAdminJson("MANAGE_ASSESSMENTS");
  if (!auth.ok) return auth.response;
  const admin = auth.session?.user;
  if (!admin?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const keySuffix = admin.email || admin.id;
  const limited = rateLimit(req, { keyPrefix: "admin-assessments-create", limit: 30, windowMs: 60_000, keySuffix });
  if (limited) return limited;

  const body = (await req.json().catch(() => null)) as any;
  const courseId = String(body?.courseId || "").trim();
  const levelId = String(body?.levelId || "").trim();
  const version = String(body?.version || "").trim();
  const question = String(body?.question || "").trim();
  const explanation = String(body?.explanation || "").trim();
  const options = Array.isArray(body?.options) ? body.options.map((x: any) => String(x || "").trim()).filter(Boolean) : null;
  const correctIndex = Number(body?.correctIndex);
  const bloomLevel = Math.max(1, Math.min(6, Number(body?.bloomLevel) || 1));
  const tags = String(body?.tags || "").trim();
  const reason = String(body?.reason || "").trim();

  if (!reason) return NextResponse.json({ error: "reason required" }, { status: 400 });
  if (!courseId || !ALLOWED_COURSES.has(courseId)) return NextResponse.json({ error: "Invalid courseId" }, { status: 400 });
  if (!levelId || !ALLOWED_LEVELS.has(levelId)) return NextResponse.json({ error: "Invalid levelId" }, { status: 400 });
  if (!version || version.length > 20) return NextResponse.json({ error: "Invalid version" }, { status: 400 });
  if (!question || question.length < 10) return NextResponse.json({ error: "Invalid question" }, { status: 400 });
  if (!explanation || explanation.length < 10) return NextResponse.json({ error: "Invalid explanation" }, { status: 400 });
  if (!options || options.length < 2) return NextResponse.json({ error: "Invalid options" }, { status: 400 });
  if (!Number.isFinite(correctIndex) || correctIndex < 0 || correctIndex >= options.length) {
    return NextResponse.json({ error: "Invalid correctIndex" }, { status: 400 });
  }

  const assessment = await prisma.assessment.findUnique({
    where: { courseId_levelId: { courseId, levelId } },
    select: { id: true },
  });
  if (!assessment) return NextResponse.json({ error: "Assessment not found" }, { status: 404 });

  const versionTag = `v:${version}`;
  const mergedTags = [tags, versionTag].filter(Boolean).join(", ");

  const created = await prisma.question.create({
    data: {
      assessmentId: assessment.id,
      type: "MCQ",
      bloomLevel,
      difficultyTarget: 0.6,
      discriminationIndex: null,
      question,
      options: JSON.stringify(options),
      correctAnswer: JSON.stringify(correctIndex),
      explanation,
      tags: mergedTags,
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, questionId: created.id }, { status: 200 });
}

