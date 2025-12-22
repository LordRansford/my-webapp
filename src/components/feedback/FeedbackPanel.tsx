"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";

const OPTIONS = ["Family", "Friend", "Work colleague", "Other"] as const;

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
    const key = "rn_feedback_session_v1";
    const existing = window.sessionStorage.getItem(key);
    if (existing) return existing;
    const id = cryptoRandomId();
    window.sessionStorage.setItem(key, id);
    return id;
  } catch {
    return cryptoRandomId();
  }
}

export default function FeedbackPanel() {
  const pathname = usePathname() || "/";
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
        setStatus("error");
        setErrorMessage(typeof data?.message === "string" ? data.message : "Could not send feedback.");
        return;
      }
      setStatus("success");
      setMessage("");
    } catch {
      setStatus("error");
      setErrorMessage("Could not send feedback.");
    }
  };

  return (
    <section className="mt-6 rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm" aria-label="Feedback">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-900">Quick feedback</h2>
        <p className="text-sm text-slate-700">
          Optional. This helps improve accuracy and usefulness. No accounts required.
        </p>
      </div>

      {status === "success" ? (
        <p className="mt-3 text-sm font-semibold text-emerald-800">Thank you. Your feedback has been received.</p>
      ) : (
        <div className="mt-4 grid gap-3">
          <label className="space-y-1" htmlFor="panel-feedback-name">
            <span className="text-sm font-semibold text-slate-800">Name (optional)</span>
            <input
              id="panel-feedback-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="Your name"
            />
          </label>

          <label className="space-y-1" htmlFor="panel-feedback-heard">
            <span className="text-sm font-semibold text-slate-800">How did you hear about this site?</span>
            <select
              id="panel-feedback-heard"
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

          <label className="space-y-1" htmlFor="panel-feedback-message">
            <span className="text-sm font-semibold text-slate-800">Feedback</span>
            <textarea
              id="panel-feedback-message"
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

          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className="button" onClick={submit} disabled={!canSubmit || status === "loading"}>
              {status === "loading" ? "Sending..." : "Send feedback"}
            </button>
            {status === "error" ? <span className="text-sm text-rose-700">{errorMessage || "Could not send feedback."}</span> : null}
          </div>
        </div>
      )}
    </section>
  );
}


