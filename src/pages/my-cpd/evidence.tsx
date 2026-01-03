import { useMemo, useState } from "react";
import Layout from "@/components/Layout";
import { useCPD } from "@/hooks/useCPD";
import { buildEvidenceText } from "@/lib/cpdEvidence";
import { CPDTrackId, getCompletionForCourse, getTotalsForTrack } from "@/lib/cpd";
import { minutesToHours } from "@/lib/cpd/calculations";
import { aiSectionManifest } from "@/lib/aiSections";
import { cyberSections } from "@/lib/cyberSections";
import { softwareArchitectureSectionManifest } from "@/lib/softwareArchitectureSections";
import { dataSectionManifest } from "@/lib/dataSections";
import { digitalisationSectionManifest } from "@/lib/digitalisationSections";
import { networkSectionManifest } from "@/lib/networkSections";

const trackConfigs: Array<{
  trackId: CPDTrackId;
  title: string;
  manifest: Record<string, string[]>;
  levels: string[];
}> = [
  {
    trackId: "cyber",
    title: "Cybersecurity",
    manifest: cyberSections,
    levels: ["foundations", "applied", "practice", "summary"],
  },
  {
    trackId: "ai",
    title: "AI",
    manifest: aiSectionManifest,
    levels: ["foundations", "intermediate", "advanced", "summary"],
  },
  {
    trackId: "digitalisation",
    title: "Digitalisation",
    manifest: digitalisationSectionManifest,
    levels: ["foundations", "intermediate", "advanced", "summary"],
  },
  {
    trackId: "software-architecture",
    title: "Software Development and Architecture",
    manifest: softwareArchitectureSectionManifest,
    levels: ["foundations", "intermediate", "advanced", "summary"],
  },
  {
    trackId: "data",
    title: "Data",
    manifest: dataSectionManifest,
    levels: ["foundations", "intermediate", "advanced", "summary"],
  },
  {
    trackId: "network-models",
    title: "Network models",
    manifest: networkSectionManifest,
    levels: ["foundations", "applied", "practice", "summary"],
  },
];

const toHours = (minutes: number) => minutesToHours(minutes);
const titleCase = (value: string) =>
  value
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export default function CpdEvidencePage() {
  const { state } = useCPD();
  const evidenceText = useMemo(() => buildEvidenceText(state), [state]);
  const [copyMessage, setCopyMessage] = useState("");

  const handleCopy = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
      setCopyMessage("Copy is not available in this browser. Please select the text and copy it manually.");
      return;
    }

    try {
      await navigator.clipboard.writeText(evidenceText);
      setCopyMessage("Evidence copied to clipboard.");
    } catch {
      setCopyMessage("Copy failed. Please select the text and copy it manually.");
    }
  };

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  return (
    <Layout title="CPD Evidence" description="Copy this into your CPD system or print it for your records.">
      <div className="page-header evidence-container">
        <p className="eyebrow">My CPD</p>
        <h1>CPD Evidence</h1>
        <p className="lead">Copy this into your CPD system or print it for your records.</p>
        <div className="actions print-hidden">
          <button type="button" className="button ghost" onClick={handleCopy}>
            Copy evidence
          </button>
          <button type="button" className="button ghost" onClick={handlePrint}>
            Print this page
          </button>
        </div>
        {copyMessage ? <p className="hint">{copyMessage}</p> : null}
      </div>

      <section className="section evidence-container">
        <div className="section-heading">
          <h2>Summary by track</h2>
          <span className="hint">Hours and section completion</span>
        </div>
        <div className="card">
          <table className="thin-table">
            <thead>
              <tr>
                <th>Track</th>
                <th>Hours logged</th>
                <th>Sections completed</th>
              </tr>
            </thead>
            <tbody>
              {trackConfigs.map((track) => {
                const totals = getTotalsForTrack(state, track.trackId);
                const completion = getCompletionForCourse(state, track.trackId, track.manifest, track.levels);
                return (
                  <tr key={track.trackId}>
                    <td>{track.title}</td>
                    <td>{toHours(totals.totalMinutes)}</td>
                    <td>
                      {completion.completedCount} of {completion.totalCount}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section evidence-container">
        <div className="section-heading">
          <h2>Detailed activity log</h2>
          <span className="hint">Most recent entries</span>
        </div>
        <div className="card">
          {state.activity.length === 0 ? (
            <p className="muted">No activity logged yet. Use CPD tracking on a course page, then come back here.</p>
          ) : (
            <div className="max-h-96 overflow-auto pr-2">
              <ul className="space-y-3 text-sm text-slate-700">
                {state.activity.slice(0, 40).map((entry) => (
                  <li key={entry.id} className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="font-semibold text-slate-900">
                      {entry.minutesDelta >= 0 ? "+" : "-"}
                      {Math.abs(entry.minutesDelta)} min
                    </p>
                    <p className="text-xs text-slate-600">
                      {titleCase(entry.trackId)} {titleCase(entry.levelId)}{" "}
                      {entry.sectionId === "overall" ? "overall" : titleCase(entry.sectionId)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(entry.timestamp).toLocaleString()}
                    </p>
                    {entry.note ? <p className="mt-1 text-xs text-slate-600">{entry.note}</p> : null}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className="section evidence-container">
        <div className="section-heading">
          <h2>Evidence text</h2>
          <span className="hint">Copy into your CPD form</span>
        </div>
        <div className="card">
          <textarea
            className="key-card__body mono"
            readOnly
            rows={14}
            value={evidenceText}
            aria-label="CPD evidence text"
          />
        </div>
      </section>
    </Layout>
  );
}
