"use client";

import { useMemo, useState } from "react";
import ToolCard from "@/components/notes/ToolCard";
import SwitchRow from "@/components/ui/SwitchRow";

function Panel({ title, eyebrow = "Tool", children }) {
  return (
    <div className="panel stack">
      <div className="panel__header">
        <p className="eyebrow">{eyebrow}</p>
        {title && <h3 style={{ margin: 0 }}>{title}</h3>}
      </div>
      {children}
    </div>
  );
}

export function PhishingSpotterTool() {
  const samples = [
    { id: "1", text: "Action required: verify your account within 30 minutes", suspicious: true },
    { id: "2", text: "We noticed a new sign-in from London. If this was you, ignore.", suspicious: false },
    { id: "3", text: "Invoice attached, enable macros to view", suspicious: true },
  ];
  const [choice, setChoice] = useState(null);
  const selected = samples.find((s) => s.id === choice);
  return (
    <ToolCard
      title="Phishing spotter"
      intent="Practise spotting urgency and unusual requests."
      predictPrompt="Which message is most likely risky?"
      reflection="List the cues you used and how you would verify safely."
    >
      <p className="muted">Tap the message that feels most risky.</p>
      <div className="quiz-options">
        {samples.map((s) => (
          <label key={s.id} className={`quiz-option ${choice === s.id ? "is-selected" : ""}`}>
            <input type="radio" name="phish" value={s.id} checked={choice === s.id} onChange={() => setChoice(s.id)} />
            <span>{s.text}</span>
          </label>
        ))}
      </div>
      {selected && (
        <p className={`quiz-feedback ${selected.suspicious ? "warn" : "ok"}`}>
          {selected.suspicious ? "Correct to pause. Urgency and macros are red flags." : "This is a routine alert. Always verify but less urgent."}
        </p>
      )}
    </ToolCard>
  );
}

export function PasswordStrengthLab() {
  const [length, setLength] = useState(12);
  const [charset, setCharset] = useState("lower+upper+digits");

  const charsetSize = useMemo(() => {
    switch (charset) {
      case "lower":
        return 26;
      case "lower+upper":
        return 52;
      case "lower+upper+digits":
        return 62;
      case "all":
        return 94;
      default:
        return 62;
    }
  }, [charset]);

  const entropy = useMemo(() => {
    const bits = length * Math.log2(charsetSize || 1);
    return Math.round(bits * 10) / 10;
  }, [length, charsetSize]);

  return (
    <ToolCard
      title="Password strength lab"
      intent="See how length and character set change guess difficulty."
      predictPrompt="Will adding symbols or adding length increase strength faster?"
      reflection="Write one change you will make to your own passwords and why."
    >
      <div className="control-row">
        <label className="control">
          <span>Length</span>
          <input type="number" min="4" max="64" value={length} onChange={(e) => setLength(Number(e.target.value) || 0)} />
        </label>
        <label className="control">
          <span>Character set</span>
          <select value={charset} onChange={(e) => setCharset(e.target.value)}>
            <option value="lower">Lowercase only</option>
            <option value="lower+upper">Lower + upper</option>
            <option value="lower+upper+digits">Lower + upper + digits</option>
            <option value="all">Letters + digits + symbols</option>
          </select>
        </label>
      </div>
      <div className="status">
        <div className="eyebrow">Estimated entropy</div>
        <p className="mono">{entropy} bits</p>
        <p className="muted">Increase length first. Avoid reuse to keep this maths useful.</p>
      </div>
    </ToolCard>
  );
}

