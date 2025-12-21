import { NextResponse } from "next/server";
import { listFeedback } from "@/lib/feedback/store";
import { analyzeFeedback } from "@/lib/feedback/summary";

export async function GET() {
  const enabled = process.env.FEEDBACK_SUMMARY_ENABLED === "true";
  if (!enabled) return NextResponse.json({ message: "Not available" }, { status: 404 });

  const entries = listFeedback();
  const summary = analyzeFeedback(entries);

  const lines: string[] = [];
  lines.push(`# Feedback summary`);
  lines.push(`Total: ${summary.total}`);
  lines.push("");
  lines.push(`## Key themes`);
  summary.keyThemes.forEach((t) => lines.push(`- ${t.theme}: ${t.count}`));
  lines.push("");
  lines.push(`## Severity`);
  summary.severityRanking.forEach((s) => lines.push(`- ${s.theme}: ${s.severity} (${s.count})`));
  lines.push("");
  lines.push(`## Suggested focus`);
  summary.suggestedFocus.forEach((s) => lines.push(`- ${s}`));
  lines.push("");
  lines.push(`## Praise samples`);
  summary.praiseSignals.forEach((p) => lines.push(`- ${p}`));
  lines.push("");
  lines.push(`## Issues (top)`);
  summary.repeatedIssues.slice(0, 10).forEach((i) => lines.push(`- ${i.theme || i}`));
  lines.push("");
  lines.push(`## Entries`);
  entries.forEach((e) => {
    lines.push(`- ${e.createdAt} | ${e.heardFrom}${e.name ? ` | ${e.name}` : ""} | ${e.message}`);
  });

  return new NextResponse(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": 'attachment; filename="feedback-summary.md"',
    },
  });
}


