"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import CitationChip from "@/components/assistants/CitationChip";

type MentorCitation = { title: string; href: string; why?: string };
type MentorTryNext = { title: string; href: string; steps: string[] };
type MentorMsg = {
  role: "user" | "mentor";
  content: string;
  citationsTitle?: string;
  citations?: MentorCitation[];
  tryNext?: MentorTryNext | null;
  lowConfidence?: boolean;
};

const feedbackOptions = ["Family", "Friend", "Work colleague", "Other"] as const;

function sanitizeText(input: unknown, maxLen: number) {
  const raw = typeof input === "string" ? input : "";
  return raw.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, maxLen);
}

function cryptoRandomId() {
  try {
    const bytes = new Uint8Array(12);
    window.crypto.getRandomValues(bytes);
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return `${Date.now().toString(16)}${Math.random().toString(16).slice(2, 10)}`;
  }
}

function getSessionId() {
  try {
    const key = "rn_assistants_session_v1";
    const existing = window.sessionStorage.getItem(key);
    if (existing) return existing;
    const id = cryptoRandomId();
    window.sessionStorage.setItem(key, id);
    return id;
  } catch {
    return cryptoRandomId();
  }
}

export default function AssistantsShell() {
  const pathname = usePathname() || "/";
  const [mentorOpen, setMentorOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  // Mentor state
  const [mentorMessages, setMentorMessages] = useState<MentorMsg[]>([]);
  const [mentorInput, setMentorInput] = useState("");
  const [mentorStatus, setMentorStatus] = useState<"idle" | "loading">("idle");

  // Feedback state
  const [name, setName] = useState("");
  const [heardFrom, setHeardFrom] = useState<(typeof feedbackOptions)[number]>(feedbackOptions[0]);
  const [message, setMessage] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const canSubmitFeedback = useMemo(() => sanitizeText(message, 1500).length > 0, [message]);

  useEffect(() => {
    // Persist drawer closed/open state only for this session.
    // Default is collapsed.
  }, []);

  const askMentor = async (text?: string) => {
    const question = sanitizeText(text ?? mentorInput, 320);
    if (!question) return;

    setMentorStatus("loading");
    try {
      const res = await fetch("/api/mentor/query", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question, pageUrl: pathname }),
      });
      const data = await res.json().catch(() => ({}));

      setMentorMessages((m) => [
        ...m,
        { role: "user", content: question },
        {
          role: "mentor",
          content: typeof data?.answer === "string" ? data.answer : "I can only help with what is covered on this site.",
          citationsTitle: typeof data?.citationsTitle === "string" ? data.citationsTitle : undefined,
          citations: Array.isArray(data?.citations) ? data.citations : undefined,
          tryNext: data?.tryNext || null,
          lowConfidence: Boolean(data?.lowConfidence),
        },
      ]);
      setMentorInput("");
    } catch {
      setMentorMessages((m) => [...m, { role: "mentor", content: "I can only help with what is covered on this site." }]);
    } finally {
      setMentorStatus("idle");
    }
  };

  const submitFeedback = async () => {
    const cleanMessage = sanitizeText(message, 1500);
    if (!cleanMessage) return;

    setFeedbackStatus("loading");
    setFeedbackError(null);
    try {
      const payload = {
        name: sanitizeText(name, 80) || "",
        heardFrom,
        message: cleanMessage,
        pageUrl: pathname,
        sessionId: getSessionId(),
      };
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFeedbackStatus("error");
        setFeedbackError(typeof data?.message === "string" ? data.message : "Could not send feedback.");
        return;
      }
      setFeedbackStatus("success");
      setMessage("");
    } catch {
      setFeedbackStatus("error");
      setFeedbackError("Could not send feedback.");
    }
  };

  return (
    <>
      {/* Left feedback launcher */}
      <div className="fixed left-3 top-1/2 z-50 hidden -translate-y-1/2 sm:block">
        <button
          type="button"
          className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          onClick={() => setFeedbackOpen(true)}
          aria-label="Open feedback"
        >
          Feedback
        </button>
      </div>

      {/* Right mentor launcher */}
      <div className="fixed right-3 top-1/2 z-50 hidden -translate-y-1/2 sm:block">
        <button
          type="button"
          className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          onClick={() => setMentorOpen(true)}
          aria-label="Open mentor"
        >
          Mentor
        </button>
      </div>

      {/* Feedback drawer */}
      {feedbackOpen ? (
        <div className="fixed inset-0 z-50">
          <button type="button" className="absolute inset-0 bg-black/35" aria-label="Close feedback" onClick={() => setFeedbackOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-full max-w-sm overflow-y-auto bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-slate-900">Feedback</h2>
              <button type="button" className="rounded-full border px-3 py-1 text-sm" onClick={() => setFeedbackOpen(false)}>
                Close
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-700">Optional. This helps improve accuracy and usability.</p>

            {feedbackStatus === "success" ? (
              <p className="mt-3 text-sm font-semibold text-emerald-800">Thank you. Your feedback has been received.</p>
            ) : (
              <div className="mt-4 grid gap-3">
                <label className="space-y-1" htmlFor="assist-feedback-name">
                  <span className="text-sm font-semibold text-slate-800">Name (optional)</span>
                  <input
                    id="assist-feedback-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                    placeholder="Your name"
                  />
                </label>

                <label className="space-y-1" htmlFor="assist-feedback-heard">
                  <span className="text-sm font-semibold text-slate-800">How did you hear about this site?</span>
                  <select
                    id="assist-feedback-heard"
                    value={heardFrom}
                    onChange={(e) => setHeardFrom(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 p-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    {feedbackOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1" htmlFor="assist-feedback-message">
                  <span className="text-sm font-semibold text-slate-800">Feedback</span>
                  <textarea
                    id="assist-feedback-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    maxLength={1500}
                    className="w-full rounded-xl border border-slate-200 p-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                    placeholder="What worked well, what was confusing, or what is missing"
                    required
                  />
                  <span className="text-xs text-slate-600">Required.</span>
                </label>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
                  Screenshots are not enabled yet. If you need to share one, mention it in the message and I will follow up.
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button type="button" className="button" onClick={submitFeedback} disabled={!canSubmitFeedback || feedbackStatus === "loading"}>
                    {feedbackStatus === "loading" ? "Sending..." : "Send feedback"}
                  </button>
                  {feedbackStatus === "error" ? <span className="text-sm text-rose-700">{feedbackError || "Could not send feedback."}</span> : null}
                </div>
              </div>
            )}
          </aside>
        </div>
      ) : null}

      {/* Mentor drawer */}
      {mentorOpen ? (
        <div className="fixed inset-0 z-50">
          <button type="button" className="absolute inset-0 bg-black/35" aria-label="Close mentor" onClick={() => setMentorOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-full max-w-sm overflow-y-auto bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-slate-900">Mentor</h2>
              <button type="button" className="rounded-full border px-3 py-1 text-sm" onClick={() => setMentorOpen(false)}>
                Close
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-700">
              This assistant explains site content. It may be wrong. Verify important details.
            </p>

            <div className="mt-3 space-y-3">
              {mentorMessages.length === 0 ? <p className="text-sm text-slate-700">Ask a question to see an answer.</p> : null}
              {mentorMessages.map((m, idx) => (
                <div key={idx} className={`rounded-2xl border p-3 text-sm ${m.role === "user" ? "border-sky-200 bg-sky-50" : "border-slate-200 bg-white"}`}>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">{m.role === "user" ? "You" : "Mentor"}</div>
                  <div className="mt-1 whitespace-pre-wrap text-slate-900">{m.content}</div>
                  {m.lowConfidence ? <p className="mt-2 text-xs text-amber-800">I am not fully confident. Please check sources.</p> : null}
                  {m.citations && m.citations.length ? (
                    <div className="mt-3">
                      <div className="text-xs font-semibold text-slate-700">{m.citationsTitle || "Where this is covered on the site"}</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {m.citations.slice(0, 5).map((c) => (
                          <CitationChip key={c.href} href={c.href} title={c.title} why={c.why} />
                        ))}
                      </div>
                      <ul className="mt-2 list-disc pl-4 text-xs text-slate-700">
                        {m.citations.slice(0, 5).map((c) => (
                          <li key={`${c.href}-why`}>{c.why || "Relevant section in the notes."}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {m.tryNext ? (
                    <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <div className="text-xs font-semibold text-slate-800">Try this next</div>
                      <div className="mt-1">
                        <a className="link text-sm font-semibold" href={m.tryNext.href}>
                          {m.tryNext.title}
                        </a>
                      </div>
                      {Array.isArray(m.tryNext.steps) && m.tryNext.steps.length ? (
                        <ol className="mt-2 list-decimal pl-4 text-xs text-slate-700">
                          {m.tryNext.steps.slice(0, 3).map((s) => (
                            <li key={s}>{s}</li>
                          ))}
                        </ol>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-800" htmlFor="assist-mentor-question">
                Ask about this page
              </label>
              <div className="flex flex-col gap-2">
                <input
                  id="assist-mentor-question"
                  value={mentorInput}
                  onChange={(e) => setMentorInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") askMentor();
                  }}
                  className="w-full rounded-xl border border-slate-200 p-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  placeholder="Ask about the notes or tools"
                  maxLength={320}
                />
                <button type="button" className="button primary" onClick={() => askMentor()} disabled={!mentorInput.trim() || mentorStatus === "loading"}>
                  {mentorStatus === "loading" ? "Thinking..." : "Send"}
                </button>
              </div>
              <p className="text-xs text-slate-600">Answers are grounded in site content only.</p>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}


