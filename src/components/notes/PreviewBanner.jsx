"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "rn_preview_banner_dismissed";

function getSessionDismissed() {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function setSessionDismissed() {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // ignore storage errors
  }
}

export default function PreviewBanner() {
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(getSessionDismissed());
  }, []);

  const feedbackHref = useMemo(() => {
    if (pathname === "/feedback") return "#feedback-form";
    return "/feedback#feedback-form";
  }, [pathname]);

  if (dismissed) return null;

  return (
    <div className="border-b border-slate-200 bg-slate-50/70">
      <div className="mx-auto flex max-w-[1200px] items-start justify-between gap-3 px-4 py-2">
        <p
          className="m-0 min-w-0 text-sm text-slate-700"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          This site is an early preview of Ransford’s Notes. Content, tools and layouts are still evolving. Feedback is very welcome and
          genuinely helps improve things.
        </p>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={feedbackHref}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            onClick={(e) => {
              if (pathname !== "/feedback") return;
              // Smooth scroll when already on the feedback page.
              e.preventDefault();
              const el = document.getElementById("feedback-form");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              else window.location.hash = "feedback-form";
            }}
          >
            Leave feedback
          </Link>

          <button
            type="button"
            className="rounded-full border border-transparent px-2 py-1 text-xs font-semibold text-slate-600 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            onClick={() => {
              setSessionDismissed();
              setDismissed(true);
            }}
            aria-label="Dismiss preview banner"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}


