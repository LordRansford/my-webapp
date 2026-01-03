"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import CitationChip from "@/components/assistants/CitationChip";

type Citation = { title: string; href: string; why?: string };

type Msg = {
  role: "user" | "professor";
  content: string;
  citations?: Citation[];
  lowConfidence?: boolean;
};

function sanitizeText(input: unknown, maxLen: number) {
  const raw = typeof input === "string" ? input : "";
  return raw.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, maxLen);
}

export default function ProfessorRansfordAssistant(props: { open: boolean; onClose: () => void; pageUrl: string; pageTitle: string }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!props.open) return;
    window.setTimeout(() => inputRef.current?.focus(), 50);
  }, [props.open]);

  const intro = useMemo(
    () =>
      props.pageTitle
        ? `Ask about this page. I will only use this website content.`
        : `Ask a question. I will only use this website content.`,
    [props.pageTitle],
  );

  const ask = async () => {
    const question = sanitizeText(input, 320);
    if (!question) return;
    setError("");
    setStatus("loading");
    setMessages((m) => [...m, { role: "user", content: question }]);
    setInput("");
    try {
      const res = await fetch("/api/professor/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question, pageUrl: props.pageUrl, pageTitle: props.pageTitle }),
      });
      const data = (await res.json().catch(() => ({}))) as any;
      if (!res.ok) {
        const msg = typeof data?.message === "string" ? data.message : "Unable to answer right now.";
        setMessages((m) => [...m, { role: "professor", content: msg, lowConfidence: true }]);
        return;
      }
      setMessages((m) => [
        ...m,
        {
          role: "professor",
          content: typeof data?.answer === "string" ? data.answer : "I can help with what is covered on this site.",
          citations: Array.isArray(data?.citations) ? data.citations : undefined,
          lowConfidence: Boolean(data?.lowConfidence),
        },
      ]);
    } catch {
      setError("Unable to reach Professor Ransford right now.");
    } finally {
      setStatus("idle");
    }
  };

  if (!props.open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" className="absolute inset-0 bg-black/35" aria-label="Close professor" onClick={props.onClose} />
      <aside
        className="absolute right-0 top-0 h-full w-full max-w-sm overflow-y-auto bg-white p-4 shadow-xl"
        aria-label="Professor drawer"
      >
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-slate-900">Professor Ransford</h2>
          <button
            type="button"
            className="rounded-full border px-3 py-1 text-sm"
            onClick={props.onClose}
            aria-label="Close professor panel"
          >
            Close
          </button>
        </div>
        <p className="mt-2 text-sm text-slate-700">{intro}</p>
        <p className="mt-1 text-xs text-slate-600">
          During timed assessments this assistant is disabled to protect exam integrity.
        </p>

        <div className="mt-3 space-y-3">
          {messages.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              Try asking how to use a tool, where to start, or what to practise next.
            </div>
          ) : null}

          {messages.map((m, idx) => (
            <div key={idx} className={`rounded-2xl border p-3 text-sm ${m.role === "user" ? "border-sky-200 bg-sky-50" : "border-slate-200 bg-white"}`}>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">{m.role === "user" ? "You" : "Professor"}</div>
              <div className="mt-1 whitespace-pre-wrap text-slate-900">{m.content}</div>
              {m.lowConfidence ? <p className="mt-2 text-xs text-amber-800">Verify using the links below.</p> : null}
              {m.citations && m.citations.length ? (
                <div className="mt-3">
                  <div className="text-xs font-semibold text-slate-700">Where this is covered on the site</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {m.citations.slice(0, 6).map((c) => (
                      <CitationChip key={c.href} href={c.href} title={c.title} why={c.why} />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-800" htmlFor="professor-question">
            Ask a question
          </label>
          <input
            ref={inputRef}
            id="professor-question"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") ask();
            }}
            className="w-full rounded-xl border border-slate-200 p-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            placeholder="Ask about the notes, tools, CPD, or assessments"
            maxLength={320}
            disabled={status === "loading"}
          />
          <button type="button" className="button primary" onClick={ask} disabled={!input.trim() || status === "loading"}>
            {status === "loading" ? "Thinking..." : "Send"}
          </button>
          {error ? <p className="text-xs font-semibold text-rose-700">{error}</p> : null}
        </div>
      </aside>
    </div>
  );
}

