"use client";

import { useMemo, useState } from "react";
import VariantPicker from "./VariantPicker";
import MermaidRenderer from "./MermaidRenderer";
import AssumptionsPanel from "./AssumptionsPanel";
import { DiagramTabs } from "./DiagramTabs";
import ExportPanel from "../Export/ExportPanel";

export default function DiagramPackViewer({ pack }) {
  const [variantId, setVariantId] = useState(pack?.variants?.[0]?.id || "minimal");
  const [diagramId, setDiagramId] = useState("context");
  const [lastSvg, setLastSvg] = useState("");

  const variant = useMemo(() => {
    const found = (pack?.variants || []).find((v) => v.id === variantId);
    return found || (pack?.variants || [])[0];
  }, [pack?.variants, variantId]);

  const mermaidText = variant?.diagrams?.[diagramId] || "";

  if (!pack || !pack.variants || pack.variants.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <p className="text-sm text-slate-700">No diagram pack yet.</p>
      </div>
    );
  }

  return (
    <section className="space-y-5" aria-label="Diagram pack viewer">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Diagram pack</p>
        <p className="mt-2 text-sm text-slate-700">
          Switch variants to change emphasis. Switch tabs to view each diagram type.
        </p>
        <div className="mt-4">
          <VariantPicker variants={pack.variants} selectedId={variantId} onSelect={setVariantId} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
            <DiagramTabs activeId={diagramId} onChange={setDiagramId} />
          </div>
          <ExportPanel
            svgText={lastSvg}
            systemName={pack.input.systemName}
            diagramType={diagramId}
            variantLabel={variant.label}
          />
          <MermaidRenderer
            mermaidText={mermaidText}
            ariaLabel={`${variant.label} ${diagramId} diagram`}
            onRenderedSvg={setLastSvg}
          />
        </div>
        <aside className="lg:col-span-4 xl:col-span-3">
          <AssumptionsPanel assumptions={variant.assumptions} omissions={variant.omissions} />
        </aside>
      </div>
    </section>
  );
}


