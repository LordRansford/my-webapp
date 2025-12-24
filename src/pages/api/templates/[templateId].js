import { logWarn } from "@/lib/telemetry/log";

const TEMPLATES = {
  "docs-data-spec.json": {
    contentType: "application/json; charset=utf-8",
    body: JSON.stringify(
      {
        acceptedExtensions: [".pdf", ".docx", ".txt", ".csv"],
        notes: [
          "Use synthetic or anonymised data only.",
          "Keep files small to stay within the free tier limits.",
          "CSV should include a header row.",
        ],
      },
      null,
      2
    ),
  },
  "docs-data-example-small.csv": {
    contentType: "text/csv; charset=utf-8",
    body:
      "id,title,category,created_at,body\n" +
      '1,Meeting notes,notes,2025-01-14,"We discussed priorities: reliability, clarity, and cost controls."\n' +
      '2,Incident summary,security,2025-02-03,"Root cause was a missing validation step. Action: add tests and monitoring."\n' +
      '3,Release checklist,ops,2025-03-19,"Verify auth, run e2e, check contrast, confirm dashboards export."\n',
  },
  "data-prep-mini-classification.csv": {
    contentType: "text/csv; charset=utf-8",
    body:
      "row_id,age,tenure_months,plan,monthly_spend,refunds_last_12m,ticket_count_90d,churned\n" +
      "1,29,3,basic,19.99,0,1,0\n" +
      "2,41,24,pro,59.00,1,4,1\n" +
      "3,33,12,basic,24.50,0,0,0\n" +
      "4,52,60,pro,75.00,2,6,1\n" +
      "5,26,1,basic,12.00,0,2,0\n",
  },
};

function safeName(v) {
  return String(v || "").replace(/[^a-zA-Z0-9._-]/g, "").slice(0, 120);
}

export default function handler(req, res) {
  const templateId = safeName(req.query.templateId);
  const tpl = TEMPLATES[templateId];
  if (!tpl) {
    logWarn("templates.not_found", { templateId });
    return res.status(404).json({ error: "Template not found" });
  }

  res.setHeader("Content-Type", tpl.contentType);
  res.setHeader("Content-Disposition", `attachment; filename="${templateId}"`);
  res.status(200).send(tpl.body);
}


