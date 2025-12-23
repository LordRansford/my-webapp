"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Project = { id: string; title: string; topic: string };

type Step = { id: string; title: string; description: string; starter: string };

const STEPS: Step[] = [
  { id: "vars", title: "JS basics (variables)", description: "Assign values and print them.", starter: `const name = "Ransford";\nconsole.log("Hello", name);` },
  { id: "loops", title: "JS loops", description: "Loop from 1 to 5 and sum the numbers.", starter: `let sum = 0;\nfor (let i = 1; i <= 5; i++) sum += i;\nconsole.log("sum", sum);` },
  { id: "funcs", title: "JS functions", description: "Write a small function and call it.", starter: `function square(n) {\n  return n * n;\n}\nconsole.log(square(8));` },
  { id: "transform", title: "JS data transform", description: "Transform an array with map.", starter: `const nums = [1, 2, 3, 4];\nconst doubled = nums.map((n) => n * 2);\nconsole.log(doubled.join(", "));` },
  { id: "debug", title: "Debugging example", description: "This step intentionally has an error. Fix it and run again.", starter: `const user = { name: "Asha" };\nconsole.log(user.fullName.toUpperCase());` },
  { id: "challenge", title: "Mini challenge", description: "Write a function that returns true if a word is a palindrome.", starter: `function isPalindrome(word) {\n  // TODO\n}\n\nconsole.log(isPalindrome("level"));\nconsole.log(isPalindrome("hello"));` },
];

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function CodeNotebookLabPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState<string>("");
  const [projectDetail, setProjectDetail] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outlineOpen, setOutlineOpen] = useState(false);

  const [stepCode, setStepCode] = useState<Record<string, string>>(() => Object.fromEntries(STEPS.map((s) => [s.id, s.starter])));
  const [stdout, setStdout] = useState<Record<string, string>>({});
  const [stderr, setStderr] = useState<Record<string, string>>({});
  const [runMeta, setRunMeta] = useState<Record<string, { durationMs: number; freeTierAppliedMs: number; chargedCredits: number }>>({});
  const [busyStep, setBusyStep] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState<Record<string, string>>({});
  const [lang, setLang] = useState<"js" | "py">("js");

  const selectedProject = useMemo(() => projects.find((p) => p.id === projectId) || null, [projects, projectId]);

  const loadProjects = async () => {
    const res = await fetch("/api/workspace/projects");
    const data = await res.json().catch(() => null);
    if (data?.ok) {
      setProjects(data.projects || []);
      if (!projectId && (data.projects?.[0]?.id as string | undefined)) setProjectId(String(data.projects[0].id));
    }
  };

  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProjectDetail = async (pid: string) => {
    if (!pid) {
      setProjectDetail(null);
      return;
    }
    const res = await fetch(`/api/workspace/projects/${encodeURIComponent(pid)}`);
    const data = await res.json().catch(() => null);
    if (data?.ok) setProjectDetail(data.project);
  };

  useEffect(() => {
    if (!projectId) {
      setProjectDetail(null);
      return;
    }
    loadProjectDetail(projectId);
  }, [projectId]);

  const createDefaultProject = async () => {
    setCreating(true);
    setError(null);
    const res = await fetch("/api/workspace/projects", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "Code notebook", topic: "software" }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.ok) {
      setError(String(data?.error || "Could not create project."));
      setCreating(false);
      return;
    }
    await loadProjects();
    setProjectId(String(data.project.id));
    await loadProjectDetail(String(data.project.id));
    setCreating(false);
  };

  const runStep = async (step: Step) => {
    setError(null);
    if (!projectId) {
      setError("Select a project first.");
      return;
    }
    setBusyStep(step.id);
    setStdout((prev) => ({ ...prev, [step.id]: "" }));
    setStderr((prev) => ({ ...prev, [step.id]: "" }));
    setRunMeta((prev) => ({ ...prev, [step.id]: { durationMs: 0, freeTierAppliedMs: 0, chargedCredits: 0 } }));

    if (lang === "py") {
      setStderr((prev) => ({ ...prev, [step.id]: "Python sandbox coming soon." }));
      setBusyStep(null);
      return;
    }

    const payload = { language: lang, code: stepCode[step.id] || "", input: "", presets: [] };
    const res = await fetch("/api/jobs/create", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ toolId: "code-runner", mode: "enqueue", inputBytes: payload.code.length, payload, projectId, note: noteDraft[step.id] || "" }),
    });
    const data = await res.json().catch(() => null);
    const jobId = String(data?.jobId || "");
    if (!res.ok || !jobId) {
      setError(String(data?.error || "Could not start run."));
      setBusyStep(null);
      return;
    }

    for (let i = 0; i < 60; i++) {
      const jr = await fetch(`/api/jobs/${encodeURIComponent(jobId)}`);
      const j = await jr.json().catch(() => null);
      const s = j?.job?.status || null;
      if (s === "succeeded") {
        setStdout((prev) => ({ ...prev, [step.id]: String(j?.job?.resultJson?.stdout || "") }));
        setStderr((prev) => ({ ...prev, [step.id]: String(j?.job?.resultJson?.stderr || "") }));
        setRunMeta((prev) => ({
          ...prev,
          [step.id]: {
            durationMs: Number(j?.job?.durationMs || 0),
            freeTierAppliedMs: Number(j?.job?.freeTierAppliedMs || 0),
            chargedCredits: Number(j?.job?.chargedCredits || 0),
          },
        }));
        setBusyStep(null);
        await loadProjects();
        await loadProjectDetail(projectId);
        return;
      }
      if (s === "denied" || s === "failed" || s === "cancelled") {
        setStderr((prev) => ({ ...prev, [step.id]: String(j?.job?.errorMessage || "Run did not complete.") }));
        setBusyStep(null);
        await loadProjects();
        await loadProjectDetail(projectId);
        return;
      }
      await sleep(600);
    }
    setStderr((prev) => ({ ...prev, [step.id]: "Timed out waiting for run." }));
    setBusyStep(null);
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 md:px-6 lg:px-8 space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-semibold text-slate-600">Software labs</p>
        <h1 className="text-3xl font-semibold text-slate-900">Code notebook</h1>
        <p className="text-slate-700">Step by step practice with saved runs and notes.</p>
      </header>

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">{error}</div> : null}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Project</h2>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700">Select a project</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full md:w-96 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
            >
              <option value="">Select...</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.topic})
                </option>
              ))}
            </select>
            {selectedProject ? <p className="text-xs text-slate-600">Saving runs to: {selectedProject.title}</p> : null}
          </div>
          <button
            type="button"
            onClick={createDefaultProject}
            disabled={creating}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300"
          >
            {creating ? "Creating..." : "Create project"}
          </button>
        </div>
        {selectedProject ? (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setOutlineOpen(true)}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-400 lg:hidden"
            >
              Outline
            </button>
            <Link href={`/workspace/${encodeURIComponent(selectedProject.id)}`} className="text-sm font-semibold text-emerald-700 hover:underline">
              Open this project in Workspace
            </Link>
          </div>
        ) : null}
      </section>

      {/* Mobile outline drawer */}
      {outlineOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/35 lg:hidden"
            aria-label="Close outline"
            onClick={() => setOutlineOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-40 w-10/12 max-w-sm overflow-y-auto bg-white p-4 shadow-xl lg:hidden">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Project outline</h2>
              <button
                type="button"
                className="rounded-full border border-slate-300 px-3 py-1 text-sm font-semibold text-slate-900"
                onClick={() => setOutlineOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <ProjectOutlinePanel project={projectDetail} />
            </div>
          </aside>
        </>
      ) : null}

      {/* Desktop outline */}
      <div className="hidden lg:block">
        <ProjectOutlinePanel project={projectDetail} />
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Language</h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setLang("js")}
            className={`rounded-full px-4 py-2 text-sm font-semibold border ${
              lang === "js" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-900 border-slate-300"
            }`}
          >
            JavaScript
          </button>
          <button
            type="button"
            onClick={() => setLang("py")}
            className={`rounded-full px-4 py-2 text-sm font-semibold border ${
              lang === "py" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-900 border-slate-300"
            }`}
          >
            Python
          </button>
        </div>
        {lang === "py" ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Python sandbox coming soon.
          </div>
        ) : null}
      </section>

      <section className="space-y-4">
        {STEPS.map((step) => (
          <div key={step.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{step.title}</h2>
                <p className="text-slate-700">{step.description}</p>
              </div>
              <button
                type="button"
                onClick={() => runStep(step)}
                disabled={busyStep === step.id}
                className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:bg-slate-300"
              >
                {busyStep === step.id ? "Running..." : "Run"}
              </button>
            </div>

            <textarea
              value={stepCode[step.id] || ""}
              onChange={(e) => setStepCode((prev) => ({ ...prev, [step.id]: e.target.value }))}
              rows={10}
              className="w-full rounded-2xl border border-slate-200 bg-white p-3 font-mono text-sm text-slate-900"
            />

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-slate-700">Stdout</p>
                <pre className="mt-2 min-h-[90px] overflow-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-900 whitespace-pre-wrap">
                  {stdout[step.id] || "No output yet."}
                </pre>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700">Errors</p>
                <pre className="mt-2 min-h-[90px] overflow-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-900 whitespace-pre-wrap">
                  {stderr[step.id] || "No errors."}
                </pre>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-xs font-semibold text-slate-700">runtime (ms)</p>
                <p className="mt-1 text-sm text-slate-900">{runMeta[step.id]?.durationMs ?? 0}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-xs font-semibold text-slate-700">free tier applied (ms)</p>
                <p className="mt-1 text-sm text-slate-900">{runMeta[step.id]?.freeTierAppliedMs ?? 0}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-xs font-semibold text-slate-700">credits charged</p>
                <p className="mt-1 text-sm text-slate-900">{runMeta[step.id]?.chargedCredits ?? 0}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <p className="text-xs font-semibold text-slate-700">Save note (plain text)</p>
              <textarea
                value={noteDraft[step.id] || ""}
                onChange={(e) => setNoteDraft((prev) => ({ ...prev, [step.id]: e.target.value }))}
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                placeholder="What did you learn?"
              />
              <p className="text-xs text-slate-600">Notes are saved when you run the step.</p>
            </div>
          </div>
        ))}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/studios" className="text-sm font-semibold text-slate-700 hover:underline">
          Back to Studio
        </Link>
        <div className="flex gap-3">
          <Link href="/workspace" className="text-sm font-semibold text-emerald-700 hover:underline">
            Open Workspace
          </Link>
          {projectId ? (
            <Link href={`/workspace/${encodeURIComponent(projectId)}`} className="text-sm font-semibold text-slate-700 hover:underline">
              View project
            </Link>
          ) : null}
        </div>
      </div>
    </main>
  );
}

