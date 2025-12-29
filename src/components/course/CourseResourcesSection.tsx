"use client";

import Link from "next/link";
import { LayoutDashboard, Wrench, Palette } from "lucide-react";
import SectionHeader from "./SectionHeader";

interface ResourceLink {
  label: string;
  href: string;
  icon?: "dashboard" | "tool" | "studio";
  description?: string;
}

interface CourseResourcesSectionProps {
  title?: string;
  subtitle?: string;
  emoji?: string;
  dashboardHref?: string;
  toolsHref?: string;
  studiosHref?: string;
  customResources?: ResourceLink[];
  className?: string;
}

const iconMap = {
  dashboard: LayoutDashboard,
  tool: Wrench,
  studio: Palette,
};

/**
 * Course resources section component displaying links to dashboards, tools, and studios.
 * Provides consistent resource link styling and layout.
 */
export default function CourseResourcesSection({
  title = "Further practice",
  subtitle,
  emoji,
  dashboardHref,
  toolsHref,
  studiosHref,
  customResources = [],
  className = "",
}: CourseResourcesSectionProps) {
  const resources: ResourceLink[] = [];

  if (dashboardHref) {
    resources.push({
      label: "Dashboards",
      href: dashboardHref,
      icon: "dashboard",
      description: "Interactive dashboards and visualisations",
    });
  }

  if (toolsHref) {
    resources.push({
      label: "Tools",
      href: toolsHref,
      icon: "tool",
      description: "Hands-on labs and practice tools",
    });
  }

  if (studiosHref) {
    resources.push({
      label: "Studios",
      href: studiosHref,
      icon: "studio",
      description: "Guided practice environments",
    });
  }

  resources.push(...customResources);

  if (resources.length === 0) {
    return null;
  }

  return (
    <section className={`course-section-spacing ${className}`}>
      <SectionHeader variant="practice" emoji={emoji} subtitle={subtitle}>{title}</SectionHeader>
      <div className="course-grid grid gap-4 md:grid-cols-2">
        {resources.map((resource, index) => {
          const IconComponent = resource.icon ? iconMap[resource.icon] : null;
          return (
            <Link
              key={index}
              href={resource.href}
              className="course-card group flex flex-col rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm
                transition-all duration-200 ease-out
                hover:border-blue-300 hover:shadow-md hover:-translate-y-1
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                dark:bg-slate-800/90 dark:border-slate-700 dark:hover:border-blue-500"
              aria-label={`${resource.label}${resource.description ? `: ${resource.description}` : ""}`}
            >
              {IconComponent && (
                <div className="mb-3 text-blue-600 dark:text-blue-400">
                  <IconComponent size={24} aria-hidden="true" />
                </div>
              )}
              <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-700 dark:text-slate-100 dark:group-hover:text-blue-400 transition-colors">
                {resource.label}
              </h3>
              {resource.description && (
                <p className="text-sm text-slate-700 mb-4 flex-1 dark:text-slate-300">
                  {resource.description}
                </p>
              )}
              <div className="course-card__footer flex items-center justify-between mt-auto pt-3 border-t border-slate-100 dark:border-slate-700">
                <span className="text-sm font-medium text-slate-600 group-hover:text-blue-600 dark:text-slate-400 dark:group-hover:text-blue-400 transition-colors">
                  Open
                </span>
                <span className="text-slate-400 group-hover:text-blue-600 dark:text-slate-500 dark:group-hover:text-blue-400 transition-colors" aria-hidden="true">
                  →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

