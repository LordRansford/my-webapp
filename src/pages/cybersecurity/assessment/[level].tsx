import { ErrorBoundary } from "@/components/notes/ErrorBoundary";
import CourseLessonTemplate from "@/components/course/CourseLessonTemplate";
import ExamRunner from "@/components/assessments/ExamRunner";
import Link from "next/link";

type LevelId = "foundations" | "applied" | "practice";

const TITLES: Record<LevelId, string> = {
  foundations: "Cybersecurity certification assessment. Foundations",
  applied: "Cybersecurity certification assessment. Applied",
  practice: "Cybersecurity certification assessment. Practice",
};

export default function CyberAssessmentPage(props: { levelId: LevelId }) {
  const levelId = props.levelId;
  const title = TITLES[levelId];

  return (
    <ErrorBoundary>
      <CourseLessonTemplate
        meta={{
          title,
          description: "Timed cybersecurity assessment with attempt tracking and certificate on pass.",
          level: "Assessment",
          slug: `/cybersecurity/assessment/${levelId}`,
        }}
        headings={[
          { id: "assessment", title: "Assessment", depth: 2 },
          { id: "rules", title: "Rules", depth: 2 },
        ]}
        activeLevelId="assessment"
        courseHref="/cybersecurity"
        courseLabel="Cybersecurity"
        dashboardHref="/dashboards/cybersecurity"
        labsHref="/tools/cybersecurity"
        studiosHref="/cyber-studios"
      >
        <section id="assessment" className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-900">{title}</div>
            <div className="mt-1 text-sm text-slate-700">
              You need an account and credits to start. Certificate name is locked.
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">Practice before your timed attempt</div>
            <div className="mt-1 text-sm text-slate-700">
              Use the course tools and the CPD prep pack to practise the skills that show up in the assessment, then start the timed attempt when you are ready.
              Sign in so your attempts attach to your account.
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/cybersecurity/summary"
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
              >
                Practice first
              </Link>
              <Link
                href="/cybersecurity/cpd-prep"
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
              >
                CPD prep pack
              </Link>
              <Link
                href="/signin"
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                Sign in
              </Link>
            </div>
          </div>
          <ExamRunner courseId="cybersecurity" levelId={levelId} title={title} />
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
            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              If you are doing CPD, use the prep pack for structured revision. If you still need help, email ransford.amponsah@ransfordsnotes.com and include your CPD reference code from the prep pack page.
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/cybersecurity/cpd-prep" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">
                CPD prep pack
              </Link>
              <Link href="/pricing" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50">
                Pricing
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

