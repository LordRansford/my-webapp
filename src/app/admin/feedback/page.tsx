"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import NotesLayout from "@/components/notes/Layout";

const FEEDBACK_LOCAL_KEY = "rn_feedback_entries_v1";
// Enable preview mode locally by either:
// - setting NEXT_PUBLIC_PREVIEW_MODE=true in your environment, OR
// - adding ?preview=true to the URL.
const PREVIEW_ENV_ENABLED = process.env.NEXT_PUBLIC_PREVIEW_MODE === "true";

function safeReadLocalFeedback() {
  try {
    const raw = window.localStorage.getItem(FEEDBACK_LOCAL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function AdminFeedbackPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const previewQuery = (searchParams?.get("preview") || "").toLowerCase();
  const previewEnabled = PREVIEW_ENV_ENABLED || previewQuery === "true";

  useEffect(() => {
    setEntries(safeReadLocalFeedback());
  }, []);

  const cards = useMemo(() => {
    return (entries || [])
      .filter((e) => e && typeof e === "object")
      .map((e) => ({
        id: String((e as any).id || ""),
        name: String((e as any).name || "").trim(),
        heardFrom: String((e as any).heardFrom || "").trim(),
        message: String((e as any).message || "").trim(),
        createdAt: String((e as any).createdAt || "").trim(),
      }))
      .filter((e) => e.id && e.message);
  }, [entries]);

  return (
    <NotesLayout
      meta={{
        title: "Feedback (local)",
        description: "Local preview feedback viewer.",
        level: "Summary",
        slug: "/admin/feedback",
        section: "ai",
      }}
      activeLevelId="summary"
      headings={[]}
      showContentsSidebar={false}
      showStepper={false}
    >
      <div className="space-y-6">
        {!previewEnabled ? (
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 text-sm text-slate-700 shadow-sm">
            This page is only available in preview mode.
          </div>
        ) : (
          <>
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 shadow-sm">
          <p className="m-0 font-semibold">
            Preview mode only. This page is not protected and will be secured later.
          </p>
        </div>

        <header className="space-y-2">
          <p className="eyebrow">Internal</p>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-semibold text-slate-900">Feedback viewer (local)</h1>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
              PREVIEW
            </span>
          </div>
          <p className="text-slate-700">Reads feedback submissions stored locally by the /feedback page.</p>
        </header>

        {cards.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 text-sm text-slate-700 shadow-sm">
            No feedback submitted yet.
          </div>
        ) : (
          <div className="space-y-3">
            {cards.map((e) => {
              const who = e.name ? e.name : "Anonymous";
              const when = e.createdAt ? new Date(e.createdAt).toLocaleString() : "";
              return (
                <article
                  key={e.id}
                  className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm"
                  aria-label="Feedback entry"
                >
                  <div className="text-xs text-slate-600">
                    {when} · {e.heardFrom || ""}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">{who}</div>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-800">{e.message}</p>
                </article>
              );
            })}
          </div>
        )}
          </>
        )}
      </div>
    </NotesLayout>
  );
}


