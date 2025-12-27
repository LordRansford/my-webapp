"use client";

import React, { useMemo, useState } from "react";
import { Palette, FolderTree, MonitorSmartphone } from "lucide-react";
import { SecurityBanner } from "@/components/dev-studios/SecurityBanner";
import SwitchRow from "@/components/ui/SwitchRow";

type Framework = "React" | "Vue" | "Svelte" | "Vanilla JavaScript";
type Styling = "Tailwind style utility classes" | "Component library" | "Plain CSS";
type AppStyle = "Single page application" | "Multi page application" | "Static generated site";

const frameworkCopy: Record<Framework, string> = {
  React: "Component Lego set. Great for rich UIs; mind your state sprawl.",
  Vue: "Approachable reactivity with opinions. Fast to onboard; watch version quirks.",
  Svelte: "Compiler magic. Tiny bundles; keep an eye on team familiarity.",
  "Vanilla JavaScript": "No framework tax. Perfect for small widgets; gets spicy at scale.",
};

const styleCopy: Record<Styling, string> = {
  "Tailwind style utility classes": "Utility-first speed, consistent spacing. Can get noisy without discipline.",
  "Component library": "Shipped components, fast scaffolding. Watch bundle size and customization pain.",
  "Plain CSS": "Zero lock-in, clear cascade. Requires structure to avoid global soup.",
};

const appStyleCopy: Record<AppStyle, string> = {
  "Single page application": "Feels instant after first load. Beware over-fetching and giant bundles.",
  "Multi page application": "Simple, SEO friendly. More full-page navigations, but fewer hydration headaches.",
  "Static generated site": "Fast and cacheable. Content-heavy sites love this; dynamic data needs care.",
};

const baseTree = ["src/", "src/components/", "src/pages/", "src/styles/", "src/lib/"];

const checklistItems = [
  "App shell and layout",
  "Navigation that works with keyboard and screen readers",
  "Error boundary or simple error message",
  "Loading states (skeletons or spinners)",
  "Theming and consistent spacing",
];

export default function FrontendLab() {
  const [framework, setFramework] = useState<Framework>("React");
  const [styling, setStyling] = useState<Styling>("Tailwind style utility classes");
  const [appStyle, setAppStyle] = useState<AppStyle>("Single page application");
  const [checks, setChecks] = useState<Record<string, boolean>>(
    Object.fromEntries(checklistItems.map((c) => [c, false]))
  );

  const layout = useMemo(() => {
    const tree = [...baseTree];
    if (appStyle === "Single page application") tree.push("src/routes/ or src/router/");
    if (appStyle === "Static generated site") tree.push("content/ or mdx/");
    if (framework === "React") tree.push("src/hooks/");
    if (framework === "Vue") tree.push("src/views/");
    return tree;
  }, [framework, appStyle]);

  const readiness = useMemo(() => {
    const total = checklistItems.length;
    const done = checklistItems.filter((c) => checks[c]).length;
    return Math.round((done / total) * 100);
  }, [checks]);

  const readinessCopy =
    readiness < 40
      ? "This will work on your laptop and cry on your first real user."
      : readiness < 80
      ? "Decent start. Your future you can work with this."
      : "This would not embarrass you in front of a front end architect.";

  const combinedCopy = useMemo(() => {
    const fw = frameworkCopy[framework];
    const style = styleCopy[styling];
    const app = appStyleCopy[appStyle];
    return `${fw} ${app} ${style}`;
  }, [framework, styling, appStyle]);

  return (
    <div className="space-y-6">
      <SecurityBanner />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-sky-600" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-slate-900">1. Choose your front end flavour</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-800">Framework</p>
                {(["React", "Vue", "Svelte", "Vanilla JavaScript"] as Framework[]).map((f) => (
                  <label key={f} className="flex items-center gap-2 text-sm text-slate-800">
                    <input
                      type="radio"
                      name="framework"
                      checked={framework === f}
                      onChange={() => setFramework(f)}
                      className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-200"
                    />
                    {f}
                  </label>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-800">Styling</p>
                {(
                  ["Tailwind style utility classes", "Component library", "Plain CSS"] as Styling[]
                ).map((s) => (
                  <label key={s} className="flex items-center gap-2 text-sm text-slate-800">
                    <input
                      type="radio"
                      name="styling"
                      checked={styling === s}
                      onChange={() => setStyling(s)}
                      className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-200"
                    />
                    {s}
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800">
                Application style
                <select
                  value={appStyle}
                  onChange={(e) => setAppStyle(e.target.value as AppStyle)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                >
                  {["Single page application", "Multi page application", "Static generated site"].map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </label>
              <p className="text-sm text-slate-700 leading-relaxed">{combinedCopy}</p>
            </div>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <FolderTree className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              <h3 className="text-2xl font-semibold text-slate-900">2. Layout and components</h3>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm text-slate-700">Folder outline tuned to your choices.</p>
                <div className="rounded-2xl bg-slate-950 text-slate-100 text-xs p-4 space-y-1">
                  {layout.map((line) => (
                    <div key={line}>{line}</div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-slate-700">Component checklist</p>
                <div className="space-y-2">
                  {checklistItems.map((item) => (
                    <SwitchRow
                      key={item}
                      label={item}
                      checked={checks[item]}
                      tone="emerald"
                      onCheckedChange={(checked) => setChecks((prev) => ({ ...prev, [item]: checked }))}
                    />
                  ))}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-700">
                    <span>Front end readiness</span>
                    <span>{readiness}/100</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        readiness < 40 ? "bg-rose-400" : readiness < 80 ? "bg-amber-400" : "bg-emerald-500"
                      }`}
                      style={{ width: `${readiness}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-600">{readinessCopy}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <MonitorSmartphone className="h-5 w-5 text-indigo-600" aria-hidden="true" />
              <h3 className="text-2xl font-semibold text-slate-900">3. App shell preview</h3>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 space-y-3 text-sm text-slate-800">
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="bg-slate-900 text-white px-3 py-2 text-xs font-semibold flex justify-between">
                  <span>{framework}</span>
                  <span>{appStyle}</span>
                </div>
                <div className="grid grid-cols-5">
                  <div className="col-span-1 border-r border-slate-100 bg-slate-50 p-3 text-xs text-slate-700 space-y-2">
                    <div className="h-2 w-14 rounded-full bg-slate-300" aria-hidden="true" />
                    <div className="space-y-1">
                      <div className="h-2 w-10 rounded-full bg-slate-200" aria-hidden="true" />
                      <div className="h-2 w-12 rounded-full bg-slate-200" aria-hidden="true" />
                      <div className="h-2 w-8 rounded-full bg-slate-200" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="col-span-4 p-4 space-y-2">
                    <div className="h-2 w-24 rounded-full bg-slate-200" aria-hidden="true" />
                    <div className="h-2 w-32 rounded-full bg-slate-200" aria-hidden="true" />
                    <div className="h-24 w-full rounded-xl border border-dashed border-slate-200 bg-white/60" aria-hidden="true" />
                    <div className="h-2 w-20 rounded-full bg-slate-200" aria-hidden="true" />
                  </div>
                </div>
                <div className="bg-slate-100 px-3 py-2 text-xs text-slate-600">Footer area</div>
              </div>
              <div className="space-y-1 text-xs text-slate-700">
                <p className="font-semibold text-slate-800">Accessibility hints</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Body text should be at least 16px. If you squint on a phone, bump it.</li>
                  <li>Contrast: text on white/soft backgrounds should read at a glance.</li>
                  <li>Focus: tab through; outlines must stay visible on buttons and links.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
