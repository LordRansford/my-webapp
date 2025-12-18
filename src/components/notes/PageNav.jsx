"use client";

export default function PageNav({ prevHref, prevLabel, nextHref, nextLabel, showTop = false, showBottom = false }) {
  const scrollTo = (position) => {
    const opts = { behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" };
    if (position === "top") window.scrollTo({ top: 0, ...opts });
    if (position === "bottom") window.scrollTo({ top: document.body.scrollHeight, ...opts });
  };

  return (
    <nav className="my-6 flex flex-wrap items-center justify-between gap-3" aria-label="Page navigation between course pages">
      <div className="flex gap-2">
        {prevHref ? (
          <a
            className="rounded-full border px-3 py-1 text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-200"
            href={prevHref}
            rel="prev"
            aria-label={`Previous: ${prevLabel || "Previous page"}`}
          >
            ← {prevLabel || "Previous"}
          </a>
        ) : (
          <span />
        )}
      </div>
      <div className="flex gap-2">
        {showTop ? (
          <button
            className="rounded-full border px-3 py-1 text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-200"
            onClick={() => scrollTo("top")}
            aria-label="Scroll to top"
          >
            Top
          </button>
        ) : null}
        {showBottom ? (
          <button
            className="rounded-full border px-3 py-1 text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-200"
            onClick={() => scrollTo("bottom")}
            aria-label="Scroll to bottom"
          >
            Bottom
          </button>
        ) : null}
      </div>
      <div className="flex gap-2">
        {nextHref ? (
          <a
            className="rounded-full border px-3 py-1 text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-200"
            href={nextHref}
            rel="next"
            aria-label={`Next: ${nextLabel || "Next page"}`}
          >
            {nextLabel || "Next"} →
          </a>
        ) : (
          <span />
        )}
      </div>
    </nav>
  );
}
