"use client";

import { Lightbulb, HelpCircle, Layers3, ListChecks } from "lucide-react";

function BlockShell({ title, icon: Icon, children }) {
  return (
    <section className="my-5 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
        <Icon className="h-4 w-4 text-slate-600" aria-hidden="true" />
        <span>{title}</span>
      </div>
      <div className="text-sm leading-relaxed text-slate-800">{children}</div>
    </section>
  );
}

export function ConceptBlock({ children }) {
  return (
    <BlockShell title="Concept" icon={Lightbulb}>
      {children}
    </BlockShell>
  );
}

export function WhyItMatters({ children }) {
  return (
    <BlockShell title="Why it matters" icon={HelpCircle}>
      {children}
    </BlockShell>
  );
}

export function HowItWorks({ children }) {
  return (
    <BlockShell title="How it works" icon={Layers3}>
      {children}
    </BlockShell>
  );
}

export function KeyTakeaways({ children }) {
  return (
    <BlockShell title="Key takeaways" icon={ListChecks}>
      {children}
    </BlockShell>
  );
}


