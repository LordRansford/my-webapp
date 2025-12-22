import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/security/rateLimit";
import { requireSameOrigin } from "@/lib/security/origin";
import { withRequestLogging } from "@/lib/security/requestLog";
import { sanitizeQuestion } from "@/lib/mentor/sanitize";
import { incrementUsage } from "@/lib/mentor/usage";
import { retrieveContent } from "@/lib/mentor/retrieveContent";
import { findToolSuggestion } from "@/lib/tools/toolRegistry";

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

    const { matches, weak } = retrieveContent(safe.cleaned, pageUrl || null, 6);
    if (!matches.length) return NextResponse.json({ message: "I can only help with what is covered on this site." }, { status: 200 });

    incrementUsage();

    const top = matches[0];
    const lowConfidence = weak;
    const tool = findToolSuggestion(safe.cleaned);

    return NextResponse.json(
      {
        answer: lowConfidence ? "I might be wrong here. The closest matches are below." : (top.why || "This is covered in the notes."),
        citationsTitle: "Where this is covered on the site",
        citations: matches.slice(0, 5).map((m) => ({ title: m.title, href: m.href, why: m.why })),
        tryNext: tool ? { title: tool.title, href: tool.route + (tool.anchor ? `#${tool.anchor}` : ""), steps: tool.tips.slice(0, 3) } : null,
        note: "Responses are limited to site content. No external advice is provided.",
        lowConfidence,
      },
      { status: 200 }
    );
  });
}


