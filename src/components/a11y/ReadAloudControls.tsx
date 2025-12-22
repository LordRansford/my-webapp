"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, Square } from "lucide-react";

type Status = "idle" | "playing" | "paused";

function canSpeak() {
  return typeof window !== "undefined" && "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance !== "undefined";
}

function extractReadableText(selector: string) {
  try {
    const root = document.querySelector(selector);
    if (!root) return "";
    // Remove nav-like blocks from reading, keep headings and paragraphs.
    const clone = root.cloneNode(true) as HTMLElement;
    clone.querySelectorAll("nav, aside, button, input, textarea, select").forEach((n) => n.remove());
    const text = (clone.textContent || "").replace(/\s+/g, " ").trim();
    return text.slice(0, 18_000);
  } catch {
    return "";
  }
}

export default function ReadAloudControls({
  selector = "main article",
  label = "Listen",
}: {
  selector?: string;
  label?: string;
}) {
  const [available, setAvailable] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setAvailable(canSpeak());
    return () => {
      try {
        window.speechSynthesis?.cancel?.();
      } catch {
        // ignore
      }
    };
  }, []);

  const text = useMemo(() => (available ? extractReadableText(selector) : ""), [available, selector]);

  const start = () => {
    if (!available) return;
    if (!text) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 1;
      utter.pitch = 1;
      utter.onend = () => setStatus("idle");
      utter.onerror = () => setStatus("idle");
      utter.onpause = () => setStatus("paused");
      utter.onresume = () => setStatus("playing");
      utterRef.current = utter;
      window.speechSynthesis.speak(utter);
      setStatus("playing");
    } catch {
      setStatus("idle");
    }
  };

  const pause = () => {
    if (!available) return;
    try {
      window.speechSynthesis.pause();
      setStatus("paused");
    } catch {
      // ignore
    }
  };

  const resume = () => {
    if (!available) return;
    try {
      window.speechSynthesis.resume();
      setStatus("playing");
    } catch {
      // ignore
    }
  };

  const stop = () => {
    if (!available) return;
    try {
      window.speechSynthesis.cancel();
      setStatus("idle");
    } catch {
      // ignore
    }
  };

  if (!available) return null;

  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-sm font-semibold text-slate-900">{label}</span>
      <div className="inline-flex items-center gap-2">
        {status !== "playing" ? (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            onClick={status === "paused" ? resume : start}
            aria-label={status === "paused" ? "Resume reading" : "Start reading"}
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            {status === "paused" ? "Resume" : "Play"}
          </button>
        ) : (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            onClick={pause}
            aria-label="Pause reading"
          >
            <Pause className="h-4 w-4" aria-hidden="true" />
            Pause
          </button>
        )}
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          onClick={stop}
          aria-label="Stop reading"
        >
          <Square className="h-4 w-4" aria-hidden="true" />
          Stop
        </button>
      </div>
    </div>
  );
}



