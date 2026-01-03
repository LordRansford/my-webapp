import { ErrorBoundary } from "@/components/notes/ErrorBoundary";
import CourseLessonTemplate from "@/components/course/CourseLessonTemplate";
import ExamRunner from "@/components/assessments/ExamRunner";
import Link from "next/link";

type LevelId = "foundations" | "applied" | "practice";

const TITLES: Record<LevelId, string> = {
  foundations: "Network models certification assessment. Foundations",
  applied: "Network models certification assessment. Applied",
  practice: "Network models certification assessment. Practice",
};

export default function NetworkModelsAssessmentPage(props: { levelId: LevelId }) {
  const levelId = props.levelId;
  const title = TITLES[levelId];

  return (
    <ErrorBoundary>
      <CourseLessonTemplate
        meta={{
          title,
          description: "Timed network models assessment with attempt tracking and certificate on pass.",
          level: "Assessment",
          slug: `/network-models/assessment/${levelId}`,
        }}
        headings={[
          { id: "assessment", title: "Assessment", depth: 2 },
          { id: "rules", title: "Rules", depth: 2 },
        ]}
        activeLevelId="assessment"
        courseHref="/network-models"
        courseLabel="Network Models"
        dashboardHref="/dashboards/cybersecurity"
        labsHref="/network-models"
        studiosHref="/studios/hub"
      >
        <section id="assessment" className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-900">{title}</div>
            <div className="mt-1 text-sm text-slate-700">
              You need an account and credits to start. Certificate name is locked.
            </div>
          </div>
          <ExamRunner courseId="network-models" levelId={levelId} title={title} />
        </section>

        <section id="rules" className="space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Rules</div>
            <ol className="mt-2 list-decimal space-y-2 ml-5 text-sm text-slate-700">
              <li>Time limit is 75 minutes.</li>
              <li>There are 50 questions.</li>
              <li>Pass mark is 80 percent.</li>
              <li>You can retake. Attempts are tracked.</li>
              <li>Professor Ransford is paused during timed sessions.</li>
              <li>Copy and context menu actions are restricted to reduce casual cheating.</li>
            </ol>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/pricing" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50">
                Pricing
              </Link>
              <Link href="/network-models" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">
                Back to course
              </Link>
            </div>
          </div>
        </section>
      </CourseLessonTemplate>
    </ErrorBoundary>
  );
}

export async function getServerSideProps(ctx: any) {
  const level = String(ctx?.params?.level || "").trim();
  if (level !== "foundations" && level !== "applied" && level !== "practice") {
    return { notFound: true };
  }
  return { props: { levelId: level } };
}

