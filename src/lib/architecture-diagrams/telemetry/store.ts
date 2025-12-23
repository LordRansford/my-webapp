import type { ArchitectureTelemetryEvent } from "./events";

// Simple in-memory counters.
// Note: In serverless production this will reset. This is acceptable for v1 and can be swapped for DB storage later.
type Counters = Record<string, number>;

const counters: Counters = Object.create(null);

function inc(key: string, by = 1) {
  counters[key] = (counters[key] || 0) + by;
}

function key(parts: Array<string | undefined | null>) {
  return parts.filter(Boolean).join(":");
}

export function recordArchitectureEvent(evt: ArchitectureTelemetryEvent) {
  inc(key(["events", evt.event]));
  if (evt.variantId) inc(key(["variant", evt.variantId]));
  if (evt.audience) inc(key(["audience", evt.audience]));
  if (evt.diagramType) inc(key(["diagramType", evt.diagramType]));

  if (evt.event === "generation_completed") inc("generations");

  if (evt.event.startsWith("export_")) {
    inc("exports_total");
    inc(key(["exports", evt.event]));
    if (evt.pageSize) inc(key(["exports_pageSize", evt.pageSize]));
  }

  if (evt.event === "export_pdf_succeeded") inc("pdf_ok");
  if (evt.event === "export_pdf_failed") {
    inc("pdf_fail");
    if (evt.outcome) inc(key(["pdf_fail_reason", evt.outcome]));
  }

  if (evt.durationBucket) inc(key(["duration", evt.durationBucket]));
}

export function getArchitectureMetrics() {
  const get = (k: string) => counters[k] || 0;

  const variants = ["minimal", "stakeholder", "security", "data", "ops"].map((id) => ({
    id,
    count: get(`variant:${id}`),
  }));

  const exports = {
    svg: get("exports:export_svg"),
    png: get("exports:export_png"),
    pdfRequested: get("exports:export_pdf_requested"),
    pdfSucceeded: get("exports:export_pdf_succeeded"),
    pdfFailed: get("exports:export_pdf_failed"),
  };

  const pdfTotal = exports.pdfSucceeded + exports.pdfFailed;
  const pdfSuccessRate = pdfTotal === 0 ? 0 : exports.pdfSucceeded / pdfTotal;

  const commonFailures = Object.keys(counters)
    .filter((k) => k.startsWith("pdf_fail_reason:"))
    .map((k) => ({ reason: k.split(":")[1], count: counters[k] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const durationBuckets = [
    { bucket: "0-200", count: get("duration:0-200") },
    { bucket: "200-800", count: get("duration:200-800") },
    { bucket: "800+", count: get("duration:800+") },
  ];

  const mostSelectedVariant = variants.slice().sort((a, b) => b.count - a.count)[0]?.id || "minimal";

  return {
    generations: get("generations"),
    variants,
    mostSelectedVariant,
    exports,
    pdf: {
      successRate: pdfSuccessRate,
      commonFailures,
    },
    performance: {
      durationBuckets,
    },
  };
}


