"use client";

import NotesLayout from "@/components/NotesLayout";
import ConceptCallout from "@/components/notes/Callout";
import ToolCard from "@/components/learn/ToolCard";

const tools = [
  { title: "Password entropy dashboard", slug: "password-entropy", description: "Explore how length and character sets affect password search space." },
  { title: "Hashing playground", slug: "hashing-playground", description: "Type text and salt to see how hash outputs change." },
  { title: "Symmetric encryption lab", slug: "symmetric-crypto-lab", description: "Encrypt and decrypt small messages with a shared key in your browser." },
  { title: "Public and private key lab", slug: "public-private-key-lab", description: "Generate a key pair and try simple encrypt, decrypt, sign and verify flows." },
  { title: "TLS toy handshake", slug: "tls-toy-handshake", description: "Step through a simplified TLS style handshake and see what each side learns." },
  { title: "URL safety checklist", slug: "url-safety-checklist", description: "Paste a URL and get a simple, local safety checklist." },
  { title: "DNS resolution explorer", slug: "dns-resolution-explorer", description: "Walk through a simulated DNS lookup for a hostname." },
  { title: "Port and service surface concept", slug: "port-surface-concept", description: "Toggle simple ports and services to see how attack surface changes." },
  { title: "Network zones map", slug: "network-zones-map", description: "Arrange systems into zones and see where traffic is allowed." },
  { title: "Threat model canvas", slug: "threat-model-canvas", description: "Capture assets, actors, boundaries and threats in one view." },
  { title: "Risk matrix builder", slug: "risk-matrix-builder", description: "Add security risks and place them on a likelihood and impact grid." },
  { title: "Access control matrix", slug: "access-control-matrix", description: "Map roles to resources and see where access is too broad." },
  { title: "Data classification board", slug: "data-classification-board", description: "Place example data items into labels and see handling rules." },
  { title: "Log triage sandbox", slug: "log-triage-sandbox", description: "Classify small synthetic log entries and compare with an analyst view." },
  { title: "Phishing email trainer", slug: "phishing-email-trainer", description: "Review synthetic emails and practise spotting phishing clues." },
  { title: "Vulnerability register", slug: "vulnerability-register", description: "Capture vulnerabilities with severity and remediation status." },
  { title: "Control coverage map", slug: "control-coverage-map", description: "Rate control families and see a simple coverage heatmap." },
  { title: "Incident timeline builder", slug: "incident-timeline-builder", description: "Build a small incident timeline and capture lessons." },
  { title: "Red team and blue team planner", slug: "red-blue-exercise-planner", description: "Outline scope, objectives and safety rules for a security exercise." },
  { title: "Policy and exception register", slug: "policy-exception-register", description: "Track policy exceptions with clear ownership and review dates." },
];

export default function ClientPage() {
  return (
    <NotesLayout
      meta={{
        title: "Cybersecurity dashboards",
        description: "Interactive cybersecurity sandboxes covering passwords, crypto, networks, threats, risk, and governance.",
        section: "cybersecurity",
        slug: "/dashboards/cybersecurity",
        level: "Dashboards",
      }}
      headings={[]}
    >
      <main className="relative flex-1 space-y-10">
        <header className="rounded-3xl border border-gray-200 bg-white/90 p-5 shadow-sm backdrop-blur">
          <p className="eyebrow m-0 text-gray-600">Dashboards · Cybersecurity</p>
          <h1 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">Cybersecurity dashboards</h1>
          <p className="max-w-2xl text-sm text-gray-700">
            Safe, client-side practice environments covering passwords, crypto, networks, threats, risk, and governance. Nothing
            here scans the internet or stores your inputs.
          </p>
        </header>

        <article className="prose prose-slate max-w-none dark:prose-invert">
          <p>
            Choose a dashboard tool below. Each tool opens on its own page so there is exactly one primary tool per page.
          </p>
          <ConceptCallout>
            These dashboards are educational. They are not a full penetration test or a formal security audit. Use them
            responsibly and only on systems you own or are allowed to test.
          </ConceptCallout>
          <div className="not-prose">
            {tools.map((tool) => (
              <ToolCard
                key={tool.slug}
                title={tool.title}
                description={tool.description}
                href={`/dashboards/cybersecurity/${tool.slug}`}
              />
            ))}
          </div>
        </article>
      </main>
    </NotesLayout>
  );
}
