"use client";

import SectionHeader from "./SectionHeader";

interface CourseReferencesSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  references?: string[];
  className?: string;
}

/**
 * Course references section component displaying references and further reading.
 */
export default function CourseReferencesSection({
  title = "References and further reading",
  subtitle,
  description = "These notes draw on a wide range of sources. A few starting points are listed here so that you can explore the official material in more depth.",
  references = [],
  className = "",
}: CourseReferencesSectionProps) {
  return (
    <section className={`course-section-spacing ${className}`}>
      <SectionHeader subtitle={subtitle}>{title}</SectionHeader>
      <p className="course-body-text text-base text-slate-800 dark:text-slate-300 mb-4">
        {description}
      </p>
      {references.length > 0 && (
        <ul className="list-disc space-y-2 pl-5 text-base text-slate-800 dark:text-slate-300">
          {references.map((reference, index) => (
            <li key={index}>{reference}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

