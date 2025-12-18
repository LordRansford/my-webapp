import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import { getCpdCourses, getPlannedHoursTotal, CourseOverview } from "@/lib/cpdOverview";

type CpdPageProps = {
  courses: CourseOverview[];
  totalHours: number;
};

const STORAGE_KEY = "ransfordsnotes-cpd";

const readCpdStore = () => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

function CourseProgress({ courseId, levelIds }: { courseId: string; levelIds: string[] }) {
  const [tracked, setTracked] = useState(0);

  useEffect(() => {
    const store = readCpdStore();
    const course = store?.[courseId] || {};
    const touched = levelIds.filter((id) => Number(course[id] || 0) > 0).length;
    setTracked(touched);
  }, [courseId, levelIds]);

  const total = levelIds.length;
  const percent = total ? Math.round((tracked / total) * 100) : 0;

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
        <span>{tracked} of {total} levels with time logged</span>
        <span>{percent}%</span>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-slate-100" aria-hidden="true">
        <div className="h-2 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-2 text-xs text-slate-500">Progress uses your local CPD entries in this browser.</p>
    </div>
  );
}

export default function CpdHubPage({ courses, totalHours }: CpdPageProps) {
  return (
    <Layout title="My learning and CPD" description="Track course progress and plan your CPD hours.">
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow text-slate-500">Learning hub</p>
            <h1 className="text-2xl font-semibold text-slate-900">My learning and CPD</h1>
            <p className="mt-2 text-sm text-slate-600">
              This page keeps track of what we have studied together, how many hours it is worth and which bits you might want to do next.
            </p>
          </div>
          <button
            type="button"
            title="Export coming later. For now, take screenshots or copy notes."
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            Export
          </button>
        </div>
      </section>

      <section className="mt-6">
        <div className="grid gap-4 lg:grid-cols-3">
          {courses.map((course) => (
            <article key={course.id} className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{course.title}</p>
              <p className="mt-2 text-sm text-slate-700">{course.tagline}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">
                  Planned hours: {course.totalEstimatedHours}
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">
                  {course.levels.length} levels
                </span>
              </div>

              <CourseProgress
                courseId={course.id}
                levelIds={course.levels.map((lvl) => lvl.id)}
              />

              <div className="mt-4 flex items-center justify-between text-xs text-slate-600">
                <span>Course view</span>
                <Link
                  href={`/courses/${course.id}`}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
                >
                  Open course
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">CPD summary</h2>
        <p className="mt-1 text-sm text-slate-600">
          Planned hours across all courses: <span className="font-semibold text-slate-800">{totalHours}</span>
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recently studied</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>Cybersecurity Foundations - Status: in progress</li>
              <li>AI Intermediate - Status: planned</li>
              <li>Digitalisation Advanced - Status: in progress</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Next ideas</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>Log 30 minutes after each study session.</li>
              <li>Pick one dashboard and reflect on one insight.</li>
              <li>Share one takeaway with a colleague or peer.</li>
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const courses = getCpdCourses();
  const totalHours = getPlannedHoursTotal(courses);
  return {
    props: {
      courses,
      totalHours,
    },
  };
}
