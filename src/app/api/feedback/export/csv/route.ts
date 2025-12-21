import { NextResponse } from "next/server";
import { listFeedback } from "@/lib/feedback/store";

export async function GET() {
  const enabled = process.env.FEEDBACK_SUMMARY_ENABLED === "true";
  if (!enabled) return NextResponse.json({ message: "Not available" }, { status: 404 });

  const entries = listFeedback();
  const rows = [
    ["createdAt", "heardFrom", "name", "message", "rateClarity", "rateUsefulness"].join(","),
    ...entries.map((e) =>
      [
        e.createdAt,
        e.heardFrom,
        e.name || "",
        JSON.stringify(e.message || ""),
        e.rateClarity ?? "",
        e.rateUsefulness ?? "",
      ].join(",")
    ),
  ];

  return new NextResponse(rows.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="feedback.csv"',
    },
  });
}


