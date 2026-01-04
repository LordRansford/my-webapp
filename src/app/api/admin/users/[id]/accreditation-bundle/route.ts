import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdminJson } from "@/lib/security/adminAuth";
import { rateLimit } from "@/lib/security/rateLimit";
import { buildCourseEvidenceSummary } from "@/lib/cpd/courseEvidence";
import type { CPDState } from "@/lib/cpd";

const ALLOWED_COURSES = new Set(["cybersecurity", "network-models"]);

function safeJsonParse(value: string | null) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
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

function extractJustification(raw: any) {
  if (!raw || typeof raw !== "object") return "";
  return typeof (raw as any).justification === "string" ? String((raw as any).justification) : "";
}

function letter(i: number) {
  const letters = ["A", "B", "C", "D", "E", "F"];
  return letters[i] || String(i + 1);
}

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminJson("VIEW_USERS");
  if (!auth.ok) return auth.response;
  const admin = auth.session?.user;
  if (!admin?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const keySuffix = admin.email || admin.id;
  const limited = rateLimit(req, { keyPrefix: "admin-accreditation-bundle", limit: 20, windowMs: 60_000, keySuffix });
  if (limited) return limited;

  const { id } = await ctx.params;
  const { searchParams } = new URL(req.url);
  const courseId = String(searchParams.get("courseId") || "cybersecurity").trim();
  if (!ALLOWED_COURSES.has(courseId)) return NextResponse.json({ error: "Invalid courseId" }, { status: 400 });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ransfordsnotes.com";

  const user = await prisma.userIdentity.findUnique({
    where: { id },
    select: { id: true, email: true, createdAt: true, lastLoginAt: true, lastActiveAt: true },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const learnerProfile = await prisma.learnerProfile.findUnique({ where: { userId: id }, select: { certificateName: true, lockedAt: true } }).catch(() => null);
  const cpdRow = await prisma.cpdState.findUnique({ where: { userId: id }, select: { stateJson: true, updatedAt: true } }).catch(() => null);
  const cpdState = (safeJsonParse(cpdRow?.stateJson || null) as CPDState) || ({ sections: [], activity: [] } as any);

  const levels = courseId === "cybersecurity" ? (["foundations", "applied", "practice"] as const) : ([] as any);
  const courseTitle = courseId === "cybersecurity" ? "Cybersecurity" : courseId;

  const evidenceSummaries = levels.map((levelId) =>
    buildCourseEvidenceSummary({
      courseId: "cybersecurity",
      levelId: levelId as any,
      courseTitle,
      learnerIdentifier: user.email,
      cpdState,
    }),
  );

  const attempts = await prisma.assessmentAttempt.findMany({
    where: { userId: id, assessment: { courseId } },
    orderBy: { completedAt: "desc" },
    take: 50,
    select: {
      id: true,
      score: true,
      passed: true,
      timeSpent: true,
      completedAt: true,
      courseVersion: true,
      assessment: { select: { levelId: true } },
    },
  });

  const certificates = await prisma.certificate.findMany({
    where: { userId: id, courseId: { startsWith: `${courseId}:` } },
    orderBy: { issuedAt: "desc" },
    take: 20,
    select: { id: true, courseId: true, courseVersion: true, issuedAt: true, certificateHash: true, status: true },
  }).catch(() => [] as any[]);

  const out: string[] = [];
  out.push(`# Accreditation bundle`);
  out.push(``);
  out.push(`Course ${courseId}`);
  out.push(`Generated ${new Date().toISOString()}`);
  out.push(``);
  out.push(`## Learner`);
  out.push(``);
  out.push(`User id ${user.id}`);
  out.push(`Email ${user.email}`);
  out.push(`Created ${user.createdAt.toISOString()}`);
  out.push(`Last login ${user.lastLoginAt.toISOString()}`);
  out.push(`Last active ${user.lastActiveAt.toISOString()}`);
  out.push(`Certificate name ${learnerProfile?.certificateName || "Not set"}`);
  out.push(``);
  out.push(`## CPD evidence summaries`);
  out.push(``);
  out.push(`CPD state updated ${cpdRow?.updatedAt ? new Date(cpdRow.updatedAt).toISOString() : "Not available"}`);
  out.push(``);
  for (const s of evidenceSummaries) {
    out.push(`### ${s.levelId}`);
    out.push(``);
    out.push(`Estimated hours ${s.estimatedHours}`);
    out.push(`Recorded hours ${s.recordedHours}`);
    out.push(`Completion date ${s.completionDate || "Not completed"}`);
    out.push(`Sections completed ${s.evidenceSignals.sectionsCompleted}`);
    out.push(`Minutes logged ${s.evidenceSignals.minutesLogged}`);
    out.push(`Quizzes completed ${s.evidenceSignals.quizzesCompleted}`);
    out.push(`Tool events ${s.evidenceSignals.toolEvents}`);
    out.push(``);
  }

  out.push(`## Assessment attempts`);
  out.push(``);
  out.push(`Total attempts ${attempts.length}`);
  out.push(``);
  for (const a of attempts.slice(0, 20)) {
    out.push(`- Attempt ${a.id}`);
    out.push(`  Level ${a.assessment.levelId}`);
    out.push(`  Version ${a.courseVersion}`);
    out.push(`  Score ${a.score} percent`);
    out.push(`  Passed ${a.passed ? "yes" : "no"}`);
    out.push(`  Time spent seconds ${a.timeSpent}`);
    out.push(`  Completed ${a.completedAt.toISOString()}`);
    out.push(``);
  }

  out.push(`## Certificates`);
  out.push(``);
  if (!certificates.length) {
    out.push(`No certificates issued`);
    out.push(``);
  } else {
    for (const c of certificates) {
      const verifyUrl = `${siteUrl}/verify/certificate/${encodeURIComponent(c.certificateHash)}`;
      out.push(`- ${c.courseId}`);
      out.push(`  Status ${c.status}`);
      out.push(`  Version ${c.courseVersion}`);
      out.push(`  Issued ${new Date(c.issuedAt).toISOString()}`);
      out.push(`  Verify ${verifyUrl}`);
      out.push(``);
    }
  }

  // Practice review with learner reasoning
  const latestPractice = await prisma.assessmentAttempt.findFirst({
    where: { userId: id, assessment: { courseId, levelId: "practice" } },
    orderBy: { completedAt: "desc" },
    select: { id: true, answers: true, completedAt: true, score: true, passed: true, courseVersion: true, questionIds: true },
  });

  if (latestPractice) {
    const qids = (safeJsonParse(latestPractice.questionIds) as any) || [];
    const questions = await prisma.question.findMany({
      where: { id: { in: Array.isArray(qids) ? qids : [] } },
      select: { id: true, question: true, options: true, correctAnswer: true, explanation: true },
      take: 500,
    });
    const byId = new Map(questions.map((q) => [q.id, q]));
    const ordered = (Array.isArray(qids) ? qids : []).map((x: any) => String(x)).map((qid: string) => byId.get(qid)).filter(Boolean) as any[];

    const rawAnswers = (safeJsonParse(latestPractice.answers) as any) || {};

    out.push(`## Practice constructive feedback`);
    out.push(``);
    out.push(`Attempt ${latestPractice.id}`);
    out.push(`Completed ${latestPractice.completedAt.toISOString()}`);
    out.push(`Version ${latestPractice.courseVersion}`);
    out.push(`Score ${latestPractice.score} percent`);
    out.push(`Passed ${latestPractice.passed ? "yes" : "no"}`);
    out.push(``);

    let idx = 1;
    for (const q of ordered) {
      const ua = rawAnswers?.[q.id];
      const choice = extractChoice(ua);
      const justification = extractJustification(ua);
      const expected = safeJsonParse(q.correctAnswer);
      const options = (safeJsonParse(q.options) as any) || [];

      const userLetter = typeof choice === "number" ? letter(choice) : "Not answered";
      const correctLetter = typeof expected === "number" ? letter(expected) : String(expected);
      const ok = typeof expected === "number" && typeof choice === "number" ? expected === choice : false;

      out.push(`### Q${idx}`);
      out.push(``);
      out.push(`Result ${ok ? "correct" : "incorrect"}`);
      out.push(`Correct ${correctLetter}`);
      out.push(`Learner ${userLetter}`);
      out.push(``);
      out.push(`Question`);
      out.push(String(q.question || "").trim());
      out.push(``);
      if (options.length) {
        out.push(`Options`);
        for (let i = 0; i < options.length; i += 1) out.push(`${letter(i)}. ${String(options[i])}`);
        out.push(``);
      }
      out.push(`Learner reasoning`);
      out.push(justification ? justification.trim() : "No reasoning provided");
      out.push(``);
      out.push(`Model rationale`);
      out.push(String(q.explanation || "").trim());
      out.push(``);
      idx += 1;
    }
  }

  const body = out.join("\n");
  const file = `accreditation-bundle-${courseId}-${user.email.replace(/[^a-z0-9._-]+/gi, "_")}.md`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${file}"`,
    },
  });
}

