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
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-slate-700">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link href={item.href} className="font-semibold text-slate-800 hover:text-slate-900 underline decoration-slate-300 underline-offset-4">
                  {item.label}
                </Link>
              ) : (
                <span className="font-semibold text-slate-900">{item.label}</span>
              )}
              {!isLast ? <span aria-hidden="true" className="text-slate-500">›</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