export function RBACSimulator() {
  const roles = ["Intern", "Analyst", "Manager", "Admin"];
  const [selectedRole, setSelectedRole] = useState("Analyst");
  const permissions = {
    Intern: ["Read reports"],
    Analyst: ["Read reports", "Create reports"],
    Manager: ["Read reports", "Create reports", "Approve changes"],
    Admin: ["All actions, including delete"],
  };
  return (
    <ToolCard
      title="RBAC simulator"
      intent="Visualise blast radius by role."
      predictPrompt="Which role should have delete rights?"
      reflection="Note one permission you would remove in your own environment."
    >
      <p className="muted">Pick a role and review the blast radius. Keep high-risk actions narrow.</p>
      <div className="control-row">
        {roles.map((role) => (
          <label key={role} className={`pill ${selectedRole === role ? "pill--accent" : "pill--ghost"}`} style={{ cursor: "pointer" }}>
            <input
              type="radio"
              name="rbac-role"
              value={role}
              checked={selectedRole === role}
              onChange={() => setSelectedRole(role)}
              className="visually-hidden"
            />
            {role}
          </label>
        ))}
      </div>
      <ul>
        {permissions[selectedRole].map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="muted">Least privilege: give the minimum to do the job, nothing more.</p>
    </ToolCard>
  );
}

export function RansomwareResponseSimulator() {
  const steps = [
    { id: "isolate", label: "Isolate affected systems" },
    { id: "preserve", label: "Preserve evidence and logs" },
    { id: "restore", label: "Restore from clean backups" },
    { id: "notify", label: "Notify stakeholders and, if required, regulators" },
  ];
  const [done, setDone] = useState([]);
  const toggle = (id, checked) =>
    setDone((prev) => (checked ? (prev.includes(id) ? prev : [...prev, id]) : prev.filter((x) => x !== id)));
  return (
    <ToolCard
      title="Ransomware response simulator"
      intent="Rehearse first moves under pressure."
      predictPrompt="Which action should happen before restoring?"
      reflection="What would slow you down in a real incident? Write one fix."
    >
      <p className="muted">Tick actions in order. Preparation makes these steps faster.</p>
      <div className="space-y-2">
        {steps.map((step) => (
          <SwitchRow
            key={step.id}
            label={step.label}
            checked={done.includes(step.id)}
            tone="emerald"
            onCheckedChange={(checked) => toggle(step.id, checked)}
          />
        ))}
      </div>
      <p className="muted">Backups, segmentation, and rehearsed playbooks reduce impact.</p>
    </ToolCard>
  );
}

export function LogAnalysisMiniLab() {
  const events = [
    { id: "login", text: "Multiple failed logins from one IP", suspicious: true },
    { id: "api", text: "API 200 responses from known partner", suspicious: false },
    { id: "admin", text: "New admin account created at 02:14", suspicious: true },
  ];
  const [selected, setSelected] = useState([]);
  const toggle = (id, checked) =>
    setSelected((prev) => (checked ? (prev.includes(id) ? prev : [...prev, id]) : prev.filter((x) => x !== id)));
  return (
    <ToolCard
      title="Log analysis mini lab"
      intent="Notice patterns instead of single lines."
      predictPrompt="Which entries deserve fastest review?"
      reflection="How would you automate alerts for the items you picked?"
    >
      <p className="muted">Flag lines that deserve investigation.</p>
      <div className="space-y-2">
        {events.map((e) => (
          <SwitchRow
            key={e.id}
            label={e.text}
            checked={selected.includes(e.id)}
            tone={e.suspicious ? "amber" : "slate"}
            onCheckedChange={(checked) => toggle(e.id, checked)}
          />
        ))}
      </div>
      {selected.length > 0 && (
        <p className="quiz-feedback warn">
          Patterns matter more than single lines. Escalate when you see privilege changes or repeated failures.
        </p>
      )}
    </ToolCard>
  );
}

export function InputValidationSimulator() {
  const [mode, setMode] = useState("allowlist");
  return (
    <ToolCard
      title="Input validation simulator"
      intent="Compare allowlists and blocklists at a trust boundary."
      predictPrompt="Which strategy fails least when attackers change payloads?"
      reflection="Write one field in your system that should use an allowlist."
    >
      <p className="muted">Pick a validation strategy for a contact form. Which reduces risk most?</p>
      <div className="control-row">
        <label className={`pill ${mode === "allowlist" ? "pill--accent" : "pill--ghost"}`} style={{ cursor: "pointer" }}>
          <input className="visually-hidden" type="radio" name="validation" value="allowlist" checked={mode === "allowlist"} onChange={() => setMode("allowlist")} />
          Allow specific patterns
        </label>
        <label className={`pill ${mode === "blocklist" ? "pill--accent" : "pill--ghost"}`} style={{ cursor: "pointer" }}>
          <input className="visually-hidden" type="radio" name="validation" value="blocklist" checked={mode === "blocklist"} onChange={() => setMode("blocklist")} />
          Block some patterns
        </label>
      </div>
      <p className="status">
        {mode === "allowlist"
          ? "Allowlisting with strict parsing and length checks is safer than chasing every bad pattern."
          : "Blocklists miss new payloads. Prefer allowlists for fields like names, emails, or IDs."}
      </p>
    </ToolCard>
  );
}

export function IncidentTimelineTool() {
  const [entries, setEntries] = useState([
    { time: "09:12", event: "Alert triggered on login failures" },
    { time: "09:20", event: "Account locked and user contacted" },
  ]);
  const [time, setTime] = useState("");
  const [event, setEvent] = useState("");

  const addEntry = () => {
    if (!time || !event) return;
    setEntries((prev) => [...prev, { time, event }]);
    setTime("");
    setEvent("");
  };

  return (
    <ToolCard
      title="Incident timeline tool"
      intent="Practice building a clean incident record."
      predictPrompt="Which events should appear first in a timeline?"
      reflection="How would you keep this timeline accurate during a live incident?"
    >
      <p className="muted">Build a clean sequence for evidence and handover.</p>
      <div className="tool-grid">
        <div className="stack">
          <label className="control">
            <span>Time</span>
            <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="10:05" />
          </label>
          <label className="control">
            <span>Event</span>
            <input value={event} onChange={(e) => setEvent(e.target.value)} placeholder="Containment action taken" />
          </label>
          <button type="button" className="button primary" onClick={addEntry}>
            Add entry
          </button>
        </div>
        <div className="stack">
          <p className="eyebrow">Timeline</p>
          <ol className="stack">
            {entries.map((item, idx) => (
              <li key={`${item.time}-${idx}`}>
                <strong>{item.time}</strong> - {item.event}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </ToolCard>
  );
}

export const quizChapter3 = [
  {
    id: "chain",
    prompt: "Why think of attacks as chains?",
    options: [
      { id: "a", text: "Breaking any link can stop harm", correct: true, explanation: "Defence in depth breaks chains early." },
      { id: "b", text: "It makes reports longer", correct: false, explanation: "The value is in layered defence, not length." },
    ],
  },
  {
    id: "password",
    prompt: "What improves password strength fastest?",
    options: [
      { id: "a", text: "Length and uniqueness", correct: true, explanation: "Long, unique passphrases raise entropy and stop reuse attacks." },
      { id: "b", text: "Replacing letters with numbers", correct: false, explanation: "Leetspeak adds little; length matters more." },
    ],
  },
  {
    id: "input",
    prompt: "Why prefer allowlists for input validation?",
    options: [
      { id: "a", text: "They define what good looks like and reduce bypasses", correct: true, explanation: "Allow specific patterns, not endless blocks." },
      { id: "b", text: "They are easier to maintain than blocklists of bad input", correct: false, explanation: "Maintenance is a benefit, but the main gain is reducing bypass." },
    ],
  },
  {
    id: "logs",
    prompt: "What makes logs valuable in incidents?",
    options: [
      { id: "a", text: "They show sequences and changes over time", correct: true, explanation: "Timelines help containment and learning." },
      { id: "b", text: "They eliminate the need for witnesses", correct: false, explanation: "Logs complement people; they do not replace them." },
    ],
  },
];

export function QuizCard({ title, questions }) {
  const [answers, setAnswers] = useState({});
  const select = (qId, optionId) => setAnswers((prev) => ({ ...prev, [qId]: optionId }));
  const getStatus = (question) => {
    const chosen = answers[question.id];
    if (!chosen) return null;
    const option = question.options.find((opt) => opt.id === chosen);
    return option?.correct ? "correct" : "incorrect";
  };

  return (
    <Panel title={title} eyebrow="Quiz">
      <div className="quiz-list">
        {questions.map((question) => {
          const status = getStatus(question);
          return (
            <div key={question.id} className="quiz-item">
              <p className="quiz-question">{question.prompt}</p>
              <div className="quiz-options">
                {question.options.map((opt) => (
                  <label key={opt.id} className={`quiz-option ${answers[question.id] === opt.id ? "is-selected" : ""}`}>
                    <input
                      type="radio"
                      name={`quiz-${question.id}`}
                      value={opt.id}
                      checked={answers[question.id] === opt.id}
                      onChange={() => select(question.id, opt.id)}
                    />
                    <span>{opt.text}</span>
                  </label>
                ))}
              </div>
              {status && (
                <p className={`quiz-feedback ${status === "correct" ? "ok" : "warn"}`}>
                  {status === "correct" ? "Correct." : "Not quite."}{" "}
                  {question.options.find((opt) => opt.id === answers[question.id])?.explanation || ""}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
