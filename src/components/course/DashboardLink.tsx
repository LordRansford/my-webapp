"use client";

import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

interface DashboardLinkProps {
  href: string;
  label?: string;
  className?: string;
}

/**
 * Dashboard link component with consistent styling and icon.
 * Used for linking to course-specific dashboards.
 */
export default function DashboardLink({
  href,
  label = "Open dashboards",
  className = "",
}: DashboardLinkProps) {
  return (
    <Link
      href={href}
      className={`button ghost inline-flex items-center gap-2 ${className}`}
      aria-label={label}
    >
      <LayoutDashboard size={18} aria-hidden="true" />
      {label}
    </Link>
  );
}

