import { CPDState, CPDTrackId, getTotalsForTrack } from "@/lib/cpd";
import { minutesToHours } from "@/lib/cpd/calculations";

const trackLabels: Record<CPDTrackId, string> = {
  cyber: "Cybersecurity",
  ai: "AI",
  "software-architecture": "Software Development and Architecture",
  digitalisation: "Digitalisation",
  data: "Data",
  "network-models": "Network models",
};

const toHours = (minutes: number) => minutesToHours(minutes);

const titleCase = (value: string) =>
  value
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const formatActivityLine = (entry: CPDState["activity"][number]) => {
  const track = trackLabels[entry.trackId] || titleCase(entry.trackId);
  const level = titleCase(entry.levelId);
  const section = entry.sectionId && entry.sectionId !== "overall" ? titleCase(entry.sectionId) : "overall";
  const minutes = Math.abs(entry.minutesDelta || 0);
  const sign = entry.minutesDelta >= 0 ? "+" : "-";
  const note = entry.note ? ` (${entry.note})` : "";
  return `- ${new Date(entry.timestamp).toLocaleString()} ${sign}${minutes} min on ${track} ${level} ${section}${note}`;
};

export function buildEvidenceText(
  state: CPDState,
  trackIds: CPDTrackId[] = ["cyber", "ai", "software-architecture", "digitalisation", "data", "network-models"]
) {
  const lines: string[] = [];
  lines.push("Name: ");
  lines.push("Period: ");
  lines.push("");
  lines.push("Summary:");

  trackIds.forEach((trackId) => {
    const totals = getTotalsForTrack(state, trackId);
    lines.push(
      `I completed approximately ${toHours(totals.totalMinutes)} hours on ${trackLabels[trackId] || trackId}.`
    );
  });

  lines.push("");
  lines.push("Breakdown by activity:");
  if (state.activity.length === 0) {
    lines.push("No activity logged yet.");
  } else {
    state.activity.slice(0, 50).forEach((entry) => {
      lines.push(formatActivityLine(entry));
    });
  }

  return lines.join("\n");
}
