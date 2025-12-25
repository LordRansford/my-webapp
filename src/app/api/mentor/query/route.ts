import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/security/rateLimit";
import { requireSameOrigin } from "@/lib/security/origin";
import { withRequestLogging } from "@/lib/security/requestLog";
import { sanitizeQuestion } from "@/lib/mentor/sanitize";
import { incrementUsage } from "@/lib/mentor/usage";
import { retrieveContent } from "@/lib/mentor/retrieveContent";
import { retrieveVectorContent } from "@/lib/mentor/vectorStore";
import { findToolSuggestion } from "@/lib/tools/toolRegistry";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { runWithMetering } from "@/lib/tools/runWithMetering";
import { attachWorkspaceCookie, getWorkspaceIdentity } from "@/lib/workspace/request";
import { createRun, createNote, updateRun, getProject } from "@/lib/workspace/store";
import type { MentorPageContext, MentorRequest, MentorResponse } from "@/lib/contracts/mentor";

const DISABLED = process.env.MENTOR_ENABLED === "false";
const RESPONSE_TIMEOUT_MS = 2500; // 2.5 seconds, leaving 0.5s buffer for response

type PageContext = MentorPageContext;
type MentorApiResponse = MentorResponse;

function clampText(input: unknown, maxLen: number) {
  const raw = typeof input === "string" ? input : "";
  return raw.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLen);
}

