"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

interface CourseLevel {
  id: string;
  slug: string;
  title: string;
  href: string;
  completed?: boolean;
}

interface CourseNavigationProps {
  courseSlug: string;
  levels: CourseLevel[];
  currentLevelId?: string;
}

export default function CourseNavigation({ courseSlug, levels, currentLevelId }: CourseNavigationProps) {
  const pathname = usePathname();

  return (
    <nav className="course-navigation" aria-label="Course navigation">
      <div className="space-y-2">
        {levels.map((level, index) => {
          const isActive = currentLevelId === level.id || pathname?.includes(level.slug);
          const isCompleted = level.completed;

          return (
            <Link
              key={level.id}
              href={level.href}
              className={`
                group flex items-center gap-3 rounded-xl border p-4 transition-all
                ${isActive 
                  ? "border-slate-400 bg-slate-50 shadow-sm" 
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                }
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2
              `}
            >
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                ) : (
                  <Circle className={`h-5 w-5 ${isActive ? "text-slate-600" : "text-slate-400"}`} aria-hidden="true" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">
                  Level {index + 1}
                </div>
                <div className={`text-sm font-semibold ${isActive ? "text-slate-900" : "text-slate-700"}`}>
                  {level.title}
                </div>
              </div>
              <ArrowRight 
                className={`h-4 w-4 flex-shrink-0 transition-transform ${
                  isActive ? "text-slate-600" : "text-slate-400 group-hover:translate-x-1"
                }`} 
                aria-hidden="true" 
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

