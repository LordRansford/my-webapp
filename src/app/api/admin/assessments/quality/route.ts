import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdminJson } from "@/lib/security/adminAuth";
import { rateLimit } from "@/lib/security/rateLimit";

const ALLOWED_COURSES = new Set(["cybersecurity"]);
const ALLOWED_LEVELS = new Set(["foundations", "applied", "practice"]);
const ALLOWED_DOMAINS: Record<string, Set<string>> = {
  foundations: new Set(["basics", "identity", "network", "crypto", "risk", "response"]),
  applied: new Set(["web", "api", "auth", "secrets", "cloud", "logging"]),
  practice: new Set(["sdlc", "zero-trust", "runtime", "vulnerability", "detection", "governance"]),
};

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

function extractDomains(tags: string) {
  const raw = String(tags || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const out: string[] = [];
  for (const t of raw) {
    if (t.startsWith("domain:")) out.push(t.slice("domain:".length));
  }
  return out.filter(Boolean);
}

function normaliseOption(text: string) {
  return String(text || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s]/g, "")
    .trim();
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
    select: { id: true, question: true, options: true, correctAnswer: true, explanation: true, optionRationales: true, tags: true, type: true },
    take: 500,
  });

  const missingRationales: string[] = [];
  const rationalesMismatch: string[] = [];
  const missingPublished: string[] = [];
  const missingDomain: string[] = [];
  const multipleDomains: string[] = [];
  const invalidDomain: string[] = [];
  const invalidCorrectAnswer: string[] = [];
  const invalidCorrectIndex: string[] = [];
  const duplicateOptions: string[] = [];
  const emptyOptionText: string[] = [];
  const weakRationales: string[] = [];
  const containsAllOfTheAbove: string[] = [];
  const containsNoneOfTheAbove: string[] = [];
  const negativeWording: string[] = [];
  const shortQuestion: string[] = [];
  const shortExplanation: string[] = [];

  for (const q of rows) {
    const options = (safeJsonParse(q.options) as any) || [];
    const rationales = safeJsonParse(q.optionRationales);
    const hasPublished = hasTag(q.tags, "published");
    const domains = extractDomains(q.tags);
    const hasDomain = domains.length > 0;
    const allowedDomains = ALLOWED_DOMAINS[levelId] || new Set<string>();

    if (!hasPublished) missingPublished.push(q.id);
    if (!hasDomain) missingDomain.push(q.id);
    if (domains.length > 1) multipleDomains.push(q.id);
    if (domains.length === 1 && allowedDomains.size && !allowedDomains.has(domains[0]!)) invalidDomain.push(q.id);
    if (String(q.question || "").trim().length < 25) shortQuestion.push(q.id);
    if (String(q.explanation || "").trim().length < 60) shortExplanation.push(q.id);

    const stem = String(q.question || "").toLowerCase();
    if (stem.includes("all of the above")) containsAllOfTheAbove.push(q.id);
    if (stem.includes("none of the above")) containsNoneOfTheAbove.push(q.id);
    if (/\bexcept\b/.test(stem) || /\bnot\b/.test(stem)) negativeWording.push(q.id);

    if (!options.length) continue;

    const opts = Array.isArray(options) ? options.map((x) => String(x || "").trim()) : [];
    if (opts.some((o) => !o)) emptyOptionText.push(q.id);
    const normalised = opts.map(normaliseOption).filter(Boolean);
    const seen = new Set<string>();
    let dup = false;
    for (const n of normalised) {
      if (seen.has(n)) dup = true;
      seen.add(n);
    }
    if (dup) duplicateOptions.push(q.id);

    const correct = safeJsonParse(q.correctAnswer);
    const correctIndex = typeof correct === "number" ? correct : null;
    if (correctIndex == null) invalidCorrectAnswer.push(q.id);
    if (correctIndex != null && (correctIndex < 0 || correctIndex >= opts.length)) invalidCorrectIndex.push(q.id);

    if (!Array.isArray(rationales) || !rationales.some((x) => String(x || "").trim().length > 0)) {
      missingRationales.push(q.id);
      continue;
    }
    if (Array.isArray(rationales) && rationales.length !== options.length) {
      rationalesMismatch.push(q.id);
    }

    const rlines = Array.isArray(rationales) ? rationales.map((x) => String(x ?? "").trim()) : [];
    const anyWeak = rlines.some((r) => r.length > 0 && r.length < 20) || rlines.some((r) => !r);
    if (anyWeak) weakRationales.push(q.id);
  }

  const issues: Record<string, string[]> = {
    missingRationales,
    weakRationales,
    rationalesMismatch,
    missingPublished,
    missingDomain,
    multipleDomains,
    invalidDomain,
    invalidCorrectAnswer,
    invalidCorrectIndex,
    emptyOptionText,
    duplicateOptions,
    containsAllOfTheAbove,
    containsNoneOfTheAbove,
    negativeWording,
    shortQuestion,
    shortExplanation,
  };

  return NextResponse.json(
    {
      courseId,
      levelId,
      version,
      totals: {
        questions: rows.length,
        missingRationales: missingRationales.length,
        weakRationales: weakRationales.length,
        rationalesMismatch: rationalesMismatch.length,
        missingPublished: missingPublished.length,
        missingDomain: missingDomain.length,
        multipleDomains: multipleDomains.length,
        invalidDomain: invalidDomain.length,
        invalidCorrectAnswer: invalidCorrectAnswer.length,
        invalidCorrectIndex: invalidCorrectIndex.length,
        emptyOptionText: emptyOptionText.length,
        duplicateOptions: duplicateOptions.length,
        containsAllOfTheAbove: containsAllOfTheAbove.length,
        containsNoneOfTheAbove: containsNoneOfTheAbove.length,
        negativeWording: negativeWording.length,
        shortQuestion: shortQuestion.length,
        shortExplanation: shortExplanation.length,
      },
      samples: {
        missingRationales: missingRationales.slice(0, 25),
        weakRationales: weakRationales.slice(0, 25),
        rationalesMismatch: rationalesMismatch.slice(0, 25),
        missingPublished: missingPublished.slice(0, 25),
        missingDomain: missingDomain.slice(0, 25),
        multipleDomains: multipleDomains.slice(0, 25),
        invalidDomain: invalidDomain.slice(0, 25),
        invalidCorrectAnswer: invalidCorrectAnswer.slice(0, 25),
        invalidCorrectIndex: invalidCorrectIndex.slice(0, 25),
        emptyOptionText: emptyOptionText.slice(0, 25),
        duplicateOptions: duplicateOptions.slice(0, 25),
        containsAllOfTheAbove: containsAllOfTheAbove.slice(0, 25),
        containsNoneOfTheAbove: containsNoneOfTheAbove.slice(0, 25),
        negativeWording: negativeWording.slice(0, 25),
        shortQuestion: shortQuestion.slice(0, 25),
        shortExplanation: shortExplanation.slice(0, 25),
      },
      issues: Object.fromEntries(Object.entries(issues).map(([k, v]) => [k, v.slice(0, 200)])),
    },
    { status: 200 },
  );
}

