export default function ChartCard({ title, description, loading, children }) {
  return (
    <section className="rn-card rn-chart">
      <div className="rn-card-title">{title}</div>
      <div className="rn-card-body">{description}</div>
      <div className="rn-chart-body">{loading ? <div className="rn-skeleton rn-skeleton-chart" /> : children}</div>
    </section>
  );
}
