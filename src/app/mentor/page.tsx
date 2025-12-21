"use client";

import { useState } from "react";
import NotesLayout from "@/components/notes/Layout";
import { sanitizeQuestion } from "@/lib/mentor/sanitize";

type Message = { role: "user" | "mentor"; content: string; detail?: string; sources?: { title: string; slug: string }[]; lowConfidence?: boolean };

const suggestions = [
  "Explain this section in simpler terms",
  "How does this relate to cybersecurity",
  "Where can I practice this concept",
  "What should I read next",
];

export default function MentorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const send = async (text?: string) => {
    const question = (text || input).trim();
    const safe = sanitizeQuestion(question);
    if (!question || !safe.ok) {
      setMessages((m) => [...m, { role: "mentor", content: "I can only help with what is covered on this site." }]);
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/mentor/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages((m) => [...m, { role: "mentor", content: data?.message || "I can only help with site content." }]);
      } else {
        setMessages((m) => [
          ...m,
          { role: "user", content: question },
          {
            role: "mentor",
            content: data?.answer || "I can only help with site content.",
            detail: data?.detail,
            sources: data?.sources,
            lowConfidence: !!data?.lowConfidence,
          },
        ]);
      }
      setInput("");
      setStatus("idle");
    } catch {
      setStatus("error");
      setMessages((m) => [...m, { role: "mentor", content: "I can only help with what is covered on this site." }]);
    }
  };

  return (
    <NotesLayout
      meta={{
        title: "Learning Mentor",
        description: "Ask questions about this page.",
        level: "Summary",
        slug: "/mentor",
        section: "ai",
      }}
      activeLevelId="summary"
    >
      <div className="space-y-6">
        <header className="space-y-2">
          <p className="eyebrow">Mentor</p>
          <h1 className="text-3xl font-semibold text-slate-900">Learning Mentor</h1>
          <p className="text-slate-700">Ask about the notes, tools, and dashboards on this site. I only answer from the existing content.</p>
        </header>

        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button key={s} type="button" className="button" onClick={() => send(s)}>
                {s}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex flex-col gap-3">
              {messages.length === 0 ? <p className="text-sm text-slate-700">Ask a question to see an answer.</p> : null}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl border p-3 text-sm ${
                    msg.role === "user" ? "border-sky-200 bg-sky-50" : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">{msg.role === "user" ? "You" : "Mentor"}</div>
                  <div className="mt-1 text-slate-900 whitespace-pre-wrap">{msg.content}</div>
                  {msg.detail ? (
                    <div className="mt-2">
                      <button
                        type="button"
                        className="text-xs font-semibold text-slate-800 underline"
                        onClick={() => setExpanded((e) => ({ ...e, [idx]: !e[idx] }))}
                      >
                        {expanded[idx] ? "Hide detail" : "Show more detail"}
                      </button>
                      {expanded[idx] ? <p className="mt-1 text-sm text-slate-800 whitespace-pre-wrap">{msg.detail}</p> : null}
                    </div>
                  ) : null}
                  {msg.lowConfidence ? (
                    <p className="mt-2 text-xs text-amber-800">I am not fully confident. Please check the sources below.</p>
                  ) : null}
                  {msg.sources && msg.sources.length ? (
                    <div className="mt-2 text-xs text-slate-700">
                      Sources:
                      <ul className="list-disc pl-4">
                        {msg.sources.map((s) => (
                          <li key={s.slug}>
                            <a className="link" href={s.slug}>
                              {s.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-800" htmlFor="mentor-question">
                Ask about this site
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  id="mentor-question"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") send();
                  }}
                  className="flex-1 rounded-xl border border-slate-200 p-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  placeholder="Ask a question about the notes or tools"
                  maxLength={320}
                />
                <button
                  type="button"
                  className="button primary"
                  onClick={() => send()}
                  disabled={!input.trim() || status === "loading"}
                >
                  {status === "loading" ? "Thinking..." : "Send"}
                </button>
              </div>
              <p className="text-xs text-slate-600">
                I only answer from existing site content. If a question is out of scope, I will say so. No data is stored beyond anonymous counts.
              </p>
            </div>
          </div>
        </section>
      </div>
    </NotesLayout>
  );
}


