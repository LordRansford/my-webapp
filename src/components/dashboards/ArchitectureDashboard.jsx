"use client";

export default function ArchitectureDashboard() {
  const hotspots = [
    { title: "Coupling hotspots", body: "Shared database across many services. Plan to split ownership or introduce anti-corruption layers." },
    { title: "Single point of failure", body: "Identity provider with no fallback. Consider redundancy and stronger incident runbooks." },
    { title: "Ownership gaps", body: "No clear owner for observability stack. Assign and fund it." },
  ];

  return (
    <section className="rn-card rn-mt">
      <div className="rn-card-title">Architecture health dashboard</div>
      <div className="rn-card-body">
        This is a thinking aid. It highlights common systemic risks so you can ask better questions about your own systems.
      </div>
      <div className="rn-grid rn-grid-2 rn-mt">
        {hotspots.map((h, idx) => (
          <div key={idx} className="rn-mini">
            <div className="rn-mini-title">{h.title}</div>
            <div className="rn-mini-body">{h.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
