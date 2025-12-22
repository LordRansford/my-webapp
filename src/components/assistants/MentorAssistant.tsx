"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { GraduationCap, X } from "lucide-react";
import CitationChip from "@/components/assistants/CitationChip";

type MentorCitation = { title: string; href: string; why?: string };
type MentorTryNext = { title: string; href: string; steps: string[] };
export type MentorMsg = {
  role: "user" | "mentor";
  content: string;
  citationsTitle?: string;
  citations?: MentorCitation[];
  tryNext?: MentorTryNext | null;
  lowConfidence?: boolean;
};

const MSG_KEY_PREFIX = "rn_mentor_msgs_v1:";

function sanitizeText(input: unknown, maxLen: number) {
  const raw = typeof input === "string" ? input : "";
  return raw.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, maxLen);
}

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

function collectToolTitles(): Array<{ id?: string; title: string }> {
  try {
    const nodes = Array.from(document.querySelectorAll("[data-tool-id][data-tool-title]"));
    if (nodes.length) {
      return nodes
        .map((n: any) => ({ id: String(n?.dataset?.toolId || "").trim(), title: String(n?.dataset?.toolTitle || "").trim().slice(0, 120) }))
        .filter((t) => t.title);
    }
    const fallback = Array.from(document.querySelectorAll(".notes-tool-card h3"));
    return fallback.map((n: any) => ({ title: String(n?.textContent || "").trim().slice(0, 120) })).filter((t) => t.title);
  } catch {
    return [];
  }
}

function readMsgs(key: string): MentorMsg[] {
  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as MentorMsg[]) : [];
  } catch {
    return [];
  }
}

function writeMsgs(key: string, msgs: MentorMsg[]) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(msgs.slice(-30)));
  } catch {
    // ignore
  }
}

export default function MentorAssistant({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname() || "/";
  const storageKey = useMemo(() => `${MSG_KEY_PREFIX}${pathname}`, [pathname]);

  const [messages, setMessages] = useState<MentorMsg[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  useEffect(() => {
    if (typeof window === "undefined") return;
    setMessages(readMsgs(storageKey));
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    writeMsgs(storageKey, messages);
  }, [storageKey, messages]);

  const ask = async () => {
    const question = sanitizeText(input, 320);
    if (!question) return;
    setStatus("loading");

    const headings = collectHeadings();
    const tools = collectToolTitles();

    try {
      const res = await fetch("/api/mentor/query", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          question,
          pageUrl: pathname,
          pageTitle: document.title || "",
          headings,
          tools,
        }),
      });
      const data = await res.json().catch(() => ({}));

      const citations: MentorCitation[] = Array.isArray(data?.citations) ? data.citations : [];
      const filtered = citations.filter((c) => {
        const href = typeof c?.href === "string" ? c.href : "";
        if (!href) return false;
        if (!href.includes("#")) return true;
        const hash = href.split("#")[1] || "";
        if (!hash) return false;
        const routePart = href.split("#")[0] || "";
        const sameRoute = routePart === "" || routePart === pathname;
        if (!sameRoute) return true;
        return Boolean(document.getElementById(hash));
      });

      setMessages((m) => [
        ...m,
        { role: "user", content: question },
        {
          role: "mentor",
          content: typeof data?.answer === "string" ? data.answer : "I can only help with what is covered on this site.",
          citationsTitle: typeof data?.citationsTitle === "string" ? data.citationsTitle : undefined,
          citations: filtered.length ? filtered : undefined,
          tryNext: data?.tryNext || null,
          lowConfidence: Boolean(data?.lowConfidence),
        },
      ]);
      setInput("");
    } catch {
      setMessages((m) => [...m, { role: "mentor", content: "I can only help with what is covered on this site." }]);
    } finally {
      setStatus("idle");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" className="absolute inset-0 bg-black/35" aria-label="Close mentor" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-sm overflow-y-auto bg-white p-4 shadow-xl" aria-label="Mentor drawer">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-slate-800" aria-hidden="true" />
            <h2 className="text-base font-semibold text-slate-900">Mentor</h2>
          </div>
          <button type="button" className="rounded-full border px-3 py-1 text-sm" onClick={onClose} aria-label="Close mentor panel">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
          Educational support only. Not medical advice. Not legal advice.
        </div>

        <div className="mt-3 space-y-3">
          {messages.length === 0 ? <p className="text-sm text-slate-700">Ask a question to see an answer.</p> : null}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border p-3 text-sm ${msg.role === "user" ? "border-sky-200 bg-sky-50" : "border-slate-200 bg-white"}`}
            >
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">{msg.role === "user" ? "You" : "Mentor"}</div>
              <div className="mt-1 whitespace-pre-wrap text-slate-900">{msg.content}</div>
              {msg.lowConfidence ? <p className="mt-2 text-xs text-amber-800">I might be wrong here. Please check the citations.</p> : null}
              {msg.citations && msg.citations.length ? (
                <div className="mt-3">
                  <div className="text-xs font-semibold text-slate-700">{msg.citationsTitle || "Where this is covered on the site"}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {msg.citations.slice(0, 6).map((c) => (
                      <CitationChip key={c.href} href={c.href} title={c.title} why={c.why} />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-800" htmlFor="mentor-question">
            Ask about this page
          </label>
          <input
            id="mentor-question"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") ask();
            }}
            className="w-full rounded-xl border border-slate-200 p-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            placeholder="Ask about the notes or tools"
            maxLength={320}
          />
          <button type="button" className="button primary" onClick={ask} disabled={!input.trim() || status === "loading"}>
            {status === "loading" ? "Thinking..." : "Send"}
          </button>
        </div>
      </aside>
    </div>
  );
}


