"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, LifeBuoy, X } from "lucide-react";

const feedbackOptions = ["Family", "Friend", "Work colleague", "Other"] as const;
const feedbackCategories = ["Bug", "Content", "UX", "Idea", "Other"] as const;
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

function summariseFeedback(message: string, category: string, followUp: string) {
  const m = sanitizeText(message, 240);
  const f = sanitizeText(followUp, 180);
  const parts = [category ? `Category: ${category}.` : "", m ? `Message: ${m}` : "", f ? `Expectation: ${f}` : ""].filter(Boolean);
  return parts.join(" ");
}

export default function FeedbackAssistant({
  open,
  onClose,
  pageUrl,
  pageTitle,
}: {
  open: boolean;
  onClose: () => void;
  pageUrl: string;
  pageTitle: string;
}) {
  const [name, setName] = useState("");
  const [heardFrom, setHeardFrom] = useState<(typeof feedbackOptions)[number]>(feedbackOptions[0]);
  const [category, setCategory] = useState<(typeof feedbackCategories)[number]>(feedbackCategories[1]);
  const [message, setMessage] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreviewUrl, setScreenshotPreviewUrl] = useState<string | null>(null);

  const canSubmit = useMemo(() => sanitizeText(message, 1500).length > 0, [message]);

  useEffect(() => {
    if (!screenshotFile) return;
    const url = URL.createObjectURL(screenshotFile);
    setScreenshotPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [screenshotFile]);

  const submit = async () => {
    const cleanMessage = sanitizeText(message, 1500);
    if (!cleanMessage) return;
    setStatus("loading");
    setErrorMessage(null);
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
        category,
        followUp: sanitizeText(followUp, 600),
        clientSummary: summariseFeedback(cleanMessage, category, followUp),
        message: cleanMessage,
        pageUrl,
        pageTitle,
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
        setStatus("error");
        setErrorMessage(typeof data?.message === "string" ? data.message : "Could not send feedback.");
        return;
      }
      setStatus("success");
      setMessage("");
      setFollowUp("");
      setScreenshotFile(null);
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err?.message || "Could not send feedback.");
    }
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
        setErrorMessage("Screenshot must be an image.");
        return;
      }
      if (file.size > SCREENSHOT_MAX_BYTES) {
        setErrorMessage("Screenshot is too large. Please use a smaller image.");
        return;
      }
      setErrorMessage(null);
      setScreenshotFile(file);
    },
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" className="absolute inset-0 bg-black/35" aria-label="Close feedback" onClick={onClose} />
      <aside className="absolute left-0 top-0 h-full w-full max-w-sm overflow-y-auto bg-white p-4 shadow-xl" aria-label="Feedback drawer">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <LifeBuoy className="h-4 w-4 text-slate-800" aria-hidden="true" />
            <h2 className="text-base font-semibold text-slate-900">Feedback</h2>
          </div>
          <button type="button" className="rounded-full border px-3 py-1 text-sm" onClick={onClose} aria-label="Close feedback panel">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {status === "success" ? (
          <p className="mt-3 text-sm font-semibold text-emerald-800">Thank you. Your feedback has been received.</p>
        ) : (
          <div className="mt-4 grid gap-3">
            <label className="space-y-1" htmlFor="feedback-name">
              <span className="text-sm font-semibold text-slate-800">Name</span>
              <input
                id="feedback-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                placeholder="Optional"
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
                {feedbackOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1" htmlFor="feedback-category">
              <span className="text-sm font-semibold text-slate-800">Type</span>
              <select
                id="feedback-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 p-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                {feedbackCategories.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1" htmlFor="feedback-message">
              <span className="text-sm font-semibold text-slate-800">Your feedback</span>
              <textarea
                id="feedback-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                maxLength={1500}
                className="w-full rounded-xl border border-slate-200 p-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                placeholder="What worked well, what was confusing, or what is missing"
                required
              />
            </label>

            <label className="space-y-1" htmlFor="feedback-followup">
              <span className="text-sm font-semibold text-slate-800">One follow up question</span>
              <input
                id="feedback-followup"
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                placeholder="What would good look like instead?"
                maxLength={600}
              />
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
                      setErrorMessage("Screenshot must be an image.");
                      return;
                    }
                    if (file.size > SCREENSHOT_MAX_BYTES) {
                      setErrorMessage("Screenshot is too large. Please use a smaller image.");
                      return;
                    }
                    setErrorMessage(null);
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
              <button type="button" className="button" onClick={submit} disabled={!canSubmit || status === "loading"}>
                {status === "loading" ? "Sending..." : "Send feedback"}
              </button>
              {status === "error" ? <span className="text-sm text-rose-700">{errorMessage || "Could not send feedback."}</span> : null}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}