function normalise(text: string) {
  return String(text || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
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

  const headings = Array.isArray(ctx?.headings) ? ctx!.headings! : [];
  const heading = headings.find((h) => h?.id && terms.some((t) => String(h.text || "").toLowerCase().includes(t))) || null;
  const href = heading?.id ? `${ctx?.pathname || ""}#${heading.id}` : ctx?.pathname || "";
  const title = heading?.text ? String(heading.text).slice(0, 120) : ctx?.title || "This page";

  return { title, href, excerpt };
}

// Layer 1: Fast local keyword search (no OpenAI needed)
function getLocalFallback(question: string, pageUrl: string | null): MentorApiResponse {
  const normalized = normalise(question);
  const keywords = normalized.split(" ").filter(Boolean).slice(0, 5);
  
  // Try to find relevant tools/pages from keywords
  const toolSuggestions = [
    { id: "python-playground", title: "Python Playground", route: "/tools/ai/python-playground" },
    { id: "js-sandbox", title: "JavaScript Sandbox", route: "/tools/software-architecture/js-sandbox" },
    { id: "sql-sqlite", title: "SQL Sandbox", route: "/tools/data/sql-sandbox" },
    { id: "regex-tester", title: "Regex Tester", route: "/tools/software-architecture/regex-tester" },
    { id: "password-entropy", title: "Password Entropy Meter", route: "/tools/cyber/password-entropy" },
  ].filter((tool) => 
    keywords.some((kw) => 
      tool.title.toLowerCase().includes(kw) || 
      tool.id.toLowerCase().includes(kw)
    )
  ).slice(0, 3);

  const answer = toolSuggestions.length > 0
    ? `I found ${toolSuggestions.length} relevant tool${toolSuggestions.length > 1 ? "s" : ""} that might help:\n\n${toolSuggestions.map((t, i) => `${i + 1}. [${t.title}](${t.route})`).join("\n")}\n\nVisit these tools to learn more. For deeper answers, the full search system needs to be available.`
    : `I don't have indexed content for "${question}" yet. Here's what you can do:\n\n1. Check the [Tools hub](/tools) for interactive tools\n2. Browse [Notes](/notes) for written content\n3. Try rephrasing your question with specific tool names or keywords`;

  return {
    answer,
    answerMode: "general-guidance",
    citationsV2: toolSuggestions.map((t) => ({
      title: t.title,
      urlOrPath: t.route,
      anchorOrHeading: t.title,
    })),
    refusalReason: {
      code: "FALLBACK_MODE",
      message: "Using local keyword search fallback. Full RAG system unavailable or timed out.",
    },
    suggestedNextActions: [
      "Visit the suggested tools above",
      "Try asking about a specific tool by name",
      "Check the /tools page for all available tools",
    ],
    lowConfidence: true,
    note: "Local fallback used - full search unavailable",
  };
}

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();
  const startTime = Date.now();
  
  return withRequestLogging(req, { route: "POST /api/mentor/query" }, async () => {
    try {
      if (DISABLED) {
        const fallback = getLocalFallback("", null);
        return NextResponse.json(fallback);
      }

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

      // Create abort controller for timeout
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), RESPONSE_TIMEOUT_MS);

      let retrievalSucceeded = false;
      let modelSucceeded = false;
      let fallbackUsed = false;

      try {
        const metered = await Promise.race([
          runWithMetering<MentorApiResponse>({
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

              // Layer 1: Fast local keyword search
              const keyword = retrieveContent(safe.cleaned, pageUrl || ctx?.pathname || null, 6);
              retrievalSucceeded = keyword.matches.length > 0 || pageHit !== null;

              // Layer 2: Vector search (if OpenAI key exists)
              let vector = { matches: [], weak: false };
              try {
                if (process.env.OPENAI_API_KEY && !abortController.signal.aborted) {
                  vector = await retrieveVectorContent(safe.cleaned, pageUrl || ctx?.pathname || null, 6);
                  retrievalSucceeded = retrievalSucceeded || vector.matches.length > 0;
                }
              } catch (err) {
                // Vector search failed, continue with keyword
                console.error("[MENTOR] Vector search failed:", err);
              }

              const matches = vector.matches.length ? vector.matches : keyword.matches;
              const weak = vector.weak && keyword.matches.length === 0;

              if (!matches.length && !pageHit) {
                const fallback = getLocalFallback(safe.cleaned, pageUrl || ctx?.pathname || null);
                fallbackUsed = true;
                return { output: fallback, outputBytes: Buffer.byteLength(JSON.stringify(fallback)) };
              }

              incrementUsage();
              const top = matches[0] || null;
              const lowConfidence = Boolean(weak) || (!pageHit && !top) || (top ? top.score < 0.18 : false);
              const tool = findToolSuggestion(safe.cleaned);

              // Generate answer (simplified - in production this would call OpenAI)
              // For now, use the top match or page hit
              let answer = "";
              let citations: Array<{ title: string; urlOrPath: string; anchorOrHeading?: string }> = [];

              if (pageHit) {
                answer = `Based on the current page: ${pageHit.excerpt}`;
                citations.push({
                  title: pageHit.title,
                  urlOrPath: pageHit.href,
                  anchorOrHeading: pageHit.title,
                });
              } else if (top) {
                answer = `From the site content: ${top.excerpt || top.text || "Relevant content found."}`;
                citations.push({
                  title: top.title || "Content",
                  urlOrPath: top.href || "",
                  anchorOrHeading: top.title || undefined,
                });
              }

              if (!answer) {
                const fallback = getLocalFallback(safe.cleaned, pageUrl || ctx?.pathname || null);
                fallbackUsed = true;
                return { output: fallback, outputBytes: Buffer.byteLength(JSON.stringify(fallback)) };
              }

              modelSucceeded = true;

              const payload: MentorApiResponse = {
                answer: answer.length > 200 ? answer : answer + "\n\nFor more details, visit the linked pages above.",
                answerMode: "site-grounded",
                citationsV2: citations,
                refusalReason: lowConfidence ? { code: "LOW_CONFIDENCE", message: "Answer confidence is low. Check the citations." } : undefined,
                suggestedNextActions: tool
                  ? [`Try the [${tool.title}](${tool.route}) tool for hands-on experience.`]
                  : ["Visit the linked pages for more information.", "Try rephrasing your question with specific keywords."],
                lowConfidence,
                note: lowConfidence ? "Low confidence answer - verify with linked sources" : undefined,
              };

              return { output: payload, outputBytes: Buffer.byteLength(JSON.stringify(payload)) };
            },
          }),
          new Promise<MentorApiResponse>((_, reject) => {
            abortController.signal.addEventListener("abort", () => {
              reject(new Error("TIMEOUT"));
            });
          }),
        ]);

        clearTimeout(timeoutId);

        const duration = Date.now() - startTime;
        console.log(`[MENTOR] requestId=${requestId} duration=${duration}ms retrieval=${retrievalSucceeded} model=${modelSucceeded} fallback=${fallbackUsed}`);

        if (runId) {
          await updateRun({ runId, status: "completed", outputJson: metered.output });
        }

        return NextResponse.json(metered.output);
      } catch (err) {
        clearTimeout(timeoutId);
        const isTimeout = err instanceof Error && err.message === "TIMEOUT";
        
        const duration = Date.now() - startTime;
        console.error(`[MENTOR] requestId=${requestId} duration=${duration}ms error=${isTimeout ? "TIMEOUT" : "ERROR"}`, err);

        // Return fallback on timeout or error
        const fallback = getLocalFallback(safe.cleaned, pageUrl || ctx?.pathname || null);
        fallbackUsed = true;

        if (runId) {
          await updateRun({ runId, status: "failed", outputJson: fallback }).catch(() => {});
        }

        return NextResponse.json(fallback);
      }
    } catch (err) {
      const duration = Date.now() - startTime;
      console.error(`[MENTOR] requestId=${requestId} duration=${duration}ms fatal_error`, err);
      
      // Final fallback
      const fallback = getLocalFallback("", null);
      return NextResponse.json(fallback);
    }
  });
}
