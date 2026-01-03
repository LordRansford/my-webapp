import { useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import NotesLayout from "@/components/notes/Layout";
import { MDXRenderer } from "@/components/notes/MDXRenderer";
import { loadNote } from "@/lib/content/loadNote";
import CourseProgressBar from "@/components/course/CourseProgressBar";
import CourseHeroSection from "@/components/course/CourseHeroSection";
import SectionHeader from "@/components/course/SectionHeader";
import SubsectionHeader from "@/components/course/SubsectionHeader";
import BodyText from "@/components/course/BodyText";
import { cyberSections } from "@/lib/cyberSections";
import { getTotalCpdHours } from "@/components/CPDTracker";
import cybersecurityCourse from "../../../content/courses/cybersecurity.json";
import SafeIcon from "@/components/content/SafeIcon";
import ToolCard from "@/components/notes/ToolCard";
import QuizBlock from "@/components/notes/QuizBlock";
import { ErrorBoundary } from "@/components/notes/ErrorBoundary";
import CPDTracker from "@/components/CPDTracker";
import AchievementsDashboard from "@/components/notes/AchievementsDashboard";
import LearningPathSelector from "@/components/notes/LearningPathSelector";

const SecurityHabitPlannerTool = dynamic(() => import("@/components/notes/tools/cybersecurity/overview/SecurityHabitPlannerTool"), { ssr: false });

function StartButton() {
  return (
    <div className="actions">
      <Link href="/cybersecurity/beginner" className="button primary">
        Start with Foundations
      </Link>
      <Link href="/my-cpd" className="button ghost">
        Track CPD
      </Link>
      <Link href="/my-cpd/evidence" className="button ghost">
        Export CPD evidence
      </Link>
      <Link href="/dashboards/cybersecurity" className="button ghost">
        Open dashboards
      </Link>
      <Link href="/cyber-studios" className="button ghost">
        Open studios
      </Link>
      <Link href="/tools/cybersecurity" className="button ghost">
        Open the labs
      </Link>
    </div>
  );
}

const levelAccents = {
  foundations: { icon: "shield", chip: "chip--mint", ring: "border-emerald-100 bg-emerald-50 text-emerald-700" },
  applied: { icon: "target", chip: "chip--amber", ring: "border-amber-100 bg-amber-50 text-amber-700" },
  practice: { icon: "layers", chip: "chip--accent", ring: "border-blue-100 bg-blue-50 text-blue-700" },
  summary: { icon: "sparkles", chip: "chip--ghost", ring: "border-slate-200 bg-slate-50 text-slate-700" },
};

const bandLabelByLevelId = {
  foundations: "Foundations",
  applied: "Intermediate",
  practice: "Advanced",
  summary: "Summary",
};

function LevelCards({ levels = [] }) {
  const cards = [
    ...(Array.isArray(levels) ? levels : []),
    {
      id: "summary",
      label: "Summary",
      title: "Summary and games",
      summary: "Recap key ideas, test yourself with scenarios, and keep your CPD evidence clean.",
      route: "/cybersecurity/summary",
    },
  ];

  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((level) => {
        const href = level.href || level.route || "#";
        const accent = levelAccents[level.id] || levelAccents.foundations;
        const band = bandLabelByLevelId[level.id] || level.label || "Level";
        const title = level.title || level.label || band;
        const summary = level.summary || level.description || "";

        return (
          <div key={level.id} className="flex flex-col rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm backdrop-blur">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3">
                <span
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border ${accent.ring}`}
                  role="img"
                  aria-label={`${title} icon`}
                >
                  <SafeIcon name={accent.icon} size={18} color="currentColor" style={{ marginRight: 0 }} />
                </span>
                <div className="flex-1">
                  <span className={`chip ${accent.chip}`}>{band}</span>
                  <h3 className="mt-2 text-base font-semibold text-gray-900">{title}</h3>
                  {summary ? <p className="mt-1 text-sm text-gray-600">{summary}</p> : null}
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link
                href={href}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Open notes <span aria-hidden="true" className="ml-1">-&gt;</span>
              </Link>
              <Link
                href="/my-cpd/evidence"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                CPD evidence <span aria-hidden="true" className="ml-1">-&gt;</span>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function CybersecurityOverviewPage({ source, headings }) {
  const mdxComponents = useMemo(
    () => ({
      StartButton,
      SafeIcon,
      CourseHeroSection,
      SectionHeader,
      SubsectionHeader,
      BodyText,
      LevelCards: () => <LevelCards levels={cybersecurityCourse.levels} />,
      CourseProgressBar: () => <CourseProgressBar courseId="cybersecurity" manifest={cyberSections} />,
      CPDHoursTotal: () => {
        const total = getTotalCpdHours("cybersecurity");
        return (
          <div className="rounded-2xl border border-gray-200 bg-white/85 p-4 shadow-sm">
            <p className="text-sm font-semibold text-gray-900">Your recorded CPD hours for Cybersecurity</p>
            <p className="text-base font-semibold text-gray-800">{total.toFixed(1)} hours</p>
            <p className="text-sm text-gray-700">
              This stays in your browser only. If you need official CPD credit, log your time with your professional body as well.
            </p>
          </div>
        );
      },
      CPDTracker,
      ToolCard,
      QuizBlock,
      SecurityHabitPlannerTool,
      AchievementsDashboard,
      LearningPathSelector,
    }),
    []
  );

  return (
    <ErrorBoundary>
      <NotesLayout
        meta={{
          title: cybersecurityCourse.title,
          description: cybersecurityCourse.description,
          level: "Overview",
          slug: cybersecurityCourse.overview_route,
          section: "cybersecurity",
        }}
        headings={headings}
      >
        <MDXRenderer source={source} components={mdxComponents} />
      </NotesLayout>
    </ErrorBoundary>
  );
}

export async function getServerSideProps() {
  const note = await loadNote("cybersecurity/overview.mdx");
  return {
    props: {
      source: note.source,
      headings: note.headings || [],
    },
  };
}
