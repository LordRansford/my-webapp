"use client";

import Link from "next/link";
import SectionHeader from "./SectionHeader";

interface CourseCPDSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  trackHref?: string;
  evidenceHref?: string;
  className?: string;
}

/**
 * Course CPD section component displaying CPD tracking information and links.
 * Provides consistent CPD section styling.
 */
export default function CourseCPDSection({
  title = "CPD",
  subtitle,
  description = "Log minutes as you study and practise. Your records stay in this browser. Use the export view when you need a clean summary for your CPD system.",
  trackHref = "/my-cpd",
  evidenceHref = "/my-cpd/evidence",
  className = "",
}: CourseCPDSectionProps) {
  return (
    <section className={`course-section-spacing ${className}`}>
      <SectionHeader subtitle={subtitle}>{title}</SectionHeader>
      <p className="course-body-text text-base text-slate-800 dark:text-slate-300">
        {description}
      </p>
      <div className="actions mt-4 flex flex-wrap gap-3">
        <Link
          href={trackHref}
          className="button ghost"
          aria-label="Track CPD hours"
        >
          Track CPD
        </Link>
        <Link
          href={evidenceHref}
          className="button ghost"
          aria-label="Export CPD evidence"
        >
          Export CPD evidence
        </Link>
      </div>
    </section>
  );
}

