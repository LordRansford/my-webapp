import Link from "next/link";
import { useMemo } from "react";
import Layout from "@/components/Layout";
import CPDTrackSummaryCard from "@/components/CPDTrackSummaryCard";
import { useCPD } from "@/hooks/useCPD";
import { aiSectionManifest } from "@/lib/aiSections";
import { cyberSections } from "@/lib/cyberSections";
import { softwareArchitectureSectionManifest } from "@/lib/softwareArchitectureSections";
import { dataSectionManifest } from "@/lib/dataSections";
import { digitalisationSectionManifest } from "@/lib/digitalisationSections";

const trackLabels: Record<string, string> = {
  cyber: "Cyber",
  ai: "AI",
  "software-architecture": "Software Architecture",
  digitalisation: "Digitalisation",
  data: "Data",
};

const titleCase = (value: string) =>
  value
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export default function MyCpdPage() {
  const { state } = useCPD();

  const recent = useMemo(() => state.activity.slice(0, 10), [state.activity]);

  return (
    <Layout title="My CPD" description="Track progress across your learning tracks.">
      <div className="hero">
        <div className="hero__copy">
          <p className="eyebrow">My CPD</p>
          <h1>Your learning record in one place.</h1>
          <p className="lead">Track what you have actually done, not what you hoped to do.</p>
          <Link href="/my-cpd/evidence" className="button ghost">
            Open CPD evidence view
          </Link>
        </div>
        <div className="hero__panel">
          <p className="eyebrow">Quick glance</p>
          <ul className="hero-list">
            <li>
              <span className="dot dot--accent" />
              Local progress stored in this browser
            </li>
            <li>
              <span className="dot dot--accent" />
              Track minutes and sections per course
            </li>
            <li>
              <span className="dot dot--accent" />
              Review recent CPD activity
            </li>
          </ul>
        </div>
      </div>

      <section className="section">
        <div className="section-heading">
          <h2>Track progress</h2>
          <span className="hint">Five core tracks using the same CPD engine</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="grid gap-4 sm:grid-cols-2">
            <CPDTrackSummaryCard
              trackId="cyber"
              title="Cybersecurity"
              route="/courses/cybersecurity"
              manifest={cyberSections}
              levelIds={["foundations", "applied", "practice", "summary"]}
            />
            <CPDTrackSummaryCard
              trackId="ai"
              title="AI"
              route="/ai"
              manifest={aiSectionManifest}
              levelIds={["foundations", "intermediate", "advanced", "summary"]}
            />
            <CPDTrackSummaryCard
              trackId="software-architecture"
              title="Software Architecture"
              route="/courses/software-architecture"
              manifest={softwareArchitectureSectionManifest}
              levelIds={["foundations", "intermediate", "advanced", "summary"]}
            />
            <CPDTrackSummaryCard
              trackId="digitalisation"
              title="Digitalisation"
              route="/digitalisation"
              manifest={digitalisationSectionManifest}
              levelIds={["foundations", "intermediate", "advanced", "summary"]}
            />
            <CPDTrackSummaryCard
              trackId="data"
              title="Data"
              route="/data"
              manifest={dataSectionManifest}
              levelIds={["foundations", "intermediate", "advanced", "summary"]}
            />
          </div>

          <div className="card">
            <div className="section-heading">
              <h3>Recent activity</h3>
              <span className="hint">Last 10 entries</span>
            </div>
            {recent.length === 0 ? (
              <p className="muted">No entries yet. Try a lesson and log a few minutes, then come back here.</p>
            ) : (
              <div className="max-h-80 overflow-auto pr-2">
                <ul className="space-y-3 text-sm text-slate-700">
                  {recent.map((entry) => {
                    const track = trackLabels[entry.trackId] || entry.trackId;
                    const level = titleCase(entry.levelId);
                    const section =
                      entry.sectionId && entry.sectionId !== "overall" ? titleCase(entry.sectionId) : "overall";
                    const minutes = Math.abs(entry.minutesDelta || 0);
                    const sign = entry.minutesDelta >= 0 ? "+" : "-";
                    return (
                      <li key={entry.id} className="rounded-xl border border-slate-200 bg-white p-3">
                        <p className="font-semibold text-slate-900">
                          {sign}
                          {minutes} min on {track} {level} {section}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {new Date(entry.timestamp).toLocaleString()}
                        </p>
                        {entry.note ? <p className="mt-1 text-xs text-slate-600">{entry.note}</p> : null}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
