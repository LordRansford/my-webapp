"use client";

import Link from "next/link";
import { useState } from "react";
import TemplateGrid from "@/components/architecture-diagrams/Templates/TemplateGrid";
import DiagramPackViewer from "@/components/architecture-diagrams/Preview/DiagramPackViewer";
import { ARCHITECTURE_TEMPLATES, getArchitectureTemplate } from "@/lib/architecture-diagrams/templates";
import { validateArchitectureDiagramInput } from "@/lib/architecture-diagrams/validate";
import { generateDiagramPack } from "@/lib/architecture-diagrams/generate/pack";
import { emitArchitectureTelemetry, durationBucketFrom } from "@/lib/architecture-diagrams/telemetry/client";

export default function TemplatesGalleryClient() {
  const [previewId, setPreviewId] = useState(null);
  const [previewPack, setPreviewPack] = useState(null);
  const [status, setStatus] = useState("");

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8 space-y-6">
      <header className="space-y-3 rounded-3xl bg-gradient-to-br from-slate-50 via-sky-50/60 to-slate-50 p-8 shadow-sm ring-1 ring-slate-100">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Architecture Diagram Studio</p>
        <h1 className="text-4xl font-semibold leading-tight text-slate-900">Templates</h1>
        <p className="max-w-3xl text-base text-slate-700">
          Start from a curated example. You can edit everything before generating diagrams.
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          <Link
            href="/studios/architecture-diagram-studio"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            Back
          </Link>
          <Link
            href="/studios/architecture-diagram-studio/wizard"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            Open wizard
          </Link>
        </div>
      </header>

      {status ? <p className="text-sm font-semibold text-slate-700">{status}</p> : null}

      <TemplateGrid
        templates={ARCHITECTURE_TEMPLATES}
        onUse={(id) => {
          setStatus("");
          window.location.href = `/studios/architecture-diagram-studio/wizard?template=${encodeURIComponent(id)}`;
        }}
        onPreview={(id) => {
          setStatus("");
          setPreviewId(id);
          setPreviewPack(null);
          const t = getArchitectureTemplate(id);
          if (!t) return;
          const validation = validateArchitectureDiagramInput(t.input);
          if (!validation.ok) {
            setPreviewPack(null);
            return;
          }
          const started = Date.now();
          emitArchitectureTelemetry({
            event: "generation_requested",
            audience: validation.value.audience,
            goal: validation.value.goal,
            outcome: "ok",
          });
          try {
            const pack = generateDiagramPack(validation.value);
            setPreviewPack(pack);
            emitArchitectureTelemetry({
              event: "generation_completed",
              audience: validation.value.audience,
              goal: validation.value.goal,
              outcome: "ok",
              durationBucket: durationBucketFrom(started),
            });
          } catch {
            emitArchitectureTelemetry({
              event: "generation_completed",
              audience: validation.value.audience,
              goal: validation.value.goal,
              outcome: "failed",
              durationBucket: durationBucketFrom(started),
            });
            setPreviewPack(null);
          }
          // Scroll to preview calmly.
          setTimeout(() => {
            const el = document.getElementById("template-preview");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 30);
        }}
      />

      <section id="template-preview" className="pt-2">
        {previewPack ? (
          <div className="space-y-3">
            <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Preview</p>
              <p className="mt-2 text-sm text-slate-700">
                These diagrams are generated drafts. Review before using in decisions.
              </p>
            </div>
            <DiagramPackViewer pack={previewPack} />
          </div>
        ) : previewId ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-900 shadow-sm">
            <p className="font-semibold">Preview not available</p>
            <p className="mt-1">This template could not be validated. Please try a different template.</p>
          </div>
        ) : null}
      </section>
    </main>
  );
}


