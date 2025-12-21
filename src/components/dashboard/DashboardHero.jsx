export default function DashboardHero({ title, subtitle, note, badge }) {
  return (
    <section className="rn-hero" id="top">
      <div className="rn-hero-inner">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="rn-h1">{title}</h1>
          {badge ? (
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800" aria-label="Supporter status">
              {badge}
            </span>
          ) : null}
        </div>
        <p className="rn-lede">{subtitle}</p>
        {note ? <div className="rn-hero-note">{note}</div> : null}
      </div>
    </section>
  );
}
