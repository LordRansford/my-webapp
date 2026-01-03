import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdminJson } from "@/lib/security/adminAuth";
import { rateLimit } from "@/lib/security/rateLimit";

const ALLOWED_COURSES = new Set(["cybersecurity"]);
const ALLOWED_LEVELS = new Set(["foundations", "applied", "practice"]);

function safeJsonParse(value: string | null) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function letter(i: number) {
  const letters = ["A", "B", "C", "D", "E", "F"];
  return letters[i] || String(i + 1);
}

function toLines(s: string) {
  return String(s || "")
    .split("\n")
    .map((x) => x.trimEnd());
}

export async function GET(req: Request) {
  const auth = await requireAdminJson("VIEW_ASSESSMENTS");
  if (!auth.ok) return auth.response;
  const admin = auth.session?.user;
  if (!admin?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const keySuffix = admin.email || admin.id;
  const limited = rateLimit(req, { keyPrefix: "admin-assessments-answerkey", limit: 15, windowMs: 60_000, keySuffix });
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

  const versionTag = `v:${version}`;
  const rows = await prisma.question.findMany({
    where: { assessmentId: assessment.id, tags: { contains: versionTag } },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      question: true,
      options: true,
      correctAnswer: true,
      explanation: true,
      optionRationales: true,
      tags: true,
      bloomLevel: true,
      type: true,
    },
    take: 500,
  });

  const out: string[] = [];
  out.push(`# Answer key`);
  out.push(``);
  out.push(`Course ${courseId}`);
  out.push(`Level ${levelId}`);
  out.push(`Version ${version}`);
  out.push(`Generated ${new Date().toISOString()}`);
  out.push(``);
  out.push(`Notes`);
  out.push(`1. This sheet is for internal review and marking support.`);
  out.push(`2. Each question includes the correct answer and rationales.`);
  out.push(`3. Option rationales can be improved in the admin editor.`);
  out.push(``);

  let n = 1;
  for (const q of rows) {
    const options = (safeJsonParse(q.options) as any) || [];
    const correct = safeJsonParse(q.correctAnswer);
    const rationales = (safeJsonParse(q.optionRationales) as any) || null;

    const correctIndex = typeof correct === "number" ? correct : null;

    out.push(`## Q${n}`);
    out.push(``);
    out.push(`ID ${q.id}`);
    out.push(`Type ${q.type}`);
    out.push(`Bloom ${q.bloomLevel}`);
    out.push(`Tags ${q.tags}`);
    out.push(``);
    out.push(`Question`);
    out.push(...toLines(q.question));
    out.push(``);

    out.push(`Options`);
    for (let i = 0; i < options.length; i += 1) {
      out.push(`${letter(i)}. ${String(options[i])}`);
    }
    out.push(``);

    if (correctIndex != null) {
      out.push(`Correct answer ${letter(correctIndex)}`);
    } else {
      out.push(`Correct answer ${String(correct)}`);
    }
    out.push(``);
    out.push(`Why this is correct`);
    out.push(...toLines(q.explanation));
    out.push(``);
    out.push(`Why other options are wrong`);
    for (let i = 0; i < options.length; i += 1) {
      const opt = String(options[i]);
      const isCorrect = correctIndex != null ? i === correctIndex : false;
      const stored = Array.isArray(rationales) ? String(rationales[i] || "").trim() : "";
      if (isCorrect) {
        out.push(`${letter(i)}. Correct. ${stored ? stored : q.explanation}`);
      } else {
        const fallback = stored
          ? stored
          : `Incorrect. This option is plausible but it does not best answer the question. It does not address the main decision or control needed.`;
        out.push(`${letter(i)}. ${opt}. ${fallback}`);
      }
    }
    out.push(``);
    n += 1;
  }

  const body = out.join("\n");
  const file = `answer-key-${courseId}-${levelId}-${version}.md`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${file}"`,
    },
  });
}

