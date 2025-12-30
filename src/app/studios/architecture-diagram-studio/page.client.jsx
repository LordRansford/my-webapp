"use client";

import Link from "next/link";
import { StudioLandingTemplate } from "@/components/templates/PageTemplates";
import StudioNavigation from "@/components/studios/StudioNavigation";
import ReadyToBuildCTA from "@/components/ai-studio/ReadyToBuildCTA";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";

export default function ArchitectureDiagramStudioClient() {
  return (
    <SecureErrorBoundary studio="architecture-diagram-studio">
      <StudioLandingTemplate breadcrumbs={[{ label: "Home", href: "/" }, { label: "Studios", href: "/studios" }, { label: "Architecture Diagram Studio" }]} backHref="/studios">
      <header className="space-y-3 rounded-3xl bg-gradient-to-br from-slate-50 via-sky-50/60 to-slate-50 p-8 shadow-sm ring-1 ring-slate-100">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Studio</p>
        <h1 className="text-4xl font-semibold leading-tight text-slate-900">Architecture Diagram Studio</h1>
        <p className="max-w-3xl text-base text-slate-700">
          Describe your system and generate clear, printable architecture diagrams.
        </p>
      </header>

      {/* Studio Navigation */}
      <div className="flex justify-center mt-6">
        <StudioNavigation studioType="architecture" showHub={true} />
      </div>

      {/* Ready to Build CTA */}
      <div className="mt-6">
        <ReadyToBuildCTA 
          studioName="Architecture Diagram Studio"
          buildHref="/studios/architecture-diagram-studio/editor"
          description="Ready to create professional diagrams? Try the live editor with advanced features."
        />
      </div>

      <section className="mt-8 grid gap-4 lg:grid-cols-3" aria-label="Studio introduction">
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">What this studio does</p>
          <p className="mt-2 text-sm text-slate-700">
            You describe your system in plain language. The studio generates draft architecture diagrams. Diagrams are starting points for thinking and discussion.
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Two ways to work</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>Beginners use the guided wizard.</li>
            <li>Professionals use the power editor.</li>
            <li>Both share the same validation and export rules.</li>
          </ul>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2" aria-label="Primary actions">
        <Link
          href="/studios/architecture-diagram-studio/wizard"
          className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Guided Wizard 🧭</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Step by step</h2>
          <p className="mt-2 text-sm text-slate-700">Best if you are new to architecture diagrams.</p>
          <p className="mt-4 text-sm font-semibold text-slate-900">Open wizard →</p>
        </Link>

        <Link
          href="/studios/architecture-diagram-studio/editor"
          className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Power Editor ⚡</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Direct control</h2>
          <p className="mt-2 text-sm text-slate-700">Best for professionals and reviewers.</p>
          <p className="mt-4 text-sm font-semibold text-slate-900">Open editor →</p>
        </Link>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm" aria-label="What you get">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">What you get</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-700">Print ready diagrams 🖨️</div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-700">Clear assumptions and boundaries 🔍</div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-700">Beginner friendly guidance 🧒</div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-700">Professional outputs for reviews 🧑‍💻</div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2" aria-label="How it works and example">
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">How it works</p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700">
            <li>Describe your system</li>
            <li>Review and adjust</li>
            <li>Generate and export diagrams</li>
          </ol>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Example</p>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            <p>System: Online toy shop</p>
            <p>Users: Customers and admins</p>
            <p>Parts: Web app, API, database</p>
            <p>Flows: Login and checkout</p>
            <p className="mt-3 text-xs font-semibold text-slate-700">
              Generated diagrams always need review. This tool helps you think, not guess.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 text-sm text-slate-700">
        <Link href="/studios" className="font-semibold text-emerald-700 hover:underline">
          Back to studios
        </Link>
      </section>
      </StudioLandingTemplate>
    </SecureErrorBoundary>
  );
}


