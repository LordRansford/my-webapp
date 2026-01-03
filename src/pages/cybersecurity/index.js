import dynamic from "next/dynamic";
import { useMemo } from "react";
import CoursePathSection from "@/components/course/CoursePathSection";
import SectionHeader from "@/components/course/SectionHeader";
import BodyText from "@/components/course/BodyText";
import { cyberSections } from "@/lib/cyberSections";
import CourseOverviewTemplate from "@/components/course/CourseOverviewTemplate";
import CourseProgressBar from "@/components/course/CourseProgressBar";
import CPDHoursTotal from "@/components/course/CPDHoursTotal";
import { useCPD } from "@/hooks/useCPD";
import { getCompletionForLevel } from "@/lib/cpd";
import cybersecurityCourse from "../../../content/courses/cybersecurity.json";
import SafeIcon from "@/components/content/SafeIcon";
import ToolCard from "@/components/notes/ToolCard";
import QuizBlock from "@/components/notes/QuizBlock";
import { ErrorBoundary } from "@/components/notes/ErrorBoundary";

const SecurityHabitPlannerTool = dynamic(() => import("@/components/notes/tools/cybersecurity/overview/SecurityHabitPlannerTool"), { ssr: false });

export default function CybersecurityOverviewPage({ source, headings }) {
  const { state } = useCPD();
  const corePath = useMemo(() => {
    const base = Array.isArray(cybersecurityCourse.levels) ? cybersecurityCourse.levels : [];
    const levels = [
      ...base.map((l) => ({
        id: l.id,
        label: l.label,
        title: l.title,
        summary: l.summary,
        href: l.route,
        estimatedHours: Number(l.estimatedHours || l.estimated_hours) || undefined,
        progress: getCompletionForLevel(state, "cybersecurity", l.id, cyberSections?.[l.id] || []).percent
          ? { percent: getCompletionForLevel(state, "cybersecurity", l.id, cyberSections?.[l.id] || []).percent }
          : { percent: 0 },
      })),
      {
        id: "summary",
        label: "Summary",
        title: "Summary and games",
        summary: "Recap key ideas, test yourself with scenarios, and keep your CPD evidence clean.",
        href: "/cybersecurity/summary",
        estimatedHours: 3,
        progress: { percent: 0 },
      },
    ];
    return levels;
  }, [state]);

  const headingsLocal = useMemo(
    () => [
      { id: "overview", title: "Overview", depth: 2 },
      { id: "progress", title: "Progress", depth: 2 },
      { id: "path", title: "Core path", depth: 2 },
      { id: "artefacts", title: "What you will build", depth: 2 },
      { id: "how-to-use", title: "How to use this course", depth: 2 },
      { id: "certification", title: "Certification assessment", depth: 2 },
      { id: "quick-practice", title: "Quick practice", depth: 2 },
    ],
    []
  );

  return (
    <ErrorBoundary>
      <CourseOverviewTemplate
        meta={{
          title: cybersecurityCourse.title,
          description: cybersecurityCourse.description,
          level: "Overview",
          slug: cybersecurityCourse.overview_route,
          section: "cybersecurity",
        }}
        headings={headingsLocal}
        hero={{
          eyebrow: "Cybersecurity course",
          title: "From foundations to practice",
          description:
            "A clear route from zero to confident. No hidden prerequisites. Every module stays tied to a real decision so you can explain security, not just repeat it.",
          highlights: [
            { chip: "Focus", text: "Real systems and real habits, not theory alone." },
            { chip: "Tools", text: "In browser labs you can reuse with a team." },
            { chip: "CPD", text: "Assessments and certificates fund keeping learning free." },
          ],
          primaryAction: { label: "Start with Foundations", href: "/cybersecurity/beginner" },
          secondaryActions: [
            { label: "Pricing and CPD", href: "/pricing" },
            { label: "Sign in for CPD tracking", href: "/signin" },
            { label: "My CPD evidence", href: "/my-cpd/evidence" },
            { label: "Open dashboards", href: "/dashboards/cybersecurity" },
            { label: "Open studios", href: "/cyber-studios" },
            { label: "Open the labs", href: "/tools/cybersecurity" },
          ],
          icon: <SafeIcon name="shield" size={20} color="currentColor" style={{ marginRight: 0 }} />,
          gradient: "green",
        }}
        jumpLinks={[
          { id: "path", label: "Core path" },
          { id: "artefacts", label: "What you build" },
          { id: "certification", label: "Certification" },
          { id: "quick-practice", label: "Practice" },
        ]}
        topCards={
          <>
            <div id="progress" className="space-y-3">
              <CourseProgressBar courseId="cybersecurity" manifest={cyberSections} />
            </div>
            <CPDHoursTotal courseName="Cybersecurity" totalHours={cybersecurityCourse.totalEstimatedHours || 0} />
          </>
        }
      >
        <section id="overview" className="space-y-4">
          <BodyText>
            This course has three core levels plus a summary and games page. Move through them at your own pace and revisit the
            labs whenever you need a reset.
          </BodyText>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-900">CPD and certificates</div>
            <div className="mt-2 text-sm text-slate-700">
              If you want CPD evidence and certificates, sign in before you start learning so the system can record your progress.
              Assessments and certificates also help keep this site free for everyone.
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href="/signin" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">
                Sign in
              </a>
              <a href="/pricing" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50">
                Pricing
              </a>
              <a href="/cybersecurity/assessment/foundations" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50">
                Take an assessment
              </a>
            </div>
          </div>
        </section>

        <section id="path" className="space-y-4">
          <CoursePathSection title="Core path" emoji="🛡️" levels={corePath} />
        </section>

        <section id="artefacts" className="space-y-4">
          <SectionHeader variant="content" emoji="📦" id="artefacts">
            What you will build
          </SectionHeader>
          <BodyText>
            You will produce three small artefacts that you can reuse at work. They are designed to be defensible, practical,
            and easy to explain.
          </BodyText>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Personal Security Baseline",
                subtitle: "Stage 1 capstone output",
                body: "A simple plan you can apply to your own accounts and devices. It is focused on actions you can actually sustain.",
                href: "/cybersecurity/beginner",
                tone: "border-emerald-100 bg-emerald-50/60",
              },
              {
                title: "Feature Security Review Pack",
                subtitle: "Stage 2 capstone output",
                body: "A compact review you can use for one feature. Risks, controls, verification, and evidence in one place.",
                href: "/cybersecurity/intermediate#applied-a7-applied-capstone",
                tone: "border-amber-100 bg-amber-50/60",
              },
              {
                title: "Operational Security Pack",
                subtitle: "Stage 3 capstone output",
                body: "A system level pack you can defend. Scope, top risks, controls, verification, and evidence quality.",
                href: "/cybersecurity/advanced#practice-p9-capstone-professional-practice",
                tone: "border-blue-100 bg-blue-50/60",
              },
            ].map((card) => (
              <a
                key={card.title}
                href={card.href}
                className={`block rounded-2xl border ${card.tone} p-4 shadow-sm transition-transform duration-200 hover:-translate-y-1 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400`}
              >
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">{card.subtitle}</div>
                <div className="mt-2 text-base font-semibold text-slate-900">{card.title}</div>
                <div className="mt-2 text-sm text-slate-700">{card.body}</div>
              </a>
            ))}
          </div>
        </section>

        <section id="how-to-use" className="space-y-4">
          <SectionHeader variant="guide" emoji="📚" id="how-to-use">
            How to use this course
          </SectionHeader>
          <ol className="space-y-2 text-base text-slate-700 leading-relaxed list-decimal ml-5">
            <li>Move through Foundations, Applied, and Practice in order for the cleanest progress.</li>
            <li>Use the labs when a concept feels fuzzy. The goal is judgement, not memorisation.</li>
            <li>Record a few minutes when you practise so your CPD record stays honest and useful.</li>
            <li>Come back later and redo the capstones on a new system. That is where depth builds.</li>
          </ol>
        </section>

        <section id="certification" className="space-y-4">
          <SectionHeader variant="content" emoji="🏁" id="certification">
            Certification assessment
          </SectionHeader>
          <BodyText>
            Each level has a timed assessment with detailed feedback after submission. You need an account and credits to start.
            Certificates help your career and help keep this site free.
          </BodyText>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Foundations assessment",
                body: "50 questions. 75 minutes. 80 percent pass mark. Clear feedback and revision links after submission.",
                href: "/cybersecurity/assessment/foundations",
                tone: "border-slate-200 bg-white hover:border-slate-300",
              },
              {
                title: "Applied assessment",
                body: "50 questions. 75 minutes. 80 percent pass mark. Clear feedback and revision links after submission.",
                href: "/cybersecurity/assessment/applied",
                tone: "border-slate-200 bg-white hover:border-slate-300",
              },
              {
                title: "Practice assessment",
                body: "50 questions. 75 minutes. 80 percent pass mark. Includes constructive feedback on your reasoning.",
                href: "/cybersecurity/assessment/practice",
                tone: "border-slate-200 bg-white hover:border-slate-300",
              },
            ].map((card) => (
              <a
                key={card.title}
                href={card.href}
                className={`block rounded-2xl border ${card.tone} p-4 shadow-sm transition-transform duration-200 hover:-translate-y-1 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400`}
              >
                <div className="text-base font-semibold text-slate-900">{card.title}</div>
                <div className="mt-2 text-sm text-slate-700">{card.body}</div>
              </a>
            ))}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">CPD prep pack</div>
            <div className="mt-2 text-sm text-slate-700">
              CPD candidates will get practice flows and targeted revision prompts designed to help you pass.
              Access is for one year from purchase and subject to availability.
            </div>
          </div>
        </section>

        <section id="quick-practice" className="space-y-4">
          <SectionHeader variant="practice" emoji="🛠️" id="quick-practice">
            Quick practice
          </SectionHeader>
          <ToolCard title="Security habit drill" description="Pick one habit to reinforce this week.">
            <SecurityHabitPlannerTool />
          </ToolCard>
          <QuizBlock
            title="Checkpoint"
            questions={[
              {
                q: "Why keep the course plain and structured",
                a: "So anyone can build intuition and defend real systems without hidden prerequisites.",
              },
              { q: "How many core levels does the course have", a: "Three core levels plus a summary and games page." },
            ]}
          />
        </section>
      </CourseOverviewTemplate>
    </ErrorBoundary>
  );
}

export async function getServerSideProps() {
  return { props: { source: null, headings: [] } };
}
