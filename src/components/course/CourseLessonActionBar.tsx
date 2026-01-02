"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, ClipboardList, LayoutGrid, SlidersHorizontal } from "lucide-react";
import { ReactNode } from "react";

export default function CourseLessonActionBar({
  courseHref,
  courseLabel,
  dashboardHref,
  labsHref,
  studiosHref,
}: {
  courseHref: string;
  courseLabel: string;
  dashboardHref?: string;
  labsHref?: string;
  studiosHref?: string;
}) {
  type ActionLink = { label: string; href: string; icon: ReactNode };
  const links: ActionLink[] = [
    { label: "Overview", href: courseHref, icon: <BookOpen className="h-4 w-4" aria-hidden="true" /> },
    { label: "Track CPD", href: "/my-cpd", icon: <ClipboardList className="h-4 w-4" aria-hidden="true" /> },
    { label: "CPD evidence", href: "/my-cpd/evidence", icon: <ClipboardList className="h-4 w-4" aria-hidden="true" /> },
  ];

  if (dashboardHref) links.push({ label: "Dashboards", href: dashboardHref, icon: <LayoutGrid className="h-4 w-4" aria-hidden="true" /> });
  if (labsHref) links.push({ label: "Labs", href: labsHref, icon: <SlidersHorizontal className="h-4 w-4" aria-hidden="true" /> });
  if (studiosHref) links.push({ label: "Studios", href: studiosHref, icon: <LayoutGrid className="h-4 w-4" aria-hidden="true" /> });

  return (
    <div
      className="not-prose mb-4 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm backdrop-blur"
      role="group"
      aria-label="Course actions"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          href={courseHref}
          className="inline-flex items-center gap-2 rounded-xl px-2 py-1 text-sm font-semibold text-blue-700 hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
          aria-label={`Back to ${courseLabel} overview`}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to {courseLabel} overview
        </Link>
        <div className="flex flex-wrap gap-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              {l.icon}
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

