"use client";

import { useEffect, useMemo, useState } from "react";
import VariantPicker from "./VariantPicker";
import MermaidRenderer from "./MermaidRenderer";
import AssumptionsPanel from "./AssumptionsPanel";
import { DiagramTabs } from "./DiagramTabs";
import ExportPanel from "../Export/ExportPanel";
import { emitArchitectureTelemetry } from "@/lib/architecture-diagrams/telemetry/client";
import { getStabilityNote } from "@/lib/architecture-diagrams/rules/levels";
import SecurityGuidancePanel from "./SecurityGuidancePanel";
import ArchitectureBriefPanel from "./ArchitectureBriefPanel";
import ADRPanel from "./ADRPanel";
import { buildArchitectureBriefMarkdown } from "@/lib/architecture-diagrams/docs/brief";
import { buildAdrStubMarkdown } from "@/lib/architecture-diagrams/docs/adr";

export default function DiagramPackViewer({ pack }) {
  const [variantId, setVariantId] = useState(pack?.variants?.[0]?.id || "minimal");
  const [diagramId, setDiagramId] = useState("context");
  const [lastSvg, setLastSvg] = useState("");

  useEffect(() => {
    if (!pack?.input) return;
    emitArchitectureTelemetry({
      event: "variant_selected",
      variantId,
      diagramType: diagramId,
      audience: pack.input.audience,
      goal: pack.input.goal,
      outcome: "ok",
    });
  }, [diagramId, pack?.input, variantId]);

  const variant = useMemo(() => {
    const found = (pack?.variants || []).find((v) => v.id === variantId);
    return found || (pack?.variants || [])[0];
  }, [pack?.variants, variantId]);

  const mermaidText = variant?.diagrams?.[diagramId] || "";
  const appendixMarkdown = useMemo(() => {
    if (!pack?.inputVersion) return "";
    const brief = buildArchitectureBriefMarkdown({
      input: pack.input,
      inputVersion: pack.inputVersion,
      assumptions: variant.assumptions || [],
      omissions: variant.omissions || [],
    });
    const adr = buildAdrStubMarkdown({
      input: pack.input,
      inputVersion: pack.inputVersion,
      assumptions: variant.assumptions || [],
      omissions: variant.omissions || [],
    });
    return `${brief}\n\n---\n\n${adr}\n`;
  }, [pack, variant.assumptions, variant.omissions]);

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
        <p className="mt-2 text-sm text-slate-700">Switch variants to change emphasis. Switch tabs to view each diagram type.</p>
        <div className="mt-3 grid gap-3 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-800">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Version awareness</p>
            <p className="mt-1 font-semibold text-slate-900">Generated from input version {pack.inputVersion}</p>
            {pack.input.versionName ? <p className="mt-1 text-xs text-slate-600">Version name: {pack.input.versionName}</p> : null}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-800">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Expected stability</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
              <li>{getStabilityNote("c4-context")}</li>
              <li>{getStabilityNote("c4-container")}</li>
              <li>{getStabilityNote("deployment")}</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-800">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Purpose guardrails</p>
            {(pack.purpose?.warnings || []).length ? (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-800">
                {pack.purpose.warnings.map((w, idx) => (
                  <li key={`${w.message}-${idx}`}>{w.message}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-700">No guardrail warnings.</p>
            )}
            <p className="mt-3 text-xs text-slate-600">These are drafts for discussion and review.</p>
          </div>
        </div>
        <div className="mt-4">
            <VariantPicker variants={pack.variants} selectedId={variantId} onSelect={setVariantId} audience={pack.input.audience} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          <SecurityGuidancePanel inputVersion={pack.inputVersion} goal={pack.input.goal} />
          <ArchitectureBriefPanel pack={pack} assumptions={variant.assumptions} omissions={variant.omissions} />
          <ADRPanel pack={pack} assumptions={variant.assumptions} omissions={variant.omissions} />
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
            <DiagramTabs activeId={diagramId} onChange={setDiagramId} />
          </div>
          <ExportPanel
            svgText={lastSvg}
            systemName={pack.input.systemName}
            diagramType={diagramId}
            variantLabel={variant.label}
            variantId={variant.id}
            audience={pack.input.audience}
            goal={pack.input.goal}
            appendixMarkdown={appendixMarkdown}
            inputVersion={pack.inputVersion}
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


