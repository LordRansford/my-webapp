"use client";

import React, { useState, useEffect } from "react";
import { Users, Check } from "lucide-react";

interface AudienceSelectorProps {
  onSelect: (audienceId: string) => void;
  initialAudience?: string;
  showDescription?: boolean;
}

const audiences = [
  {
    id: "children",
    name: "Children",
    icon: "👶",
    description: "Safe, fun projects for kids",
  },
  {
    id: "student",
    name: "Student",
    icon: "🎓",
    description: "Learning and educational projects",
  },
  {
    id: "professional",
    name: "Professional",
    icon: "💼",
    description: "Business and production use",
  },
  {
    id: "educator",
    name: "Educator",
    icon: "👨‍🏫",
    description: "Teaching and educational content",
  },
  {
    id: "researcher",
    name: "Researcher",
    icon: "🔬",
    description: "Research and experimentation",
  },
];

export default function AudienceSelector({
  onSelect,
  initialAudience,
  showDescription = true,
}: AudienceSelectorProps) {
  const [selectedAudience, setSelectedAudience] = useState<string>(
    initialAudience || ""
  );

  useEffect(() => {
    const saved = localStorage.getItem("ai-studio-audience");
    if (saved && !initialAudience) {
      setSelectedAudience(saved);
      onSelect(saved);
    }
  }, [initialAudience, onSelect]);

  const handleSelect = (audienceId: string) => {
    setSelectedAudience(audienceId);
    localStorage.setItem("ai-studio-audience", audienceId);
    onSelect(audienceId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-slate-600" />
        <h3 className="text-lg font-semibold text-slate-900">Who are you?</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {audiences.map((audience) => (
          <button
            key={audience.id}
            onClick={() => handleSelect(audience.id)}
            className={`p-6 rounded-2xl border-2 transition-all text-left ${
              selectedAudience === audience.id
                ? "border-purple-500 bg-purple-50 shadow-lg"
                : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{audience.icon}</span>
                <div>
                  <h4 className="font-semibold text-slate-900">{audience.name}</h4>
                  {showDescription && (
                    <p className="text-sm text-slate-600 mt-1">{audience.description}</p>
                  )}
                </div>
              </div>
              {selectedAudience === audience.id && (
                <div className="p-1 bg-purple-600 rounded-full">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

