import Link from "next/link";
import { MarketingPageTemplate } from "@/components/templates/PageTemplates";

export async function getStaticProps() {
  const fs = require("node:fs");
  const path = require("node:path");
  const p = path.join(process.cwd(), "public", "tools-index.json");
  const raw = fs.readFileSync(p, "utf8");
  const index = JSON.parse(raw);
  const tools = Array.isArray(index?.tools) ? index.tools : [];

  const listed = tools
    .filter((t) => Boolean(t?.listed))
    .map((t) => {
      const executionModes = Array.isArray(t.executionModes) ? t.executionModes : [];
      const isCompute = executionModes.includes("compute");
      return {
        id: t.id,
        title: t.title,
        purpose: t.description || "",
        category: t.category || "General",
        level: t.difficulty || "Beginner",
        compute: isCompute ? "Compute" : "Browser-only",
        href: t.route,
      };
    })
    .sort((a, b) => (a.category + a.title).localeCompare(b.category + b.title));

  return { props: { tools: listed } };
}

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

export default function ToolsPage({ tools }) {
  return (
    <MarketingPageTemplate breadcrumbs={[{ label: "Home", href: "/" }, { label: "Tools" }]}>
      <header className="page-header">
        <p className="eyebrow">Useful tools</p>
        <h1>Tool workspaces</h1>
        <p className="lead">
          A compact hub for serious practice. Each tool opens into a dedicated workspace page with clear intent, inputs, outputs, and limits.
        </p>
        <p className="text-sm text-slate-700">
          Want a guided project flow instead of a single tool. Try{" "}
          <Link href="/studios" className="font-semibold text-emerald-700 hover:underline">
            Studios
          </Link>{" "}
          or{" "}
          <Link href="/dev-studios" className="font-semibold text-emerald-700 hover:underline">
            Software Development Studio
          </Link>
          .
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
    </MarketingPageTemplate>
  );
}
