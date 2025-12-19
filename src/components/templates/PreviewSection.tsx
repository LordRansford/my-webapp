import React from "react";

type PreviewMetric = {
  label: string;
  value: string;
};

type PreviewSectionProps = {
  title: string;
  number?: string;
  children: React.ReactNode;
  metrics?: PreviewMetric[];
};

export function PreviewSection({ title, number, children, metrics }: PreviewSectionProps) {
  return (
    <section className="preview-section" aria-label={title}>
      <div className="preview-section__heading">
        <h2 className="preview-section__title">
          {number && <span className="preview-section__number">{number}</span>}
          {title}
        </h2>
        {metrics && metrics.length > 0 && (
          <div className="preview-section__metrics" aria-label="Key indicators">
            {metrics.map((metric) => (
              <div key={metric.label} className="preview-section__metric">
                <p className="preview-section__metric-label">{metric.label}</p>
                <p className="preview-section__metric-value">{metric.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="preview-section__body">{children}</div>
    </section>
  );
}
