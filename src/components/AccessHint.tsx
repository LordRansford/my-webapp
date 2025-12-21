"use client";

type Props = {
  message: string;
  detail?: string;
};

export default function AccessHint({ message, detail }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">{message}</p>
      {detail ? <p className="text-sm text-slate-700 mt-1">{detail}</p> : null}
    </div>
  );
}


