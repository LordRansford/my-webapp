"use client";

import React, { useState } from "react";
import { X, HelpCircle, BookOpen, ExternalLink } from "lucide-react";
import Link from "next/link";

interface HelpSection {
  title: string;
  content: React.ReactNode;
  links?: { label: string; href: string }[];
}

interface ContextualHelpProps {
  sections: HelpSection[];
  feature: string;
  className?: string;
}

export default function ContextualHelp({ sections, feature, className = "" }: ContextualHelpProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors ${className}`}
        aria-label="Get help"
        title="Get help"
      >
        <HelpCircle className="w-5 h-5" />
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="help-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
              <h2 id="help-title" className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" aria-hidden="true" />
                Help: {feature}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Close help"
              >
                <X className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {sections.map((section, index) => (
                <div key={index} className="space-y-3">
                  <h3 className="text-lg font-semibold text-slate-900">{section.title}</h3>
                  <div className="text-slate-700 prose prose-sm max-w-none">
                    {section.content}
                  </div>
                  {section.links && section.links.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {section.links.map((link, linkIndex) => (
                        <Link
                          key={linkIndex}
                          href={link.href}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                          aria-label={`${link.label} (opens in new tab)`}
                        >
                          {link.label}
                          <ExternalLink className="w-3 h-3" aria-hidden="true" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-4">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                aria-label="Close help dialog"
              >
                Got it, thanks!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

