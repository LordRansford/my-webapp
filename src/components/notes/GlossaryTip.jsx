"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

export default function GlossaryTip({ term, children, label }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const wrapperRef = useRef(null);
  const displayTerm = useMemo(() => label || term, [label, term]);

  const show = () => setOpen(true);
  const hide = () => setOpen(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    const onPointerDown = (event) => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      if (!wrapper.contains(event.target)) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown, { capture: true });
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown, { capture: true });
    };
  }, [open]);

  return (
    <span ref={wrapperRef} className="relative inline-flex items-baseline align-baseline">
      <button
        type="button"
        className="inline-flex items-baseline gap-1 rounded-md px-1 py-0.5 text-left font-normal text-inherit underline decoration-dotted decoration-slate-400 underline-offset-4 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-blue-200"
        aria-label={`Show definition for ${displayTerm}`}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onClick={() => setOpen((v) => !v)}
      >
        <strong className="font-semibold">{displayTerm}</strong>
        <span
          aria-hidden="true"
          className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 bg-white text-xs font-semibold text-gray-700"
        >
          ?
        </span>
      </button>
      {open ? (
        <div
          id={panelId}
          className="absolute left-0 z-20 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-800 shadow-lg"
          role="dialog"
          aria-label={`${displayTerm} definition`}
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          <p className="mb-1 font-semibold text-gray-900">{displayTerm}</p>
          <div className="leading-relaxed">{children}</div>
        </div>
      ) : null}
    </span>
  );
}
