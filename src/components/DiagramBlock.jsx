// src/components/DiagramBlock.jsx
// Simple, reusable wrapper for schematic diagrams in MDX.
// It gives you a consistent card layout for boxes, arrows and captions.
// Any children you pass from MDX will be rendered inside the canvas area.

export default function DiagramBlock({
  title,
  subtitle,
  description,
  layout = "stack", // "stack" or "split"
  children,
}) {
  const isSplit = layout === "split";

  return (
    <section
      className="my-8 rounded-3xl border border-slate-200 bg-slate-50/80 px-4 py-5 shadow-sm
                 dark:border-slate-700 dark:bg-slate-900/60"
      aria-label={title || "Diagram"}
    >
      {/* Header */}
      {(title || subtitle || description) && (
        <header className="mb-4 space-y-1">
          {title && (
            <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {subtitle}
            </p>
          )}
          {description && (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {description}
            </p>
          )}
        </header>
      )}

      {/* Body layout */}
      <div
        className={
          isSplit
            ? "grid gap-4 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-start"
            : "flex flex-col gap-3"
        }
      >
        {/* Diagram canvas */}
        <div
          className="rounded-2xl border border-slate-200 bg-white/90 p-4
                     shadow-inner dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="pointer-events-auto flex flex-col gap-3 text-sm text-slate-800 dark:text-slate-100">
            {children}
          </div>
        </div>

        {/* Optional notes panel for split layout */}
        {isSplit && (
          <aside
            className="rounded-2xl bg-slate-100/90 p-4 text-xs text-slate-700
                       dark:bg-slate-800/80 dark:text-slate-200"
          >
            <p className="font-semibold mb-1">How to read this diagram</p>
            <p className="mb-2">
              Boxes are components or actors. Arrows show direction of data or
              control. Group things that usually change together. If you find
              yourself drawing a lot of criss cross arrows, the design probably
              needs a tidy up.
            </p>
            <p>
              Feel free to edit this text in the MDX if you want different
              hints for a specific diagram.
            </p>
          </aside>
        )}
      </div>
    </section>
  );
}
