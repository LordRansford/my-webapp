"use client";

import React, { useState } from "react";
import { Clock, TrendingUp, Users, Sparkles } from "lucide-react";

interface UseCase {
  id: string;
  title: string;
  description: string;
  category: string;
  audience: string[];
  estimatedTime: string;
  estimatedCredits: number;
  examples: string[];
}

interface UseCaseCardsProps {
  useCases: UseCase[];
  selectedAudience?: string;
  onSelect?: (useCaseId: string) => void;
}

const defaultUseCases: UseCase[] = [
  {
    id: "sentiment-analysis",
    title: "Sentiment Analysis",
    description: "Analyze text to determine positive, negative, or neutral sentiment",
    category: "Text Analysis",
    audience: ["all", "student", "professional"],
    estimatedTime: "20 minutes",
    estimatedCredits: 25,
    examples: ["Product reviews", "Social media posts", "Customer feedback"],
  },
  {
    id: "image-classification",
    title: "Image Classification",
    description: "Automatically categorize images into predefined classes",
    category: "Computer Vision",
    audience: ["all", "student", "professional"],
    estimatedTime: "45 minutes",
    estimatedCredits: 50,
    examples: ["Photo organization", "Quality control", "Medical imaging"],
  },
  {
    id: "text-generation",
    title: "Text Generation",
    description: "Generate human-like text for various purposes",
    category: "Natural Language",
    audience: ["children", "student", "professional"],
    estimatedTime: "30 minutes",
    estimatedCredits: 40,
    examples: ["Story writing", "Content creation", "Code generation"],
  },
  {
    id: "chatbot",
    title: "Chatbot Assistant",
    description: "Build conversational AI assistants for customer support or education",
    category: "Conversational AI",
    audience: ["student", "professional"],
    estimatedTime: "2 hours",
    estimatedCredits: 100,
    examples: ["Customer support", "Educational tutor", "FAQ bot"],
  },
  {
    id: "document-summarization",
    title: "Document Summarization",
    description: "Automatically summarize long documents into key points",
    category: "Text Processing",
    audience: ["student", "professional"],
    estimatedTime: "1 hour",
    estimatedCredits: 60,
    examples: ["Research papers", "Meeting notes", "Legal documents"],
  },
  {
    id: "recommendation-system",
    title: "Recommendation System",
    description: "Suggest products, content, or actions based on user preferences",
    category: "Recommendation",
    audience: ["professional"],
    estimatedTime: "3 hours",
    estimatedCredits: 150,
    examples: ["E-commerce", "Content platforms", "Music streaming"],
  },
];

export default function UseCaseCards({
  useCases = defaultUseCases,
  selectedAudience,
  onSelect,
}: UseCaseCardsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredUseCases = useCases.filter((uc) => {
    const audienceMatch = !selectedAudience || uc.audience.includes(selectedAudience) || uc.audience.includes("all");
    const categoryMatch = selectedCategory === "all" || uc.category === selectedCategory;
    return audienceMatch && categoryMatch;
  });

  const categories = Array.from(new Set(useCases.map((uc) => uc.category)));

  const getAudienceIcon = (audiences: string[]) => {
    if (audiences.includes("children")) return "👶";
    if (audiences.includes("student")) return "🎓";
    if (audiences.includes("professional")) return "💼";
    return "🌍";
  };

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === "all"
              ? "bg-purple-600 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-purple-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Use Case Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredUseCases.map((useCase) => (
          <div
            key={useCase.id}
            onClick={() => onSelect?.(useCase.id)}
            className="p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getAudienceIcon(useCase.audience)}</span>
                <h3 className="text-lg font-semibold text-slate-900">{useCase.title}</h3>
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-4">{useCase.description}</p>

            <div className="mb-4">
              <div className="text-xs font-medium text-slate-500 mb-2">Examples:</div>
              <ul className="space-y-1">
                {useCase.examples.map((example, index) => (
                  <li key={index} className="text-xs text-slate-600 flex items-center gap-1">
                    <span className="w-1 h-1 bg-slate-400 rounded-full" />
                    {example}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div className="flex items-center gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {useCase.estimatedTime}
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {useCase.estimatedCredits} credits
                </div>
              </div>
              <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                Get Started →
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredUseCases.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <p>No use cases found for the selected filters.</p>
        </div>
      )}
    </div>
  );
}

