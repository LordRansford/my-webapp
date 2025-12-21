import { notFound } from "next/navigation";
import NotesLayout from "@/components/notes/Layout";
import { listFeedback } from "@/lib/feedback/store";
import { analyzeFeedback } from "@/lib/feedback/summary";

export default function AdminFeedbackPage({ searchParams }: any) {
  const enabled = process.env.ADMIN_FEEDBACK_ENABLED === "true";
  const pass = process.env.ADMIN_FEEDBACK_KEY || "";
  if (!enabled || (pass && searchParams?.key !== pass)) {
    notFound();
  }

  const entries = listFeedback();
  const summary = analyzeFeedback(entries);
  const filter = typeof searchParams?.theme === "string" ? searchParams.theme.toLowerCase().trim() : "";
  const filteredEntries = filter
    ? entries.filter((e) => `${e.message} ${e.workedWell} ${e.confused} ${e.missing} ${e.other}`.toLowerCase().includes(filter))
    : entries;

  return (
    <NotesLayout
      meta={{
        title: "Feedback analysis",
        description: "Private feedback analysis.",
        level: "Summary",
        slug: "/admin/feedback",
        section: "ai",
      }}
      activeLevelId="summary"
    >
      <div className="space-y-6">
        <header className="space-y-2">
          <p className="eyebrow">Private</p>
          <h1 className="text-3xl font-semibold text-slate-900">Feedback analysis (private)</h1>
          <p className="text-slate-700">Structured themes, not visible to users.</p>
          <div className="flex flex-wrap gap-2 text-sm">
            <a className="button" href="/api/feedback/summary">
              Summary JSON
            </a>
            <a className="button" href="/api/feedback/export/markdown">
              Export markdown
            </a>
            <a className="button" href="/api/feedback/export/csv">
              Export CSV
            </a>
          </div>
          <form method="get" className="flex flex-wrap gap-2 text-sm">
            <label className="flex items-center gap-2">
              <span>Filter by theme</span>
              <input
                name="theme"
                defaultValue={filter}
                className="rounded border border-slate-300 px-2 py-1"
                placeholder="confusion, ux, gaps"
              />
            </label>
            {filter ? (
              <a className="button" href="/admin/feedback">
                Clear
              </a>
            ) : null}
          </form>
        </header>

        <section className="space-y-3 rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Summary</h2>
          <p className="text-sm text-slate-700">Total submissions: {summary.total}</p>
          <p className="text-sm text-slate-700">
            Averages: clarity {summary.averages.clarity ?? "n/a"} | usefulness {summary.averages.usefulness ?? "n/a"}
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Key themes</h3>
              <ul className="list-disc pl-5 text-sm text-slate-800">
                {summary.keyThemes.map((t) => (
                  <li key={t.theme}>
                    {t.theme}: {t.count}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Severity ranking</h3>
              <ul className="list-disc pl-5 text-sm text-slate-800">
                {summary.severityRanking.map((s) => (
                  <li key={s.theme}>
                    {s.theme}: {s.severity} ({s.count})
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Suggested focus</h3>
            <ul className="list-disc pl-5 text-sm text-slate-800">
              {summary.suggestedFocus.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="space-y-3 rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Praise signals</h2>
          {summary.praiseSignals.length === 0 ? <p className="text-sm text-slate-700">No positive signals yet.</p> : null}
          <ul className="list-disc pl-5 text-sm text-slate-800">
            {summary.praiseSignals.slice(0, 10).map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-3 rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Repeated issues</h2>
          {summary.repeatedIssues.length === 0 ? <p className="text-sm text-slate-700">No issues logged.</p> : null}
          <ul className="list-disc pl-5 text-sm text-slate-800">
            {summary.repeatedIssues.slice(0, 10).map((p) => (
              <li key={p.theme}>{p.theme}: {p.count}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-3 rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Verbatim (filtered)</h2>
          {filteredEntries.length === 0 ? <p className="text-sm text-slate-700">No feedback yet.</p> : null}
          <ul className="space-y-2 text-sm text-slate-800">
            {filteredEntries.map((e) => (
              <li key={e.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs text-slate-600">
                  {new Date(e.createdAt).toLocaleString()} · {e.heardFrom} {e.name ? `· ${e.name}` : ""}
                  {e.rateClarity ? ` · clarity ${e.rateClarity}` : ""} {e.rateUsefulness ? ` · useful ${e.rateUsefulness}` : ""}
                </div>
                <div className="mt-1 text-slate-900">{e.message}</div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </NotesLayout>
  );
}


