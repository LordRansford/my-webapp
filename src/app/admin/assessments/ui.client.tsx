"use client";

import React, { useEffect, useMemo, useState } from "react";

type LevelId = "foundations" | "applied" | "practice";
type CourseId = "cybersecurity" | "network-models";

type QuestionRow = {
  id: string;
  type: string;
  bloomLevel: number;
  question: string;
  options: string[] | null;
  correctAnswer: any;
  explanation: string;
  optionRationales: string[] | null;
  tags: string;
  published: boolean;
};

type AssessmentData = {
  assessmentId: string;
  courseId: string;
  levelId: LevelId;
  passThreshold: number;
  timeLimitMinutes: number;
  version: string;
  questions: QuestionRow[];
};

type AnalysisData = {
  attempts: { total: number; passed: number; passRatePercent: number; avgScore: number };
  perQuestion: Array<{ questionId: string; attempts: number; correct: number; correctRatePercent: number }>;
};

type QualityData = {
  totals: Record<string, number>;
  samples: Record<string, string[]>;
  issues?: Record<string, string[]>;
};

function tagSet(tags: string) {
  return new Set(
    String(tags || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
}

function setPublishedTag(tags: string, published: boolean) {
  const set = tagSet(tags);
  if (published) set.add("published");
  else set.delete("published");
  return Array.from(set).join(", ");
}

function getDomainFromTags(tags: string) {
  const set = tagSet(tags);
  for (const t of set) {
    if (t.startsWith("domain:")) return t.slice("domain:".length);
  }
  return "";
}

function setDomainTag(tags: string, domain: string) {
  const set = tagSet(tags);
  for (const t of Array.from(set)) {
    if (t.startsWith("domain:")) set.delete(t);
  }
  const d = String(domain || "").trim();
  if (d) set.add(`domain:${d}`);
  return Array.from(set).join(", ");
}

export default function AdminAssessmentsClient(props: { canManage: boolean }) {
  const [courseId, setCourseId] = useState<CourseId>("cybersecurity");
  const [levelId, setLevelId] = useState<LevelId>("foundations");
  const [version, setVersion] = useState("2025.01");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");
  const [reason, setReason] = useState("");
  const [data, setData] = useState<AssessmentData | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [quality, setQuality] = useState<QualityData | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [issueFilter, setIssueFilter] = useState<string>("");

  const selected = useMemo(() => ({ courseId, levelId, version }), [courseId, levelId, version]);

  const refresh = async () => {
    setBusy(true);
    setError("");
    try {
      const url = `/api/admin/assessments/questions?courseId=${encodeURIComponent(selected.courseId)}&levelId=${encodeURIComponent(selected.levelId)}&version=${encodeURIComponent(selected.version)}`;
      const res = await fetch(url);
      const json = (await res.json().catch(() => null)) as any;
      if (!res.ok) {
        setError(json?.error || "Unable to load assessment.");
        return;
      }
      setData(json as AssessmentData);

      const aurl = `/api/admin/assessments/analysis?courseId=${encodeURIComponent(selected.courseId)}&levelId=${encodeURIComponent(selected.levelId)}&version=${encodeURIComponent(selected.version)}`;
      const ares = await fetch(aurl);
      const ajson = (await ares.json().catch(() => null)) as any;
      if (ares.ok) setAnalysis(ajson as AnalysisData);
      else setAnalysis(null);

      const qurl = `/api/admin/assessments/quality?courseId=${encodeURIComponent(selected.courseId)}&levelId=${encodeURIComponent(selected.levelId)}&version=${encodeURIComponent(selected.version)}`;
      const qres = await fetch(qurl);
      const qjson = (await qres.json().catch(() => null)) as any;
      if (qres.ok) setQuality(qjson as QualityData);
      else setQuality(null);
    } catch {
      setError("Unable to load assessment.");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected.courseId, selected.levelId, selected.version]);

  const stats = useMemo(() => {
    const list = data?.questions || [];
    const published = list.filter((q) => q.published).length;
    return { total: list.length, published, draft: list.length - published };
  }, [data?.questions]);

  const issueIds = useMemo(() => {
    if (!issueFilter) return null;
    const ids = quality?.issues?.[issueFilter] || quality?.samples?.[issueFilter] || [];
    return new Set(ids);
  }, [issueFilter, quality?.issues, quality?.samples]);

  const visibleQuestions = useMemo(() => {
    const list = data?.questions || [];
    if (!issueIds) return list;
    return list.filter((q) => issueIds.has(q.id));
  }, [data?.questions, issueIds]);

  const allowedDomains = useMemo(() => {
    if (selected.courseId === "network-models") {
      if (levelId === "foundations") return ["models", "encapsulation", "layers", "addressing", "dns", "subnetting"];
      if (levelId === "applied") return ["tcp", "udp", "dns", "routing", "nat", "tls"];
      return ["security", "observability", "captures", "segmentation", "operations", "troubleshooting"];
    }
    if (levelId === "foundations") return ["basics", "identity", "network", "crypto", "risk", "response"];
    if (levelId === "applied") return ["web", "api", "auth", "secrets", "cloud", "logging"];
    return ["sdlc", "zero-trust", "runtime", "vulnerability", "detection", "governance"];
  }, [levelId, selected.courseId]);

  const togglePublish = async (q: QuestionRow) => {
    if (!props.canManage) return;
    const r = reason.trim();
    if (!r) {
      setError("Reason required.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/assessments/questions/${encodeURIComponent(q.id)}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          reason: r,
          version: selected.version,
          published: !q.published,
          patch: { tags: setPublishedTag(q.tags, !q.published) },
        }),
      });
      const json = (await res.json().catch(() => null)) as any;
      if (!res.ok) {
        setError(json?.error || "Unable to update question.");
        return;
      }
      setReason("");
      await refresh();
    } catch {
      setError("Unable to update question.");
    } finally {
      setBusy(false);
    }
  };

  const updateQuestion = async (q: QuestionRow) => {
    if (!props.canManage) return;
    const r = reason.trim();
    if (!r) {
      setError("Reason required.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/assessments/questions/${encodeURIComponent(q.id)}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          reason: r,
          version: selected.version,
          patch: {
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            optionRationales: q.optionRationales,
            tags: q.tags,
            bloomLevel: q.bloomLevel,
          },
        }),
      });
      const json = (await res.json().catch(() => null)) as any;
      if (!res.ok) {
        setError(json?.error || "Unable to update question.");
        return;
      }
      setEditingId(null);
      setReason("");
      await refresh();
    } catch {
      setError("Unable to update question.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600" htmlFor="course">
              Course
            </label>
            <select
              id="course"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value as CourseId)}
            >
              <option value="cybersecurity">Cybersecurity</option>
              <option value="network-models">Network models</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600" htmlFor="level">
              Level
            </label>
            <select
              id="level"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
              value={levelId}
              onChange={(e) => setLevelId(e.target.value as LevelId)}
            >
              <option value="foundations">Foundations</option>
              <option value="applied">Applied</option>
              <option value="practice">Practice</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600" htmlFor="version">
              Course version
            </label>
            <input
              id="version"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
              placeholder="Example 2025.01"
            />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold text-slate-600">Questions</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{stats.total}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold text-slate-600">Published</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{stats.published}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold text-slate-600">Draft</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{stats.draft}</div>
          </div>
        </div>

        <div className="grid gap-2 md:grid-cols-[1fr_auto]">
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for change"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          />
          <button
            type="button"
            disabled={busy}
            onClick={refresh}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
          >
            {busy ? "Loading" : "Refresh"}
          </button>
        </div>

        {analysis ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Attempt analytics</div>
            <div className="mt-2 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-xs font-semibold text-slate-600">Attempts</div>
                <div className="text-sm font-semibold text-slate-900">{analysis.attempts.total}</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-xs font-semibold text-slate-600">Pass rate</div>
                <div className="text-sm font-semibold text-slate-900">{analysis.attempts.passRatePercent} percent</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-xs font-semibold text-slate-600">Average score</div>
                <div className="text-sm font-semibold text-slate-900">{analysis.attempts.avgScore} percent</div>
              </div>
            </div>
          </div>
        ) : null}

        {error ? <div className="text-sm font-semibold text-rose-700">{error}</div> : null}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Questions</h2>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span>Tag `published` is required for exam selection</span>
            <a
              className="font-semibold text-emerald-700 hover:underline"
              href={`/api/admin/assessments/answer-key?courseId=${encodeURIComponent(selected.courseId)}&levelId=${encodeURIComponent(selected.levelId)}&version=${encodeURIComponent(selected.version)}`}
            >
              Download answer key
            </a>
          </div>
        </div>

        {quality ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Quality checks</div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(quality.totals || {}).map(([k, v]) => (
                <div key={k} className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <div className="text-xs font-semibold text-slate-700">{k}</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">{v}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className={[
                  "rounded-full border px-3 py-1 text-xs font-semibold shadow-sm",
                  !issueFilter ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
                ].join(" ")}
                onClick={() => setIssueFilter("")}
              >
                Show all
              </button>
              {Object.entries(quality.totals || {})
                .filter(([, v]) => Number(v) > 0)
                .slice(0, 10)
                .map(([k]) => (
                  <button
                    key={k}
                    type="button"
                    className={[
                      "rounded-full border px-3 py-1 text-xs font-semibold shadow-sm",
                      issueFilter === k ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
                    ].join(" ")}
                    onClick={() => setIssueFilter(k)}
                    title="Filter questions by this issue"
                  >
                    {k}
                  </button>
                ))}
            </div>
            <div className="text-xs text-slate-600">
              Prioritise missing rationales first so the exported answer key is worth paying for.
            </div>
          </div>
        ) : null}

        <div className="space-y-3">
          {visibleQuestions.map((q) => {
            const editing = editingId === q.id;
            const domain = getDomainFromTags(q.tags);
            return (
              <div key={q.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-slate-600">{q.id}</div>
                    <div className="text-sm font-semibold text-slate-900">{q.type} Bloom {q.bloomLevel}</div>
                    <div className="text-xs text-slate-600">{q.published ? "Published" : "Draft"}</div>
                    {domain ? <div className="text-xs font-semibold text-slate-700">Domain {domain}</div> : <div className="text-xs font-semibold text-rose-700">Domain missing</div>}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {props.canManage ? (
                      <>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => setEditingId(editing ? null : q.id)}
                          className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
                        >
                          {editing ? "Close" : "Edit"}
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => togglePublish(q)}
                          className="rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                        >
                          {q.published ? "Unpublish" : "Publish"}
                        </button>
                      </>
                    ) : (
                      <div className="text-xs text-slate-600">Read only</div>
                    )}
                  </div>
                </div>

                {editing ? (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-slate-700">Question</div>
                      <textarea
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                        rows={3}
                        value={q.question}
                        onChange={(e) => {
                          const v = e.target.value;
                          setData((prev) => {
                            if (!prev) return prev;
                            return { ...prev, questions: prev.questions.map((x) => (x.id === q.id ? { ...x, question: v } : x)) };
                          });
                        }}
                      />
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-slate-700">Options</div>
                        <textarea
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                          rows={4}
                          value={(q.options || []).join("\n")}
                          onChange={(e) => {
                            const opts = e.target.value.split("\n").map((s) => s.trim()).filter(Boolean);
                            setData((prev) => {
                              if (!prev) return prev;
                              return { ...prev, questions: prev.questions.map((x) => (x.id === q.id ? { ...x, options: opts } : x)) };
                            });
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-slate-700">Correct answer index</div>
                        <input
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                          value={typeof q.correctAnswer === "number" ? String(q.correctAnswer) : ""}
                          onChange={(e) => {
                            const n = Number(e.target.value);
                            setData((prev) => {
                              if (!prev) return prev;
                              return { ...prev, questions: prev.questions.map((x) => (x.id === q.id ? { ...x, correctAnswer: Number.isFinite(n) ? n : 0 } : x)) };
                            });
                          }}
                        />
                        <div className="text-xs text-slate-600">This editor supports MCQ index answers for now</div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-slate-700">Explanation</div>
                      <textarea
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                        rows={3}
                        value={q.explanation}
                        onChange={(e) => {
                          const v = e.target.value;
                          setData((prev) => {
                            if (!prev) return prev;
                            return { ...prev, questions: prev.questions.map((x) => (x.id === q.id ? { ...x, explanation: v } : x)) };
                          });
                        }}
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-slate-700">Option rationales</div>
                      <textarea
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                        rows={4}
                        value={(q.optionRationales || []).join("\n")}
                        onChange={(e) => {
                          const lines = e.target.value.split("\n").map((s) => s.trimEnd());
                          setData((prev) => {
                            if (!prev) return prev;
                            return { ...prev, questions: prev.questions.map((x) => (x.id === q.id ? { ...x, optionRationales: lines } : x)) };
                          });
                        }}
                        placeholder="One line per option. Include why each option is correct or wrong."
                      />
                      <div className="text-xs text-slate-600">Keep the number of lines aligned with options</div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-slate-700">Bloom level</div>
                        <input
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                          value={String(q.bloomLevel)}
                          onChange={(e) => {
                            const n = Math.max(1, Math.min(6, Number(e.target.value) || 1));
                            setData((prev) => {
                              if (!prev) return prev;
                              return { ...prev, questions: prev.questions.map((x) => (x.id === q.id ? { ...x, bloomLevel: n } : x)) };
                            });
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-slate-700">Tags</div>
                        <input
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                          value={q.tags}
                          onChange={(e) => {
                            const v = e.target.value;
                            setData((prev) => {
                              if (!prev) return prev;
                              return { ...prev, questions: prev.questions.map((x) => (x.id === q.id ? { ...x, tags: v } : x)) };
                            });
                          }}
                        />
                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                          <div className="space-y-1">
                            <div className="text-xs font-semibold text-slate-700">Domain tag</div>
                            <select
                              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                              value={getDomainFromTags(q.tags) || ""}
                              onChange={(e) => {
                                const v = e.target.value;
                                setData((prev) => {
                                  if (!prev) return prev;
                                  return { ...prev, questions: prev.questions.map((x) => (x.id === q.id ? { ...x, tags: setDomainTag(x.tags, v) } : x)) };
                                });
                              }}
                            >
                              <option value="">Choose domain</option>
                              {allowedDomains.map((d) => (
                                <option key={d} value={d}>
                                  {d}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs font-semibold text-slate-700">Tip</div>
                            <div className="text-xs text-slate-600">
                              Use exactly one domain tag. Keep it consistent with the blueprint so the learning report links correctly.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => updateQuestion(q)}
                        className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setEditingId(null)}
                        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-slate-900">{q.question}</div>
                    <ol className="ml-5 list-decimal space-y-1 text-sm text-slate-700">
                      {(q.options || []).map((o, i) => (
                        <li key={i}>{o}</li>
                      ))}
                    </ol>
                    <div className="text-xs text-slate-600">Tags {q.tags}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

