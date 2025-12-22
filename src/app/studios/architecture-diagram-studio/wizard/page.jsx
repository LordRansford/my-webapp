import Link from "next/link";

export const metadata = {
  title: "Architecture Diagram Studio Wizard",
  description: "Step by step input flow for architecture diagrams. Validation only in v1.",
};

export default function ArchitectureDiagramWizardStub() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 md:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Architecture Diagram Studio</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Guided wizard</h1>
        <p className="mt-2 text-sm text-slate-700">
          This route is stubbed. Next prompt will wire the wizard to the shared schema and validation layer.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/studios/architecture-diagram-studio" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">
            Back
          </Link>
          <Link href="/studios/architecture-diagram-studio/editor" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Open power editor
          </Link>
        </div>
      </div>
    </main>
  );
}


