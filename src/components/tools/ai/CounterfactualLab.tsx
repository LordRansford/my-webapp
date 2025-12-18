"use client";

import React from "react";
import { Repeat2 } from "lucide-react";
import { AiToolCard } from "./AiToolCard";

export function CounterfactualLab() {
  return (
    <AiToolCard
      id="counterfactual-lab-title"
      title="Counterfactual and what if lab"
      icon={<Repeat2 className="h-4 w-4" aria-hidden="true" />}
      description="Upload a dataset with numeric features, train a small model in your browser and move sliders to see how the predicted probability changes. This helps you build a practical feel for what the model reacts to and what it mostly ignores."
    >
      <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 text-sm text-slate-700">
        This lab placeholder is ready to be wired into a richer counterfactual explorer. Plug in your model and feature sliders here
        when you are ready to expand it.
      </div>
    </AiToolCard>
  );
}
