"use client";

import { useEffect, useMemo, useState } from "react";

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function readEvents(keys) {
  const out = [];
  for (const k of keys) {
    const raw = typeof window !== "undefined" ? localStorage.getItem(k) : null;
    const parsed = raw ? safeParse(raw) : null;
    if (parsed && Array.isArray(parsed.events)) out.push(...parsed.events.map((e) => ({ ...e, __key: k })));
  }
  return out;
}

function dedupeByLatest(events) {
  const byId = new Map();
  for (const e of events) {
    const id = e.id || `${e.type}:${e.__key}:${e.at || ""}`;
    const prev = byId.get(id);
    if (!prev || (e.at || 0) > (prev.at || 0)) byId.set(id, e);
  }
  return [...byId.values()].sort((a, b) => (b.at || 0) - (a.at || 0));
}

function buildInsights(events) {
  const insights = [];

  const has = (predicate) => events.some(predicate);
  const count = (predicate) => events.filter(predicate).length;

  const accuracyTrapOverOptim = count((e) => e.type === "accuracy_trap_choice" && e.choice === "max_accuracy") >= 1;
  const accuracyTrapCostAware = count((e) => e.type === "accuracy_trap_choice" && e.choice === "min_cost") >= 1;

  const leakageMissed = count((e) => e.type === "leakage_round" && e.result === "missed_leak") >= 1;
  const leakageStrong = count((e) => e.type === "leakage_round" && e.result === "caught_leak") >= 2;

  const attentionSurprised = has((e) => e.type === "attention_miss" && e.severity === "high");
  const agentRunaway = has((e) => e.type === "agent_run" && e.outcome === "runaway");

  const trustedHallucination = has((e) => e.type === "hallucination_decision" && e.decision === "trust" && e.correct === false);
  const cautiousHallucination = has((e) => e.type === "hallucination_decision" && e.decision === "verify");

  const autoDefenceOverreach = has((e) => e.type === "autodefence_policy" && e.policy === "aggressive" && e.damage === "high");

  if (accuracyTrapOverOptim) {
    insights.push({
      title: "You are drawn to headline metrics",
      body: "You chose an option that improved accuracy while worsening outcomes. Tie evaluation to cost, harm, and operational capacity.",
      type: "learning",
    });
  }
  if (accuracyTrapCostAware) {
    insights.push({
      title: "You think in consequences",
      body: "You optimised for outcome rather than the prettiest score. That habit prevents quiet failures.",
      type: "positive",
    });
  }
  if (leakageMissed) {
    insights.push({
      title: "Leakage still looks reasonable",
      body: "You missed at least one leaked feature. Leakage often hides inside process artefacts that feel useful. Ask what exists at prediction time.",
      type: "learning",
    });
  }
  if (leakageStrong) {
    insights.push({
      title: "Strong experimental instincts",
      body: "You repeatedly spotted leaked signals. You are thinking about causality and process, not just correlation.",
      type: "positive",
    });
  }
  if (attentionSurprised) {
    insights.push({
      title: "Context limits felt real",
      body: "You saw a high impact miss caused by context limits. This is why fluency is not reliability and why grounding and verification exist.",
      type: "learning",
    });
  }
  if (agentRunaway) {
    insights.push({
      title: "You saw compounding failure",
      body: "Repeated actions amplify small mistakes. Good agents require stop conditions, monitoring, and clear escalation paths.",
      type: "learning",
    });
  }
  if (trustedHallucination) {
    insights.push({
      title: "Fluency pulled you in",
      body: "You trusted a confident answer that was wrong. Verification habits prevent confident mistakes becoming incidents.",
      type: "learning",
    });
  }
  if (cautiousHallucination) {
    insights.push({
      title: "You verify before you trust",
      body: "You chose to verify rather than trust. That single habit changes outcomes more than most model upgrades.",
      type: "positive",
    });
  }
  if (autoDefenceOverreach) {
    insights.push({
      title: "Overreach is a hidden risk",
      body: "Aggressive automation caused damage. Overreaction is also a failure mode in autonomous defence.",
      type: "learning",
    });
  }

  if (insights.length === 0) {
    insights.push({
      title: "No insights yet",
      body: "Play at least one game above. Insights are generated only from your actions and stored only on your device.",
      type: "neutral",
    });
  }

  return insights;
}

