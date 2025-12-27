"use client";

import { useEffect, useId, useMemo, useState } from "react";

function normaliseDiagramText(input) {
  if (Array.isArray(input)) return input.join("");
  return String(input ?? "");
}

function getIsDark() {
  if (typeof window === "undefined") return false;
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  const classDark = document?.documentElement?.classList?.contains("dark");
  return Boolean(prefersDark || classDark);
}

export default function MermaidDiagram({ children, caption, ariaLabel }) {
  const id = useId();
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");

  const diagramText = useMemo(() => normaliseDiagramText(children).trim(), [children]);
  const label = ariaLabel || caption || "Diagram";

  useEffect(() => {
    let cancelled = false;

    async function render() {
      setError("");
      if (!diagramText) {
        setSvg("");
        return;
      }

      try {
        const mermaid = (await import("mermaid")).default;
        const dark = getIsDark();

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          themeVariables: dark
            ? {
                background: "#0f172a",
                primaryColor: "#111c33",
                primaryTextColor: "#e5e7eb",
                lineColor: "#94a3b8",
                fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif",
              }
            : {
                background: "#ffffff",
                primaryColor: "#eef2ff",
                primaryTextColor: "#0f172a",
                lineColor: "#475569",
                fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif",
              },
        });

        const key = `m-${id.replace(/:/g, "")}`;
        const out = await mermaid.render(key, diagramText);
        if (cancelled) return;
        setSvg(out.svg || "");
      } catch (e) {
        if (cancelled) return;
        setError(e?.message || "Failed to render Mermaid diagram.");
        setSvg("");
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [diagramText, id]);

  return (
    <figure className="my-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div className="p-4">
        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-200">
            <p className="font-semibold">Diagram failed to render.</p>
            <p className="mt-1">{error}</p>
            <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-white/70 p-3 text-[0.7rem] text-slate-800 dark:bg-black/30 dark:text-slate-100">
              {diagramText}
            </pre>
          </div>
        ) : (
          <div
            className="mermaid-diagram overflow-x-auto"
            aria-label={label}
            role="img"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        )}
      </div>
      {caption ? (
        <figcaption className="border-t border-slate-100 px-4 py-3 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-300">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

