/**
 * AI Studio - Project Details
 *
 * Local-first project page: view config, run, export, and manage a single project.
 */

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Download, FileText, Link as LinkIcon, Play, Trash2 } from "lucide-react";
import type { AIStudioProject } from "@/lib/ai-studio/projects/store";
import { deleteProject, getProjectById, setLastOpenedProjectId, updateProjectRun } from "@/lib/ai-studio/projects/store";
import { buildProjectPackZipBlob, exportProjectAsJson, exportProjectAsPackZip, exportProjectAsPdf } from "@/lib/ai-studio/projects/export";
import { runAiStudioProjectLocal } from "@/lib/ai-studio/projects/run";
import RunReceiptPanel from "@/components/ai-studio/RunReceiptPanel";
import { createProjectShareCode } from "@/lib/ai-studio/projects/share";
import GeneratedFilesPanel from "@/components/shared/GeneratedFilesPanel";

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
  const [selectedRunAt, setSelectedRunAt] = useState<string | null>(null);
  const [computePreset, setComputePreset] = useState<"light" | "standard" | "heavy">("light");
  const [shareLink, setShareLink] = useState<string | null>(null);

  async function blobToBase64(blob: Blob): Promise<string> {
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let binary = "";
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    return btoa(binary);
  }

  const isStory = project?.exampleId === "story-generator";
  const isHomework = project?.exampleId === "homework-helper";
  const isSupport = project?.exampleId === "customer-support-bot";

  useEffect(() => {
    if (!projectId) return;
    const p = getProjectById(projectId);
    if (p) {
      setProject(p);
      setLastOpenedProjectId(p.id);
      if (p.exampleId === "story-generator") {
        setPrompt(typeof p.lastRun?.input === "string" ? (p.lastRun.input as string) : "A brave robot exploring a new planet");
      }
      if (p.exampleId === "homework-helper") {
        setPrompt(typeof p.lastRun?.input === "string" ? (p.lastRun.input as string) : "How do I solve 2x + 5 = 15?");
      }
      if (p.exampleId === "customer-support-bot") {
        setPrompt(typeof p.lastRun?.input === "string" ? (p.lastRun.input as string) : "How do I return an item?");
      }
    } else {
      setProject(null);
    }
  }, [projectId]);

  useEffect(() => {
    if (!project) return;
    const runs = Array.isArray(project.runs) ? project.runs : project.lastRun ? [project.lastRun] : [];
    setSelectedRunAt(runs[0]?.ranAt || null);
  }, [project?.id]);

  const computeToolId = useMemo(() => {
    if (!project) return null;
    if (project.exampleId === "story-generator") return "ai-story-generator";
    if (project.exampleId === "homework-helper") return "ai-homework-helper";
    if (project.exampleId === "customer-support-bot") return "ai-support-bot";
    return null;
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
          body: JSON.stringify({ toolId: computeToolId, inputBytes, requestedComplexityPreset: computePreset }),
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
  }, [computeToolId, prompt, computePreset]);

  const runLocal = async () => {
    if (!project) return;
    setBusy(true);
    setError(null);
    try {
      const input = isStory || isHomework || isSupport ? prompt : undefined;
      const { output, receipt } = await runAiStudioProjectLocal({ project, input });
      updateProjectRun(project.id, { input, output, receipt });
      const updated = getProjectById(project.id);
      setProject(updated);
      const latest = updated?.runs?.[0]?.ranAt || updated?.lastRun?.ranAt || null;
      setSelectedRunAt(latest);
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
      if (!isStory && !isHomework && !isSupport) {
        setError("Compute runs are not implemented for this project yet.");
        return;
      }

      const res = await fetch("/api/tools/run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          toolId: computeToolId,
          mode: "compute",
          inputs: isStory ? { prompt } : isHomework ? { question: prompt } : { question: prompt },
          requestedComplexityPreset: computePreset,
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

      updateProjectRun(project.id, { input: prompt, output: data.output, receipt: data.receipt, files: Array.isArray(data.files) ? data.files : [] });
      const updated = getProjectById(project.id);
      setProject(updated);
      const latest = updated?.runs?.[0]?.ranAt || updated?.lastRun?.ranAt || null;
      setSelectedRunAt(latest);
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
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              Export JSON
            </button>
            <button
              type="button"
              onClick={async () => {
                const code = createProjectShareCode(project);
                await navigator.clipboard.writeText(code);
                alert("Share code copied. Paste it into /ai-studio/projects to import on another device.");
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              <LinkIcon className="w-4 h-4" aria-hidden="true" />
              Copy share code
            </button>
            <button
              type="button"
              onClick={async () => {
                setShareLink(null);
                setBusy(true);
                setError(null);
                try {
                  const blob = await buildProjectPackZipBlob(project);
                  const zipBase64 = await blobToBase64(blob);
                  const res = await fetch("/api/share/packs/create", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ title: project.title, projectId: project.id, zipBase64, expiresInDays: 7 }),
                  });
                  const data = await res.json().catch(() => null);
                  if (!res.ok || !data?.ok) {
                    setError(String(data?.error || "Failed to create share link. You may need to sign in."));
                    return;
                  }
                  const url = `${window.location.origin}${data.sharePath}`;
                  setShareLink(url);
                  await navigator.clipboard.writeText(url);
                  alert("Share link copied. Anyone with this link can download your ZIP pack until it expires.");
                } catch (e) {
                  setError(e instanceof Error ? e.message : "Failed to create share link.");
                } finally {
                  setBusy(false);
                }
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              <LinkIcon className="w-4 h-4" aria-hidden="true" />
              Create share link (7 days)
            </button>
            <button
              type="button"
              onClick={() => exportProjectAsPackZip(project)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              Export pack (ZIP)
            </button>
            <button
              type="button"
              onClick={() => exportProjectAsPdf(project)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
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
              className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-900 hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2"
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

        {shareLink ? (
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-900">
            <p className="text-xs font-semibold text-slate-700">Share link (copied)</p>
            <p className="mt-1 break-all text-xs text-slate-900">{shareLink}</p>
            <p className="mt-1 text-[11px] text-slate-600">
              Anyone with this link can download your ZIP pack until it expires. Make sure you are not sharing sensitive data.
            </p>
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
          ) : isHomework ? (
            <div className="space-y-2">
              <label htmlFor="prompt" className="text-sm font-semibold text-slate-900">
                Question
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-xs text-slate-600">
                Tip: write the exact equation if you can (for example, 2x + 5 = 15). This demo is intentionally limited for safety.
              </p>
            </div>
          ) : isSupport ? (
            <div className="space-y-2">
              <label htmlFor="prompt" className="text-sm font-semibold text-slate-900">
                Customer question
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-xs text-slate-600">
                Tip: include the intent (return, refund, delivery). This is a safe demo and does not access real customer data.
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
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">Quality</span>
                <div className="flex gap-1 rounded-lg border border-slate-300 bg-white p-1">
                  {(["light", "standard", "heavy"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setComputePreset(p)}
                      className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                        computePreset === p ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50"
                      }`}
                      aria-pressed={computePreset === p}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-600">
                  Higher quality increases compute time and may cost more credits.
                </p>
              </div>
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
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
            >
              <Play className="w-4 h-4" aria-hidden="true" />
              Run local (free)
            </button>
            <button
              type="button"
              onClick={runCompute}
              disabled={busy || !computeToolId || (computeEstimate ? !computeEstimate.allowed : false)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              <Play className="w-4 h-4" aria-hidden="true" />
              Run compute (metered)
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">Run history</h2>
            <p className="text-xs text-slate-600">Your last 30 runs are stored on this device.</p>
          </div>

          {(() => {
            const runs = Array.isArray(project.runs) ? project.runs : project.lastRun ? [project.lastRun] : [];
            if (runs.length === 0) {
              return <p className="text-sm text-slate-600">No runs yet.</p>;
            }
            const selected = runs.find((r) => r.ranAt === selectedRunAt) || runs[0];
            return (
              <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
                <div className="space-y-2">
                  {runs.slice(0, 10).map((r) => {
                    const active = r.ranAt === selected.ranAt;
                    const label = new Date(r.ranAt).toLocaleString();
                    const mode = r.receipt?.mode || "local";
                    const credits = r.receipt?.creditsCharged ?? 0;
                    return (
                      <button
                        key={r.ranAt}
                        type="button"
                        onClick={() => setSelectedRunAt(r.ranAt)}
                        className={`w-full rounded-lg border p-3 text-left text-xs transition focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          active ? "border-primary-500 bg-primary-50" : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                        aria-label={`Open run from ${label}`}
                      >
                        <p className="font-semibold text-slate-900">{label}</p>
                        <p className="mt-1 text-slate-600">
                          {mode} · {credits} credits
                        </p>
                      </button>
                    );
                  })}
                  {runs.length > 10 ? <p className="text-[11px] text-slate-500">Showing latest 10 runs here.</p> : null}
                </div>

                <div className="space-y-3">
                  {selected.receipt ? <RunReceiptPanel receipt={selected.receipt} /> : null}
                      {Array.isArray((selected as any).files) && (selected as any).files.length ? (
                        <GeneratedFilesPanel files={(selected as any).files} title="Generated files" />
                      ) : null}
                  <div className="flex flex-wrap gap-2">
                    {typeof selected.input === "string" ? (
                      <button
                        type="button"
                        onClick={() => setPrompt(selected.input as string)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50"
                      >
                        Load this input
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(JSON.stringify(selected.output, null, 2))}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50"
                    >
                      Copy output
                    </button>
                  </div>
                  <pre className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-900 overflow-auto whitespace-pre-wrap">
                    {JSON.stringify(selected.output, null, 2)}
                  </pre>
                </div>
              </div>
            );
          })()}
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

