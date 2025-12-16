"use client";

export default function DecisionDashboard() {
  const metrics = [
    { title: "Decisions per month", value: "4", hint: "Healthy cadence. Decisions are being captured." },
    { title: "Reopened decisions", value: "1", hint: "Revisiting is good. Check why it was reopened." },
    { title: "Unowned decisions", value: "0", hint: "All decisions have owners. Keep it that way." },
  ];

  return (
    <section className="rn-card rn-mt">
      <div className="rn-card-title">Decision and change dashboard</div>
      <div className="rn-card-body">
        Architectural decisions must be visible. This view reminds you to watch cadence, ownership, and rework.
      </div>
      <div className="rn-grid rn-grid-3 rn-mt">
        {metrics.map((m, idx) => (
          <div key={idx} className="rn-mini">
            <div className="rn-mini-title">{m.title}</div>
            <div className="rn-mini-body">
              <strong>{m.value}</strong>
              <div className="text-sm text-gray-700">{m.hint}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
