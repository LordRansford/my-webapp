"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import AiOverviewLab from "./sections/AiOverviewLab";
import AiFundamentalsLab from "./sections/AiFundamentalsLab";
import ModelTypesLab from "./sections/ModelTypesLab";
import DataTrainingLab from "./sections/DataTrainingLab";
import InferenceLimitationsLab from "./sections/InferenceLimitationsLab";
import EvaluationBiasLab from "./sections/EvaluationBiasLab";
import ResponsibleAiLab from "./sections/ResponsibleAiLab";
import PracticalToolsLab from "./sections/PracticalToolsLab";
import PracticalUseCasesLab from "./sections/PracticalUseCasesLab";
import AiStudioReflection from "./sections/AiStudioReflection";
import StudioTabs from "@/components/studios/StudioTabs";

const tabs = [
  { id: "overview", label: "Overview", component: AiOverviewLab },
  { id: "what-ai-is", label: "What AI is and is not", component: AiFundamentalsLab },
  { id: "model-types", label: "Model types and capabilities", component: ModelTypesLab },
  { id: "data-training", label: "Data and training basics", component: DataTrainingLab },
  { id: "inference", label: "Inference and limitations", component: InferenceLimitationsLab },
  { id: "eval-bias", label: "Evaluation and bias", component: EvaluationBiasLab },
  { id: "responsible", label: "Responsible AI", component: ResponsibleAiLab },
  { id: "tools", label: "Practical experimentation tools", component: PracticalToolsLab },
  { id: "use-cases", label: "Practical use cases", component: PracticalUseCasesLab },
  { id: "reflection", label: "Reflection and next steps", component: AiStudioReflection },
];

function tabClass(active: boolean) {
  return `whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
    active ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
  }`;
}

export default function AiStudiosPage() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const ActiveComp = useMemo(() => tabs.find((t) => t.id === activeTab)?.component || AiOverviewLab, [activeTab]);

  return (
    <div className="page-content max-w-6xl mx-auto space-y-8">
      <header className="rounded-3xl bg-gradient-to-br from-slate-50 via-indigo-50/60 to-slate-50 ring-1 ring-slate-100 px-6 py-6 sm:px-8 sm:py-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] space-y-3">
        <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 text-white px-3 py-1 text-xs font-semibold">
          Studio
          <span aria-hidden="true">•</span> AI
        </div>
        <h1 className="text-3xl font-semibold text-slate-900">AI Studio (Responsible, practical)</h1>
        <p className="text-base text-slate-700 max-w-3xl leading-relaxed">
          This studio is about understanding, evaluation, and responsible use of AI. It is built for professionals: calm, honest, and focused on decision quality.
        </p>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Link href="/ai" className="font-semibold text-emerald-700 hover:underline">
            Back to AI course
          </Link>
          <span className="text-slate-300" aria-hidden="true">
            |
          </span>
          <Link href="/studios/model-forge" className="font-semibold text-emerald-700 hover:underline">
            Open Model Forge
          </Link>
          <span className="text-slate-300" aria-hidden="true">
            |
          </span>
          <Link href="/studios" className="font-semibold text-emerald-700 hover:underline">
            AI Studios hub
          </Link>
        </div>
      </header>

      <div className="overflow-x-auto">
        <StudioTabs
          ariaLabel="AI Studio sections"
          tabs={tabs}
          activeId={activeTab}
          onSelect={setActiveTab}
        />
      </div>

      <section id={`panel-${activeTab}`} role="tabpanel" aria-label={tabs.find((t) => t.id === activeTab)?.label}>
        <ActiveComp />
      </section>
    </div>
  );
}



