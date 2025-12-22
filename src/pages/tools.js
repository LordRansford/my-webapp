import Link from "next/link";
import NotesLayout from "@/components/NotesLayout";

const tools = [
  {
    id: "python-playground",
    title: "Python playground",
    purpose: "Run small Python experiments in-browser (Pyodide).",
    category: "AI",
    level: "Intermediate",
    compute: "Heavy",
    href: "/tools/ai/python-playground",
  },
  {
    id: "js-sandbox",
    title: "JavaScript sandbox",
    purpose: "Test JS behaviour and parsing safely.",
    category: "Software Architecture",
    level: "Beginner",
    compute: "Browser-only",
    href: "/tools/software-architecture/js-sandbox",
  },
  {
    id: "sql-sqlite",
    title: "SQL sandbox (SQLite)",
    purpose: "Practise queries and joins locally.",
    category: "Data",
    level: "Beginner",
    compute: "Light",
    href: "/tools/data/sql-sandbox",
  },
  {
    id: "rsa-oaep",
    title: "RSA lab (OAEP + SHA-256)",
    purpose: "Generate keys and explain asymmetric crypto.",
    category: "Cybersecurity",
    level: "Intermediate",
    compute: "Light",
    href: "/tools/cyber/rsa-lab",
  },
  {
    id: "entropy-hashing",
    title: "Entropy and hashing",
    purpose: "Visualise randomness and the avalanche effect.",
    category: "Cybersecurity",
    level: "Beginner",
    compute: "Browser-only",
    href: "/tools/cyber/entropy-hashing",
  },
  {
    id: "password-entropy",
    title: "Password entropy meter",
    purpose: "Compare length vs complexity trade-offs.",
    category: "Cybersecurity",
    level: "Beginner",
    compute: "Browser-only",
    href: "/tools/cyber/password-entropy",
  },
  {
    id: "cert-viewer",
    title: "Certificate viewer",
    purpose: "Inspect certificate fields and trust cues.",
    category: "Cybersecurity",
    level: "Intermediate",
    compute: "Browser-only",
    href: "/tools/cyber/certificate-viewer",
  },
  {
    id: "regex-tester",
    title: "Regex tester",
    purpose: "Extract patterns and groups from sample text.",
    category: "Software Architecture",
    level: "Beginner",
    compute: "Browser-only",
    href: "/tools/software-architecture/regex-tester",
  },
  {
    id: "schema-inspector",
    title: "Schema inspector",
    purpose: "Explore entities, fields, and relationships.",
    category: "Data",
    level: "Intermediate",
    compute: "Browser-only",
    href: "/tools/data/schema-inspector",
  },
  {
    id: "logic-gates",
    title: "Logic gate simulator",
    purpose: "Learn AND/OR/XOR with truth tables.",
    category: "Software Architecture",
    level: "Beginner",
    compute: "Browser-only",
    href: "/tools/software-architecture/logic-gates",
  },
  {
    id: "risk-register-builder",
    title: "Risk register builder",
    purpose: "Structure and prioritise risks with likelihood, impact, and mitigations.",
    category: "Cybersecurity",
    level: "Intermediate",
    compute: "Browser-only",
    href: "/tools/cyber/risk-register-builder",
  },
  {
    id: "decision-log-generator",
    title: "Decision log generator",
    purpose: "Create auditable records of decisions and rationale.",
    category: "Software Architecture",
    level: "Beginner",
    compute: "Browser-only",
    href: "/tools/software-architecture/decision-log-generator",
  },
  {
    id: "architecture-tradeoff-analysis",
    title: "Architecture trade-off analysis",
    purpose: "Compare options against constraints and non-functional requirements.",
    category: "Software Architecture",
    level: "Advanced",
    compute: "Browser-only",
    href: "/tools/software-architecture/architecture-tradeoff-analysis",
  },
  {
    id: "data-classification-helper",
    title: "Data classification helper",
    purpose: "Classify sensitivity and handling requirements in plain terms.",
    category: "Data",
    level: "Intermediate",
    compute: "Browser-only",
    href: "/tools/data/data-classification-helper",
  },
  {
    id: "threat-modelling-lite",
    title: "Threat modelling lite",
    purpose: "Run a STRIDE-style walkthrough without diagrams.",
    category: "Cybersecurity",
    level: "Intermediate",
    compute: "Browser-only",
    href: "/tools/cyber/threat-modelling-lite",
  },
  {
    id: "control-mapping-tool",
    title: "Control mapping tool",
    purpose: "Map controls to standards at a conceptual level (ISO, NIST, SOC 2).",
    category: "Cybersecurity",
    level: "Advanced",
    compute: "Browser-only",
    href: "/tools/cyber/control-mapping-tool",
  },
  {
    id: "process-friction-mapper",
    title: "Process friction mapper",
    purpose: "Identify where process slows delivery or creates risk.",
    category: "Digitalisation",
    level: "Beginner",
    compute: "Browser-only",
    href: "/tools/digitalisation/process-friction-mapper",
  },
  {
    id: "technical-debt-qualifier",
    title: "Technical debt qualifier",
    purpose: "Describe and prioritise debt with impact, cost, and risk.",
    category: "Software Architecture",
    level: "Intermediate",
    compute: "Browser-only",
    href: "/tools/software-architecture/technical-debt-qualifier",
  },
  {
    id: "incident-postmortem-builder",
    title: "Incident post-mortem builder",
    purpose: "Create learning-focused post-incident reviews and actions.",
    category: "Cybersecurity",
    level: "Intermediate",
    compute: "Browser-only",
    href: "/tools/cyber/incident-post-mortem-builder",
  },
  {
    id: "metrics-definition-studio",
    title: "Metrics definition studio",
    purpose: "Define useful metrics and avoid vanity measurements.",
    category: "Data",
    level: "Advanced",
    compute: "Browser-only",
    href: "/tools/data/metrics-definition-studio",
  },
];

