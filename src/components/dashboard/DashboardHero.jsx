export default function DashboardHero({ title, subtitle, note }) {
  return (
    <section className="rn-hero" id="top">
      <div className="rn-hero-inner">
        <h1 className="rn-h1">{title}</h1>
        <p className="rn-lede">{subtitle}</p>
        {note ? <div className="rn-hero-note">{note}</div> : null}
      </div>
    </section>
  );
}
