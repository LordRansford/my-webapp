"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

type Run = { id: string; toolId: string; status: string; startedAt: string | null; finishedAt: string | null; metricsJson: any };
type Note = { id: string; runId: string | null; content: string; createdAt: string };

export default function WorkspaceProjectPage() {
  const router = useRouter();
  const projectId = typeof router.query.projectId === "string" ? router.query.projectId : "";
  const [project, setProject] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const load = async () => {
    if (!projectId) return;
    const res = await fetch(`/api/workspace/projects/${encodeURIComponent(projectId)}`);
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.ok) {
      setError(String(data?.error || "Could not load project."));
      return;
    }
    setProject(data.project);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const exportJson = async () => {
    if (!projectId) return;
    setExporting(true);
    const res = await fetch(`/api/workspace/projects/${encodeURIComponent(projectId)}/export`);
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.ok) {
      setError(String(data?.error || "Export failed."));
      setExporting(false);
      return;
    }
    const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(project?.title || "project").replace(/\s+/g, "_").slice(0, 40)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
  };

  const runs: Run[] = project?.runs || [];
  const notes: Note[] = project?.notes || [];

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8 space-y-6">
      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">{error}</div> : null}

      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-600">Workspace project</p>
          <h1 className="text-3xl font-semibold text-slate-900">{project?.title || "Loading..."}</h1>
          <p className="text-sm text-slate-700">topic: {project?.topic || "..."}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={exportJson}
            disabled={exporting}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-400 disabled:text-slate-400"
          >
            {exporting ? "Exporting..." : "Export JSON"}
          </button>
          <Link
            href="/workspace"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Workspace
          </Link>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-12">
        <aside className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Runs</h2>
            <div className="mt-3 space-y-2">
              {runs.length === 0 ? (
                <p className="text-sm text-slate-700">No runs yet.</p>
              ) : (
                runs.map((r) => (
                  <div key={r.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-sm font-semibold text-slate-900">{r.toolId}</p>
                    <p className="text-xs text-slate-700">
                      {r.status} • {r.metricsJson?.durationMs ?? "?"} ms • {r.metricsJson?.chargedCredits ?? 0} credits
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Notes</h2>
            <div className="mt-3 space-y-2">
              {notes.length === 0 ? (
                <p className="text-sm text-slate-700">No notes yet.</p>
              ) : (
                notes.map((n) => (
                  <div key={n.id} className="rounded-2xl border border-slate-200 bg-white p-3">
                    <p className="text-xs text-slate-600">{new Date(n.createdAt).toLocaleString()}</p>
                    <p className="text-sm text-slate-900 whitespace-pre-wrap">{n.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        <section className="lg:col-span-8 space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">Project overview</h2>
            <p className="text-slate-700">
              This view is read only. Use labs and tools with a project selected to save runs and notes here.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Link href="/studios/software/labs/code-notebook" className="text-sm font-semibold text-emerald-700 hover:underline">
                Open code notebook lab
              </Link>
              <span className="text-slate-300">|</span>
              <Link href="/tools/code-lab" className="text-sm font-semibold text-slate-700 hover:underline">
                Open Code Lab
              </Link>
            </div>
          </div>
        </section>
      </div>

      <div className="flex items-center justify-between">
        <Link href="/studios" className="text-sm font-semibold text-slate-700 hover:underline">
          Back to labs
        </Link>
        <Link href="/workspace" className="text-sm font-semibold text-emerald-700 hover:underline">
          Open Workspace
        </Link>
      </div>
    </main>
  );
}


