"use client";

import katex from "katex";
import "katex/dist/katex.min.css";

export function MathInline({ formula, children }) {
  const formulaToRender = formula || children;
  if (!formulaToRender) return null;
  
  return (
    <span
      className="math-inline"
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(formulaToRender, {
          throwOnError: false,
          strict: false,
          displayMode: false,
        }),
      }}
    />
  );
}

export function MathBlock({ formula, children }) {
  const formulaToRender = formula || children;
  if (!formulaToRender) return null;
  
  return (
    <div
      className="math-display katex-display"
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(formulaToRender, {
          throwOnError: false,
          displayMode: true,
          strict: false,
        }),
      }}
    />
  );
}
