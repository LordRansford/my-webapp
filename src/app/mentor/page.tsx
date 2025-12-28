"use client";

import React, { useState } from "react";
import NotesLayout from "@/components/notes/Layout";
import { sanitizeQuestion } from "@/lib/mentor/sanitize";
import type { MentorPageContext } from "@/lib/contracts/mentor";

type Message = {
  role: "user" | "mentor";
  content: string;
  answerMode?: "site-grounded" | "general-guidance" | "mixed";
  refusalReason?: { code: string; message: string } | null;
  suggestedNextActions?: string[];
  citations?: Array<{ title: string; href: string; why?: string }>;
  citationsV2?: Array<{ title: string; urlOrPath: string; anchorOrHeading?: string }>;
  sources?: { title: string; href: string; excerpt?: string }[];
  lowConfidence?: boolean;
};

function collectHeadings(): Array<{ id: string; text: string; depth: number }> {
  try {
    const nodes = Array.from(document.querySelectorAll("article h2, article h3"));
    return nodes
      .map((n: any) => ({
        id: String(n?.id || "").trim(),
        text: String(n?.textContent || "").trim().slice(0, 120),
        depth: n?.tagName === "H2" ? 2 : 3,
      }))
      .filter((h) => h.id && h.text);
  } catch {
    return [];
  }
}

function collectVisibleText(maxLen = 8000) {
  try {
    const root = document.querySelector("article") || document.querySelector("main") || document.body;
    const raw = String((root as any)?.innerText || (root as any)?.textContent || "");
    return raw.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLen);
  } catch {
    return "";
  }
}

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
      setMessages((m) => [...m, { role: "mentor", content: "Please ask a shorter, specific question." }]);
      return;
    }
    setStatus("loading");
    try {
      const pageContext: MentorPageContext = {
        pathname: window.location.pathname || "/mentor",
        title: document.title || "Mentor",
        text: collectVisibleText(9000),
        headings: collectHeadings(),
      };
      const res = await fetch("/api/mentor/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, pageUrl: window.location.pathname || "/mentor", pageContext }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages((m) => [...m, { role: "mentor", content: data?.message || "Something went wrong." }]);
      } else {
        setMessages((m) => [
          ...m,
          { role: "user", content: question },
          {
            role: "mentor",
            content: typeof data?.answer === "string" ? data.answer : "No answer available.",
            answerMode: data?.answerMode,
            refusalReason: data?.refusalReason || null,
            suggestedNextActions: Array.isArray(data?.suggestedNextActions) ? data.suggestedNextActions : undefined,
            citations: Array.isArray(data?.citations) ? data.citations : undefined,
            citationsV2: Array.isArray(data?.citationsV2) ? data.citationsV2 : undefined,
            sources: Array.isArray(data?.sources) ? data.sources : undefined,
            lowConfidence: Boolean(data?.lowConfidence),
          },
        ]);
      }
      setInput("");
      setStatus("idle");
    } catch {
      setStatus("error");
      setMessages((m) => [...m, { role: "mentor", content: "Could not reach the mentor right now. Please try again." }]);
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
      showContentsSidebar={false}
      showStepper={false}
      useAppShell
    >
      <div className="space-y-6">
        <header className="space-y-2">
          <p className="eyebrow">Mentor</p>
          <h1 className="text-3xl font-semibold text-slate-900">Learning Mentor</h1>
          <p className="text-slate-700">
            Ask about the notes, tools, and labs. I answer from this site when possible, and I will label general guidance clearly.
          </p>
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
                  {msg.role === "mentor" && msg.answerMode ? (
                    <div className="mt-1 text-xs font-semibold text-slate-700">
                      {msg.answerMode === "site-grounded" ? "From this site" : msg.answerMode === "general-guidance" ? "General guidance" : "Mixed"}
                    </div>
                  ) : null}
                  <div className="mt-1 text-slate-900 whitespace-pre-wrap">
                    {msg.content.split('\n').map((line, idx) => {
                      // Convert markdown links to clickable links
                      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
                      const parts: React.ReactNode[] = [];
                      let lastIndex = 0;
                      let match;
                      
                      while ((match = linkRegex.exec(line)) !== null) {
                        // Add text before the link
                        if (match.index > lastIndex) {
                          parts.push(line.slice(lastIndex, match.index));
                        }
                        // Add the link
                        parts.push(
                          <a 
                            key={`link-${idx}-${match.index}`}
                            href={match[2]} 
                            className="text-blue-600 underline hover:text-blue-800"
                          >
                            {match[1]}
                          </a>
                        );
                        lastIndex = match.index + match[0].length;
                      }
                      // Add remaining text
                      if (lastIndex < line.length) {
                        parts.push(line.slice(lastIndex));
                      }
                      
                      return parts.length > 1 ? (
                        <p key={idx} className={idx > 0 ? "mt-2" : ""}>
                          {parts}
                        </p>
                      ) : (
                        <p key={idx} className={idx > 0 ? "mt-2" : ""}>{line}</p>
                      );
                    })}
                  </div>
                  {msg.refusalReason?.message ? (
                    <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                      <p className="m-0 font-semibold">Why I could not answer from the site</p>
                      <p className="mt-1 m-0">{msg.refusalReason.message}</p>
                    </div>
                  ) : null}
                  {msg.suggestedNextActions && msg.suggestedNextActions.length ? (
                    <div className="mt-3">
                      <div className="text-xs font-semibold text-slate-700">Suggested next actions</div>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-800">
                        {msg.suggestedNextActions.slice(0, 4).map((a) => (
                          <li key={a}>{a}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {msg.lowConfidence ? (
                    <p className="mt-2 text-xs text-amber-800">I am not fully confident. Please check the sources below.</p>
                  ) : null}
                  {msg.sources && msg.sources.length ? (
                    <div className="mt-3">
                      <div className="text-xs font-semibold text-slate-700">Sources</div>
                      <ul className="mt-2 space-y-1">
                        {msg.sources.slice(0, 6).map((s) => (
                          <li key={`${s.href}-${s.title}`} className="text-xs text-slate-700">
                            <a className="underline hover:no-underline" href={s.href}>
                              {s.title}
                            </a>
                            {s.excerpt ? <span className="text-slate-500"> — {s.excerpt}</span> : null}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {msg.citations && msg.citations.length ? (
                    <div className="mt-3">
                      <div className="text-xs font-semibold text-slate-700">Where to read next</div>
                      <ul className="mt-2 space-y-1">
                        {msg.citations.slice(0, 6).map((c) => (
                          <li key={c.href} className="text-xs text-slate-700">
                            <a className="underline hover:no-underline" href={c.href}>
                              {c.title}
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
                I answer from this site when possible. If not, I provide brief general guidance and suggest what to do next.
              </p>
            </div>
          </div>
        </section>
      </div>
    </NotesLayout>
  );
}


