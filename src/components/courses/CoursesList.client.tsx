"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock3, Shield, Brain, Boxes, Database, Compass } from "lucide-react";
import CourseProgress from "@/components/course/CourseProgress";

const COURSE_ICONS: Record<string, typeof Shield> = {
  cybersecurity: Shield,
  ai: Brain,
  "software-architecture": Boxes,
  data: Database,
  digitalisation: Compass,
};

interface CourseTrack {
  id: string;
  slug: string;
  title: string;
  description: string;
  totalEstimatedHours: number;
  overviewRoute: string;
  startHref: string;
  bands: Array<{ key: string; label: string; href: string }>;
  summary?: { key: string; label: string; href: string };
}

interface CoursesListProps {
  courses: CourseTrack[];
}

export default function CoursesList({ courses }: CoursesListProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "hours-asc" | "hours-desc">("name");

  // Map courses to include level IDs for progress tracking
  const coursesWithLevels = useMemo(() => {
    return courses.map((course) => {
      const levelIds = [
        ...course.bands.map((b) => b.key),
        course.summary?.key || "summary",
      ].filter(Boolean);
      return { ...course, levelIds };
    });
  }, [courses]);

  const filteredAndSorted = useMemo(() => {
    let filtered = coursesWithLevels.filter((course) => {
      const query = search.toLowerCase();
      return (
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.slug.toLowerCase().includes(query)
      );
    });

    if (sortBy === "name") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "hours-asc") {
      filtered.sort((a, b) => a.totalEstimatedHours - b.totalEstimatedHours);
    } else if (sortBy === "hours-desc") {
      filtered.sort((a, b) => b.totalEstimatedHours - a.totalEstimatedHours);
    }

    return filtered;
  }, [coursesWithLevels, search, sortBy]);

  const totalHours = courses.reduce((sum, c) => sum + (c.totalEstimatedHours || 0), 0);
  const totalLevels = courses.reduce((sum, c) => sum + (c.bands.length + 1), 0);

  return (
    <>
      {/* Summary Statistics */}
      <section className="mt-8 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Course overview</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total courses</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{courses.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total hours</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{totalHours}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total levels</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{totalLevels}</p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="mt-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Choose a track</h2>
            <p className="mt-1 text-sm text-slate-700">Notes with embedded, browser-safe tooling</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <input
              type="search"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <option value="name">Sort by name</option>
              <option value="hours-asc">Hours (low to high)</option>
              <option value="hours-desc">Hours (high to low)</option>
            </select>
          </div>
        </div>

        {filteredAndSorted.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
            <p className="text-sm text-slate-700">No courses match your search.</p>
            <button
              onClick={() => setSearch("")}
              className="mt-2 text-sm font-semibold text-slate-900 underline hover:text-slate-700"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {filteredAndSorted.map((course) => {
              const Icon = COURSE_ICONS[course.slug] || Boxes;
              const levelCount = course.bands.length + 1;
              const firstLabel = course.bands[0]?.label || "Foundations";

              return (
                <article
                  key={course.slug}
                  className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
                      <Icon size={20} className="text-slate-700" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{course.title}</p>
                      <p className="mt-2 text-sm text-slate-700">{course.description}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">
                      <Clock3 size={12} className="mr-1 inline" aria-hidden="true" />
                      {course.totalEstimatedHours} hrs
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">
                      {levelCount} levels
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {course.bands.map((level) => (
                      <Link
                        key={level.key}
                        href={level.href}
                        className="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        {level.label}
                      </Link>
                    ))}
                    {course.summary && (
                      <Link
                        href={course.summary.href}
                        className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        {course.summary.label}
                      </Link>
                    )}
                  </div>

                  <CourseProgress courseId={course.slug} levelIds={course.levelIds} />

                  <div className="mt-4 flex items-center justify-between">
                    <Link
                      href={course.startHref || course.overviewRoute}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    >
                      Start with {firstLabel}
                      <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                    <Link
                      href={course.overviewRoute}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:underline focus:outline-none focus:ring-2 focus:ring-slate-200"
                    >
                      Overview
                      <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