export default function ProgressInsights({ namespace, sources }) {
  const [events, setEvents] = useState([]);
  const storageKeys = useMemo(() => sources, [sources]);

  useEffect(() => {
    const all = readEvents(storageKeys);
    setEvents(dedupeByLatest(all));

    const onStorage = () => {
      const next = readEvents(storageKeys);
      setEvents(dedupeByLatest(next));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [storageKeys]);

  const insights = useMemo(() => buildInsights(events), [events]);

  const clear = () => {
    for (const k of storageKeys) localStorage.removeItem(k);
    localStorage.removeItem(`${namespace}_dismissed`);
    setEvents([]);
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case "positive":
        return {
          borderColor: "rgba(52, 199, 89, 0.3)",
          background: "linear-gradient(135deg, rgba(52, 199, 89, 0.08) 0%, rgba(52, 199, 89, 0.03) 100%)",
          icon: "✓",
        };
      case "learning":
        return {
          borderColor: "rgba(255, 149, 0, 0.3)",
          background: "linear-gradient(135deg, rgba(255, 149, 0, 0.08) 0%, rgba(255, 149, 0, 0.03) 100%)",
          icon: "💡",
        };
      default:
        return {
          borderColor: "rgba(142, 142, 147, 0.3)",
          background: "linear-gradient(135deg, rgba(142, 142, 147, 0.08) 0%, rgba(142, 142, 147, 0.03) 100%)",
          icon: "ℹ",
        };
    }
  };

  return (
    <section className="rn-section">
      <div className="rn-head">
        <h2 className="rn-h2">Progress insights</h2>
        <p className="rn-body" style={{ marginTop: "0.5rem", fontSize: "0.95rem", color: "var(--muted)" }}>
          These insights are private to this device. No account. No tracking.
        </p>
      </div>

      {insights.length > 0 && (
        <div className="rn-grid rn-grid-2" style={{ marginTop: "2rem", gap: "1.25rem" }}>
          {insights.map((x, idx) => {
            const typeStyles = getTypeStyles(x.type);
            return (
              <div
                key={idx}
                className="rn-card"
                style={{
                  border: `2px solid ${typeStyles.borderColor}`,
                  background: typeStyles.background,
                  borderRadius: "16px",
                  padding: "1.5rem",
                  position: "relative",
                  overflow: "hidden",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.05)";
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: `linear-gradient(90deg, ${typeStyles.borderColor.replace("0.3", "1")} 0%, transparent 100%)`,
                  }}
                />
                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                  <div
                    style={{
                      fontSize: "1.5rem",
                      lineHeight: 1,
                      flexShrink: 0,
                      marginTop: "0.2rem",
                    }}
                  >
                    {typeStyles.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      className="rn-card-title"
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        marginBottom: "0.75rem",
                        color: "var(--text)",
                        lineHeight: 1.3,
                      }}
                    >
                      {x.title}
                    </div>
                    <div
                      className="rn-card-body"
                      style={{
                        fontSize: "0.95rem",
                        lineHeight: 1.6,
                        color: "var(--text)",
                        opacity: 0.85,
                      }}
                    >
                      {x.body}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="rn-actions" style={{ marginTop: "2.5rem", display: "flex", justifyContent: "center" }}>
        <button
          className="rn-btn"
          onClick={clear}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "0.95rem",
            fontWeight: 500,
            border: "1px solid var(--line)",
            background: "var(--surface)",
            color: "var(--text)",
            borderRadius: "12px",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--surface-2)";
            e.currentTarget.style.borderColor = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--surface)";
            e.currentTarget.style.borderColor = "var(--line)";
          }}
        >
          Clear local progress
        </button>
      </div>
    </section>
  );
}
