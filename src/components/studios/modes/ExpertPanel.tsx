"use client";

import React, { ReactNode, useState } from "react";
import { Settings, ChevronDown, ChevronUp, Code, Database, Zap } from "lucide-react";

interface ExpertSection {
  id: string;
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

interface ExpertPanelProps {
  sections: ExpertSection[];
  className?: string;
}

export function ExpertPanel({
  sections,
  className = ""
}: ExpertPanelProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(sections.filter(s => s.defaultOpen).map(s => s.id))
  );

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-slate-600" />
        <h3 className="text-lg font-semibold text-slate-900">Expert Controls</h3>
      </div>

      {sections.map((section) => {
        const isOpen = openSections.has(section.id);
        const Icon = section.icon || Settings;

        return (
          <div
            key={section.id}
            className="rounded-xl border border-slate-200 bg-white overflow-hidden"
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-slate-600" />
                <div>
                  <h4 className="font-semibold text-slate-900">{section.title}</h4>
                  {section.description && (
                    <p className="text-sm text-slate-600 mt-0.5">{section.description}</p>
                  )}
                </div>
              </div>
              {isOpen ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {isOpen && (
              <div className="border-t border-slate-200 p-4 bg-slate-50">
                {section.children}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
