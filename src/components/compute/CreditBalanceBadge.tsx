"use client";

export default function CreditBalanceBadge({ balance }: { balance: number | null }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm">
      Credits: {typeof balance === "number" ? balance : "Sign in to view"}
    </span>
  );
}


