"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface StudioBreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function StudioBreadcrumbs({ items, className = "" }: StudioBreadcrumbsProps) {
  return (
    <nav 
      className={`flex items-center gap-2 text-sm text-slate-600 ${className}`}
      aria-label="Breadcrumb navigation"
    >
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 rounded"
        aria-label="Home"
      >
        <Home className="w-4 h-4" aria-hidden="true" />
        <span className="sr-only">Home</span>
      </Link>
      
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-4 h-4 text-slate-400" aria-hidden="true" />
            {isLast || !item.href ? (
              <span className="text-slate-900 font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 rounded"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
