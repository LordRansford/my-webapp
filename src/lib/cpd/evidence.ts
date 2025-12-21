import type { CPDActivity, CPDState, CPDTrackId } from "@/lib/cpd";
import { CPD_RULES_VERSION, buildEvidenceRecord } from "@/lib/cpd/calculations.core";

export type EvidenceSource = "reading" | "tool" | "quiz" | "manual";

export type EvidenceRecord = {
  id: string;
  timestamp: string;
  source: EvidenceSource;
  trackId: CPDTrackId;
  levelId: string;
  sectionId: string;
  minutesDelta: number;
  note?: string;
  rulesVersion: string;
  hash: string;
};

export function evidenceFromActivity(entry: CPDActivity, source: EvidenceSource = "manual"): EvidenceRecord {
  const record = buildEvidenceRecord({
    id: String(entry.id),
    timestamp: String(entry.timestamp),
    source,
    trackId: entry.trackId,
    levelId: entry.levelId,
    sectionId: entry.sectionId,
    minutesDelta: Number(entry.minutesDelta) || 0,
    note: entry.note || "",
  });
  return record as EvidenceRecord;
}

export function buildEvidenceRecords(state: CPDState, source: EvidenceSource = "manual"): EvidenceRecord[] {
  return (state.activity || []).map((a) => evidenceFromActivity(a, source));
}

export function getEvidenceRulesVersion(): string {
  return CPD_RULES_VERSION;
}


