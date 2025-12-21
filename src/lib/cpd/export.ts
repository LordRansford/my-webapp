import type { CPDState, CPDTrackId } from "@/lib/cpd";
import { getTotalsForTrack, getCompletionForCourse } from "@/lib/cpd";
import { buildEvidenceRecords } from "@/lib/cpd/evidence";
import { minutesToHours } from "@/lib/cpd/calculations";
import { exportActivityCsv as exportActivityCsvCore } from "@/lib/cpd/export.core";

export type CpdSummaryRow = {
  trackId: CPDTrackId;
  totalMinutes: number;
  totalHours: number;
  completedSections: number;
  totalSections: number;
};

export type CpdTranscript = {
  generatedAt: string;
  tracks: CpdSummaryRow[];
  evidence: ReturnType<typeof buildEvidenceRecords>;
};

export function buildCpdSummary(state: CPDState, trackIds: CPDTrackId[]): CpdSummaryRow[] {
  return trackIds.map((trackId) => {
    const totals = getTotalsForTrack(state, trackId);
    return {
      trackId,
      totalMinutes: totals.totalMinutes,
      totalHours: minutesToHours(totals.totalMinutes),
      completedSections: totals.completedSections,
      totalSections: totals.totalSections,
    };
  });
}

export function buildCpdTranscript(state: CPDState, trackIds: CPDTrackId[]): CpdTranscript {
  return {
    generatedAt: new Date().toISOString(),
    tracks: buildCpdSummary(state, trackIds),
    evidence: buildEvidenceRecords(state),
  };
}

export function exportActivityCsv(state: CPDState): string {
  return exportActivityCsvCore(state as any);
}

export function computeCourseCompletion(
  state: CPDState,
  trackId: CPDTrackId,
  manifest: Record<string, string[]>,
  levelIds: string[]
) {
  return getCompletionForCourse(state, trackId, manifest, levelIds);
}


