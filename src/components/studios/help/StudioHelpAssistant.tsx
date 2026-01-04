"use client";

import React, { useMemo, useState } from "react";
import { Sparkles, Wand2 } from "lucide-react";
import type { GeneratedFile } from "@/lib/compute/generatedFiles";
import GeneratedFilesPanel from "@/components/shared/GeneratedFilesPanel";

type StudioId = "dev" | "cyber" | "data" | "ai" | "architecture" | "lab";

const studioMeta: Record<StudioId, { label: string; helpScope: string; exampleTypes: Array<{ id: string; label: string }> }> = {
  dev: {
    label: "Dev Studio",
    helpScope: "APIs, schemas, CI/CD, deployment, architecture decisions, and project scaffolding.",
    exampleTypes: [
      { id: "openapi", label: "OpenAPI spec (YAML)" },
      { id: "github-actions", label: "GitHub Actions workflow (YAML)" },
      { id: "adr", label: "ADR (Markdown)" },
    ],
  },
  cyber: {
    label: "Cyber Studio",
    helpScope: "Threat modelling, risk registers, IR playbooks, policies, and security architecture.",
    exampleTypes: [
      { id: "threat-model", label: "Threat model (JSON)" },
      { id: "risk-register", label: "Risk register (CSV)" },
      { id: "ir-playbook", label: "Incident response playbook (Markdown)" },
    ],
  },
  data: {
    label: "Data Studio",
    helpScope: "Data pipelines, quality checks, catalog/schema, governance, and dashboards.",
    exampleTypes: [
      { id: "dataset-csv", label: "Dataset (CSV) + schema (JSON)" },
      { id: "pipeline-spec", label: "Pipeline spec (YAML)" },
    ],
  },
  ai: {
    label: "AI Studio",
    helpScope: "AI Studio projects, safe prompting, local vs compute runs, and export packs.",
    exampleTypes: [
      { id: "ai-studio-project", label: "AI Studio project JSON" },
      { id: "prompt-pack", label: "Prompt pack (Markdown)" },
    ],
  },
  architecture: {
    label: "Architecture Diagram Studio",
    helpScope: "Diagram briefs, assumptions, boundaries, and Mermaid-style architecture diagrams.",
    exampleTypes: [
      { id: "mermaid", label: "Mermaid diagram (.mmd)" },
      { id: "diagram-brief", label: "Diagram brief (Markdown)" },
    ],
  },
  lab: {
    label: "Studios (general)",
    helpScope: "Navigation, safe usage, and choosing the right studio for your goal.",
    exampleTypes: [{ id: "project-brief", label: "Project brief (Markdown)" }],
  },
};

export default function StudioHelpAssistant(props: { initialStudio?: string }) {
  const initialStudio = (props.initialStudio || "lab") as StudioId;
  const [studio, setStudio] = useState<StudioId>(studioMeta[initialStudio] ? initialStudio : "lab");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string>("");
  const [files, setFiles] = useState<GeneratedFile[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [exampleType, setExampleType] = useState(studioMeta[studio].exampleTypes[0]?.id || "project-brief");
  const [projectName, setProjectName] = useState("My project");
  const [requirements, setRequirements] = useState("Goal: …\nUsers: …\nKey features: …\nConstraints: …");
  const suggestedPrompts = useMemo(() => {
    const base = [
      "Explain what to do first, step by step.",
      "Generate an example file I can upload and then tell me how to tweak it.",
      "What’s the safest way to use this studio for a beginner?",
    ];
    if (studio === "architecture") base.unshift("Generate a Mermaid diagram for a simple web app (web, API, database).");
    if (studio === "cyber") base.unshift("Generate a threat model for an e-commerce website and a risk register CSV.");
    if (studio === "data") base.unshift("Generate a small CSV dataset and matching schema.json for analytics.");
    if (studio === "dev") base.unshift("Generate an OpenAPI spec for a todo API with auth.");
    if (studio === "ai") base.unshift("Generate an AI Studio project JSON I can import and run.");
    return base.slice(0, 6);
  }, [studio]);

  const run = async (mode: "chat" | "generate") => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/studios/help/query", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          studio,
          mode,
          question: mode === "chat" ? question : "",
          example: mode === "generate" ? { type: exampleType, projectName, requirements } : null,
          requestedComplexityPreset: "standard",
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setError(String(data?.error || "Help request failed."));
        return;
      }
      setAnswer(String(data.answer || ""));
      setFiles(Array.isArray(data.files) ? data.files : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Help request failed.");
    } finally {
      setBusy(false);
    }
  };

  const meta = studioMeta[studio];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-slate-900">Studio expert assistant</h2>
          <p className="text-sm text-slate-700">
            Scope: <span className="font-semibold">{meta.label}</span>. I will only answer inside this scope: {meta.helpScope}
          </p>
        </div>
        <div className="w-full max-w-sm">
          <label className="text-xs font-semibold text-slate-700">Studio</label>
          <select
            value={studio}
            onChange={(e) => {
              const next = e.target.value as StudioId;
              setStudio(next);
              setExampleType(studioMeta[next].exampleTypes[0]?.id || "project-brief");
              setAnswer("");
              setFiles([]);
            }}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {Object.entries(studioMeta).map(([id, m]) => (
              <option key={id} value={id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900" role="alert">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">Ask a question</h3>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setQuestion(p)}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                {p}
              </button>
            ))}
          </div>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={5}
            className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Ask about the selected studio…"
          />
          <button
            type="button"
            onClick={() => run("chat")}
            disabled={busy || !question.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Ask Professor Ransford
          </button>
          <p className="text-xs text-slate-600">
            If your question is outside this studio, I will refuse and suggest where to go instead.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">Generate an uploadable example</h3>
          <label className="text-xs font-semibold text-slate-700">Example type</label>
          <select
            value={exampleType}
            onChange={(e) => setExampleType(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {meta.exampleTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>

          <label className="text-xs font-semibold text-slate-700">Project name</label>
          <input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="e.g. Online Toy Shop"
          />

          <label className="text-xs font-semibold text-slate-700">Your requirements (the assistant will tailor the example)</label>
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            rows={5}
            className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />

          <button
            type="button"
            onClick={() => run("generate")}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            <Wand2 className="h-4 w-4" aria-hidden="true" />
            Generate example files
          </button>
          <p className="text-xs text-slate-600">
            You’ll get files you can copy/paste or download as real files for upload.
          </p>
        </div>
      </div>

      {answer || files.length ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4">
          {answer ? (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-900">Answer</h3>
              <pre className="whitespace-pre-wrap text-sm text-slate-800">{answer}</pre>
            </div>
          ) : null}

          {files.length ? <GeneratedFilesPanel files={files} title="Generated files" /> : null}
        </div>
      ) : null}
    </section>
  );
}

