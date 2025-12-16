"use client";

import { useMemo, useState } from "react";

const INITIATIVES = [
  { id: 1, name: "Stabilise identity and access", dependency: null },
  { id: 2, name: "Data quality uplift", dependency: null },
  { id: 3, name: "New digital service", dependency: 1 },
  { id: 4, name: "Analytics and insight", dependency: 2 },
  { id: 5, name: "Platform observability", dependency: 1 },
];

export default function RoadmapSprintGame() {
  const [order, setOrder] = useState(INITIATIVES.map((i) => i.id));

  const issues = useMemo(() => {
    const problems = [];
    order.forEach((id, idx) => {
      const item = INITIATIVES.find((i) => i.id === id);
      if (item?.dependency) {
        const depIndex = order.indexOf(item.dependency);
        if (depIndex > idx) problems.push(item.name);
      }
    });
    return problems;
  }, [order]);

  const move = (id, direction) => {
    setOrder((prev) => {
      const idx = prev.indexOf(id);
      const next = [...prev];
      const swapWith = direction === "up" ? idx - 1 : idx + 1;
      if (swapWith < 0 || swapWith >= prev.length) return prev;
      [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
      return next;
    });
  };

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Roadmap sprint game</div>
        <div className="rn-tool-sub">Reorder initiatives for a three year horizon. Dependencies should come earlier.</div>
      </div>

      <div className="rn-card rn-mt space-y-2">
        {order.map((id, idx) => {
          const item = INITIATIVES.find((i) => i.id === id);
          return (
            <div key={id} className="rn-mini rn-flex rn-items-center rn-justify-between gap-2">
              <div>
                <div className="rn-mini-title">{idx + 1}. {item?.name}</div>
                {item?.dependency ? <div className="rn-mini-body text-sm text-gray-700">Depends on: {INITIATIVES.find((i) => i.id === item.dependency)?.name}</div> : null}
              </div>
              <div className="rn-actions rn-gap-1">
                <button className="rn-btn" onClick={() => move(id, "up")}>Up</button>
                <button className="rn-btn" onClick={() => move(id, "down")}>Down</button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rn-card rn-mt">
        <div className="rn-card-title">What this shows</div>
        <div className="rn-card-body">
          {issues.length === 0
            ? "Dependencies are respected. This is a realistic starting point for a roadmap."
            : `These items are placed before their prerequisites: ${issues.join(", ")}. Try moving foundational work earlier.`}
        </div>
        <div className="rn-mini rn-mt">
          <div className="rn-mini-title">Reflection</div>
          <div className="rn-mini-body">Do you leave room for learning and course correction. Are platforms and data foundations early enough.</div>
        </div>
      </div>
    </div>
  );
}
