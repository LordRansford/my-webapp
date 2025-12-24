"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { StudioToolTemplate, StudioResultsTemplate } from "@/components/templates/PageTemplates";
import { validateArchitectureDiagramInput } from "@/lib/architecture-diagrams/validate";
import { generateDiagramPack } from "@/lib/architecture-diagrams/generate/pack";
import DiagramPackViewer from "@/components/architecture-diagrams/Preview/DiagramPackViewer";
import { ARCH_DIAGRAM_LIMITS } from "@/lib/architecture-diagrams/limits";

export default function ArchitectureDiagramEditorClient() {
  const [raw, setRaw] = useState("");
  const [errors, setErrors] = useState([]);
  const [pack, setPack] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | validating | error | ok
  const [errorMessage, setErrorMessage] = useState("");

  const limits = useMemo(
    () => [
      `Max total text: ${ARCH_DIAGRAM_LIMITS.maxTotalTextChars} chars`,
      `Max system name: ${ARCH_DIAGRAM_LIMITS.maxSystemNameChars} chars`,
      `Max description: ${ARCH_DIAGRAM_LIMITS.maxSystemDescriptionChars} chars`,
      `Actors: up to ${ARCH_DIAGRAM_LIMITS.maxActors}`,
      `External systems: up to ${ARCH_DIAGRAM_LIMITS.maxExternalSystems}`,
      `Containers: up to ${ARCH_DIAGRAM_LIMITS.maxContainers}`,
      `Data stores: up to ${ARCH_DIAGRAM_LIMITS.maxDataStores}`,
      `Data types: up to ${ARCH_DIAGRAM_LIMITS.maxDataTypes}`,
      `Flows: up to ${ARCH_DIAGRAM_LIMITS.maxFlows}`,
    ],
    []
  );

  const onGenerate = () => {
    setStatus("validating");
    setErrorMessage("");
    setErrors([]);
    setPack(null);
    let parsed;
    try {
      parsed = JSON.parse(raw || "{}");
    } catch (err) {
      setStatus("error");
      setErrorMessage("Input is not valid JSON. Please paste valid JSON and try again.");
      return;
    }
    const validation = validateArchitectureDiagramInput(parsed);
    if (!validation.ok) {
      setStatus("error");
      setErrors(validation.errors || []);
      setErrorMessage("Please fix the validation errors and try again.");
      return;
    }
    try {
      const result = generateDiagramPack(validation.value);
      setPack(result);
      setStatus("ok");
    } catch (err) {
      setStatus("error");
      setErrorMessage("Could not generate diagrams. Please simplify the input and try again.");
    }
  };

  return (
    <StudioToolTemplate
      backHref="/studios/architecture-diagram-studio"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Studios", href: "/studios" },
        { label: "Architecture Diagram Studio", href: "/studios/architecture-diagram-studio" },
        { label: "Power editor" },
      ]}
    >
      <header className="space-y-2">
        <p className="eyebrow">Studio</p>
        <h1 className="text-3xl font-semibold text-slate-900">Architecture Diagram Studio · Power editor</h1>
        <p className="text-slate-700">
          Paste a JSON payload that matches the architecture diagram schema. Inputs are validated locally; no data leaves your browser.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/studios/architecture-diagram-studio/wizard"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
          >
            Use guided wizard
          </Link>
        </div>
      </header>

      <section className="mt-4 grid gap-4 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-3 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Input JSON</p>
              <p className="text-sm text-slate-700">Use the wizard first if you need a schema example.</p>
            </div>
            <button
              type="button"
              className="button primary"
              onClick={onGenerate}
              disabled={status === "validating"}
            >
              {status === "validating" ? "Validating..." : "Generate diagrams"}
            </button>
          </div>
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={16}
            className="w-full rounded-2xl border border-slate-200 bg-white p-3 font-mono text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            placeholder={`{\n  "systemName": "Sample system",\n  "systemDescription": "What it does...",\n  "goal": "explain",\n  "audience": "students",\n  "users": [{ "name": "User", "description": "..." }],\n  "externalSystems": [],\n  "containers": [],\n  "dataTypes": [],\n  "dataStores": [],\n  "flows": [],\n  "security": { "authenticationMethod": "", "trustBoundaries": [], "hasNoTrustBoundariesConfirmed": true, "adminAccess": false, "sensitiveDataCategories": [] }\n}`}
            aria-label="Architecture diagram JSON input"
          />
          {status === "error" && (errorMessage || errors.length) ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <p className="m-0 font-semibold">We could not generate diagrams.</p>
              {errorMessage ? <p className="mt-1 m-0">{errorMessage}</p> : null}
              {errors.length ? (
                <ul className="mt-2 space-y-1 list-disc pl-5">
                  {errors.map((e) => (
                    <li key={`${e.path}-${e.message}`}>{e.path}: {e.message}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Limits</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {limits.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-600">
            Data stays in your browser. Downloads are generated client-side as SVG/PNG.
          </p>
        </div>
      </section>

      {pack ? (
        <StudioResultsTemplate
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Studios", href: "/studios" },
            { label: "Architecture Diagram Studio", href: "/studios/architecture-diagram-studio" },
            { label: "Generated diagrams" },
          ]}
          backHref="/studios/architecture-diagram-studio"
        >
          <DiagramPackViewer pack={pack} />
        </StudioResultsTemplate>
      ) : null}
    </StudioToolTemplate>
  );
}
