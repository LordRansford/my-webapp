"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useBreadcrumbsRegistry } from "@/components/navigation/BreadcrumbsRegistry";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const { register } = useBreadcrumbsRegistry();
  useEffect(() => {
    register(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  if (!Array.isArray(items) || items.length === 0) return null;
  if (items.length === 1 && items[0].href === "/") return null; // Don't show just "Home"
  
  return (
    <nav aria-label="Breadcrumb" className="mb-6 border-b border-slate-200 pb-3">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link 
                  href={item.href} 
                  className="font-medium text-slate-600 hover:text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-semibold text-slate-900" aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast ? (
                <span aria-hidden="true" className="text-slate-400 select-none">/</span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
