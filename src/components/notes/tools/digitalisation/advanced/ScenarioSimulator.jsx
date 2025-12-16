"use client";

import { useMemo, useState } from "react";

const SCENARIOS = {
  interoperability: {
    title: "Interoperability scenario",
    factors: ["Standards alignment", "Jurisdiction alignment", "Change control"],
  },
  ecosystem: {
    title: "Ecosystem scenario",
    factors: ["Trust", "Funding stability", "Shared platform health"],
  },
};

export default function ScenarioSimulator({ mode = "ecosystem" }) {
  const cfg = SCENARIOS[mode] || SCENARIOS.ecosystem;
  const [factors, setFactors] = useState({
    a: 3,
    b: 3,
    c: 3,
  });

  const outcome = useMemo(() => {
    const avg = (factors.a + factors.b + factors.c) / 3;
    return {
      delivery: clamp(avg + (mode === "ecosystem" ? 0.5 : 0)),
      risk: clamp(6 - avg),
      trust: clamp(avg),
    };
  }, [factors, mode]);

  const update = (key, value) => setFactors((prev) => ({ ...prev, [key]: Number(value) }));

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">{cfg.title}</div>
        <div className="rn-tool-sub">Adjust the three key factors and see how delivery, risk, and trust move.</div>
      </div>

      <div className="rn-grid rn-grid-3 rn-mt">
        {cfg.factors.map((f, idx) => (
          <Slider key={f} label={f} value={idx === 0 ? factors.a : idx === 1 ? factors.b : factors.c} onChange={(v) => update(idx === 0 ? "a" : idx === 1 ? "b" : "c", v)} />
        ))}
      </div>

      <div className="rn-card rn-mt">
        <div className="rn-card-title">Outcomes</div>
        <div className="rn-grid rn-grid-3 rn-mt">
          <Metric title="Delivery" value={outcome.delivery} />
          <Metric title="Risk" value={outcome.risk} />
          <Metric title="Trust" value={outcome.trust} />
        </div>
        <div className="rn-mini rn-mt">
          <div className="rn-mini-title">Reflection</div>
          <div className="rn-mini-body">Different ecosystems need different balances. The goal is to spot where small changes have large effects.</div>
        </div>
      </div>
    </div>
  );
}

function Slider({ label, value, onChange }) {
  return (
    <div className="rn-card space-y-2">
      <div className="rn-card-title text-sm">{label}</div>
      <input className="rn-range" type="range" min={1} max={5} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      <div className="rn-mini-body text-sm text-gray-700">Value {value}</div>
    </div>
  );
}

function Metric({ title, value }) {
  return (
    <div className="rn-mini">
      <div className="rn-mini-title">
        {title}: {value}
      </div>
      <div className="rn-mini-body text-sm text-gray-700">Higher delivery and trust are positive. Lower risk is positive.</div>
    </div>
  );
}

function clamp(n) {
  return Math.max(1, Math.min(5, Math.round(n)));
}
