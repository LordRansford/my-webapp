export default function SourceAndLicensing({ title, updatedAtISO, sources, disclaimers }) {
  return (
    <div className="rn-card rn-mt">
      <div className="rn-card-title">{title}</div>
      <div className="rn-card-body">
        Last updated: <strong>{updatedAtISO}</strong>
      </div>

      <div className="rn-mini rn-mt">
        <div className="rn-mini-title">Sources</div>
        <div className="rn-mini-body">
          {sources.map((s, i) => (
            <div key={i} className="rn-source-row">
              <span className="rn-source-name">{s.name}</span>
              <span className="rn-source-licence">{s.licence}</span>
              <span className="rn-source-notes">{s.notes}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rn-mini rn-mt">
        <div className="rn-mini-title">Limitations</div>
        <div className="rn-mini-body">
          {disclaimers.map((d, i) => (
            <p key={i} className="rn-body">
              {d}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
