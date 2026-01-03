import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Layers, Network, Activity, Gamepad2 } from "lucide-react";
import { ErrorBoundary } from "@/components/notes/ErrorBoundary";
import CourseOverviewTemplate from "@/components/course/CourseOverviewTemplate";
import CourseProgressBar from "@/components/course/CourseProgressBar";
import CPDHoursTotal from "@/components/course/CPDHoursTotal";
import CoursePathSection from "@/components/course/CoursePathSection";
import SectionHeader from "@/components/course/SectionHeader";
import BodyText from "@/components/course/BodyText";
import SafeIcon from "@/components/content/SafeIcon";
import ToolCard from "@/components/notes/ToolCard";
import QuizBlock from "@/components/notes/QuizBlock";
import { useCPD } from "@/hooks/useCPD";
import { getCompletionForLevel } from "@/lib/cpd";
import networkCourse from "../../../content/courses/network-models.json";
import { networkSectionManifest } from "@/lib/networkSections";
import Link from "next/link";

const EncapsulationLab = dynamic(() => import("@/components/notes/tools/network-models/overview/EncapsulationLab"), { ssr: false });

export default function NetworkModelsOverviewPage() {
  const { state } = useCPD();

  const corePath = useMemo(() => {
    const base = Array.isArray(networkCourse.levels) ? networkCourse.levels : [];
    const levels = [
      ...base.map((l) => ({
        id: l.id,
        label: l.label,
        title: l.title,
        summary: l.summary,
        href: l.route,
        estimatedHours: Number(l.estimatedHours || l.estimated_hours) || undefined,
        icon:
          l.id === "foundations" ? <Layers className="h-6 w-6" aria-hidden="true" /> :
          l.id === "applied" ? <Network className="h-6 w-6" aria-hidden="true" /> :
          <Activity className="h-6 w-6" aria-hidden="true" />,
        badge: "CPD ready",
        progress: getCompletionForLevel(state, "network-models", l.id, networkSectionManifest?.[l.id] || []).percent
          ? { percent: getCompletionForLevel(state, "network-models", l.id, networkSectionManifest?.[l.id] || []).percent }
          : { percent: 0 },
      })),
      {
        id: "summary",
        label: "Summary",
        title: "Summary and practice",
        summary: "Recap the models, test your understanding, and practise troubleshooting without guesswork.",
        href: "/network-models/summary",
        estimatedHours: 2,
        icon: <Gamepad2 className="h-6 w-6" aria-hidden="true" />,
        badge: "Practice",
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
      { id: "quick-practice", title: "Quick practice", depth: 2 },
    ],
    []
  );

  return (
    <ErrorBoundary>
      <CourseOverviewTemplate
        meta={{
          title: networkCourse.title,
          description: networkCourse.description,
          level: "Overview",
          slug: "/network-models",
          section: "network-models",
        }}
        headings={headingsLocal}
        hero={{
          eyebrow: "Networking course",
          title: "OSI and TCP IP without vague explanations",
          description:
            "A precise, practical walk through of how data moves across a network. You learn the models, then you learn what real stacks do, and how to prove it when something breaks.",
          highlights: [
            { chip: "Accuracy", text: "Exact terms, careful definitions, and clear boundaries." },
            { chip: "Troubleshooting", text: "A method you can apply on real systems." },
            { chip: "Security", text: "Layer aware controls without unsafe attacking." },
          ],
          primaryAction: { label: "Start with Foundations", href: "/network-models/beginner" },
          secondaryActions: [
            { label: "Pricing and CPD", href: "/pricing" },
            { label: "Sign in for CPD tracking", href: "/signin" },
            { label: "My CPD evidence", href: "/my-cpd/evidence" },
            { label: "Open the labs", href: "/tools" },
          ],
          icon: <SafeIcon name="network" size={20} color="currentColor" style={{ marginRight: 0 }} />,
          gradient: "blue",
        }}
        jumpLinks={[
          { id: "path", label: "Core path" },
          { id: "artefacts", label: "What you build" },
          { id: "quick-practice", label: "Practice" },
        ]}
        topCards={
          <>
            <div id="progress" className="space-y-3">
              <CourseProgressBar courseId="network-models" manifest={networkSectionManifest} />
            </div>
            <CPDHoursTotal courseName="OSI and TCP IP" totalHours={networkCourse.totalEstimatedHours || 0} />
          </>
        }
      >
        <section id="overview" className="space-y-4">
          <BodyText>
            This course uses OSI and TCP IP as models. They are not competing religions. They are tools for thinking. The goal is
            that you can explain a network problem using evidence and a small number of correct terms.
          </BodyText>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">CPD practice before assessment</div>
            <div className="mt-2 text-sm text-slate-700">
              If you plan to take a CPD assessment, use the labs and the summary practice first. Then start the timed attempt when you are ready.
              Sign in before you start learning so your progress and attempts attach to your account.
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/signin" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">
                Sign in
              </Link>
              <Link href="/network-models/assessment/foundations" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50">
                Start assessment
              </Link>
              <Link href="/network-models/summary" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50">
                Practice first
              </Link>
              <Link href="/pricing" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50">
                Pricing
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            This course is designed to support networking and security certifications. It is not endorsed by any certification body.
          </div>
        </section>

        <section id="path" className="space-y-4">
          <SectionHeader variant="content" emoji="🧭" id="path-title">
            Core path
          </SectionHeader>
          <CoursePathSection levels={corePath} />
        </section>

        <section id="artefacts" className="space-y-4">
          <SectionHeader variant="content" emoji="🧩" id="artefacts-title">
            What you will build
          </SectionHeader>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { title: "Encapsulation storyboard", text: "A clear explanation of how headers wrap data for one real flow." },
              { title: "Layer wise troubleshooting notes", text: "A repeatable method and evidence checklist you can reuse." },
              { title: "Security by layer map", text: "Controls mapped to where they actually apply in the stack." },
            ].map((c) => (
              <div key={c.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">{c.title}</div>
                <div className="mt-2 text-sm text-slate-700">{c.text}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="how-to-use" className="space-y-4">
          <SectionHeader variant="guide" emoji="📚" id="how-to-use-title">
            How to use this course
          </SectionHeader>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
            <div className="text-sm text-slate-700">
              1. Read one section.
              <br />
              2. Use one lab to confirm the idea.
              <br />
              3. Write down what you observed and what you assume.
            </div>
            <div className="text-sm text-slate-700">
              If you are doing CPD, sign in before you start so your progress and evidence attach to your account.
            </div>
          </div>
        </section>

        <section id="quick-practice" className="space-y-4">
          <SectionHeader variant="practice" emoji="🛠️" id="quick-practice-title">
            Quick practice
          </SectionHeader>
          <ToolCard title="Encapsulation lab" description="Turn one scenario into a correct, layered explanation.">
            <EncapsulationLab />
          </ToolCard>
          <QuizBlock
            title="Checkpoint"
            questions={[
              { q: "What does encapsulation mean", a: "Adding headers and sometimes trailers as data moves down the stack." },
              { q: "What is a useful way to use OSI", a: "As a mental model for isolating problems and placing controls." },
              { q: "What is the danger of layer talk", a: "You can hide uncertainty by using the model as if it were the real protocol boundary." },
            ]}
          />
        </section>
      </CourseOverviewTemplate>
    </ErrorBoundary>
  );
}

