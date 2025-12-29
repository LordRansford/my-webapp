"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Clock3, Shield, Brain, Boxes, Database, Compass, Star, Filter, X } from "lucide-react";
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

type CompletionStatus = "all" | "not_started" | "in_progress" | "completed";
type HoursFilter = "all" | "short" | "medium" | "long";

export default function CoursesList({ courses }: CoursesListProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "hours-asc" | "hours-desc">("name");
  const [completionFilter, setCompletionFilter] = useState<CompletionStatus>("all");
  const [hoursFilter, setHoursFilter] = useState<HoursFilter>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Map courses to include level IDs for progress tracking and completion status
  const coursesWithLevels = useMemo(() => {
    return courses.map((course) => {
      const levelIds = [
        ...course.bands.map((b) => b.key),
        course.summary?.key || "summary",
      ].filter(Boolean);
      
      // Get progress from localStorage
      let progress = 0;
      let completionStatus: "not_started" | "in_progress" | "completed" = "not_started";
      if (typeof window !== "undefined") {
        try {
          const store = window.localStorage.getItem("ransfordsnotes-cpd");
          const cpdData = store ? JSON.parse(store) : {};
          const courseData = cpdData[course.slug] || {};
          const touched = levelIds.filter((id) => Number(courseData[id] || 0) > 0).length;
          progress = levelIds.length ? Math.round((touched / levelIds.length) * 100) : 0;
          
          if (progress === 0) {
            completionStatus = "not_started";
          } else if (progress === 100) {
            completionStatus = "completed";
          } else {
            completionStatus = "in_progress";
          }
        } catch {
          // Ignore errors
        }
      }
      
      return { ...course, levelIds, progress, completionStatus };
    });
  }, [courses]);

  const filteredAndSorted = useMemo(() => {
    let filtered = coursesWithLevels.filter((course) => {
      // Search filter
      const query = search.toLowerCase();
      const matchesSearch =
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.slug.toLowerCase().includes(query);
      if (!matchesSearch) return false;

      // Completion status filter
      if (completionFilter !== "all" && course.completionStatus !== completionFilter) {
        return false;
      }

      // Hours filter
      if (hoursFilter !== "all") {
        const hours = course.totalEstimatedHours;
        if (hoursFilter === "short" && hours >= 10) return false;
        if (hoursFilter === "medium" && (hours < 10 || hours > 30)) return false;
        if (hoursFilter === "long" && hours <= 30) return false;
      }

      return true;
    });

    // Sort
    if (sortBy === "name") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "hours-asc") {
      filtered.sort((a, b) => a.totalEstimatedHours - b.totalEstimatedHours);
    } else if (sortBy === "hours-desc") {
      filtered.sort((a, b) => b.totalEstimatedHours - a.totalEstimatedHours);
    }

    return filtered;
  }, [coursesWithLevels, search, sortBy, completionFilter, hoursFilter]);

  // Get courses with progress for "Continue Learning" section
  const coursesInProgress = useMemo(() => {
    return coursesWithLevels
      .filter((c) => c.completionStatus === "in_progress")
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 3);
  }, [coursesWithLevels]);

  // Get recommended courses (not started, sorted by hours ascending)
  const recommendedCourses = useMemo(() => {
    return coursesWithLevels
      .filter((c) => c.completionStatus === "not_started")
      .sort((a, b) => a.totalEstimatedHours - b.totalEstimatedHours)
      .slice(0, 3);
  }, [coursesWithLevels]);

  const totalHours = courses.reduce((sum, c) => sum + (c.totalEstimatedHours || 0), 0);
  const totalLevels = courses.reduce((sum, c) => sum + (c.bands.length + 1), 0);

  const hasActiveFilters = completionFilter !== "all" || hoursFilter !== "all" || search !== "";

  return (
    <>
      {/* Summary Statistics */}
      <section className="mt-8 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm" aria-labelledby="course-overview-heading">
        <h2 id="course-overview-heading" className="text-lg font-semibold text-slate-900">Course overview</h2>
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

      {/* Continue Learning Section */}
      {coursesInProgress.length > 0 && (
        <section className="mt-8" aria-labelledby="continue-learning-heading">
          <h2 id="continue-learning-heading" className="text-xl font-semibold text-slate-900">Continue Learning</h2>
          <p className="mt-1 text-sm text-slate-700">Pick up where you left off</p>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {coursesInProgress.map((course) => {
              const Icon = COURSE_ICONS[course.slug] || Boxes;
              return (
                <Link
                  key={course.slug}
                  href={course.startHref || course.overviewRoute}
                  className="group rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
                      <Icon size={20} className="text-slate-700" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{course.title}</p>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                          <span>{course.progress}% complete</span>
                        </div>
                        <div className="mt-2 h-2 w-full rounded-full bg-slate-100" aria-hidden="true">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Recommended Courses */}
      {recommendedCourses.length > 0 && (
        <section className="mt-8" aria-labelledby="recommended-heading">
          <h2 id="recommended-heading" className="text-xl font-semibold text-slate-900">Recommended for you</h2>
          <p className="mt-1 text-sm text-slate-700">Start with these courses</p>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {recommendedCourses.map((course) => {
              const Icon = COURSE_ICONS[course.slug] || Boxes;
              return (
                <Link
                  key={course.slug}
                  href={course.startHref || course.overviewRoute}
                  className="group rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
                      <Icon size={20} className="text-slate-700" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{course.title}</p>
                      <p className="mt-2 text-sm text-slate-700">{course.description}</p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
                        <Clock3 size={12} className="inline" aria-hidden="true" />
                        <span>{course.totalEstimatedHours} hrs</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Search and Filter */}
      <section className="mt-8" aria-labelledby="all-courses-heading">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="all-courses-heading" className="text-2xl font-semibold text-slate-900">All courses</h2>
            <p className="mt-1 text-sm text-slate-700">Notes with embedded, browser-safe tooling</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <input
              type="search"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search courses"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400"
              aria-expanded={showFilters}
              aria-controls="filter-panel"
            >
              <Filter size={16} aria-hidden="true" />
              Filters
              {hasActiveFilters && (
                <span className="ml-1 rounded-full bg-slate-900 px-1.5 text-xs text-white">
                  {[completionFilter !== "all", hoursFilter !== "all", search !== ""].filter(Boolean).length}
                </span>
              )}
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              aria-label="Sort courses"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <option value="name">Sort by name</option>
              <option value="hours-asc">Hours (low to high)</option>
              <option value="hours-desc">Hours (high to low)</option>
            </select>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div
            id="filter-panel"
            className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
            role="region"
            aria-labelledby="filters-heading"
          >
            <div className="flex items-center justify-between">
              <h3 id="filters-heading" className="text-sm font-semibold text-slate-900">Filters</h3>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setCompletionFilter("all");
                    setHoursFilter("all");
                    setSearch("");
                  }}
                  className="text-xs font-semibold text-slate-700 underline hover:text-slate-900"
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="completion-filter" className="block text-xs font-semibold text-slate-700">
                  Completion status
                </label>
                <select
                  id="completion-filter"
                  value={completionFilter}
                  onChange={(e) => setCompletionFilter(e.target.value as CompletionStatus)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  <option value="all">All courses</option>
                  <option value="not_started">Not started</option>
                  <option value="in_progress">In progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label htmlFor="hours-filter" className="block text-xs font-semibold text-slate-700">
                  Duration
                </label>
                <select
                  id="hours-filter"
                  value={hoursFilter}
                  onChange={(e) => setHoursFilter(e.target.value as HoursFilter)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  <option value="all">All durations</option>
                  <option value="short">Less than 10 hours</option>
                  <option value="medium">10-30 hours</option>
                  <option value="long">More than 30 hours</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {filteredAndSorted.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center" role="status" aria-live="polite">
            <p className="text-sm text-slate-700">No courses match your filters.</p>
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setSearch("");
                  setCompletionFilter("all");
                  setHoursFilter("all");
                }}
                className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 underline hover:text-slate-700"
              >
                <X size={16} aria-hidden="true" />
                Clear all filters
              </button>
            )}
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
                  aria-labelledby={`course-title-${course.slug}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50" aria-hidden="true">
                      <Icon size={20} className="text-slate-700" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p id={`course-title-${course.slug}`} className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          {course.title}
                        </p>
                        {course.completionStatus === "completed" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                            <Star size={12} aria-hidden="true" />
                            Completed
                          </span>
                        )}
                        {course.completionStatus === "in_progress" && (
                          <span className="inline-flex items-center rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700">
                            In progress
                          </span>
                        )}
                      </div>
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
                      aria-label={`Start ${course.title} with ${firstLabel}`}
                    >
                      {course.completionStatus === "completed" ? "Review" : "Start"} with {firstLabel}
                      <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                    <Link
                      href={course.overviewRoute}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:underline focus:outline-none focus:ring-2 focus:ring-slate-200"
                      aria-label={`View ${course.title} overview`}
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

