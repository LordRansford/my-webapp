"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, Square } from "lucide-react";
import { highlightAnchorFromLocation } from "@/lib/ui/highlightAnchor";

type Status = "idle" | "playing" | "paused";
type ReadMode = "page" | "section";

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

function clampText(value: string, maxLen: number) {
  const clean = String(value || "").replace(/\s+/g, " ").trim();
  return clean.length > maxLen ? clean.slice(0, maxLen) : clean;
}

function getHeadingNodes(selector: string): HTMLElement[] {
  try {
    const root = document.querySelector(selector);
    if (!root) return [];
    const nodes = Array.from(root.querySelectorAll("h2[id]")) as HTMLElement[];
    return nodes.filter((n) => Boolean(n.id));
  } catch {
    return [];
  }
}

function extractSectionText(selector: string, headingId: string) {
  try {
    const root = document.querySelector(selector);
    if (!root) return "";
    const heading = root.querySelector(`#${CSS.escape(headingId)}`) as HTMLElement | null;
    if (!heading) return "";

    const headings = getHeadingNodes(selector);
    const index = headings.findIndex((h) => h.id === headingId);
    const nextHeading = index >= 0 ? headings[index + 1] : null;

    const range = document.createRange();
    range.setStartBefore(heading);
    if (nextHeading) range.setEndBefore(nextHeading);
    else range.setEndAfter(root);

    const fragment = range.cloneContents();
    const container = document.createElement("div");
    container.appendChild(fragment);
    container.querySelectorAll("nav, aside, button, input, textarea, select").forEach((n) => n.remove());
    return clampText(container.textContent || "", 9_000);
  } catch {
    return "";
  }
}

function setHeadingHighlight(headingId: string, enabled: boolean) {
  try {
    const node = document.getElementById(headingId);
    if (!node) return;
    if (enabled) {
      node.classList.add("rounded-lg", "ring-2", "ring-slate-400", "bg-slate-50");
      node.scrollIntoView({ block: "center", behavior: "smooth" });
    } else {
      node.classList.remove("rounded-lg", "ring-2", "ring-slate-400", "bg-slate-50");
    }
  } catch {
    // ignore
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

function findFirstTextMatch(selector: string, query: string) {
  try {
    const root = document.querySelector(selector);
    if (!root) return false;
    const q = String(query || "").trim().toLowerCase();
    if (!q) return false;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (node) => {
        const el = node as Element;
        const tag = el.tagName?.toLowerCase?.() || "";
        if (["script", "style", "noscript"].includes(tag)) return NodeFilter.FILTER_REJECT;
        const text = (el.textContent || "").toLowerCase();
        if (text.includes(q)) return NodeFilter.FILTER_ACCEPT;
        return NodeFilter.FILTER_SKIP;
      },
    } as any);
    const hit = walker.nextNode() as Element | null;
    if (!hit) return false;
    (hit as any).scrollIntoView?.({ behavior: "smooth", block: "center" });
    // Reuse the anchor highlight style as a general focus affordance.
    const id = (hit as any).id ? `#${String((hit as any).id)}` : "";
    if (id) {
      const url = new URL(window.location.href);
      url.hash = id;
      window.history.replaceState(null, "", url.toString());
      highlightAnchorFromLocation();
    } else {
      (hit as HTMLElement).classList.add("outline", "outline-2", "outline-slate-400", "outline-offset-4", "rounded-lg");
      window.setTimeout(() => {
        (hit as HTMLElement).classList.remove("outline", "outline-2", "outline-slate-400", "outline-offset-4", "rounded-lg");
      }, 1400);
    }
    return true;
  } catch {
    return false;
  }
}

