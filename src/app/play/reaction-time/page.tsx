"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import NotesLayout from "@/components/notes/Layout";
import GameShell from "@/components/play/GameShell";
import GameFooter from "@/components/play/GameFooter";

type Phase = "idle" | "waiting" | "ready" | "too_soon" | "done";

const LS_KEY = "rn_play_reaction_time_best_v1";

function safeReadJson<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function safeWriteJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export default function ReactionTimePage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [reactionMs, setReactionMs] = useState<number | null>(null);
  const [best, setBest] = useState<any>(null);
  const startAtRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setBest(safeReadJson(LS_KEY));
  }, []);

  const clearTimer = () => {
    if (timerRef.current != null) window.clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const reset = () => {
    clearTimer();
    startAtRef.current = null;
    setReactionMs(null);
    setPhase("idle");
  };

  const start = () => {
    reset();
    setPhase("waiting");
    const delay = 900 + Math.floor(Math.random() * 1600); // 0.9s to 2.5s
    timerRef.current = window.setTimeout(() => {
      startAtRef.current = Date.now();
      setPhase("ready");
    }, delay);
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  const onClickTarget = () => {
    if (phase === "waiting") {
      setPhase("too_soon");
      clearTimer();
      return;
    }
    if (phase !== "ready") return;
    const startedAt = startAtRef.current;
    if (!startedAt) return;
    const rt = Date.now() - startedAt;
    setReactionMs(rt);
    setPhase("done");

    const entry = { bestMs: rt, at: new Date().toLocaleString() };
    const current = safeReadJson<any>(LS_KEY);
    if (!current || typeof current.bestMs !== "number" || rt < current.bestMs) {
      safeWriteJson(LS_KEY, entry);
      setBest(entry);
    }
  };

  const message = useMemo(() => {
    if (phase === "idle") return "Press Start, then click when the box turns green.";
    if (phase === "waiting") return "Wait for green.";
    if (phase === "ready") return "Click now.";
    if (phase === "too_soon") return "Too soon. Press Start to try again.";
    if (reactionMs != null) return `Reaction time: ${reactionMs} ms.`;
    return "Done.";
  }, [phase, reactionMs]);

  const bg =
    phase === "ready"
      ? "bg-emerald-500"
      : phase === "too_soon"
        ? "bg-rose-500"
        : "bg-slate-200";

  return (
    <NotesLayout
      meta={{
        title: "Reaction time test",
        description: "Click when the colour changes to measure attention and alertness.",
        level: "Summary",
        slug: "/play/reaction-time",
        section: "ai",
      }}
      activeLevelId="summary"
    >
      <GameShell
        title="Reaction time test"
        description="A simple reaction test. Wait for the colour change, then click as quickly as you can."
        howToPlay={{
          objective: "Click when the box turns green.",
          how: ["Press Start.", "Wait for green.", "Click as quickly as you can.", "Replay to try to beat your best time."],
          improves: ["Attention", "Alertness", "Fast decision and response under a simple cue"],
        }}
        onStart={start}
        onReset={reset}
        startLabel="Start"
        resetLabel="Reset"
        score={{
          scoreLabel: "Best time (ms)",
          score: best?.bestMs ?? null,
          timeMs: reactionMs,
          accuracy: null,
          personalBest: best ? { score: best.bestMs, at: best.at } : null,
        }}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-800">{message}</p>
          <button
            type="button"
            onClick={onClickTarget}
            className={`w-full rounded-2xl ${bg} px-4 py-10 text-center text-lg font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2`}
            aria-label="Reaction target"
          >
            {phase === "ready" ? "Click" : "Wait"}
          </button>
          <p className="text-xs text-slate-600">This game stores your best time locally in your browser.</p>
        </div>
      </GameShell>
      <GameFooter onReplay={start} />
    </NotesLayout>
  );
}


