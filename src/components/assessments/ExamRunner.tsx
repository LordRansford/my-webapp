"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Question = {
  id: string;
  type: string;
  question: string;
  options: string[] | null;
};

type StartResponse = {
  sessionId: string;
  startedAt: string;
  expiresAt: string;
  timeLimitMinutes: number;
  passThreshold: number;
  requiredCredits: number;
  questions: Question[];
};

type SubmitResponse = {
  ok: boolean;
  attempt: { id: string; score: number; passed: boolean; completedAt: string; timeSpentSeconds: number };
  assessment: { courseId: string; levelId: string; passThreshold: number; timeLimitMinutes: number };
  certificateCourseId: string | null;
  review: Array<{
    id: string;
    question: string;
    options: string[] | null;
    userAnswer: any;
    correctAnswer: any;
    correct: boolean;
    explanation: string;
    tags: string;
    type: string;
  }>;
};

function secondsLeft(expiresAtIso: string) {
  const end = new Date(expiresAtIso).getTime();
  return Math.max(0, Math.floor((end - Date.now()) / 1000));
}

function formatTimer(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  const mm = String(m).padStart(2, "0");
  const rr = String(r).padStart(2, "0");
  return `${mm} ${rr}`;
}

function storageKey(sessionId: string) {
  return `assessment-answers-${sessionId}`;
}

