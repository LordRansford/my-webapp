import { useMemo } from "react";
import Link from "next/link";
import NotesLayout from "@/components/notes/Layout";
import { MDXRenderer } from "@/components/notes/MDXRenderer";
import { loadNote } from "@/lib/content/loadNote";
import SafeIcon from "@/components/content/SafeIcon";
import CPDHoursTotal from "@/components/course/CPDHoursTotal";
import { aiSectionManifest } from "@/lib/aiSections";
import { useCPD } from "@/hooks/useCPD";
import { getCompletionForCourse, getCompletionForLevel } from "@/lib/cpd";
import aiCourse from "../../../content/courses/ai.json";

const AI_LEVEL_ORDER = ["foundations", "intermediate", "advanced", "summary"];

const getHours = (matchIds, fallback) => {
  const entry = aiCourse.levels?.find((level) => matchIds.includes(level.id));
  return Number(entry?.estimatedHours || entry?.estimated_hours) || fallback;
};

const aiLevels = [
  {
    id: "foundations",
    label: "Foundations",
    title: "AI Foundations",
    description: "Start with what AI is, how data is turned into numbers and why simple models matter.",
    href: "/ai/beginner",
    estimatedHours: getHours(["foundations"], 8),
  },
  {
    id: "intermediate",
    label: "Intermediate",
    title: "AI Intermediate",
    description: "Work with evaluation, overfitting, simple pipelines and where models break in the real world.",
    href: "/ai/intermediate",
    estimatedHours: getHours(["intermediate", "applied"], 10),
  },
  {
    id: "advanced",
    label: "Advanced",
    title: "AI Advanced",
    description: "Dig into transformers, agents, diffusion and how to combine them into serious systems.",
    href: "/ai/advanced",
    estimatedHours: getHours(["advanced", "practice-strategy"], 12),
  },
  {
    id: "summary",
    label: "Summary",
    title: "Summary and games",
    description: "Test everything you know with games, scenarios and recap dashboards.",
    href: "/ai/summary",
    estimatedHours: Number(aiCourse.summaryPage?.estimatedHours) || 3,
  },
];

function StartButton() {
  return (
    <div className="my-4">
      <Link
        href="/ai/beginner"
        className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
      >
        <SafeIcon name="brain" size={16} color="currentColor" style={{ marginRight: 0 }} />
        Start with Foundations
        <span aria-hidden="true">-&gt;</span>
      </Link>
    </div>
  );
}

function TrackProgressSummary() {
  const { state } = useCPD();
  const completion = useMemo(
    () => getCompletionForCourse(state, "ai", aiSectionManifest, AI_LEVEL_ORDER),
    [state]
  );
  const percent = completion.percent;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white/85 p-4 shadow-sm" role="group" aria-label="AI course progress">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">AI track progress</p>
          <p className="text-xs text-gray-700">
            {completion.completedCount} of {completion.totalCount || 0} sections complete
          </p>
        </div>
        <span className="chip chip--accent">{percent}%</span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100" aria-hidden="true">
        <div className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function LevelCards() {
  const { state } = useCPD();

  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      {aiLevels.map((level) => {
        const sectionIds = aiSectionManifest[level.id] || [];
        const completion = getCompletionForLevel(state, "ai", level.id, sectionIds);
        return (
          <div
            key={level.id}
            className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm backdrop-blur"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow mb-1 text-gray-700">{level.label}</p>
                <h3 className="text-lg font-semibold text-gray-900">{level.title}</h3>
                <p className="mt-1 text-sm text-gray-700">{level.description}</p>
              </div>
              <span className="chip chip--ghost">
                {level.estimatedHours ? `${level.estimatedHours} hrs` : "Self paced"}
              </span>
            </div>
            <div className="mt-3" role="group" aria-label={`${level.title} progress`}>
              <div className="flex items-center justify-between text-xs font-semibold text-gray-800">
                <span>Level progress</span>
                <span aria-label={`${level.title} ${completion.percent}% complete`}>{completion.percent}%</span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100" aria-hidden="true">
                <div className="h-full bg-gradient-to-r from-sky-500 to-indigo-600" style={{ width: `${completion.percent}%` }} />
              </div>
            </div>
            <div className="mt-auto pt-3">
              <Link
                href={level.href}
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900 focus:outline-none focus:ring focus:ring-indigo-200"
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

export default function AICourseOverviewPage({ source, headings }) {
  const mdxComponents = useMemo(
    () => ({
      StartButton,
      SafeIcon,
      TrackProgressSummary,
      CPDHoursTotal: () => <CPDHoursTotal courseId="ai" courseName="AI" />,
      LevelCards: () => <LevelCards />,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: aiCourse.title || "AI course overview",
        description: aiCourse.description || "From data and intuition through to modern AI systems with safe practice.",
        level: "Overview",
        slug: "/ai",
        section: "ai",
      }}
      headings={headings}
    >
      <MDXRenderer source={source} components={mdxComponents} />
    </NotesLayout>
  );
}

export async function getStaticProps() {
  const note = await loadNote("ai/overview.mdx");
  return {
    props: {
      source: note.source,
      headings: note.headings,
    },
  };
}
