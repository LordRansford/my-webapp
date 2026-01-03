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

function hasTag(tags: string, needle: string) {
  const raw = String(tags || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return raw.includes(needle);
}

export async function GET(req: Request) {
  const auth = await requireAdminJson("VIEW_ASSESSMENTS");
  if (!auth.ok) return auth.response;
  const admin = auth.session?.user;
  if (!admin?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const keySuffix = admin.email || admin.id;
  const limited = rateLimit(req, { keyPrefix: "admin-assessments-quality", limit: 30, windowMs: 60_000, keySuffix });
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
    select: { id: true, question: true, options: true, explanation: true, optionRationales: true, tags: true },
    take: 500,
  });

  const missingRationales: string[] = [];
  const rationalesMismatch: string[] = [];
  const missingPublished: string[] = [];
  const missingDomain: string[] = [];
  const shortQuestion: string[] = [];
  const shortExplanation: string[] = [];

  for (const q of rows) {
    const options = (safeJsonParse(q.options) as any) || [];
    const rationales = safeJsonParse(q.optionRationales);
    const hasPublished = hasTag(q.tags, "published");
    const hasDomain = String(q.tags || "").includes("domain:");

    if (!hasPublished) missingPublished.push(q.id);
    if (!hasDomain) missingDomain.push(q.id);
    if (String(q.question || "").trim().length < 25) shortQuestion.push(q.id);
    if (String(q.explanation || "").trim().length < 60) shortExplanation.push(q.id);

    if (!options.length) continue;
    if (!Array.isArray(rationales) || !rationales.some((x) => String(x || "").trim().length > 0)) {
      missingRationales.push(q.id);
      continue;
    }
    if (Array.isArray(rationales) && rationales.length !== options.length) {
      rationalesMismatch.push(q.id);
    }
  }

  return NextResponse.json(
    {
      courseId,
      levelId,
      version,
      totals: {
        questions: rows.length,
        missingRationales: missingRationales.length,
        rationalesMismatch: rationalesMismatch.length,
        missingPublished: missingPublished.length,
        missingDomain: missingDomain.length,
        shortQuestion: shortQuestion.length,
        shortExplanation: shortExplanation.length,
      },
      samples: {
        missingRationales: missingRationales.slice(0, 25),
        rationalesMismatch: rationalesMismatch.slice(0, 25),
        missingPublished: missingPublished.slice(0, 25),
        missingDomain: missingDomain.slice(0, 25),
        shortQuestion: shortQuestion.slice(0, 25),
        shortExplanation: shortExplanation.slice(0, 25),
      },
    },
    { status: 200 },
  );
}

