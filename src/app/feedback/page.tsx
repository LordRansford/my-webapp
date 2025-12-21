"use client";

import { useEffect, useState } from "react";
import NotesLayout from "@/components/notes/Layout";

const OPTIONS = ["Family", "Friend", "Work colleague", "Other"];

export default function FeedbackPage() {
  // comment: this page is intentionally not linked in navigation; used for Phase 1 private feedback.
  const [form, setForm] = useState({
    name: "",
    heardFrom: OPTIONS[0],
    message: "",
    rateClarity: "",
    rateUsefulness: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "duplicate">("idle");
  const [sessionId] = useState(() => crypto.randomUUID());

  useEffect(() => {
    const already = sessionStorage.getItem("feedback_submitted") === "true";
    if (already) setStatus("duplicate");
  }, []);

  const submit = async () => {
    if (status === "duplicate") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          rateClarity: form.rateClarity ? Number(form.rateClarity) : undefined,
          rateUsefulness: form.rateUsefulness ? Number(form.rateUsefulness) : undefined,
          sessionId,
          url: window.location.pathname,
        }),
      });
      if (res.status === 409) {
        setStatus("duplicate");
        sessionStorage.setItem("feedback_submitted", "true");
        return;
      }
      if (!res.ok) {
        setStatus("error");
      } else {
        setStatus("success");
        sessionStorage.setItem("feedback_submitted", "true");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <NotesLayout
      meta={{
        title: "Site Feedback Assistant",
        description: "Private feedback for early reviewers.",
        level: "Summary",
        slug: "/feedback",
        section: "ai",
      }}
      activeLevelId="summary"
    >
      <div className="space-y-6">
        <header className="space-y-2">
          <p className="eyebrow">Private feedback for early reviewers</p>
          <h1 className="text-3xl font-semibold text-slate-900">Site Feedback Assistant</h1>
          <p className="text-slate-700">This feedback helps improve the site. Please be honest. No login, no analytics.</p>
        </header>

        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          {status === "success" || status === "duplicate" ? (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-emerald-800">
                {status === "duplicate" ? "Feedback already submitted in this session." : "Thanks for sharing. Your feedback is saved."}
              </p>
              <p className="text-sm text-slate-700">You can close this page now.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-3">
                <label className="space-y-1">
                  <span className="text-sm font-semibold text-slate-800">Name (optional)</span>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 p-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                    placeholder="Your name"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-sm font-semibold text-slate-800">How did you hear about this site?</span>
                  <select
                    value={form.heardFrom}
                    onChange={(e) => setForm((f) => ({ ...f, heardFrom: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 p-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    {OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1">
                  <span className="text-sm font-semibold text-slate-800">Feedback</span>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    rows={6}
                    maxLength={1500}
                    className="w-full rounded-xl border border-slate-200 p-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                    placeholder="What worked, what confused, what felt missing?"
                    required
                  />
                  <span className="text-xs text-slate-600">One submission per session. Max 1500 characters.</span>
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1">
                    <span className="text-sm font-semibold text-slate-800">Rate clarity (1-5, optional)</span>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={form.rateClarity}
                      onChange={(e) => setForm((f) => ({ ...f, rateClarity: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 p-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-semibold text-slate-800">Rate usefulness (1-5, optional)</span>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={form.rateUsefulness}
                      onChange={(e) => setForm((f) => ({ ...f, rateUsefulness: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 p-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </label>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="button primary"
                  onClick={submit}
                  disabled={status === "loading" || !form.message.trim()}
                >
                  {status === "loading" ? "Sending..." : "Submit feedback"}
                </button>
                {status === "error" ? <span className="text-sm text-rose-700">Could not submit. Please try again.</span> : null}
              </div>
              <p className="text-xs text-slate-600">No data is shown publicly. Stored server side for review only.</p>
              <p className="text-xs text-slate-600">We do not collect email, do not track, and do not train on feedback.</p>
            </>
          )}
        </section>
      </div>
    </NotesLayout>
  );
}

