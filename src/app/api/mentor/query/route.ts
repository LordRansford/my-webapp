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
import type { MentorPageContext, MentorRequest } from "@/lib/contracts/mentor";
import type { MentorResponse, MentorCitationV2 } from "@/types/mentor";

const DISABLED = process.env.MENTOR_ENABLED === "false";
const RESPONSE_TIMEOUT_MS = 2500; // 2.5 seconds, leaving 0.5s buffer for response

type PageContext = MentorPageContext;

/**
 * Normalize Mentor Response
 * 
 * Ensures all responses conform to the canonical MentorResponse type.
 * This is the SINGLE exit point for all response shapes.
 */
function normalizeMentorResponse(input: Partial<MentorResponse>): MentorResponse {
  return {
    answer: input.answer ?? "No answer available.",
    answerMode: input.answerMode ?? "fallback",
    citationsV2: (input.citationsV2 ?? []).map((c) => ({
      title: c.title ?? "",
      urlOrPath: c.urlOrPath ?? "",
      anchorOrHeading: c.anchorOrHeading,
    })),
    suggestedActions: input.suggestedActions ?? [],
    debug: input.debug,
  };
}

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

/**
 * Layer 1: Fast local keyword search (no OpenAI needed)
 * Returns a normalized fallback response with at least one citation.
 */
