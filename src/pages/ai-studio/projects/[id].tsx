/**
 * AI Studio - Project Details
 *
 * Local-first project page: view config, run, export, and manage a single project.
 */

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Download, FileText, Play, Trash2 } from "lucide-react";
import type { AIStudioProject } from "@/lib/ai-studio/projects/store";
import { deleteProject, getProjectById, setLastOpenedProjectId, updateProjectRun } from "@/lib/ai-studio/projects/store";
import { exportProjectAsJson, exportProjectAsPdf } from "@/lib/ai-studio/projects/export";
import { runAiStudioProjectLocal } from "@/lib/ai-studio/projects/run";

type ComputeEstimate = {
  ok: boolean;
  allowed: boolean;
  estimatedCreditCost: number;
  estimatedWallTimeMs: number;
  freeTierRemainingMs: number;
  willChargeCredits: boolean;
  reasons?: string[];
};

export default function AIStudioProjectDetailsPage() {
  const router = useRouter();
  const projectId = typeof router.query?.id === "string" ? router.query.id : "";

  const [project, setProject] = useState<AIStudioProject | null>(null);
  const [prompt, setPrompt] = useState("A brave robot exploring a new planet");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [computeEstimate, setComputeEstimate] = useState<ComputeEstimate | null>(null);

  const isStory = project?.exampleId === "story-generator";

  useEffect(() => {
    if (!projectId) return;
    const p = getProjectById(projectId);
    if (p) {
      setProject(p);
      setLastOpenedProjectId(p.id);
      if (p.exampleId === "story-generator") {
        setPrompt(typeof p.lastRun?.input === "string" ? (p.lastRun.input as string) : "A brave robot exploring a new planet");
      }
    } else {
      setProject(null);
    }
  }, [projectId]);

  const computeToolId = useMemo(() => {
    // For now, story-generator uses a dedicated compute toolId (allowlisted on /api/tools/run).
    return project?.exampleId === "story-generator" ? "ai-story-generator" : null;
  }, [project?.exampleId]);

  useEffect(() => {
    let alive = true;
    async function loadEstimate() {
      if (!computeToolId) return;
      try {
        const inputBytes = new Blob([prompt]).size;
        const res = await fetch("/api/compute/estimate", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ toolId: computeToolId, inputBytes, requestedComplexityPreset: "light" }),
        });
        const data = await res.json().catch(() => null);
        if (!alive) return;
        if (!res.ok || !data?.ok) {
          setComputeEstimate(null);
          return;
        }
        setComputeEstimate({
          ok: true,
          allowed: Boolean(data.allowed),
          estimatedCreditCost: Number(data.estimatedCreditCost || 0),
          estimatedWallTimeMs: Number(data.estimatedWallTimeMs || 0),
          freeTierRemainingMs: Number(data.freeTierRemainingMs || 0),
          willChargeCredits: Boolean(data.willChargeCredits),
          reasons: Array.isArray(data.reasons) ? data.reasons : [],
        });
      } catch {
        if (!alive) return;
        setComputeEstimate(null);
      }
    }
    loadEstimate();
    return () => {
      alive = false;
    };
  }, [computeToolId, prompt]);

  const runLocal = async () => {
    if (!project) return;
    setBusy(true);
    setError(null);
    try {
      const input = isStory ? prompt : undefined;
      const { output, receipt } = await runAiStudioProjectLocal({ project, input });
      updateProjectRun(project.id, { input, output, receipt });
      const updated = getProjectById(project.id);
      setProject(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Run failed.");
    } finally {
      setBusy(false);
    }
  };

  const runCompute = async () => {
    if (!project || !computeToolId) return;
    setBusy(true);
    setError(null);
    try {
      if (!isStory) {
        setError("Compute runs are not implemented for this project yet.");
        return;
      }

      const res = await fetch("/api/tools/run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          toolId: computeToolId,
          mode: "compute",
          inputs: { prompt },
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data) {
        setError("Compute run failed.");
        return;
      }
      if (!data.success) {
        setError(String(data.error?.message || "Compute run failed."));
        return;
      }

      updateProjectRun(project.id, { input: prompt, output: data.output, receipt: data.receipt });
      const updated = getProjectById(project.id);
      setProject(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Compute run failed.");
    } finally {
      setBusy(false);
    }
  };

  if (!projectId) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <p className="text-slate-600">Loading…</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-4xl p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-slate-900">Project not found</h1>
        <p className="text-slate-700">This project may have been deleted, or it may not exist on this device.</p>
        <Link href="/ai-studio" className="text-sm font-semibold text-primary-600 hover:underline">
          Back to AI Studio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-600">AI Studio · Project</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900 truncate">{project.title}</h1>
            <p className="mt-2 text-sm text-slate-600">
              {project.exampleId} · {project.difficulty} · {project.audience}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => exportProjectAsJson(project)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              Export JSON
            </button>
            <button
              type="button"
              onClick={() => exportProjectAsPdf(project)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              <FileText className="w-4 h-4" aria-hidden="true" />
              Export PDF
            </button>
            <button
              type="button"
              onClick={() => {
                const ok = confirm(`Delete "${project.title}"? This cannot be undone.`);
                if (!ok) return;
                deleteProject(project.id);
                router.push("/ai-studio");
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-900 hover:bg-rose-100"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
              Delete
            </button>
          </div>
        </header>

        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900" role="alert">
            {error}
          </div>
        ) : null}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Run</h2>

          {isStory ? (
            <div className="space-y-2">
              <label htmlFor="prompt" className="text-sm font-semibold text-slate-900">
                Prompt
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-xs text-slate-600">
                Tip: start simple, then add details. Keep it kind and safe for children.
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-700">
              This project does not have a runnable interface yet. Local demo runs may still work depending on the template.
            </p>
          )}

          {computeEstimate && computeToolId ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
              <p className="font-semibold text-slate-900">Compute estimate</p>
              <p className="mt-1 text-xs text-slate-600">
                Estimated wall time: ~{Math.round(computeEstimate.estimatedWallTimeMs / 1000)}s · Free tier remaining: ~
                {Math.round(computeEstimate.freeTierRemainingMs / 1000)}s · Estimated credits: {computeEstimate.estimatedCreditCost}
              </p>
              {computeEstimate.allowed ? null : (
                <p className="mt-2 text-xs text-rose-700">
                  This run may be blocked: {computeEstimate.reasons?.[0] || "not allowed"}
                </p>
              )}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={runLocal}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              <Play className="w-4 h-4" aria-hidden="true" />
              Run local (free)
            </button>
            <button
              type="button"
              onClick={runCompute}
              disabled={busy || !computeToolId}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-50"
            >
              <Play className="w-4 h-4" aria-hidden="true" />
              Run compute (metered)
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Latest output</h2>
          {project.lastRun ? (
            <>
              {project.lastRun.receipt ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700">
                  Receipt: {project.lastRun.receipt.mode} · {project.lastRun.receipt.durationMs} ms ·{" "}
                  {project.lastRun.receipt.creditsCharged} credits
                </div>
              ) : null}
              <pre className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-900 overflow-auto whitespace-pre-wrap">
                {JSON.stringify(project.lastRun.output, null, 2)}
              </pre>
            </>
          ) : (
            <p className="text-sm text-slate-600">No runs yet.</p>
          )}
        </section>

        <details className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <summary className="cursor-pointer text-sm font-semibold text-slate-900">Project configuration</summary>
          <pre className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-900 overflow-auto whitespace-pre-wrap">
            {JSON.stringify(project, null, 2)}
          </pre>
        </details>

        <div className="flex items-center justify-between">
          <Link href="/ai-studio" className="text-sm font-semibold text-primary-600 hover:underline">
            Back to AI Studio
          </Link>
          <Link href="/studios" className="text-sm font-semibold text-slate-700 hover:underline">
            Go to studios hub
          </Link>
        </div>
      </div>
    </div>
  );
}

