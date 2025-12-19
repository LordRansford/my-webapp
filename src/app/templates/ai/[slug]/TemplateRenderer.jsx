"use client";

/* eslint-disable react-hooks/static-components */
import { useMemo } from "react";
import { getToolComponent } from "@/components/templates/cyber/ToolLibrary";

export default function TemplateRenderer({ slug }) {
  const Component = useMemo(() => getToolComponent(slug), [slug]);
  if (!Component) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 text-slate-800">
        <p className="text-lg font-semibold">Template not available.</p>
        <p className="mt-2 text-sm">Try returning to the AI templates list and picking another tool.</p>
      </main>
    );
  }
  return <Component />;
}
