"use client";

import React from "react";
import { ToolOutputNotes } from "@/components/tools/ToolOutputNotes";

interface AiToolCardProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  whatThisTellsYou?: string[];
  interpretationTips?: string[];
  limitations?: string[];
  children: React.ReactNode;
}

export function AiToolCard({
  id,
  title,
  icon,
  description,
  whatThisTellsYou,
  interpretationTips,
  limitations,
  children,
}: AiToolCardProps) {
  return (
    <section
      aria-labelledby={id}
      className="rounded-3xl bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 p-6 sm:p-8 space-y-6 transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(15,23,42,0.10)]"
    >
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-50 text-slate-700 ring-1 ring-slate-100">
            {icon}
          </span>
          <div className="space-y-1">
            <h2 id={id} className="text-lg sm:text-xl font-semibold text-slate-900">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">{description}</p>
          </div>
        </div>
      </header>

      {children}

      <ToolOutputNotes
        whatThisTellsYou={
          whatThisTellsYou ?? ["A compact experiment that helps you reason about a model or dataset change."]
        }
        interpretationTips={
          interpretationTips ?? ["Change one input at a time and predict the outcome before you run it."]
        }
        limitations={
          limitations ?? ["This is a small, in-browser lab. Results may not match production scale behaviour."]
        }
      />
    </section>
  );
}
