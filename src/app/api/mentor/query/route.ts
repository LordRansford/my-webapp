import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/security/rateLimit";
import { requireSameOrigin } from "@/lib/security/origin";
import { withRequestLogging } from "@/lib/security/requestLog";
import { sanitizeQuestion } from "@/lib/mentor/sanitize";
import { searchContent } from "@/lib/mentor/search";
import { incrementUsage } from "@/lib/mentor/usage";

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
    const safe = sanitizeQuestion(question);
    if (!safe.ok) {
      return NextResponse.json(
        { message: "I can only help with what is covered on this site." },
        { status: safe.reason === "too_long" ? 413 : 400 }
      );
    }

    const results = searchContent(safe.cleaned, 3);
    if (!results.length) {
      return NextResponse.json({ message: "I can only help with what is covered on this site." }, { status: 200 });
    }

    incrementUsage();

    const top = results[0];
    const lowConfidence = top.score < 2;
    const short = top.excerpt.slice(0, 260).trim() || "This is covered in the notes.";
    const detail = results
      .map((r) => `${r.title}: ${r.excerpt.slice(0, 360).trim()}`)
      .join("\n\n")
      .trim();

    return NextResponse.json(
      {
        answer: lowConfidence
          ? "I can only help explain what is already on this site. Try the sources below."
          : short,
        detail,
        sources: results,
        note: "Responses are limited to site content. No external advice is provided.",
        lowConfidence,
      },
      { status: 200 }
    );
  });
}


