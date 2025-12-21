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
    <Layout title="CPD" description="How to use these courses and tools as self-directed CPD, with defensible hours and evidence.">
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow text-slate-500">CPD</p>
            <h1 className="text-2xl font-semibold text-slate-900">Continuing professional development</h1>
            <p className="mt-2 text-sm text-slate-600">
              This site is designed to support self-directed CPD: clear learning objectives, conservative hour estimates, hands-on practice, and evidence-friendly outputs.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Certification is not claimed. If we submit to a CPD body, status will be described as submission in progress until a formal decision is published.
            </p>
          </div>
          <Link
            href="/my-cpd/evidence"
            title="Export is not automated. Use the evidence page to copy text or take screenshots for your own CPD record."
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            Evidence and export
          </Link>
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
        <h2 className="text-lg font-semibold text-slate-900">How hours and evidence work</h2>
        <p className="mt-1 text-sm text-slate-600">
          Planned hours across all CPD courses: <span className="font-semibold text-slate-800">{totalHours}</span>
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tracking</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>Time is recorded per level using the time tracker on course pages.</li>
              <li>Section completion and quiz completion create activity signals for your evidence log.</li>
              <li>You can use the evidence page to copy a summary into your CPD system.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Using this for CPD</p>
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
