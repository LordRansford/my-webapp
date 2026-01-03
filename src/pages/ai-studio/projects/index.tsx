/**
 * AI Studio - Projects Index
 *
 * Local-first project listing with import/export.
 */

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Upload } from "lucide-react";
import ProjectsPanel from "@/components/ai-studio/ProjectsPanel";
import type { AIStudioProject } from "@/lib/ai-studio/projects/store";
import { getLastOpenedProjectId, getProjectById, getProjects, importProject, setLastOpenedProjectId, updateProjectRun } from "@/lib/ai-studio/projects/store";
import { runAiStudioProjectLocal } from "@/lib/ai-studio/projects/run";

export default function AIStudioProjectsIndexPage() {
  const [projects, setProjects] = useState<AIStudioProject[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const refresh = () => {
    const list = getProjects();
    setProjects(list);
    const last = getLastOpenedProjectId();
    setActiveProjectId(last);
  };

  useEffect(() => {
    refresh();
  }, []);

  const open = (projectId: string) => {
    setLastOpenedProjectId(projectId);
    setActiveProjectId(projectId);
  };

  const run = async (projectId: string) => {
    const p = getProjectById(projectId);
    if (!p) return;
    const input =
      p.exampleId === "story-generator"
        ? "A brave robot exploring a new planet"
        : p.exampleId === "homework-helper"
          ? "How do I solve 2x + 5 = 15?"
          : p.exampleId === "customer-support-bot"
            ? "How do I return an item?"
            : undefined;
    const { output, receipt } = await runAiStudioProjectLocal({ project: p, input });
    updateProjectRun(projectId, { input, output, receipt });
    refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/ai-studio" className="text-sm font-semibold text-primary-600 hover:underline">
            ← Back to AI Studio
          </Link>

          <label className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 cursor-pointer">
            <Upload className="w-4 h-4" aria-hidden="true" />
            Import project JSON
            <input
              type="file"
              accept="application/json"
              className="sr-only"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setImportError(null);
                try {
                  const text = await file.text();
                  const parsed = JSON.parse(text);
                  const res = importProject(parsed);
                  if (!res.ok) {
                    setImportError(res.error);
                    return;
                  }
                  setLastOpenedProjectId(res.project.id);
                  refresh();
                } catch {
                  setImportError("Could not import this file. Ensure it is a valid project JSON export.");
                } finally {
                  // allow re-importing same file
                  e.currentTarget.value = "";
                }
              }}
            />
          </label>
        </div>

        {importError ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900" role="alert">
            {importError}
          </div>
        ) : null}

        <ProjectsPanel
          projects={projects}
          activeProjectId={activeProjectId}
          onOpen={open}
          onRun={run}
          onRefresh={refresh}
        />
      </div>
    </div>
  );
}

