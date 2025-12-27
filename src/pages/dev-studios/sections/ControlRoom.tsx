"use client";

import React, { useMemo, useState } from "react";
import { SecurityBanner } from "@/components/dev-studios/SecurityBanner";
import SwitchRow from "@/components/ui/SwitchRow";

type Project = {
  name: string;
  type: string;
  frontend: string;
  backend: string;
  data: string;
  status: "Designing" | "Building" | "Testing" | "Live";
  risk: "Low" | "Medium" | "High" | "Unknown";
};

const statusOptions: Project["status"][] = ["Designing", "Building", "Testing", "Live"];
const riskOptions: Project["risk"][] = ["Low", "Medium", "High", "Unknown"];

const pill = (text: string, tone: "muted" | "ok" | "warn" | "bad" = "muted") => {
  const tones: Record<typeof tone, string> = {
    muted: "bg-slate-100 text-slate-700 ring-slate-200",
    ok: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    warn: "bg-amber-100 text-amber-800 ring-amber-200",
    bad: "bg-rose-100 text-rose-800 ring-rose-200",
  };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${tones[tone]}`}>{text}</span>;
};

export default function ControlRoom() {
  const [projects, setProjects] = useState<Project[]>([
    {
      name: "BookTrack",
      type: "Web app",
      frontend: "React",
      backend: "Node Express",
      data: "Postgres",
      status: "Designing",
      risk: "Unknown",
    },
    {
      name: "Solar Fleet",
      type: "Web app",
      frontend: "React",
      backend: "Node Express",
      data: "Postgres",
      status: "Building",
      risk: "Medium",
    },
    {
      name: "Ledger API",
      type: "API",
      frontend: "No UI",
      backend: "Django",
      data: "Postgres",
      status: "Testing",
      risk: "Low",
    },
  ]);

  const [selectedProjectName, setSelectedProjectName] = useState<string>("BookTrack");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "Web app",
    frontend: "React",
    backend: "Node Express",
    data: "Postgres",
  });

  const [safety, setSafety] = useState({
    secrets: false,
    https: true,
    audit: false,
    threat: false,
  });

  const safetyScore = Object.values(safety).filter(Boolean).length;
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  const activeProject = useMemo(() => {
    return projects.find((p) => p.name === selectedProjectName) || projects[0] || null;
  }, [projects, selectedProjectName]);

  const brief = useMemo(() => {
    if (!activeProject) return "";
    const safetyLines = [
      { label: "Secrets live in environment variables, not in code", ok: safety.secrets },
      { label: "HTTPS everywhere", ok: safety.https },
      { label: "Audit logging planned", ok: safety.audit },
      { label: "Basic threat modelling done", ok: safety.threat },
    ];

    const checklist = safetyLines.map((x) => `- [${x.ok ? "x" : " "}] ${x.label}`).join("\n");

    return [
      `# ${activeProject.name} project brief`,
      ``,
      `This brief was generated in Ransford's Software Development Studio.`,
      `It is local to your browser and includes no telemetry.`,
      ``,
      `## Stack snapshot`,
      `- Type: ${activeProject.type}`,
      `- Frontend: ${activeProject.frontend}`,
      `- Backend: ${activeProject.backend}`,
      `- Data: ${activeProject.data}`,
      ``,
      `## Safety checklist`,
      checklist,
      ``,
      `## Next steps in the studio`,
      `1. Requirements and domain modelling: /dev-studios?tab=requirements`,
      `2. Architecture and system design: /dev-studios?tab=system-design`,
      `3. Backend and API design: /dev-studios?tab=backend`,
      `4. Frontend and integration: /dev-studios?tab=frontend`,
      `5. Security and reliability: /dev-studios?tab=security`,
      `6. Deployment and operations: /dev-studios?tab=deploy`,
      `7. Observability basics: /dev-studios?tab=observability`,
      ``,
      `## Rules for safe learning`,
      `1. Do not paste real secrets, tokens, or passwords.`,
      `2. Do not paste real customer or employee data.`,
      `3. Use synthetic examples and keep notes portable.`,
    ].join("\n");
  }, [activeProject, safety]);

  const summary = useMemo(() => {
    const statusCounts = statusOptions.reduce((acc, s) => ({ ...acc, [s]: projects.filter((p) => p.status === s).length }), {} as Record<Project["status"], number>);
    const riskCounts = riskOptions.reduce((acc, r) => ({ ...acc, [r]: projects.filter((p) => p.risk === r).length }), {} as Record<Project["risk"], number>);
    return { statusCounts, riskCounts };
  }, [projects]);

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(brief);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1500);
    } catch {
      setCopyState("failed");
      window.setTimeout(() => setCopyState("idle"), 2000);
    }
  };

  const downloadBrief = () => {
    if (!activeProject) return;
    const blob = new Blob([brief], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeProject.name.replace(/[^a-z0-9_-]+/gi, "-").replace(/-+/g, "-")}-brief.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const addProject = () => {
    if (!form.name.trim()) return;
    const newProject: Project = {
      name: form.name.trim(),
      type: form.type as Project["type"],
      frontend: form.frontend,
      backend: form.backend,
      data: form.data,
      status: "Designing",
      risk: "Unknown",
    };
    setProjects((prev) => [...prev, newProject]);
    setSelectedProjectName(newProject.name);
    setShowForm(false);
    setForm({ name: "", type: "Web app", frontend: "React", backend: "Node Express", data: "Postgres" });
  };

  return (
    <div className="space-y-6">
      <SecurityBanner />
      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 sm:p-7 space-y-3">
        <p className="text-base text-slate-700">
          This is the flight deck. Keep an eye on your projects, stacks and risk here before you let your inner chaos monkey press deploy.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Project registry</h2>
              <p className="text-sm text-slate-600">A quick census of what you are building and how close it is to escaping.</p>
            </div>
            <button
              onClick={() => setShowForm((v) => !v)}
              className="rounded-2xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
            >
              {showForm ? "Close" : "New project"}
            </button>
          </div>

          {showForm && (
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm font-semibold text-slate-800">
                  Project name
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    value={form.name}
                    maxLength={80}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </label>
                <label className="text-sm font-semibold text-slate-800">
                  Type
                  <select
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  >
                    {["Web app", "API", "Data pipeline", "Internal tool", "Microservice"].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-semibold text-slate-800">
                  Frontend stack
                  <select
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    value={form.frontend}
                    onChange={(e) => setForm((f) => ({ ...f, frontend: e.target.value }))}
                  >
                    {["React", "Vue", "Svelte", "Next", "No UI"].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-semibold text-slate-800">
                  Backend stack
                  <select
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    value={form.backend}
                    onChange={(e) => setForm((f) => ({ ...f, backend: e.target.value }))}
                  >
                    {["Node Express", "Django", "Spring Boot", "ASP.NET Core", "Go service"].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-semibold text-slate-800">
                  Data store
                  <select
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    value={form.data}
                    onChange={(e) => setForm((f) => ({ ...f, data: e.target.value }))}
                  >
                    {["Postgres", "MySQL", "MongoDB", "Redis", "File based"].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={addProject}
                  className="rounded-2xl bg-emerald-600 text-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2"
                >
                  Save project
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-slate-800">
              <thead className="bg-slate-50 text-xs text-slate-600">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Project</th>
                  <th className="px-3 py-2 text-left font-semibold">Type</th>
                  <th className="px-3 py-2 text-left font-semibold">Stack</th>
                  <th className="px-3 py-2 text-left font-semibold">Status</th>
                  <th className="px-3 py-2 text-left font-semibold">Risk</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.name} className={`border-t border-slate-100 ${selectedProjectName === p.name ? "bg-slate-50/80" : ""}`}>
                    <td className="px-3 py-2 font-semibold text-slate-900">
                      <button
                        type="button"
                        onClick={() => setSelectedProjectName(p.name)}
                        className="text-left font-semibold text-slate-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                        aria-label={`Select project: ${p.name}`}
                      >
                        {p.name}
                      </button>
                    </td>
                    <td className="px-3 py-2 text-slate-700">{p.type}</td>
                    <td className="px-3 py-2 text-slate-700">
                      <div className="text-xs text-slate-600">
                        FE: {p.frontend} · BE: {p.backend} · Data: {p.data}
                      </div>
                    </td>
                    <td className="px-3 py-2">{pill(p.status, p.status === "Live" ? "ok" : p.status === "Testing" ? "warn" : "muted")}</td>
                    <td className="px-3 py-2">{pill(p.risk, p.risk === "High" ? "bad" : p.risk === "Medium" ? "warn" : "ok")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-5 space-y-3">
            <h3 className="text-xl font-semibold text-slate-900">Risk and health</h3>
            <div className="text-sm text-slate-700">If the High column is not zero, maybe do not go on holiday.</div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-700">By status</p>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((s) => (
                  <span key={s} className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-800 ring-1 ring-slate-200">
                    {s}: {summary.statusCounts[s]}
                  </span>
                ))}
              </div>
              <p className="text-xs font-semibold text-slate-700 mt-2">By risk</p>
              <div className="flex flex-wrap gap-2">
                {riskOptions.map((r) => (
                  <span
                    key={r}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                      r === "High"
                        ? "bg-rose-100 text-rose-800 ring-rose-200"
                        : r === "Medium"
                        ? "bg-amber-100 text-amber-800 ring-amber-200"
                        : "bg-emerald-100 text-emerald-800 ring-emerald-200"
                    }`}
                  >
                    {r}: {summary.riskCounts[r]}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-5 space-y-3">
            <h3 className="text-xl font-semibold text-slate-900">Safety status</h3>
            <div className="space-y-2">
              {[
                { key: "secrets", label: "Secrets live in environment variables, not in code" },
                { key: "https", label: "HTTPS everywhere" },
                { key: "audit", label: "Audit logging planned" },
                { key: "threat", label: "Basic threat modelling done" },
              ].map((item) => (
                <SwitchRow
                  key={item.key}
                  label={item.label}
                  checked={(safety as any)[item.key]}
                  tone="sky"
                  onCheckedChange={(checked) => setSafety((prev) => ({ ...prev, [item.key]: checked }))}
                />
              ))}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-700">
                <span>Studio safety</span>
                <span>{safetyScore}/4</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100">
                <div
                  className={`h-2 rounded-full transition-all ${
                    safetyScore <= 1 ? "bg-rose-400" : safetyScore <= 3 ? "bg-amber-400" : "bg-emerald-500"
                  }`}
                  style={{ width: `${(safetyScore / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-5 space-y-3">
            <h3 className="text-xl font-semibold text-slate-900">Project brief</h3>
            <p className="text-sm text-slate-700">
              Pick a project from the table, then export a brief you can drop into a repo as a starting `README.md`.
            </p>
            <textarea
              value={brief}
              readOnly
              rows={10}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 p-3 text-xs text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={copyBrief}
                disabled={!brief}
                className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
              >
                {copyState === "copied" ? "Copied" : copyState === "failed" ? "Copy failed" : "Copy brief"}
              </button>
              <button
                type="button"
                onClick={downloadBrief}
                disabled={!brief}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
              >
                Download `.md`
              </button>
            </div>
            <p className="text-xs text-slate-600">This stays local. You control what goes into a real repo.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
