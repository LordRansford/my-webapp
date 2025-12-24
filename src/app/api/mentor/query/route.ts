import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/security/rateLimit";
import { requireSameOrigin } from "@/lib/security/origin";
import { withRequestLogging } from "@/lib/security/requestLog";
import { sanitizeQuestion } from "@/lib/mentor/sanitize";
import { incrementUsage } from "@/lib/mentor/usage";
import { retrieveContent } from "@/lib/mentor/retrieveContent";
import { findToolSuggestion } from "@/lib/tools/toolRegistry";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { runWithMetering } from "@/lib/tools/runWithMetering";
import { attachWorkspaceCookie, getWorkspaceIdentity } from "@/lib/workspace/request";
import { createRun, createNote, updateRun, getProject } from "@/lib/workspace/store";
import type { MentorPageContext, MentorRequest, MentorResponse } from "@/lib/contracts/mentor";

const DISABLED = process.env.MENTOR_ENABLED === "false";

type PageContext = MentorPageContext;
type MentorApiResponse = MentorResponse;

function clampText(input: unknown, maxLen: number) {
  const raw = typeof input === "string" ? input : "";
  return raw.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLen);
}

function normalise(text: string) {
  return String(text || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function buildGeneralDefinition(question: string) {
  const q = normalise(question);
  if (q.includes("digitalisation") || q.includes("digitalization")) {
    return (
      "Digitalisation is the practical use of digital technology to improve how an organisation works and delivers outcomes. " +
      "It combines process change, data, and software so work is faster, safer, and easier to measure. " +
      "Examples include digitising a paper workflow, automating approvals, improving reporting, or building self-service services."
    );
  }
  if (q.includes("risk appetite")) {
    return (
      "Risk appetite is the amount and type of risk an organisation is willing to accept to achieve its goals. " +
      "It sets boundaries for decisions (what is acceptable vs not) and helps teams choose controls, budgets, and trade-offs consistently."
    );
  }
  return null;
}

function bestExcerptFromContext(query: string, ctx: PageContext | null) {
  const pageText = clampText(ctx?.text, 8000);
  if (pageText.length < 200) return null;
  const q = normalise(query);
  const terms = q.split(" ").filter(Boolean).slice(0, 10);
  if (!terms.length) return null;

  const hay = pageText.toLowerCase();
  const first = terms.find((t) => hay.includes(t));
  if (!first) return null;

  const idx = hay.indexOf(first);
  const start = Math.max(0, idx - 180);
  const end = Math.min(pageText.length, idx + 260);
  const excerpt = pageText.slice(start, end).trim();

  // Prefer an on-page heading as the "source" when it matches a term.
  const headings = Array.isArray(ctx?.headings) ? ctx!.headings! : [];
  const heading = headings.find((h) => h?.id && terms.some((t) => String(h.text || "").toLowerCase().includes(t))) || null;
  const href = heading?.id ? `${ctx?.pathname || ""}#${heading.id}` : ctx?.pathname || "";
  const title = heading?.text ? String(heading.text).slice(0, 120) : ctx?.title || "This page";

  return { title, href, excerpt };
}

export async function POST(req: Request) {
  return withRequestLogging(req, { route: "POST /api/mentor/query" }, async () => {
    if (DISABLED) return NextResponse.json({ message: "Mentor is disabled right now." }, { status: 503 });

    const originBlock = requireSameOrigin(req);
    if (originBlock) return originBlock;

    const limited = rateLimit(req, { keyPrefix: "mentor-query", limit: 10, windowMs: 60_000 });
    if (limited) return limited;

    const body = (await req.json().catch(() => null)) as MentorRequest | null;
    const question = typeof body?.question === "string" ? body.question : "";
    const pageUrl = typeof body?.pageUrl === "string" ? body.pageUrl : "";
    const pageContextRaw = body?.pageContext ?? null;
    const projectId = typeof body?.projectId === "string" ? body.projectId.trim() : "";
    const note = typeof body?.note === "string" ? body.note.slice(0, 8000) : "";
    const safe = sanitizeQuestion(question);
    if (!safe.ok) {
      return NextResponse.json(
        { message: safe.reason === "too_long" ? "Please ask a shorter question so I can match it to the site content." : "Please enter a valid question." },
        { status: safe.reason === "too_long" ? 413 : 400 }
      );
    }

    const session = await getServerSession(authOptions).catch(() => null);
    const userId = session?.user?.id || null;
    const ws = await getWorkspaceIdentity(req);

    let runId: string | null = null;
    if (projectId) {
      const p = await getProject({ projectId });
      const allowed = userId ? p?.ownerId === userId : p?.ownerId == null && p?.workspaceSessionId === ws.workspaceSessionId;
      if (p && allowed) {
        const run = await createRun({ projectId, toolId: "mentor-query", status: "running", inputJson: { question, pageUrl } });
        runId = String(run.id);
      }
    }

    const metered = await runWithMetering<MentorApiResponse>({
      req,
      userId,
      toolId: "mentor-query",
      inputBytes: Buffer.from(question).byteLength,
      requestedComplexityPreset: "standard",
      execute: async () => {
        const ctx: PageContext | null =
          pageContextRaw && typeof pageContextRaw === "object"
            ? {
                pathname: clampText(pageContextRaw?.pathname, 200) || pageUrl || "",
                title: clampText(pageContextRaw?.title, 180),
                text: clampText(pageContextRaw?.text, 9000),
                headings: Array.isArray(pageContextRaw?.headings)
                  ? pageContextRaw.headings
                      .map((h: any) => ({ id: clampText(h?.id, 80), text: clampText(h?.text, 140), depth: Number(h?.depth) || undefined }))
                      .filter((h: any) => h.id && h.text)
                  : undefined,
                toc: Array.isArray(pageContextRaw?.toc)
                  ? pageContextRaw.toc.map((t: any) => ({ id: clampText(t?.id, 80), text: clampText(t?.text, 140) })).filter((t: any) => t.id && t.text)
                  : undefined,
              }
            : null;

        const pageHit = bestExcerptFromContext(safe.cleaned, ctx);

        const { matches, weak } = retrieveContent(safe.cleaned, pageUrl || ctx?.pathname || null, 6);
        if (!matches.length && !pageHit) {
          const general = buildGeneralDefinition(safe.cleaned);
          const fallbacks = retrieveContent(safe.cleaned, null, 5).matches;
          const payload: any = {
            answer:
              general ||
              "I could not find an exact match in the site content. General guidance: reduce the question to one concrete term, then use the closest page links below.",
            answerMode: general ? "general-guidance" : "general-guidance",
            citationsV2: fallbacks.slice(0, 5).map((c) => ({ title: c.pageTitle || c.title, urlOrPath: c.pageRoute || c.href, anchorOrHeading: c.title })),
            refusalReason: { code: "NO_MATCH", message: "I could not find an exact section match for this question in the site index." },
            suggestedNextActions: [
              "Try one keyword from a page heading, then ask again.",
              "Tell me which lab or page you are on and what you clicked.",
              "If this is an upload issue: confirm file type, file size, and try selecting a different filename once.",
            ],
            citationsTitle: fallbacks.length ? "Where to read next on this site" : "Best match sections",
            citations: fallbacks.slice(0, 5).map((c) => ({ title: c.title, href: c.href, why: c.why })),
            sources: fallbacks.slice(0, 3).map((c) => ({ title: c.pageTitle || c.title, href: c.href, excerpt: c.why })),
            tryNext: null,
            note: "No matching sections were found for this query in the current page context or the site index.",
            lowConfidence: true,
          };
          return { output: payload, outputBytes: Buffer.byteLength(JSON.stringify(payload)) };
        }

        incrementUsage();
        const top = matches[0] || null;
        const lowConfidence = Boolean(weak) || (!pageHit && !top) || (top ? top.score < 5 : false);
        const tool = findToolSuggestion(safe.cleaned);

        const sources = [
          ...(pageHit ? [{ title: pageHit.title, href: pageHit.href, excerpt: pageHit.excerpt }] : []),
          ...matches.slice(0, 4).map((m) => ({ title: m.pageTitle || m.title, href: m.href, excerpt: m.why })),
        ];

        const answerFromSite = pageHit?.excerpt
          ? pageHit.excerpt
          : top?.why
            ? top.why
            : "The closest matches are below.";

        const payload: MentorApiResponse = {
          answer: lowConfidence ? "I might be missing context. The closest matches are below." : answerFromSite,
          answerMode: "site-grounded",
          citationsV2: matches.slice(0, 5).map((m) => ({ title: m.title, urlOrPath: m.pageRoute || m.href, anchorOrHeading: m.title })),
          answerFromSite,
          citationsTitle: "Where this is covered on the site",
          citations: matches.slice(0, 5).map((m) => ({ title: m.title, href: m.href, why: m.why })),
          sources,
          tryNext: tool ? { title: tool.title, href: tool.route + (tool.anchor ? `#${tool.anchor}` : ""), steps: tool.tips.slice(0, 3) } : null,
          note: "Answers use this site’s content and your current page context. If something is not covered, the closest sections are suggested.",
          lowConfidence,
        };
        return { output: payload, outputBytes: Buffer.byteLength(JSON.stringify(payload)) };
      },
    });

    if (!metered.ok) {
      const res = NextResponse.json({ message: metered.message, estimate: metered.estimate }, { status: metered.status });
      return attachWorkspaceCookie(res, ws.setCookieValue);
    }

    // Preserve original response shape but include receipt for transparency.
    const output = { ...(metered.output as any), receipt: metered.receipt };

    if (runId && projectId) {
      const receiptAny = metered.receipt as any;
      await updateRun({
        runId,
        status: "succeeded",
        outputJson: metered.output,
        metricsJson: { durationMs: receiptAny?.durationMs ?? 0, chargedCredits: receiptAny?.creditsCharged ?? 0 },
      }).catch(() => null);
      if (note.trim()) await createNote({ projectId, runId, content: note.trim() }).catch(() => null);
    }

    const res = NextResponse.json(output, { status: 200 });
    return attachWorkspaceCookie(res, ws.setCookieValue);
  });
}