function buildLocalFallback(question: string, pageUrl: string | null): Partial<MentorResponse> {
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

  // Always include at least one citation (Tools hub)
  const citationsV2: MentorCitationV2[] = toolSuggestions.length > 0
    ? toolSuggestions.map((t) => ({
        title: t.title,
        urlOrPath: t.route,
        anchorOrHeading: t.title,
      }))
    : [
        {
          title: "Tools hub",
          urlOrPath: "/tools",
        },
      ];

  return {
    answer,
    answerMode: "fallback",
    citationsV2,
    suggestedActions: [
      { label: "Visit Tools Hub", href: "/tools" },
      { label: "Browse Notes", href: "/notes" },
    ],
    debug: {
      retrievalCount: 0,
      fallbackReason: "No indexed content found or RAG system unavailable",
    },
  };
}

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();
  const startTime = Date.now();
  
  return withRequestLogging(req, { route: "POST /api/mentor/query" }, async () => {
    let rawResponse: Partial<MentorResponse> = {};
    
    try {
      if (DISABLED) {
        rawResponse = buildLocalFallback("", null);
        return NextResponse.json(normalizeMentorResponse(rawResponse));
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
        rawResponse = {
          answer: safe.reason === "too_long" 
            ? "Please ask a shorter question so I can match it to the site content." 
            : "Please enter a valid question.",
          answerMode: "fallback",
          citationsV2: [{ title: "Tools hub", urlOrPath: "/tools" }],
          debug: {
            retrievalCount: 0,
            fallbackReason: safe.reason === "too_long" ? "Question too long" : "Invalid question",
          },
        };
        return NextResponse.json(
          normalizeMentorResponse(rawResponse),
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
      let retrievalCount = 0;

      try {
        const meteredResult = await Promise.race([
          runWithMetering<MentorResponse>({
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
              retrievalCount = keyword.matches.length;
              retrievalSucceeded = keyword.matches.length > 0 || pageHit !== null;

              // Layer 2: Vector search (if OpenAI key exists)
              let vector: { matches: Array<{ title: string; href: string; excerpt?: string; text?: string; score?: number }>; weak: boolean } = { matches: [], weak: false };
              try {
                if (process.env.OPENAI_API_KEY && !abortController.signal.aborted) {
                  vector = await retrieveVectorContent(safe.cleaned, pageUrl || ctx?.pathname || null, 6);
                  retrievalCount = vector.matches.length || keyword.matches.length;
                  retrievalSucceeded = retrievalSucceeded || vector.matches.length > 0;
                }
              } catch (err) {
                // Vector search failed, continue with keyword
                console.error("[MENTOR] Vector search failed:", err);
              }

              const matches = vector.matches.length ? vector.matches : keyword.matches;
              const weak = vector.weak && keyword.matches.length === 0;

              if (!matches.length && !pageHit) {
                rawResponse = buildLocalFallback(safe.cleaned, pageUrl || ctx?.pathname || null);
                fallbackUsed = true;
                return { 
                  output: normalizeMentorResponse(rawResponse), 
                  outputBytes: Buffer.byteLength(JSON.stringify(normalizeMentorResponse(rawResponse))) 
                };
              }

              incrementUsage();
              const top = matches[0] || null;
              const lowConfidence = Boolean(weak) || (!pageHit && !top) || (top && top.score !== undefined ? top.score < 0.18 : false);
              const tool = findToolSuggestion(safe.cleaned);

              // Generate answer (simplified - in production this would call OpenAI)
              // For now, use the top match or page hit
              let answer = "";
              let citationsV2: MentorCitationV2[] = [];

              if (pageHit) {
                answer = `Based on the current page: ${pageHit.excerpt}`;
                citationsV2.push({
                  title: pageHit.title,
                  urlOrPath: pageHit.href,
                  anchorOrHeading: pageHit.title,
                });
              } else if (top) {
                // Handle both Citation (has 'why') and vector result (has 'excerpt' or 'text')
                const excerpt = ('excerpt' in top ? top.excerpt : null) || ('text' in top ? top.text : null) || ('why' in top ? top.why : null) || "Relevant content found.";
                answer = `From the site content: ${excerpt}`;
                citationsV2.push({
                  title: top.title || "Content",
                  urlOrPath: top.href || "",
                  anchorOrHeading: ('excerpt' in top ? top.excerpt : null) || ('why' in top ? top.why : null) || top.title || undefined,
                });
              }

              if (!answer || citationsV2.length === 0) {
                rawResponse = buildLocalFallback(safe.cleaned, pageUrl || ctx?.pathname || null);
                fallbackUsed = true;
                return { 
                  output: normalizeMentorResponse(rawResponse), 
                  outputBytes: Buffer.byteLength(JSON.stringify(normalizeMentorResponse(rawResponse))) 
                };
              }

              modelSucceeded = true;

              rawResponse = {
                answer: answer.length > 200 ? answer : answer + "\n\nFor more details, visit the linked pages above.",
                answerMode: "rag",
                citationsV2,
                suggestedActions: tool
                  ? [{ label: `Try ${tool.title}`, href: tool.route }]
                  : [{ label: "Visit Tools Hub", href: "/tools" }],
                debug: {
                  retrievalCount,
                  fallbackReason: lowConfidence ? "Low confidence match" : undefined,
                },
              };

              return { 
                output: normalizeMentorResponse(rawResponse), 
                outputBytes: Buffer.byteLength(JSON.stringify(normalizeMentorResponse(rawResponse))) 
              };
            },
          }),
          new Promise<{ ok: false; status: number; message: string; estimate: any }>((_, reject) => {
            abortController.signal.addEventListener("abort", () => {
              reject(new Error("TIMEOUT"));
            });
          }),
        ]) as Awaited<ReturnType<typeof runWithMetering<MentorResponse>>>;

        clearTimeout(timeoutId);

        const duration = Date.now() - startTime;
        console.log(`[MENTOR] requestId=${requestId} duration=${duration}ms retrieval=${retrievalSucceeded} model=${modelSucceeded} fallback=${fallbackUsed}`);

        if (!meteredResult.ok) {
          // If metering failed, return fallback
          rawResponse = buildLocalFallback(safe.cleaned, pageUrl || null);
          if (runId) {
            await updateRun({ runId, status: "failed", outputJson: normalizeMentorResponse(rawResponse) }).catch(() => {});
          }
          return NextResponse.json(normalizeMentorResponse(rawResponse));
        }

        if (runId) {
          await updateRun({ runId, status: "completed", outputJson: meteredResult.output });
        }

        return NextResponse.json(meteredResult.output);
      } catch (err) {
        clearTimeout(timeoutId);
        const isTimeout = err instanceof Error && err.message === "TIMEOUT";
        
        const duration = Date.now() - startTime;
        console.error(`[MENTOR] requestId=${requestId} duration=${duration}ms error=${isTimeout ? "TIMEOUT" : "ERROR"}`, err);

        // Return fallback on timeout or error
        rawResponse = buildLocalFallback(safe.cleaned, pageUrl || null);
        fallbackUsed = true;

        if (runId) {
          await updateRun({ runId, status: "failed", outputJson: normalizeMentorResponse(rawResponse) }).catch(() => {});
        }

        return NextResponse.json(normalizeMentorResponse(rawResponse));
      }
    } catch (err) {
      const duration = Date.now() - startTime;
      console.error(`[MENTOR] requestId=${requestId} duration=${duration}ms fatal_error`, err);
      
      // Final fallback
      rawResponse = buildLocalFallback("", null);
      return NextResponse.json(normalizeMentorResponse(rawResponse));
    }
  });
}

// TypeScript exhaustiveness guard - forces validation at build time
const _assertMentorResponse: MentorResponse = normalizeMentorResponse({});
