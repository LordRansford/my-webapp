"use client";

export default function DashboardQueryPanel({ title, subtitle, query, onChange, schema, presets }) {
  const set = (k, v) => onChange({ ...query, [k]: v });

  return (
    <aside className="rn-dashboard-aside" aria-label="Dashboard query panel">
      <div className="rn-card">
        <div className="rn-card-title">{title}</div>
        <div className="rn-card-body">{subtitle}</div>

        <div className="rn-form rn-mt">
          {Object.entries(schema).map(([key, def]) => {
            if (def.type === "select") {
              return (
                <label key={key} className="rn-field">
                  <div className="rn-field-label">{def.label}</div>
                  <select className="rn-input" value={query[key]} onChange={(e) => set(key, e.target.value)}>
                    {def.options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </label>
              );
            }

            if (def.type === "range") {
              return (
                <label key={key} className="rn-field">
                  <div className="rn-field-label">
                    {def.label}: <strong>{query[key]}</strong>
                  </div>
                  <input
                    className="rn-range"
                    type="range"
                    min={def.min}
                    max={def.max}
                    step={def.step}
                    value={query[key]}
                    onChange={(e) => set(key, Number(e.target.value))}
                  />
                </label>
              );
            }

            return null;
          })}
        </div>

        <div className="rn-mini rn-mt">
          <div className="rn-mini-title">Try this</div>
          <div className="rn-mini-body">
            <div className="rn-grid rn-grid-1">
              {presets.map((p) => (
                <button key={p.label} className="rn-btn" onClick={() => onChange({ ...query, ...p.apply })}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rn-mini rn-mt">
          <div className="rn-mini-title">What you just asked</div>
          <div className="rn-mini-body">
            <div className="rn-code-chip">{JSON.stringify(query, null, 2)}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
