"use client";

import React, { memo } from "react";

interface StudioCardProps {
  children: React.ReactNode;
  className?: string;
}

function StudioCard({ children, className = "" }: StudioCardProps) {
  return (
    <section
      className={`rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 md:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-4 sm:space-y-5 ${className}`}
    >
      {children}
    </section>
  );
}

export const StudioCardMemoized = memo(StudioCard);
export { StudioCardMemoized as StudioCard };
