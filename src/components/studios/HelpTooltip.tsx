"use client";

import React, { useState, useEffect, useRef, memo } from "react";
import { HelpCircle, X } from "lucide-react";

interface HelpTooltipProps {
  title: string;
  content: React.ReactNode;
  examples?: string[];
  technicalTerms?: { term: string; definition: string }[];
  className?: string;
}

const HelpTooltip = memo(function HelpTooltip({ 
  title, 
  content, 
  examples = [],
  technicalTerms = [],
  className = "" 
}: HelpTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  // Focus trap and keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    // Store the element that had focus before opening
    lastFocusedElement.current = document.activeElement as HTMLElement;

    // Focus the close button when dialog opens
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
        return;
      }

      // Focus trap: keep focus within dialog
      if (e.key === "Tab" && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden"; // Prevent background scrolling

    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      // Restore focus to the trigger button
      lastFocusedElement.current?.focus();
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center justify-center w-5 h-5 text-slate-400 hover:text-blue-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded ${className}`}
        aria-label={`Get help about ${title}`}
        aria-haspopup="dialog"
        type="button"
      >
        <HelpCircle className="w-4 h-4" aria-hidden="true" />
      </button>

      {isOpen && (
        <div 
          ref={dialogRef}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="help-title"
          aria-describedby="help-content"
        >
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 id="help-title" className="text-2xl font-bold text-slate-900">
                {title}
              </h2>
              <button
                ref={closeButtonRef}
                onClick={handleClose}
                className="text-slate-400 hover:text-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded p-1"
                aria-label="Close help dialog"
                type="button"
              >
                <X className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>
            
            <div id="help-content" className="p-6 space-y-6">
              <div className="prose prose-slate max-w-none">
                {content}
              </div>

              {technicalTerms.length > 0 && (
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Technical Terms Explained</h3>
                  <dl className="space-y-3">
                    {technicalTerms.map(({ term, definition }, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-lg">
                        <dt className="font-semibold text-slate-900 mb-1">{term}</dt>
                        <dd className="text-sm text-slate-700">{definition}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {examples.length > 0 && (
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Examples</h3>
                  <ul className="space-y-2">
                    {examples.map((example, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-600 font-semibold mt-1">•</span>
                        <span className="text-sm text-slate-700">{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default HelpTooltip;