function ProjectOutlinePanel({ project }: { project: any | null }) {
  const runs = Array.isArray(project?.runs) ? project.runs : [];
  const notes = Array.isArray(project?.notes) ? project.notes : [];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Project outline</h2>
          <p className="text-sm text-slate-700">Saved runs and notes update after each run.</p>
        </div>
        {project?.id ? (
          <Link href={`/workspace/${encodeURIComponent(project.id)}`} className="text-sm font-semibold text-emerald-700 hover:underline">
            View project
          </Link>
        ) : null}
      </div>

      {!project ? <p className="mt-3 text-sm text-slate-700">Select a project to see saved runs and notes.</p> : null}

      {project ? (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold text-slate-700">Recent runs</p>
            <div className="mt-2 space-y-2">
              {runs.length === 0 ? (
                <p className="text-sm text-slate-700">No runs yet.</p>
              ) : (
                runs.slice(0, 6).map((r: any) => (
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
          <div>
            <p className="text-xs font-semibold text-slate-700">Recent notes</p>
            <div className="mt-2 space-y-2">
              {notes.length === 0 ? (
                <p className="text-sm text-slate-700">No notes yet.</p>
              ) : (
                notes.slice(0, 4).map((n: any) => (
                  <div key={n.id} className="rounded-2xl border border-slate-200 bg-white p-3">
                    <p className="text-xs text-slate-600">{new Date(n.createdAt).toLocaleString()}</p>
                    <p className="text-sm text-slate-900 whitespace-pre-wrap">{String(n.content || "")}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}


