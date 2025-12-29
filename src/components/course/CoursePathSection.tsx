"use client";

import { ReactNode } from "react";
import CourseCard from "./CourseCard";
import SectionHeader from "./SectionHeader";

interface Level {
  id: string;
  label: string;
  title: string;
  summary?: string;
  description?: string;
  href: string;
  estimatedHours?: number;
  progress?: {
    percent: number;
    label?: string;
  };
}

interface CoursePathSectionProps {
  title?: string;
  subtitle?: string;
  levels: Level[];
  className?: string;
}

/**
 * Course path section component displaying the core learning path.
 * Uses CourseCard components in a responsive grid layout.
 */
export default function CoursePathSection({
  title = "Core path",
  subtitle,
  levels,
  className = "",
}: CoursePathSectionProps) {
  return (
    <section className={`course-section-spacing ${className}`}>
      <SectionHeader subtitle={subtitle}>{title}</SectionHeader>
      <div className="course-grid grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {levels.map((level) => (
          <CourseCard
            key={level.id}
            href={level.href}
            title={level.title}
            description={level.description}
            summary={level.summary}
            label={level.label}
            estimatedHours={level.estimatedHours}
            progress={level.progress}
          />
        ))}
      </div>
    </section>
  );
}

