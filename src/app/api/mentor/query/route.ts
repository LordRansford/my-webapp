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

const DISABLED = process.env.MENTOR_ENABLED === "false";

type MentorApiResponse =
  | { message: string }
  | {
      answer: string;
      citationsTitle: string;
      citations: { title: string; href: string; why: string }[];
      tryNext: { title: string; href: string; steps: string[] } | null;
      note: string;
      lowConfidence: boolean;
    };

export async function POST(req: Request) {
  return withRequestLogging(req, { route: "POST /api/mentor/query" }, async () => {
    if (DISABLED) return NextResponse.json({ message: "Mentor is disabled right now." }, { status: 503 });

    const originBlock = requireSameOrigin(req);
    if (originBlock) return originBlock;

    const limited = rateLimit(req, { keyPrefix: "mentor-query", limit: 10, windowMs: 60_000 });
    if (limited) return limited;

    const body = (await req.json().catch(() => null)) as any;
    const question = typeof body?.question === "string" ? body.question : "";
    const pageUrl = typeof body?.pageUrl === "string" ? body.pageUrl : "";
    const projectId = typeof body?.projectId === "string" ? body.projectId.trim() : "";
    const note = typeof body?.note === "string" ? body.note.slice(0, 8000) : "";
    const safe = sanitizeQuestion(question);
    if (!safe.ok) {
      return NextResponse.json(
        { message: "I can only help with what is covered on this site." },
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
        const { matches, weak } = retrieveContent(safe.cleaned, pageUrl || null, 6);
        if (!matches.length) {
          return { output: { message: "I can only help with what is covered on this site." }, outputBytes: 0 };
        }

        incrementUsage();
        const top = matches[0];
        const lowConfidence = weak;
        const tool = findToolSuggestion(safe.cleaned);

        const payload: MentorApiResponse = {
          answer: lowConfidence ? "I might be wrong here. The closest matches are below." : top.why || "This is covered in the notes.",
          citationsTitle: "Where this is covered on the site",
          citations: matches.slice(0, 5).map((m) => ({ title: m.title, href: m.href, why: m.why })),
          tryNext: tool ? { title: tool.title, href: tool.route + (tool.anchor ? `#${tool.anchor}` : ""), steps: tool.tips.slice(0, 3) } : null,
          note: "Responses are limited to site content. No external advice is provided.",
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