export default function ExamRunner(props: {
  courseId: "cybersecurity";
  levelId: "foundations" | "applied" | "practice";
  title: string;
}) {
  const [certificateName, setCertificateName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");
  const [data, setData] = useState<StartResponse | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState<SubmitResponse | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [attempts, setAttempts] = useState<Array<{ id: string; score: number; passed: boolean; completedAt: string }> | null>(null);
  const timerRef = useRef<number | null>(null);

  const current = data?.questions?.[activeIndex] || null;
  const total = data?.questions?.length || 0;
  const answeredCount = useMemo(() => {
    if (!data?.questions?.length) return 0;
    let n = 0;
    for (const q of data.questions) {
      if (answers[q.id] !== undefined && answers[q.id] !== null) n += 1;
    }
    return n;
  }, [answers, data?.questions]);

  useEffect(() => {
    if (!data?.expiresAt) return;
    setTimerSeconds(secondsLeft(data.expiresAt));
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setTimerSeconds(secondsLeft(data.expiresAt));
    }, 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [data?.expiresAt]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`/api/assessments/status?courseId=${encodeURIComponent(props.courseId)}&levelId=${encodeURIComponent(props.levelId)}`);
        const json = (await res.json().catch(() => null)) as any;
        if (!alive) return;
        if (!res.ok) return;
        const list = Array.isArray(json?.attempts) ? json.attempts : [];
        setAttempts(
          list.map((a: any) => ({
            id: String(a.id || ""),
            score: Number(a.score || 0),
            passed: Boolean(a.passed),
            completedAt: String(a.completedAt || ""),
          })),
        );
      } catch {
        // ignore
      }
    })();
    return () => {
      alive = false;
    };
  }, [props.courseId, props.levelId, submitted?.attempt?.id]);

  useEffect(() => {
    if (!data?.sessionId) return;
    try {
      const raw = window.localStorage.getItem(storageKey(data.sessionId));
      if (raw) setAnswers(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, [data?.sessionId]);

  useEffect(() => {
    if (!data?.sessionId) return;
    try {
      window.localStorage.setItem(storageKey(data.sessionId), JSON.stringify(answers));
    } catch {
      // ignore
    }
  }, [answers, data?.sessionId]);

  const setSingleChoice = (questionId: string, choiceIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: choiceIndex }));
  };

  const startOrResume = async () => {
    setBusy(true);
    setError("");
    setSubmitted(null);
    try {
      const res = await fetch("/api/assessments/start", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          courseId: props.courseId,
          levelId: props.levelId,
          certificateName: certificateName.trim(),
        }),
      });
      const json = (await res.json().catch(() => null)) as any;
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/signin";
          return;
        }
        if (res.status === 402) {
          setError("Credits required. Please purchase credits in your account.");
          return;
        }
        setError(json?.message || "Unable to start assessment.");
        return;
      }
      setData(json as StartResponse);
      setActiveIndex(0);
    } catch {
      setError("Unable to start assessment.");
    } finally {
      setBusy(false);
    }
  };

  const submit = async () => {
    if (!data?.sessionId) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/assessments/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId: data.sessionId, answers }),
      });
      const json = (await res.json().catch(() => null)) as any;
      if (!res.ok) {
        if (res.status === 409) {
          setError("Session expired. Start again.");
          setData(null);
          return;
        }
        if (res.status === 402) {
          setError("Credits required. Please purchase credits in your account.");
          return;
        }
        setError(json?.message || "Unable to submit assessment.");
        return;
      }
      setSubmitted(json as SubmitResponse);
      setData(null);
      if (data?.sessionId) window.localStorage.removeItem(storageKey(data.sessionId));
    } catch {
      setError("Unable to submit assessment.");
    } finally {
      setBusy(false);
    }
  };

  const issueCertificate = async () => {
    const courseId = submitted?.certificateCourseId;
    if (!courseId) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/certificates/issue", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const json = (await res.json().catch(() => null)) as any;
      if (!res.ok) {
        setError(json?.message || "Unable to issue certificate.");
        return;
      }
      if (json?.certificateId) {
        window.location.href = `/api/certificates/download?certificateId=${encodeURIComponent(json.certificateId)}`;
      }
    } catch {
      setError("Unable to issue certificate.");
    } finally {
      setBusy(false);
    }
  };

  if (submitted) {
    const passed = Boolean(submitted.attempt.passed);
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Result</div>
          <div className="mt-2 text-lg font-semibold text-slate-900">
            {passed ? "Pass" : "Not passed"}
          </div>
          <div className="mt-1 text-sm text-slate-700">
            Score {submitted.attempt.score} percent. Threshold {submitted.assessment.passThreshold} percent.
          </div>
          {passed ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={issueCertificate}
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
              >
                {busy ? "Working" : "Download certificate"}
              </button>
              <a
                href="/account/certificates"
                className="text-sm font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-slate-900"
              >
                View certificates
              </a>
            </div>
          ) : (
            <div className="mt-3">
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  setSubmitted(null);
                  setError("");
                }}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 disabled:opacity-60"
              >
                {busy ? "Working" : "Try again"}
              </button>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Review</div>
          <div className="mt-3 space-y-4">
            {submitted.review.slice(0, 12).map((r, idx) => (
              <div key={r.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs font-semibold text-slate-600">
                  Question {idx + 1}. {r.correct ? "Correct" : "Incorrect"}
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-900">{r.question}</div>
                <div className="mt-2 text-sm text-slate-700">{r.explanation}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-slate-600">
            Review is shortened here so the page stays fast.
          </div>
        </div>

        {error ? <div className="text-sm font-semibold text-rose-700">{error}</div> : null}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">{props.title}</div>
          <p className="mt-2 text-sm text-slate-700">
            This assessment is timed. It uses 50 questions. Pass mark is 80 percent.
          </p>
          <p className="mt-2 text-sm text-slate-700">
            Enter your full name. This name is locked for your certificates.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
            <input
              value={certificateName}
              onChange={(e) => setCertificateName(e.target.value)}
              placeholder="Full name"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
            />
            <button
              type="button"
              disabled={busy}
              onClick={startOrResume}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
            >
              {busy ? "Starting" : "Start assessment"}
            </button>
          </div>
          <div className="mt-3 text-xs text-slate-600">
            You can retake as many times as you like. Attempts are tracked.
          </div>
        </div>

        {attempts && attempts.length ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Recent attempts</div>
            <div className="mt-2 space-y-2">
              {attempts.slice(0, 5).map((a) => (
                <div key={a.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="text-sm font-semibold text-slate-900">{a.passed ? "Pass" : "Not passed"}</div>
                  <div className="text-sm text-slate-700">Score {a.score} percent</div>
                  <div className="text-xs text-slate-600">{a.completedAt ? new Date(a.completedAt).toLocaleString() : ""}</div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-800">
            {error}{" "}
            <a className="underline decoration-rose-300 underline-offset-4" href="/account/credits">
              Go to credits
            </a>
          </div>
        ) : null}
      </div>
    );
  }

  const expired = timerSeconds <= 0;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Progress</div>
            <div className="mt-1 text-sm text-slate-800">
              Answered {answeredCount} of {total}. Time left {formatTimer(timerSeconds)}.
            </div>
          </div>
          <button
            type="button"
            disabled={busy || expired}
            onClick={submit}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
          >
            {busy ? "Submitting" : expired ? "Time ended" : "Submit"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
          Question {activeIndex + 1} of {total}
        </div>
        <div className="mt-2 text-base font-semibold text-slate-900">{current?.question}</div>

        <div className="mt-3 grid gap-2">
          {(current?.options || []).map((opt, idx) => {
            const selected = answers[current?.id || ""] === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => current?.id && setSingleChoice(current.id, idx)}
                className={[
                  "w-full rounded-xl border px-3 py-2 text-left text-sm shadow-sm transition",
                  selected
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
                ].join(" ")}
              >
                {opt}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            disabled={activeIndex <= 0}
            onClick={() => setActiveIndex((n) => Math.max(0, n - 1))}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 disabled:opacity-60"
          >
            Back
          </button>
          <button
            type="button"
            disabled={activeIndex >= total - 1}
            onClick={() => setActiveIndex((n) => Math.min(total - 1, n + 1))}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 disabled:opacity-60"
          >
            Next
          </button>
        </div>
      </div>

      {error ? <div className="text-sm font-semibold text-rose-700">{error}</div> : null}
    </div>
  );
}

