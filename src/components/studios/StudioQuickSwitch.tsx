"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Layout } from "lucide-react";

interface StudioOption {
  label: string;
  href: string;
  description?: string;
}

interface StudioQuickSwitchProps {
  currentStudio: string;
  studios: StudioOption[];
  className?: string;
}

export function StudioQuickSwitch({ currentStudio, studios, className = "" }: StudioQuickSwitchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const currentStudioData = studios.find(s => s.label === currentStudio) || studios[0];

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Switch studio"
      >
        <Layout className="w-4 h-4" aria-hidden="true" />
        <span className="hidden sm:inline">{currentStudioData.label}</span>
        <span className="sm:hidden">Studio</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white shadow-lg z-50 overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            {studios.map((studio) => (
              <Link
                key={studio.href}
                href={studio.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-inset"
              >
                <div className="font-medium text-slate-900">{studio.label}</div>
                {studio.description && (
                  <div className="text-xs text-slate-600 mt-1">{studio.description}</div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
