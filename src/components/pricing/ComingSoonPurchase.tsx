"use client";

export function ComingSoonPurchase({ label = "Buy credits" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        window.alert("Payments are not enabled yet. Launching soon. Thank you for your interest.");
      }}
      className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
      aria-label={label}
    >
      {label}
    </button>
  );
}



