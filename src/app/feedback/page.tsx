"use client";

import { useMemo, useState } from "react";
import NotesLayout from "@/components/notes/Layout";

const OPTIONS = ["Family or friend", "Professional network", "Online search", "Social media", "Other"] as const;

function sanitizeText(input: unknown, maxLen: number) {
  const raw = typeof input === "string" ? input : "";
  // Trim + remove control characters (keep newlines/tabs), cap length.
  const cleaned = raw
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLen);
  return cleaned;
}

export default function FeedbackPage() {
  const [name, setName] = useState("");
  const [heardFrom, setHeardFrom] = useState<(typeof OPTIONS)[number]>(OPTIONS[0]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canSubmit = useMemo(() => sanitizeText(message, 1500).length > 0, [message]);

  const submit = async () => {
    const cleanMessage = sanitizeText(message, 1500);
    if (!cleanMessage) return;

    setStatus("loading");
    setErrorMessage(null);
    try {
      // Server-side persistence (Prompt 1E). No client-side storage of submitted feedback.
      const payload = {
        name: sanitizeText(name, 80) || "Anonymous",
        source: heardFrom,
        message: cleanMessage,
      };
      const res = await fetch("/api/feedback/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setErrorMessage(typeof data?.message === "string" ? data.message : "Could not send feedback.");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Could not send feedback.");
    }
  };

  return (
    <NotesLayout
      meta={{
        title: "Early feedback",
        description:
          "This site is in early preview. I am collecting feedback before formal accreditation and certification. Nothing is tracked beyond what you submit here.",
        level: "Feedback",
        slug: "/feedback",
        section: "ai",
      }}
      activeLevelId="summary"
      headings={[]}
      showContentsSidebar={false}
      showStepper={false}
    >
      <div className="space-y-6">
        <header className="space-y-2">
          <p className="eyebrow">Preview</p>
          <h1 className="text-3xl font-semibold text-slate-900">Early feedback</h1>
          <p className="text-slate-700">
            This site is in early preview. I am collecting feedback before formal accreditation and certification. Nothing is tracked beyond
            what you submit here.
          </p>
        </header>

        <section
          id="feedback-form"
          className="space-y-4 rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm"
        >
          {status === "success" ? (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-emerald-800">Thank you. Your feedback has been received.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-3">
                <label className="space-y-1" htmlFor="feedback-name">
                  <span className="text-sm font-semibold text-slate-800">Name (optional)</span>
                  <input
                    id="feedback-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                    placeholder="Your name"
                  />
                </label>

                <label className="space-y-1" htmlFor="feedback-heard">
                  <span className="text-sm font-semibold text-slate-800">How did you hear about this site?</span>
                  <select
                    id="feedback-heard"
                    value={heardFrom}
                    onChange={(e) => setHeardFrom(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 p-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    {OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1" htmlFor="feedback-message">
                  <span className="text-sm font-semibold text-slate-800">Feedback</span>
                  <textarea
                    id="feedback-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    maxLength={1500}
                    className="w-full rounded-xl border border-slate-200 p-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                    placeholder="Your feedback"
                    required
                  />
                  <span className="text-xs text-slate-600">Required.</span>
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="button"
                  onClick={submit}
                  disabled={!canSubmit || status === "loading"}
                >
                  Send feedback
                </button>
                {status === "loading" ? <span className="text-sm text-slate-700">Sending...</span> : null}
                {status === "error" ? (
                  <span className="text-sm text-rose-700">{errorMessage || "Could not send feedback."}</span>
                ) : null}
              </div>
            </>
          )}
        </section>
      </div>
    </NotesLayout>
  );
}

