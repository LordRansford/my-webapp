"use client";

import SectionHeader from "./SectionHeader";
import CourseCard from "./CourseCard";

interface Capstone {
  id: string;
  title: string;
  summary?: string;
  description?: string;
  href: string;
}

interface CourseCapstonesSectionProps {
  title?: string;
  subtitle?: string;
  capstones: Capstone[];
  className?: string;
}

/**
 * Course capstones section component displaying capstone projects.
 * Uses CourseCard components in a responsive grid layout.
 */
export default function CourseCapstonesSection({
  title = "Capstones",
  subtitle,
  capstones,
  className = "",
}: CourseCapstonesSectionProps) {
  if (capstones.length === 0) {
    return null;
  }

  return (
    <section className={`course-section-spacing ${className}`}>
      <SectionHeader subtitle={subtitle}>{title}</SectionHeader>
      <div className="course-grid grid gap-4 md:grid-cols-2">
        {capstones.map((capstone) => (
          <CourseCard
            key={capstone.id}
            href={capstone.href}
            title={capstone.title}
            description={capstone.description}
            summary={capstone.summary}
            badge="Capstone"
          />
        ))}
      </div>
    </section>
  );
}

