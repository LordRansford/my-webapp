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

const DISABLED = process.env.MENTOR_ENABLED === "false";

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
    const safe = sanitizeQuestion(question);
    if (!safe.ok) {
      return NextResponse.json(
        { message: "I can only help with what is covered on this site." },
        { status: safe.reason === "too_long" ? 413 : 400 }
      );
    }

    const session = await getServerSession(authOptions).catch(() => null);
    const userId = session?.user?.id || null;

    const metered = await runWithMetering({
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

        const payload = {
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
      return NextResponse.json({ message: metered.message, estimate: metered.estimate }, { status: metered.status });
    }

    // Preserve original response shape but include receipt for transparency.
    if ((metered.output as any)?.message) {
      return NextResponse.json({ ...(metered.output as any), receipt: metered.receipt }, { status: 200 });
    }

    return NextResponse.json({ ...(metered.output as any), receipt: metered.receipt }, { status: 200 });
  });
}


