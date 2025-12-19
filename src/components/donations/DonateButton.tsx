 "use client";

import dynamic from "next/dynamic";
import React, { useState } from "react";

const DonationModal = dynamic(() => import("./DonationModal"), { ssr: false, loading: () => null });

type DonateButtonProps = {
  label?: string;
  className?: string;
};

export default function DonateButton({ label = "Support this work", className }: DonateButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${className || ""}`}
        aria-haspopup="dialog"
      >
        <span>{label}</span>
      </button>
      {open ? <DonationModal open={open} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
