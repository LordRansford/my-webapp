"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import { TemplateSafetyNotice } from "./TemplateSafetyNotice";

const STORAGE_PREFIX = "rn-template-tool";

function formatDate(ts) {
  return new Date(ts).toLocaleString();
}

export function TemplateToolPage({ template, detail }) {
  const storageKey = `${STORAGE_PREFIX}-${template.id}`;
  const historyKey = `${STORAGE_PREFIX}-${template.id}-history`;

  const [context, setContext] = useState(detail.scenario || "");
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState([]);
  const [includeRisks, setIncludeRisks] = useState(true);
  const [includeExports, setIncludeExports] = useState(true);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || "{}");
      if (stored.context) setContext(stored.context);
      if (stored.notes) setNotes(stored.notes);
      if (stored.result) setResult(stored.result);
    } catch {
      // ignore
    }
    try {
      const storedHistory = JSON.parse(localStorage.getItem(historyKey) || "[]");
      setHistory(Array.isArray(storedHistory) ? storedHistory : []);
    } catch {
      setHistory([]);
    }
  }, [storageKey, historyKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ context, notes, result }));
  }, [storageKey, context, notes, result]);

  const generatedOutput = useMemo(() => {
    if (!result) return null;
    return result.split("\n").filter(Boolean);
  }, [result]);

  const runGenerator = () => {
    const base = [
      `Title: ${template.title}`,
      `Category: ${template.category}`,
      `Scenario: ${context || "Not provided yet"}`,
      "",
      "Steps followed:",
      ...detail.steps.map((s, idx) => `${idx + 1}. ${s}`),
      "",
      "Outputs to review:",
      ...detail.outputs.map((o, idx) => `${idx + 1}. ${o}`),
    ];

    if (includeRisks) {
      base.push("", "Safety and risk checks:", "- No live scanning or outbound calls.", "- Keep data non-sensitive and under 5MB.");
      detail.safety.forEach((s) => base.push(`- ${s}`));
    }

    if (includeExports) {
      base.push("", "Exports to try:", `- ${template.exportFormatsSupported.join(", ")}`);
    }

    if (notes?.trim()) {
      base.push("", "Notes:", notes.trim());
    }

    setResult(base.join("\n"));
  };

  const saveHistory = () => {
    const entry = {
      id: `${Date.now()}`,
      context,
      notes,
      result,
      savedAt: Date.now(),
    };
    const next = [entry, ...history].slice(0, 10);
    setHistory(next);
    localStorage.setItem(historyKey, JSON.stringify(next));
  };

  const resetAll = () => {
    setContext(detail.scenario || "");
    setNotes("");
    setResult("");
  };

  const exportResult = () => {
    const blob = new Blob(
      [
        `Template: ${template.title}`,
        `Category: ${template.category}`,
        "",
        result || "No run yet. Generate first.",
      ].join("\n"),
      { type: "text/plain" }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${template.id}-report.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout title={`${template.title} - Ransford's Notes`} description={template.description}>
      <nav className="breadcrumb">
        <Link href="/templates">Templates</Link>
        <span aria-hidden="true"> / </span>
        <Link href={`/templates/${template.category}`}>{template.category}</Link>
        <span aria-hidden="true"> / </span>
        <span>{template.title}</span>
      </nav>

      <article className="lesson-content">
        <p className="eyebrow">{template.category}</p>
        <h1>{template.title}</h1>
        <p className="lead">{template.description}</p>

        <div className="card" style={{ padding: "1rem", borderRadius: "18px", border: "1px solid #e2e8f0", background: "#fff", boxShadow: "0 12px 24px rgba(15,23,42,0.05)", display: "grid", gap: "1rem" }}>
          <section className="stack" style={{ gap: "0.35rem" }}>
            <h2 className="rn-h3">What it does</h2>
            <p>{detail.scenario}</p>
            <TemplateSafetyNotice />
          </section>

          <section className="grid" style={{ display: "grid", gap: "0.75rem" }}>
            <label>
              <span className="eyebrow">Describe your input or paste a tiny sample</span>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={4}
                placeholder="Outline the scenario, dataset snippet, or problem statement."
              />
            </label>
            <label>
              <span className="eyebrow">Notes to include</span>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Key risks, decisions, or assumptions" />
            </label>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input type="checkbox" checked={includeRisks} onChange={(e) => setIncludeRisks(e.target.checked)} />
                <span>Include safety reminders</span>
              </label>
              <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input type="checkbox" checked={includeExports} onChange={(e) => setIncludeExports(e.target.checked)} />
                <span>List export options</span>
              </label>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button className="button primary" type="button" onClick={runGenerator}>
                Generate output
              </button>
              <button className="button" type="button" onClick={saveHistory} disabled={!result}>
                Save state
              </button>
              <button className="button" type="button" onClick={exportResult} disabled={!result}>
                Export
              </button>
              <button className="button ghost" type="button" onClick={resetAll}>
                Reset
              </button>
            </div>
          </section>

          <section className="stack" style={{ gap: "0.5rem" }}>
            <h2 className="rn-h3">Output explanation</h2>
            <p className="muted">Each run produces a compact summary that you can copy, save, or export.</p>
            <div className="mono" style={{ whiteSpace: "pre-wrap", background: "#0f172a", color: "#e2e8f0", padding: "1rem", borderRadius: "14px", minHeight: "120px" }} aria-live="polite">
              {generatedOutput ? generatedOutput.join("\n") : "Generate to see the output here."}
            </div>
          </section>

          <section className="stack" style={{ gap: "0.5rem" }}>
            <h2 className="rn-h3">Quick example</h2>
            <div className="card" style={{ padding: "0.75rem", borderRadius: "14px", border: "1px dashed #cbd5e1", background: "#f8fafc" }}>
              <p className="eyebrow">Sample input</p>
              <p className="mono" style={{ whiteSpace: "pre-wrap" }}>{detail.example.input}</p>
              <p className="eyebrow">Expected output</p>
              <p className="mono" style={{ whiteSpace: "pre-wrap" }}>{detail.example.output}</p>
            </div>
          </section>

          <section className="stack" style={{ gap: "0.5rem" }}>
            <h2 className="rn-h3">History</h2>
            <p className="muted">History is stored in your browser only. Clear it from here.</p>
            {history.length === 0 && <p className="muted">No saved runs yet.</p>}
            {history.length > 0 && (
              <ul className="stack" style={{ gap: "0.5rem", paddingLeft: "1rem" }}>
                {history.map((item) => (
                  <li key={item.id} className="card" style={{ padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
                    <div className="flex-between" style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
                      <strong>{formatDate(item.savedAt)}</strong>
                      <button
                        type="button"
                        className="button ghost"
                        onClick={() => {
                          setHistory((prev) => {
                            const next = prev.filter((h) => h.id !== item.id);
                            localStorage.setItem(historyKey, JSON.stringify(next));
                            return next;
                          });
                        }}
                        aria-label="Delete history entry"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="mono" style={{ whiteSpace: "pre-wrap" }}>
                      {item.result || item.context}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="stack" style={{ gap: "0.5rem" }}>
            <h2 className="rn-h3">How to use</h2>
            <ol className="rn-body" style={{ paddingLeft: "1.25rem" }}>
              {detail.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="muted">
              Avoid uploading sensitive information. Tools that accept URLs only parse text locally and never fetch the URL. Files stay in memory and are not stored.
            </p>
          </section>
        </div>
      </article>
    </Layout>
  );
}
