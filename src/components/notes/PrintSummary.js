"use client";

export function PrintSummary({ title, bullets = [], keyTerms = [], diagrams = [] }) {
  return (
    <div className="panel stack">
      <p className="eyebrow">Print-friendly summary</p>
      {title && <h3 style={{ margin: 0 }}>{title}</h3>}
      <div className="summary-grid">
        <div>
          <p className="eyebrow">Key points</p>
          <ul>
            {bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow">Key terms</p>
          <ul>
            {keyTerms.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow">Diagrams to sketch</p>
          <ul>
            {diagrams.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
