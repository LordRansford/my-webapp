export default function InsightHighlights({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="rn-section">
      <h3 className="rn-h3">Highlights</h3>
      <div className="rn-grid rn-grid-2">
        {items.map((x, i) => (
          <div key={i} className="rn-card">
            <div className="rn-card-title">{x.title}</div>
            <div className="rn-card-body">{x.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
