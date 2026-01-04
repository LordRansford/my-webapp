"use client";

import React, { useState, useMemo, Suspense, useCallback } from "react";
import { 
  Search, 
  Filter, 
  Sparkles, 
  Clock, 
  Users,
  TrendingUp,
  Loader2,
  Eye
} from "lucide-react";
import { examples, getExamplesByAudience, getExamplesByDifficulty, getExamplesByCategory } from "@/lib/ai-studio/examples";
import { AIStudioExample } from "@/lib/ai-studio/examples/types";
import ExampleLoader from "./ExampleLoader";
import ErrorBoundaryWrapper from "./ErrorBoundaryWrapper";
import LoadingSpinner from "./LoadingSpinner";
import { debounce } from "@/lib/studios/performance/optimizations";
import { createProjectFromExample, setLastOpenedProjectId } from "@/lib/ai-studio/projects/store";

interface ExampleGalleryProps {
  onLoadExample?: (example?: AIStudioExample) => void;
  selectedAudience?: string;
}

export default function ExampleGallery({ onLoadExample, selectedAudience }: ExampleGalleryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedExample, setSelectedExample] = useState<AIStudioExample | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Debounce search to improve performance
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchQuery(value);
    }, 300),
    []
  );

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    debouncedSearch(value);
  };

  const filteredExamples = useMemo(() => {
    let filtered = selectedAudience 
      ? getExamplesByAudience(selectedAudience)
      : examples;

    if (selectedDifficulty !== "all") {
      filtered = filtered.filter((ex) => ex.difficulty === selectedDifficulty);
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((ex) => ex.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (ex) =>
          ex.title.toLowerCase().includes(query) ||
          ex.description.toLowerCase().includes(query) ||
          ex.useCase.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, selectedDifficulty, selectedCategory, selectedAudience]);

  const categories = useMemo(() => {
    const cats = new Set(examples.map((ex) => ex.category));
    return Array.from(cats);
  }, []);

  const handleLoadExample = (example: AIStudioExample) => {
    if (onLoadExample) {
      // Make "Load Example" create a real artefact even when skipping the preview modal.
      const project = createProjectFromExample(example);
      setLastOpenedProjectId(project.id);
      onLoadExample(example);
    } else {
      setSelectedExample(example);
      setShowPreview(true);
    }
  };

  const getAudienceIcon = (audience: string) => {
    switch (audience) {
      case "children":
        return "👶";
      case "student":
        return "🎓";
      case "professional":
        return "💼";
      default:
        return "🌍";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-700 border-green-200";
      case "intermediate":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "advanced":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search examples..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            aria-label="Search examples"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Difficulty:</span>
          </div>
          {["all", "beginner", "intermediate", "advanced"].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedDifficulty === diff
                  ? "bg-purple-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">Category:</span>
          </div>
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === "all"
                ? "bg-purple-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-purple-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat.replace(/-/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="text-sm text-slate-600 mb-4">
        Found {filteredExamples.length} example{filteredExamples.length !== 1 ? "s" : ""}
      </div>

      {/* Example Grid */}
      {filteredExamples.length === 0 ? (
        <div className="text-center py-12 text-slate-500" role="status" aria-live="polite">
          <p>No examples found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchInput("");
              setSearchQuery("");
              setSelectedDifficulty("all");
              setSelectedCategory("all");
            }}
            className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
            aria-label="Clear all filters"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredExamples.map((example) => (
            <button
              key={example.id}
              type="button"
              className="rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
              onClick={() => handleLoadExample(example)}
              aria-label={`Open example: ${example.title}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getAudienceIcon(example.audience)}</span>
                  <h3 className="font-semibold text-slate-900">{example.title}</h3>
                </div>
              </div>

              <p className="text-sm text-slate-600 mb-4 line-clamp-2">{example.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(example.difficulty)}`}>
                  {example.difficulty}
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  {example.category}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{example.estimatedTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>{example.estimatedCredits} credits</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLoadExample(example);
                  }}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-sm"
                  aria-label={`Load ${example.title} example`}
                >
                  Load Example
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedExample(example);
                    setShowPreview(true);
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  aria-label={`Preview ${example.title} example`}
                  title="Preview"
                >
                  <Eye className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && selectedExample && (
        <ErrorBoundaryWrapper>
          <Suspense fallback={<LoadingSpinner message="Loading example..." />}>
            <ExampleLoader
              example={selectedExample}
              onClose={() => {
                setShowPreview(false);
                setSelectedExample(null);
              }}
              onLoad={() => {
                setShowPreview(false);
                if (onLoadExample) {
                  onLoadExample(selectedExample);
                }
              }}
            />
          </Suspense>
        </ErrorBoundaryWrapper>
      )}
    </div>
  );
}

