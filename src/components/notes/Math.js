"use client";

import katex from "katex";

export function MathInline({ formula }) {
  return <span dangerouslySetInnerHTML={{ __html: katex.renderToString(formula, { throwOnError: false }) }} />;
}

export function MathBlock({ formula }) {
  return (
    <div
      className="math-display"
      dangerouslySetInnerHTML={{ __html: katex.renderToString(formula, { throwOnError: false, displayMode: true }) }}
    />
  );
}
