"use client";

import React, { useMemo, useState } from "react";
import { Trash2, Download, FileText, Play, Search } from "lucide-react";
import { useRouter } from "next/router";
import type { AIStudioProject } from "@/lib/ai-studio/projects/store";
import { deleteProject } from "@/lib/ai-studio/projects/store";
import { exportProjectAsJson, exportProjectAsPackZip, exportProjectAsPdf } from "@/lib/ai-studio/projects/export";

export default function ProjectsPanel(props: {
  projects: AIStudioProject[];
  activeProjectId: string | null;
  onOpen: (projectId: string) => void;
  onRun: (projectId: string) => void;
  onRefresh: () => void;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return props.projects;
    return props.projects.filter((p) => {
      return (
        p.title.toLowerCase().includes(query) ||
        p.exampleId.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    });
  }, [props.projects, q]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Projects</h2>
          <p className="text-sm text-slate-600">Examples you load become projects you can run, export, and revisit.</p>
        </div>

        <div className="relative w-full sm:w-[360px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Search projects…"
            aria-label="Search projects"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          No projects found. Load an example to create your first project.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => {
            const isActive = props.activeProjectId === p.id;
            return (
              <div
                key={p.id}
                className={`rounded-2xl border bg-white p-5 shadow-sm ${
                  isActive ? "border-primary-500 ring-2 ring-primary-200" : "border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{p.title}</p>
                    <p className="mt-1 text-xs text-slate-600 truncate">
                      {p.exampleId} · {p.difficulty} · {p.audience}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      {p.lastRun ? `Last run: ${new Date(p.lastRun.ranAt).toLocaleString()}` : "Not run yet"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const ok = confirm(`Delete "${p.title}"? This cannot be undone.`);
                      if (!ok) return;
                      deleteProject(p.id);
                      props.onRefresh();
                    }}
                    className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                    aria-label={`Delete project ${p.title}`}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      props.onOpen(p.id);
                      router.push(`/ai-studio/projects/${encodeURIComponent(p.id)}`);
                    }}
                    className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
                    aria-label={`Open project ${p.title}`}
                  >
                    Open
                  </button>
                  <button
                    type="button"
                    onClick={() => props.onRun(p.id)}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                    aria-label={`Run project ${p.title}`}
                  >
                    <Play className="w-4 h-4" aria-hidden="true" />
                    Run
                  </button>
                  <button
                    type="button"
                    onClick={() => exportProjectAsJson(p)}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                    aria-label={`Export JSON for ${p.title}`}
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                    JSON
                  </button>
                  <button
                    type="button"
                    onClick={() => exportProjectAsPackZip(p)}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                    aria-label={`Export pack for ${p.title}`}
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                    Pack
                  </button>
                  <button
                    type="button"
                    onClick={() => exportProjectAsPdf(p)}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                    aria-label={`Export PDF for ${p.title}`}
                  >
                    <FileText className="w-4 h-4" aria-hidden="true" />
                    PDF
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

