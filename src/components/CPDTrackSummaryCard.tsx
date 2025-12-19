import Link from "next/link";
import { CPDTrackId, getCompletionForCourse, getTotalsForTrack } from "@/lib/cpd";
import { useCPD } from "@/hooks/useCPD";

interface CPDTrackSummaryCardProps {
  trackId: CPDTrackId;
  title: string;
  route: string;
  manifest: Record<string, string[]>;
  levelIds?: string[];
}

const toHours = (minutes: number) => Math.round((minutes / 60) * 10) / 10;

export default function CPDTrackSummaryCard({ trackId, title, route, manifest, levelIds }: CPDTrackSummaryCardProps) {
  const { state } = useCPD();
  const totals = getTotalsForTrack(state, trackId);
  const completion = getCompletionForCourse(state, trackId, manifest, levelIds);
  const hours = toHours(totals.totalMinutes);

  return (
    <article className="course-card">
      <div className="course-card__meta">
        <span className="chip chip--accent">CPD track</span>
        <span className="chip chip--ghost">{hours} hrs logged</span>
      </div>
      <h3>{title}</h3>
      <p className="muted">
        {completion.totalCount === 0
          ? "No sections logged yet."
          : `${completion.completedCount} of ${completion.totalCount} sections complete.`}
      </p>
      <div className="course-card__footer">
        <span className="footnote">Local only</span>
        <Link href={route} className="button ghost">
          View course
        </Link>
      </div>
    </article>
  );
}