export default function ReadAloudControls({
  selector = "main article",
  label = "Listen",
  activeHeadingId,
}: {
  selector?: string;
  label?: string;
  activeHeadingId?: string;
}) {
  const [available, setAvailable] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [mode, setMode] = useState<ReadMode>("page");
  const [autoNext, setAutoNext] = useState(false);
  const [query, setQuery] = useState("");
  const [findAvailable, setFindAvailable] = useState(false);
  const [currentHeadingId, setCurrentHeadingId] = useState<string>("");
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const activeHighlightRef = useRef<string>("");

  useEffect(() => {
    setAvailable(canSpeak());
    setFindAvailable(canFindInPage());
    return () => {
      try {
        if (activeHighlightRef.current) setHeadingHighlight(activeHighlightRef.current, false);
        window.speechSynthesis?.cancel?.();
      } catch {
        // ignore
      }
    };
  }, []);

  const text = useMemo(() => (available ? extractReadableText(selector) : ""), [available, selector]);
  const headings = useMemo(() => (available ? getHeadingNodes(selector) : []), [available, selector]);

  useEffect(() => {
    const resolved =
      String(activeHeadingId || "").trim() ||
      String(currentHeadingId || "").trim() ||
      String(headings?.[0]?.id || "").trim();
    if (resolved) setCurrentHeadingId(resolved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeHeadingId, headings.length]);

  const speak = (input: string, opts?: { headingId?: string; onEnded?: () => void }) => {
    if (!available) return;
    const value = String(input || "").trim();
    if (!value) return;
    try {
      const nextHeadingId = String(opts?.headingId || "").trim();
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(value);
      utter.rate = 1;
      utter.pitch = 1;
      utter.onend = () => {
        setStatus("idle");
        if (nextHeadingId) {
          setHeadingHighlight(nextHeadingId, false);
          if (activeHighlightRef.current === nextHeadingId) activeHighlightRef.current = "";
        }
        opts?.onEnded?.();
      };
      utter.onerror = () => {
        setStatus("idle");
        if (nextHeadingId) {
          setHeadingHighlight(nextHeadingId, false);
          if (activeHighlightRef.current === nextHeadingId) activeHighlightRef.current = "";
        }
      };
      utter.onpause = () => setStatus("paused");
      utter.onresume = () => setStatus("playing");
      utterRef.current = utter;
      if (nextHeadingId) {
        if (activeHighlightRef.current && activeHighlightRef.current !== nextHeadingId) {
          setHeadingHighlight(activeHighlightRef.current, false);
        }
        activeHighlightRef.current = nextHeadingId;
        setHeadingHighlight(nextHeadingId, true);
      }
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
      if (activeHighlightRef.current) setHeadingHighlight(activeHighlightRef.current, false);
      activeHighlightRef.current = "";
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

  const readCurrentSection = () => {
    const id = String(currentHeadingId || "").trim();
    if (!id) return;
    const sectionText = extractSectionText(selector, id);
    if (!sectionText) return;
    speak(sectionText, {
      headingId: id,
      onEnded: () => {
        if (!autoNext) return;
        const index = headings.findIndex((h) => h.id === id);
        const next = index >= 0 ? headings[index + 1] : null;
        if (!next?.id) return;
        setCurrentHeadingId(next.id);
        const nextText = extractSectionText(selector, next.id);
        if (!nextText) return;
        speak(nextText, { headingId: next.id });
      },
    });
  };

  const goPrevSection = () => {
    const id = String(currentHeadingId || "").trim();
    const index = headings.findIndex((h) => h.id === id);
    const prev = index > 0 ? headings[index - 1] : null;
    if (prev?.id) setCurrentHeadingId(prev.id);
  };

  const goNextSection = () => {
    const id = String(currentHeadingId || "").trim();
    const index = headings.findIndex((h) => h.id === id);
    const next = index >= 0 ? headings[index + 1] : null;
    if (next?.id) setCurrentHeadingId(next.id);
  };

  const findNext = () => {
    const q = String(query || "").trim();
    if (!q) return;
    try {
      if (findAvailable) {
        // Search forward, wrap around.
        (window as any).find(q, false, false, true, false, true, false);
      } else {
        findFirstTextMatch(selector, q);
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="inline-flex flex-wrap items-center gap-2">
      <span className="text-sm font-semibold text-slate-900">{label}</span>
      <div className="inline-flex items-center gap-2">
        <button
          type="button"
          className={
            "inline-flex h-10 items-center justify-center rounded-full border px-3 text-sm font-semibold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 " +
            (mode === "page" ? "border-slate-300 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50")
          }
          onClick={() => setMode("page")}
          aria-pressed={mode === "page"}
        >
          Page
        </button>
        <button
          type="button"
          className={
            "inline-flex h-10 items-center justify-center rounded-full border px-3 text-sm font-semibold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 " +
            (mode === "section" ? "border-slate-300 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50")
          }
          onClick={() => setMode("section")}
          aria-pressed={mode === "section"}
        >
          Section
        </button>
        {mode === "section" ? (
          <button
            type="button"
            className={
              "inline-flex h-10 items-center justify-center rounded-full border px-3 text-sm font-semibold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 " +
              (autoNext ? "border-slate-300 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50")
            }
            onClick={() => setAutoNext((v) => !v)}
            aria-pressed={autoNext}
          >
            Auto next
          </button>
        ) : null}
      </div>
      <div className="inline-flex items-center gap-2">
        {status !== "playing" ? (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            onClick={
              status === "paused"
                ? resume
                : mode === "section"
                ? () => readCurrentSection()
                : start
            }
            aria-label={status === "paused" ? "Resume reading" : "Start reading"}
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            {status === "paused" ? "Resume" : mode === "section" ? "Play section" : "Play"}
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
        {mode === "section" ? (
          <div className="inline-flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              onClick={goPrevSection}
              aria-label="Previous section"
              disabled={headings.length === 0}
            >
              Prev
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              onClick={goNextSection}
              aria-label="Next section"
              disabled={headings.length === 0}
            >
              Next section
            </button>
          </div>
        ) : null}
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
        >
          Next
        </button>
      </div>
    </div>
  );
}



