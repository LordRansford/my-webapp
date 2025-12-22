"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { MessageCircle, LifeBuoy, X, Image as ImageIcon } from "lucide-react";
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

const STORAGE_KEY = "rn_floating_assistants_state_v1";
const SCREENSHOT_MAX_BYTES = 600_000;

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

function readPersisted() {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { mentorOpen: false, feedbackOpen: false };
    const parsed = JSON.parse(raw);
    return {
      mentorOpen: Boolean(parsed?.mentorOpen),
      feedbackOpen: Boolean(parsed?.feedbackOpen),
    };
  } catch {
    return { mentorOpen: false, feedbackOpen: false };
  }
}

function writePersisted(next: { mentorOpen: boolean; feedbackOpen: boolean }) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore storage errors
  }
}

async function fileToDataUrl(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  if (buf.byteLength > SCREENSHOT_MAX_BYTES) {
    throw new Error("Screenshot is too large. Please use a smaller image.");
  }
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read screenshot."));
    reader.onload = () => resolve(String(reader.result || ""));
    reader.readAsDataURL(file);
  });
}

export default function FloatingAssistantShell() {
  const pathname = usePathname() || "/";
  const reduce = useReducedMotion();

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

  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreviewUrl, setScreenshotPreviewUrl] = useState<string | null>(null);

  const canSubmitFeedback = useMemo(() => sanitizeText(message, 1500).length > 0, [message]);

  useEffect(() => {
    const persisted = readPersisted();
    setMentorOpen(persisted.mentorOpen);
    setFeedbackOpen(persisted.feedbackOpen);
  }, []);

  useEffect(() => {
    writePersisted({ mentorOpen, feedbackOpen });
  }, [mentorOpen, feedbackOpen]);

  useEffect(() => {
    // One assistant open at a time on small screens.
    const mq = window.matchMedia("(max-width: 640px)");
    const enforce = () => {
      if (!mq.matches) return;
      if (mentorOpen && feedbackOpen) {
        setFeedbackOpen(false);
      }
    };
    enforce();
    mq.addEventListener?.("change", enforce);
    return () => mq.removeEventListener?.("change", enforce);
  }, [mentorOpen, feedbackOpen]);

  useEffect(() => {
    if (!screenshotFile) return;
    const url = URL.createObjectURL(screenshotFile);
    setScreenshotPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [screenshotFile]);

  const closeAll = () => {
    setMentorOpen(false);
    setFeedbackOpen(false);
  };

  const onEsc = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeAll();
  };

  const askMentor = async () => {
    const question = sanitizeText(mentorInput, 320);
    if (!question) return;
    setMentorStatus("loading");
    try {
      const res = await fetch("/api/mentor/query", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question, pageUrl: pathname, pageTitle: document.title || "" }),
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
      const screenshot =
        screenshotFile && screenshotFile.type.startsWith("image/")
          ? {
              name: sanitizeText(screenshotFile.name, 120),
              type: sanitizeText(screenshotFile.type, 80),
              dataUrl: await fileToDataUrl(screenshotFile),
            }
          : null;

      const payload = {
        name: sanitizeText(name, 80) || "",
        heardFrom,
        message: cleanMessage,
        pageUrl: pathname,
        sessionId: getSessionId(),
        screenshot,
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
      setScreenshotFile(null);
    } catch (err: any) {
      setFeedbackStatus("error");
      setFeedbackError(err?.message || "Could not send feedback.");
    }
  };

  const drawerMotion = (side: "left" | "right") => {
    if (reduce) return {} as any;
    return {
      initial: { x: side === "left" ? -12 : 12, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: side === "left" ? -12 : 12, opacity: 0 },
      transition: { duration: 0.18 },
    } as any;
  };

  const dropHandlers = {
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        setFeedbackError("Screenshot must be an image.");
        return;
      }
      if (file.size > SCREENSHOT_MAX_BYTES) {
        setFeedbackError("Screenshot is too large. Please use a smaller image.");
        return;
      }
      setFeedbackError(null);
      setScreenshotFile(file);
    },
  };

  return (
    <LazyMotion features={domAnimation}>
      <div onKeyDown={onEsc}>
        {/* Launchers */}
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40">
          <div className="mx-auto flex max-w-[1200px] justify-between px-4">
            <div className="pointer-events-auto">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                aria-label="Feedback"
                onClick={() => {
                  setMentorOpen(false);
                  setFeedbackOpen((v) => !v);
                }}
              >
                <LifeBuoy className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Feedback</span>
              </button>
            </div>
            <div className="pointer-events-auto">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                aria-label="Mentor"
                onClick={() => {
                  setFeedbackOpen(false);
                  setMentorOpen((v) => !v);
                }}
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Mentor</span>
              </button>
            </div>
          </div>
        </div>

        {/* Feedback drawer */}
        {feedbackOpen ? (
          <div className="fixed inset-0 z-50">
            <button type="button" className="absolute inset-0 bg-black/35" aria-label="Close feedback" onClick={() => setFeedbackOpen(false)} />
            <m.aside
              {...drawerMotion("left")}
              className="absolute left-0 top-0 h-full w-full max-w-sm overflow-y-auto bg-white p-4 shadow-xl"
              aria-label="Feedback drawer"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-semibold text-slate-900">Feedback</h2>
                <button type="button" className="rounded-full border px-3 py-1 text-sm" onClick={() => setFeedbackOpen(false)} aria-label="Close feedback panel">
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <p className="mt-2 text-sm text-slate-700">Optional. This helps improve accuracy and usability.</p>

              {feedbackStatus === "success" ? (
                <p className="mt-3 text-sm font-semibold text-emerald-800">Thank you. Your feedback has been received.</p>
              ) : (
                <div className="mt-4 grid gap-3">
                  <label className="space-y-1" htmlFor="floating-feedback-name">
                    <span className="text-sm font-semibold text-slate-800">Name (optional)</span>
                    <input
                      id="floating-feedback-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 p-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                      placeholder="Your name"
                    />
                  </label>

                  <label className="space-y-1" htmlFor="floating-feedback-heard">
                    <span className="text-sm font-semibold text-slate-800">How did you hear about this site?</span>
                    <select
                      id="floating-feedback-heard"
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

                  <label className="space-y-1" htmlFor="floating-feedback-message">
                    <span className="text-sm font-semibold text-slate-800">Feedback</span>
                    <textarea
                      id="floating-feedback-message"
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

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3" {...dropHandlers}>
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <ImageIcon className="h-4 w-4" aria-hidden="true" />
                      Screenshot (optional)
                    </div>
                    <p className="mt-1 text-xs text-slate-700">Drag and drop an image, or choose a file. Max {Math.round(SCREENSHOT_MAX_BYTES / 1000)} KB.</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        aria-label="Upload screenshot"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (!file.type.startsWith("image/")) {
                            setFeedbackError("Screenshot must be an image.");
                            return;
                          }
                          if (file.size > SCREENSHOT_MAX_BYTES) {
                            setFeedbackError("Screenshot is too large. Please use a smaller image.");
                            return;
                          }
                          setFeedbackError(null);
                          setScreenshotFile(file);
                        }}
                      />
                      {screenshotFile ? (
                        <button type="button" className="rounded-full border px-3 py-1 text-xs font-semibold" onClick={() => setScreenshotFile(null)}>
                          Remove
                        </button>
                      ) : null}
                    </div>
                    {screenshotPreviewUrl ? (
                      <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
                        <Image src={screenshotPreviewUrl} alt="Screenshot preview" width={960} height={540} unoptimized />
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button type="button" className="button" onClick={submitFeedback} disabled={!canSubmitFeedback || feedbackStatus === "loading"}>
                      {feedbackStatus === "loading" ? "Sending..." : "Send feedback"}
                    </button>
                    {feedbackStatus === "error" ? <span className="text-sm text-rose-700">{feedbackError || "Could not send feedback."}</span> : null}
                  </div>
                </div>
              )}
            </m.aside>
          </div>
        ) : null}

        {/* Mentor drawer */}
        {mentorOpen ? (
          <div className="fixed inset-0 z-50">
            <button type="button" className="absolute inset-0 bg-black/35" aria-label="Close mentor" onClick={() => setMentorOpen(false)} />
            <m.aside
              {...drawerMotion("right")}
              className="absolute right-0 top-0 h-full w-full max-w-sm overflow-y-auto bg-white p-4 shadow-xl"
              aria-label="Mentor drawer"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-semibold text-slate-900">Mentor</h2>
                <button type="button" className="rounded-full border px-3 py-1 text-sm" onClick={() => setMentorOpen(false)} aria-label="Close mentor panel">
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <p className="mt-2 text-sm text-slate-700">This assistant explains site content. It may be wrong. Verify important details.</p>

              <div className="mt-3 space-y-3">
                {mentorMessages.length === 0 ? <p className="text-sm text-slate-700">Ask a question to see an answer.</p> : null}
                {mentorMessages.map((m, idx) => (
                  <div key={idx} className={`rounded-2xl border p-3 text-sm ${m.role === "user" ? "border-sky-200 bg-sky-50" : "border-slate-200 bg-white"}`}>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">{m.role === "user" ? "You" : "Mentor"}</div>
                    <div className="mt-1 whitespace-pre-wrap text-slate-900">{m.content}</div>
                    {m.lowConfidence ? <p className="mt-2 text-xs text-amber-800">I might be wrong here. Please check the citations.</p> : null}
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
                <label className="text-sm font-semibold text-slate-800" htmlFor="floating-mentor-question">
                  Ask about this page
                </label>
                <input
                  id="floating-mentor-question"
                  value={mentorInput}
                  onChange={(e) => setMentorInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") askMentor();
                  }}
                  className="w-full rounded-xl border border-slate-200 p-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  placeholder="Ask about the notes or tools"
                  maxLength={320}
                />
                <button type="button" className="button primary" onClick={askMentor} disabled={!mentorInput.trim() || mentorStatus === "loading"}>
                  {mentorStatus === "loading" ? "Thinking..." : "Send"}
                </button>
                <p className="text-xs text-slate-600">Answers are grounded in site content.</p>
              </div>
            </m.aside>
          </div>
        ) : null}
      </div>
    </LazyMotion>
  );
}


