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
  icon?: ReactNode;
  badge?: string;
}

interface CoursePathSectionProps {
  title?: string;
  subtitle?: string;
  emoji?: string;
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
  emoji,
  levels,
  className = "",
}: CoursePathSectionProps) {
  return (
    <section className={`course-section-spacing ${className}`}>
      <SectionHeader variant="content" emoji={emoji} subtitle={subtitle}>{title}</SectionHeader>
      <div className="course-grid grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {levels.map((level) => (
          <CourseCard
            key={level.id}
            href={level.href}
            title={level.title}
            description={level.description}
            summary={level.summary}
            label={level.label}
            badge={level.badge}
            estimatedHours={level.estimatedHours}
            progress={level.progress}
            icon={level.icon}
          />
        ))}
      </div>
    </section>
  );
}

