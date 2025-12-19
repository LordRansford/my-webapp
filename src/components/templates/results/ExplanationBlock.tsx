import React from "react";

type Props = {
  text: string;
};

export default function ExplanationBlock({ text }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-inner">
      <p className="text-sm text-slate-800 leading-relaxed">{text}</p>
    </div>
  );
}
