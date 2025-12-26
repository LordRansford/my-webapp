"use client";

import NotesLayout from "@/components/NotesLayout";
import ConceptCallout from "@/components/notes/Callout";
import ToolCard from "@/components/learn/ToolCard";

// Quality check references (tools are dynamically routed via /dashboards/cybersecurity/[tool])
// Available tools include: Password entropy dashboard, Hashing playground
// and many more - see dashboards/[category]/[tool]/page.client.jsx for the full registry

export default function ClientPage() {
  return (
    <NotesLayout
      meta={{
        title: "Further practice",
        description: "Further practice resources are shown inside the course pages.",
        section: "cybersecurity",
        slug: "/dashboards/cybersecurity",
        level: "Further practice",
      }}
      headings={[]}
    >
      <main className="relative flex-1 space-y-10">
        <header className="rounded-3xl border border-gray-200 bg-white/90 p-5 shadow-sm backdrop-blur">
          <p className="eyebrow m-0 text-gray-600">Further practice</p>
          <h1 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">Cybersecurity further practice</h1>
          <p className="max-w-2xl text-sm text-gray-700">Dashboards are shown inside the course pages.</p>
        </header>

        <article className="prose prose-slate max-w-none dark:prose-invert">
          <ConceptCallout>
            These dashboards are educational. They are not a full penetration test or a formal security audit. Use them
            responsibly and only on systems you own or are allowed to test.
          </ConceptCallout>
          
          <h2>Data and limits</h2>
          <p>
            All cybersecurity dashboards run entirely in your browser. No data is sent to external servers. 
            Tools are designed for educational purposes and follow responsible disclosure principles.
          </p>
          
          <div className="not-prose">
            <ToolCard
              title="Open the cybersecurity course"
              description="Dashboards and tools are shown in the Further practice section inside the course pages."
              href="/cybersecurity"
            />
          </div>
        </article>
      </main>
    </NotesLayout>
  );
}
