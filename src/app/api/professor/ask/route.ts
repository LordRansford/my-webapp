import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";
import { withRequestLogging } from "@/lib/security/requestLog";
import { requireSameOrigin } from "@/lib/security/origin";
import { rateLimit } from "@/lib/security/rateLimit";
import { answerWithSiteContext } from "@/lib/professor/siteAnswer";

type Body = {
  question?: string;
  pageUrl?: string;
  pageTitle?: string;
};

function sanitizeText(input: unknown, maxLen: number) {
  const raw = typeof input === "string" ? input : "";
  return raw.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, maxLen);
}

function looksLikeExamPaste(q: string) {
  const s = String(q || "");
  const lines = s.split("\n").map((x) => x.trim()).filter(Boolean);
  const hasOptions =
    lines.filter((l) => /^[A-D][).:\-]\s+/.test(l)).length >= 3 ||
    s.includes("A)") ||
    s.includes("B)") ||
    s.includes("C)") ||
    s.includes("D)");
  const long = s.length > 700 || lines.length > 10;
  const mentionsAssessment = /assessment|pass mark|75 minutes|80 percent|question bank/i.test(s);
  return hasOptions || long || mentionsAssessment;
}

export async function POST(req: Request) {
  return withRequestLogging(req, { route: "POST /api/professor/ask" }, async () => {
    const originBlock = requireSameOrigin(req);
    if (originBlock) return originBlock;

    const limited = rateLimit(req, { keyPrefix: "professor-ask", limit: 45, windowMs: 60_000 });
    if (limited) return limited;

    const body = (await req.json().catch(() => null)) as Body | null;
    const question = sanitizeText(body?.question, 800);
    const pageUrl = sanitizeText(body?.pageUrl, 200);
    const pageTitle = sanitizeText(body?.pageTitle, 120);

    if (!question || question.length < 3) return NextResponse.json({ message: "Invalid question" }, { status: 400 });

    // Hard safety: never help during assessment pages.
    if (pageUrl.includes("/assessment") || looksLikeExamPaste(question)) {
      return NextResponse.json(
        {
          answer:
            "I cannot help with timed assessments or pasted exam questions. After you submit, I can explain concepts, show where to revise on this site, and help you practise.",
          citations: [
            { title: "Pricing and CPD", href: "/pricing", why: "How assessment and CPD works on this site" },
            { title: "Cybersecurity overview", href: "/cybersecurity", why: "Where to find learning path and practice" },
          ],
          lowConfidence: false,
        },
        { status: 200 },
      );
    }

    const session = await getServerSession(authOptions).catch(() => null);
    const userId = session?.user?.id || null;

    // If the user has an active exam session, block the assistant even if they are using a different tab or device.
    if (userId) {
      const now = new Date();
      const active = await prisma.assessmentSession
        .findFirst({ where: { userId, expiresAt: { gt: now } }, select: { id: true } })
        .catch(() => null as any);
      if (active?.id) {
        return NextResponse.json(
          {
            answer:
              "Professor Ransford is paused while you have an active timed assessment session. Submit or let it expire, then come back for feedback and revision help.",
            citations: [{ title: "My account", href: "/account", why: "Credits, certificates, and CPD links" }],
            lowConfidence: false,
          },
          { status: 200 },
        );
      }
    }

    const out = await answerWithSiteContext({ question, pageUrl, pageTitle }).catch(() => null as any);
    if (!out) return NextResponse.json({ message: "Unable to answer" }, { status: 503 });

    return NextResponse.json(out, { status: 200 });
  });
}

