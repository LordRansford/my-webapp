"use client";

import React from "react";

interface StudioCardProps {
  children: React.ReactNode;
  className?: string;
}

export function StudioCard({ children, className = "" }: StudioCardProps) {
  return (
    <section
      className={`rounded-3xl bg-white p-6 sm:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-5 ${className}`}
    >
      {children}
    </section>
  );
}
