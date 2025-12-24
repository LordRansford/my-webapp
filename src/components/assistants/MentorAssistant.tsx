"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { GraduationCap, X } from "lucide-react";
import CitationChip from "@/components/assistants/CitationChip";
import ComputeMeter from "@/components/ComputeMeter";
import type { ComputeActual, ComputeEstimate } from "@/lib/contracts/compute";

type MentorCitation = { title: string; href: string; why?: string };
type MentorSource = { title: string; href: string; excerpt?: string };
type MentorTryNext = { title: string; href: string; steps: string[] };
export type MentorMsg = {
  role: "user" | "mentor";
  content: string;
  answerFromSite?: string;
  refusalReason?: { code: string; message: string } | null;
  suggestedNextActions?: string[];
  citationsTitle?: string;
  citations?: MentorCitation[];
  sources?: MentorSource[];
  tryNext?: MentorTryNext | null;
  lowConfidence?: boolean;
  receipt?: any;
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

function collectVisibleText(maxLen = 8000) {
  try {
    const root = document.querySelector("article") || document.querySelector("main") || document.body;
    const raw = String((root as any)?.innerText || (root as any)?.textContent || "");
    return raw.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLen);
  } catch {
    return "";
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
  const [estimate, setEstimate] = useState<ComputeEstimate | null>(null);
  const [estimateFreeRemainingMs, setEstimateFreeRemainingMs] = useState<number | null>(null);
  const [actual, setActual] = useState<ComputeActual | null>(null);
  const [remainingCredits, setRemainingCredits] = useState<number | null>(null);
  const [costHints, setCostHints] = useState<string[]>([]);

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
    setActual(null);
    setRemainingCredits(null);

    const headings = collectHeadings();
    const tools = collectToolTitles();
    const text = collectVisibleText(9000);

    try {
      // Pre-run estimate (authoritative)
      try {
        const er = await fetch("/api/compute/estimate", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ toolId: "mentor-query", inputBytes: question.length, requestedComplexityPreset: "standard" }),
        });
        const ej = await er.json().catch(() => null);
        if (ej?.ok) {
          setEstimate({
            estimatedCpuMs: Number(ej.estimatedCpuMs || 0),
            estimatedWallTimeMs: Number(ej.estimatedWallTimeMs || 0),
            estimatedCreditCost: Number(ej.estimatedCreditCost || 0),
            freeTierAppliedMs: Number(ej.freeTierAppliedMs || 0),
            paidMs: Number(ej.paidMs || 0),
            allowed: Boolean(ej.allowed),
            reasons: Array.isArray(ej.reasons) ? ej.reasons : [],
          });
          setEstimateFreeRemainingMs(typeof ej?.freeTierRemainingMs === "number" ? ej.freeTierRemainingMs : null);
          setCostHints(Array.isArray(ej.costHints) ? ej.costHints : []);
        }
      } catch {
        // ignore
      }

      const res = await fetch("/api/mentor/query", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          question,
          pageUrl: pathname,
          pageContext: {
            pathname,
            title: document.title || "",
            text,
            headings,
            // Tools are not used server-side today, but keep them for future expansion.
            tools,
          },
        }),
      });
      const data = await res.json().catch(() => ({}));
      const receipt = data?.receipt || null;
      if (receipt) {
        const durationMs = Number(receipt?.durationMs || 0);
        const freeTierAppliedMs = Number(receipt?.freeTierAppliedMs || 0);
        const creditsCharged = Number(receipt?.creditsCharged || 0);
        setActual({ durationMs, freeTierAppliedMs, paidMs: Math.max(0, durationMs - freeTierAppliedMs), creditsCharged });
        setRemainingCredits(typeof receipt?.remainingCredits === "number" ? receipt.remainingCredits : null);
      }

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
          content:
            typeof data?.answer === "string"
              ? data.answer
              : "I could not find an exact match in the site content. I can still give general guidance, and I will list the closest sections when available.",
          answerFromSite: typeof data?.answerFromSite === "string" ? data.answerFromSite : undefined,
          citationsTitle: typeof data?.citationsTitle === "string" ? data.citationsTitle : undefined,
          citations: filtered.length ? filtered : undefined,
          sources: Array.isArray(data?.sources)
            ? data.sources
                .map((s: any) => ({ title: sanitizeText(s?.title, 140), href: sanitizeText(s?.href, 240), excerpt: sanitizeText(s?.excerpt, 240) }))
                .filter((s: any) => s.title && s.href)
            : undefined,
          refusalReason: data?.refusalReason && typeof data.refusalReason === "object"
            ? { code: sanitizeText((data.refusalReason as any)?.code, 40), message: sanitizeText((data.refusalReason as any)?.message, 240) }
            : null,
          suggestedNextActions: Array.isArray(data?.suggestedNextActions)
            ? data.suggestedNextActions.map((x: any) => sanitizeText(x, 160)).filter(Boolean).slice(0, 5)
            : undefined,
          tryNext: data?.tryNext || null,
          lowConfidence: Boolean(data?.lowConfidence),
          receipt: data?.receipt || null,
        },
      ]);
      setInput("");
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "mentor",
          content: "Something went wrong while looking up the site content. If you rephrase using a heading keyword, I can usually find the right section.",
        },
      ]);
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
              {msg.role === "mentor" ? <div className="mt-2 text-xs font-semibold text-slate-700">Answer from this site</div> : null}
              <div className="mt-1 whitespace-pre-wrap text-slate-900">{msg.content}</div>
              {msg.lowConfidence ? <p className="mt-2 text-xs text-amber-800">I might be wrong here. Please check the citations.</p> : null}
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

        <div className="mt-4">
          <ComputeMeter
            estimate={estimate}
            actual={actual}
            tier={typeof estimateFreeRemainingMs === "number" ? { freeMsRemainingToday: estimateFreeRemainingMs } : null}
            remainingCredits={remainingCredits}
            runStatus={actual ? "success" : status === "loading" ? "success" : estimate && !estimate.allowed ? "blocked" : "success"}
            costHints={costHints}
            compact
          />
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-800" htmlFor="mentor-question">
                Ask about this page
          </label>
              <p className="text-xs text-slate-600 m-0">
                I answer from the site when possible. If the page is thin, I will provide brief general guidance and link to nearby sections.
              </p>
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


