import { useMemo } from "react";
import Link from "next/link";
import NotesLayout from "@/components/notes/Layout";
import { MDXRenderer } from "@/components/notes/MDXRenderer";
import { loadNote } from "@/lib/content/loadNote";
import CourseProgressBar from "@/components/course/CourseProgressBar";
import { cyberSections } from "@/lib/cyberSections";
import { getTotalCpdHours } from "@/components/CPDTracker";
import cybersecurityCourse from "../../../content/courses/cybersecurity.json";
import SafeIcon from "@/components/content/SafeIcon";
import ToolCard from "@/components/notes/ToolCard";
import QuizBlock from "@/components/notes/QuizBlock";

function StartButton() {
  return (
    <div className="my-4">
      <Link
        href="/cybersecurity/beginner"
        className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200"
      >
        <SafeIcon name="shield" size={16} color="currentColor" style={{ marginRight: 0 }} />
        Start with Foundations
        <span aria-hidden="true">-&gt;</span>
      </Link>
    </div>
  );
}

const levelAccents = {
  foundations: { icon: "shield", chip: "chip--mint", ring: "border-emerald-100 bg-emerald-50 text-emerald-700" },
  applied: { icon: "target", chip: "chip--amber", ring: "border-amber-100 bg-amber-50 text-amber-700" },
  practice: { icon: "layers", chip: "chip--accent", ring: "border-blue-100 bg-blue-50 text-blue-700" },
};

function LevelCards({ levels = [] }) {
  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {levels.map((level) => {
        const accent = levelAccents[level.id] || levelAccents.foundations;
        return (
          <div key={level.id} className="flex flex-col rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm backdrop-blur">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3">
                <span
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border ${accent.ring}`}
                  role="img"
                  aria-label={`${level.label} icon`}
                >
                  <SafeIcon name={accent.icon} size={18} color="currentColor" style={{ marginRight: 0 }} />
                </span>
                <div>
                  <p className="eyebrow mb-1 text-gray-700">{level.label}</p>
                  <h3 className="text-lg font-semibold text-gray-900">{level.title}</h3>
                </div>
              </div>
              <span className={`chip ${accent.chip}`}>
                {level.estimated_hours ? `${level.estimated_hours} hrs` : "Self paced"}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-700">{level.summary}</p>
            <div className="mt-auto pt-3">
              <Link
                href={level.route}
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 focus:outline-none focus:ring focus:ring-blue-200"
              >
                Go to {level.label} <span aria-hidden="true">-&gt;</span>
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
      ToolCard,
      QuizBlock,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: cybersecurityCourse.title,
        description: cybersecurityCourse.description,
        level: "Overview",
        slug: cybersecurityCourse.overview_route,
      }}
      activeLevelId="overview"
      headings={headings}
    >
      <MDXRenderer source={source} components={mdxComponents} />
    </NotesLayout>
  );
}

export async function getStaticProps() {
  const note = await loadNote("cybersecurity/overview.mdx");
  return {
    props: {
      source: note.source,
      headings: note.headings,
    },
  };
}
