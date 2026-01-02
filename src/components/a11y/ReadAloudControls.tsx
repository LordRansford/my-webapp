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

function getSelectedText(): string {
  try {
    const sel = window.getSelection();
    const text = sel ? String(sel.toString() || "").replace(/\s+/g, " ").trim() : "";
    return text.slice(0, 3_000);
  } catch {
    return "";
  }
}

function canFindInPage() {
  // window.find is supported in most modern browsers.
  // It highlights matches using the browser selection, which is accessible.
  return typeof window !== "undefined" && typeof (window as any).find === "function";
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
  const [query, setQuery] = useState("");
  const [findAvailable, setFindAvailable] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setAvailable(canSpeak());
    setFindAvailable(canFindInPage());
    return () => {
      try {
        window.speechSynthesis?.cancel?.();
      } catch {
        // ignore
      }
    };
  }, []);

  const text = useMemo(() => (available ? extractReadableText(selector) : ""), [available, selector]);

  const speak = (input: string) => {
    if (!available) return;
    const value = String(input || "").trim();
    if (!value) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(value);
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

  const start = () => speak(text);

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

  const readSelection = () => {
    const selected = getSelectedText();
    if (!selected) return;
    speak(selected);
  };

  const findNext = () => {
    const q = String(query || "").trim();
    if (!q) return;
    if (!findAvailable) return;
    try {
      // Search forward, wrap around.
      (window as any).find(q, false, false, true, false, true, false);
    } catch {
      // ignore
    }
  };

  return (
    <div className="inline-flex flex-wrap items-center gap-2">
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
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          onClick={readSelection}
          aria-label="Read selected text"
        >
          Read selection
        </button>
      </div>

      <div className="inline-flex items-center gap-2">
        <label className="text-xs font-semibold text-slate-700" htmlFor="reading-tools-search">
          Search
        </label>
        <input
          id="reading-tools-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-10 w-44 rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          placeholder="Find text"
        />
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          onClick={findNext}
          aria-label="Find next match"
          disabled={!findAvailable}
        >
          Next
        </button>
      </div>
    </div>
  );
}