function Badge({ children, tone = "slate" }) {
  const toneClass =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-800 ring-emerald-100"
      : tone === "indigo"
      ? "bg-indigo-50 text-indigo-800 ring-indigo-100"
      : tone === "amber"
      ? "bg-amber-50 text-amber-800 ring-amber-100"
      : "bg-slate-100 text-slate-700 ring-slate-200";
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${toneClass}`}>{children}</span>;
}

function toneForCategory(cat) {
  if (cat === "Cybersecurity") return "amber";
  if (cat === "AI") return "indigo";
  if (cat === "Data") return "emerald";
  return "slate";
}

export default function ToolsPage() {
  return (
    <NotesLayout
      meta={{
        title: "Useful tools",
        description: "A professional toolkit hub: small, safe, browser-first workspaces for learning and practice.",
        level: "Tools",
        slug: "/tools",
      }}
      headings={[]}
    >
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <span>Tools</span>
      </nav>

      <header className="page-header">
        <p className="eyebrow">Useful tools</p>
        <h1>Tool workspaces</h1>
        <p className="lead">
          A compact hub for serious practice. Each tool opens into a dedicated workspace page with clear intent, inputs, outputs, and limits.
        </p>
      </header>

      <section className="section">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {tools.map((t) => (
            <Link
              key={t.id}
              href={t.href}
              className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
              aria-label={`Open tool workspace: ${t.title}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="m-0 text-base font-semibold text-slate-900 truncate">{t.title}</p>
                  <p className="mt-1 text-sm text-slate-700 line-clamp-2">{t.purpose}</p>
                </div>
                <span className="text-sm font-semibold text-slate-900" aria-hidden="true">
                  Open →
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone={toneForCategory(t.category)}>{t.category}</Badge>
                <Badge>{t.level}</Badge>
                <Badge>{t.compute}</Badge>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-4 text-sm text-slate-700">
          Tip: for curated course-linked labs, use the category pages like{" "}
          <Link href="/tools/ai" className="font-semibold text-emerald-700 hover:underline">
            AI labs
          </Link>{" "}
          and{" "}
          <Link href="/tools/cybersecurity" className="font-semibold text-emerald-700 hover:underline">
            Cyber labs
          </Link>
          .
        </p>
      </section>
    </NotesLayout>
  );
}
