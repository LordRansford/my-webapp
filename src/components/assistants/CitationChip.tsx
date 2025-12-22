"use client";

import Link from "next/link";
import { highlightAnchorFromLocation } from "@/lib/mentor/highlight";

export default function CitationChip({ href, title, why }: { href: string; title: string; why?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex max-w-full items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
      title={why || title}
      onClick={() => {
        // Highlight the target section if this is an in-page anchor link.
        window.setTimeout(() => highlightAnchorFromLocation(), 0);
      }}
    >
      <span className="truncate">{title}</span>
    </Link>
  );
}


