import NotesLayout from "@/components/NotesLayout";
import Link from "next/link";
import { dashboards } from "../../../dashboards/config";

export default function DashboardsLanding() {
  return (
    <NotesLayout
      meta={{
        title: "Dashboards",
        description: "Interactive dashboards that turn theory into intuition.",
        level: "Dashboards",
        slug: "/dashboards",
      }}
    >
      <h1 className="rn-h1">Dashboards</h1>
      <p className="rn-body">
        Charts are one of the fastest ways to turn theory into intuition. I built these dashboards so you can explore, query, and test assumptions without installing anything.
      </p>
      <div className="rn-card rn-mt">
        <div className="rn-card-title">How I use these</div>
        <div className="rn-card-body">
          I start with one question I actually care about. Then I filter until the chart becomes specific enough that I can argue with it. If I cannot explain what I am seeing in plain English, I assume I am either missing context or the data is lying to me.
          These dashboards are designed to be lightweight and safe. No scraping. No trackers. No weird permissions. Just tools and explanations that behave.
        </div>
      </div>

      <section className="rn-section">
        <div className="rn-grid rn-grid-2" style={{ marginBottom: "2rem" }}>
          <Link href="/dashboards/ai" className="rn-card rn-card-button">
            <div className="rn-card-title">AI Dashboards</div>
            <div className="rn-card-body">
              Interactive labs covering data distributions, correlation, regression, classification, confusion matrices, ROC curves, bias and fairness, drift monitoring, feature importance, embeddings, clustering, prompts, hallucination, agents, RAG, diffusion, cost planning, MLOps, governance, and roles.
            </div>
          </Link>
          <Link href="/dashboards/cybersecurity" className="rn-card rn-card-button">
            <div className="rn-card-title">Cybersecurity Dashboards</div>
            <div className="rn-card-body">
              Hands-on tools for website security headers, DNS and email security, HTTPS redirects, cookies and storage, third-party scripts, email header analysis, phishing link detection, brand impersonation checks, password strength, MFA benefits, account hygiene, network posture, data classification, password habits, incident timelines, and vendor risk.
            </div>
          </Link>
        </div>
        <h2 className="rn-h2">All dashboards</h2>
        <div className="rn-grid rn-grid-3">
          {dashboards.map((d) => (
            <a key={d.id} href={d.href} className="rn-card rn-card-link">
              <div className="rn-card-title">{d.title}</div>
              <div className="rn-card-body">{d.description}</div>
              <div className="rn-tags">
                {d.tags.map((t) => (
                  <span key={t} className="rn-tag">
                    {t}
                  </span>
                ))}
              </div>
              <div className="rn-mini rn-mt">
                <div className="rn-mini-title">Data</div>
                <div className="rn-mini-body">{d.dataSummary}</div>
              </div>
              <div className="rn-mini rn-mt">
                <div className="rn-mini-title">Licensing</div>
                <div className="rn-mini-body">{d.licensingSummary}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="rn-section">
        <h2 className="rn-h2">What I will add next</h2>
        <p className="rn-body">
          The next upgrade is live update automation where it is legally safe, plus user uploaded data mode where you can explore your own CSV files entirely in your browser. That approach avoids most licensing and privacy risk while still giving the wow
          factor.
        </p>
      </section>
    </NotesLayout>
  );
}
