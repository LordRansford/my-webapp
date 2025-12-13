"use client";

import Link from "next/link";

export function NotesPager({ prev, next }) {
  return (
    <nav className="mt-10 flex items-center justify-between gap-3" aria-label="Pagination">
      <div>
        {prev ? (
          <Link
            href={prev.href}
            className="rounded-full border px-4 py-2 text-sm text-gray-800 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-200"
          >
            ← {prev.label}
          </Link>
        ) : (
          <span />
        )}
      </div>
      <div>
        <a
          href="#top"
          className="rounded-full border px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-200"
        >
          Back to top
        </a>
      </div>
      <div>
        {next ? (
          <Link
            href={next.href}
            className="rounded-full border px-4 py-2 text-sm text-gray-800 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-200"
          >
            {next.label} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </nav>
  );
}

export default NotesPager;
