import Link from "next/link";
import NotesLayout from "@/components/NotesLayout";

export default function DashboardsPage() {
  return (
    <NotesLayout
      meta={{
        title: "Further practice dashboards",
        description: "Interactive dashboards and tools for hands-on learning.",
        level: "Further practice",
        slug: "/dashboards",
      }}
      headings={[]}
    >
      <article className="lesson-content">
        <p className="eyebrow">Further practice</p>
        <h1>Dashboards</h1>
        <p className="lead">Interactive dashboards and tools for hands-on learning.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboards/ai" className="rn-card rn-card-link">
            <div className="rn-card-title">AI</div>
            <div className="rn-card-body">AI and machine learning dashboards</div>
          </Link>
          <Link href="/dashboards/architecture" className="rn-card rn-card-link">
            <div className="rn-card-title">Architecture</div>
            <div className="rn-card-body">Software architecture tools</div>
          </Link>
          <Link href="/dashboards/cybersecurity" className="rn-card rn-card-link">
            <div className="rn-card-title">Cybersecurity</div>
            <div className="rn-card-body">Security and cryptography labs</div>
          </Link>
          <Link href="/dashboards/digitalisation" className="rn-card rn-card-link">
            <div className="rn-card-title">Digitalisation</div>
            <div className="rn-card-body">Digital transformation tools</div>
          </Link>
        </div>

        <div className="mt-8 rn-callout">
          <div className="rn-callout-title">Note</div>
          <div className="rn-callout-body">
            <p>Dashboards are also integrated into the relevant course pages so they appear in the right learning flow.</p>
          </div>
        </div>
      </article>
    </NotesLayout>
  );
}

