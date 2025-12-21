export function exportActivityCsv(state) {
  const header = ["id", "trackId", "levelId", "sectionId", "minutesDelta", "timestamp", "note"].join(",");
  const rows = (state?.activity || []).map((a) => {
    const safe = (v) => `"${String(v ?? "").replaceAll(`"`, `""`)}"`;
    return [
      safe(a.id),
      safe(a.trackId),
      safe(a.levelId),
      safe(a.sectionId),
      safe(a.minutesDelta),
      safe(a.timestamp),
      safe(a.note || ""),
    ].join(",");
  });
  return [header, ...rows].join("\n");
}


