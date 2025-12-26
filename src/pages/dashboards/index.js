import NotesLayout from "@/components/NotesLayout";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export const getServerSideProps = async () => {
  return { props: {} };
};

export default function DashboardsLanding() {
  return (
    <NotesLayout
      meta={{
        title: "Further practice",
        description: "Further practice resources linked from courses.",
        level: "Further practice",
        slug: "/dashboards",
      }}
    >
      <h1 className="rn-h1">Further practice</h1>
      <p className="rn-body">Dashboards and sandboxes live inside the relevant course pages so they appear in the right learning flow.</p>

      <div className="rn-card rn-mt" style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "linear-gradient(135deg,#eef2ff,#ecfeff)" }}>
        <div className="rn-card-title" style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <Sparkles size={18} aria-hidden="true" /> Visit Ransford&apos;s AI Studios
        </div>
        <div className="rn-card-body" style={{ flex: 1 }}>
          Explore premium, in-browser labs for model training, vision, speech, docs, agents, and governance. Same privacy stance: no tracking, no vendor branding in UI.
        </div>
        <Link href="/studios" className="rn-card-button" style={{ whiteSpace: "nowrap" }} aria-label="Open Ransford's AI Studios">
          Open Studios
        </Link>
      </div>

      <div className="rn-card rn-mt">
        <div className="rn-card-title">Where to find dashboards</div>
        <div className="rn-card-body">Open a course and look for the Further practice section.</div>
      </div>

      <section className="rn-section">
        <div className="rn-grid rn-grid-3" style={{ marginBottom: "2rem" }}>
          <Link href="/ai" className="rn-card rn-card-button" style={{ background: "linear-gradient(135deg,#e0f2fe,#e0f7fa)" }}>
            <div className="rn-card-title">AI</div>
            <div className="rn-card-body">Further practice lives inside the AI course pages.</div>
          </Link>
          <Link href="/software-architecture" className="rn-card rn-card-button" style={{ background: "linear-gradient(135deg,#eef2ff,#e0e7ff)" }}>
            <div className="rn-card-title">Software architecture</div>
            <div className="rn-card-body">Further practice lives inside the course pages.</div>
          </Link>
          <Link href="/cybersecurity" className="rn-card rn-card-button" style={{ background: "linear-gradient(135deg,#fef2f2,#ffe4e6)" }}>
            <div className="rn-card-title">Cybersecurity</div>
            <div className="rn-card-body">Further practice lives inside the course pages.</div>
          </Link>
          <Link href="/digitalisation" className="rn-card rn-card-button" style={{ background: "linear-gradient(135deg,#f0fdf4,#dcfce7)" }}>
            <div className="rn-card-title">Digitalisation</div>
            <div className="rn-card-body">Further practice lives inside the course pages.</div>
          </Link>
        </div>
      </section>

      <section className="rn-section">
        <h2 className="rn-h2">Licensing and data safety</h2>
        <p className="rn-body">
          All dashboards are educational tools built for learning. They run in your browser, with no third-party tracking or data collection.
          Datasets used are either synthetic, curated educational examples, or derived from public domain sources.
          No production data or secrets should be used with these tools.
        </p>
      </section>

      <section className="rn-section">
        <h2 className="rn-h2">Note</h2>
        <p className="rn-body">This page exists only as a compatibility link target.</p>
      </section>
    </NotesLayout>
  );
}
