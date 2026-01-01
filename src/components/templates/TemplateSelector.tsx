"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Filter, Star, Clock, Zap, Eye, Settings, Upload } from "lucide-react";
import { TemplateCard } from "./TemplateCard";
import { TemplatePreview } from "./TemplatePreview";

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimatedMinutes: number;
  tags?: string[];
  route: string;
  gatingLevel?: string;
  safetyClass?: string;
  exportFormatsSupported?: string[];
  area?: string;
}

interface TemplateSelectorProps {
  templates: Template[];
  onSelect?: (template: Template) => void;
  showPreview?: boolean;
  showUpload?: boolean;
  mode?: "grid" | "list" | "wizard";
}

export function TemplateSelector({
  templates,
  onSelect,
  showPreview = true,
  showUpload = false,
  mode = "grid"
}: TemplateSelectorProps) {
  const [search, setSearch] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"relevance" | "time" | "popularity">("relevance");

  const categories = useMemo(() => {
    return Array.from(new Set(templates.map(t => t.category)));
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    let filtered = [...templates];

    // Search filter
    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        (t.tags || []).some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Difficulty filter
    if (difficultyFilter !== "all") {
      filtered = filtered.filter(t => t.difficulty === difficultyFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "time") {
        return a.estimatedMinutes - b.estimatedMinutes;
      } else if (sortBy === "popularity") {
        // Placeholder - would use actual usage data
        return 0;
      } else {
        // Relevance (default)
        return a.title.localeCompare(b.title);
      }
    });

    return filtered;
  }, [templates, search, difficultyFilter, categoryFilter, sortBy]);

  const handleTemplateClick = (template: Template) => {
    setSelectedTemplate(template);
    if (onSelect) {
      onSelect(template);
    }
  };

  const handleStartFromTemplate = (template: Template) => {
    // Navigate to template with customization options
    window.location.href = `${template.route}?mode=customize`;
  };

  if (mode === "wizard") {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Select a Template</h2>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search templates..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.slice(0, 6).map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateClick(template)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedTemplate?.id === template.id
                      ? "border-sky-500 bg-sky-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <h3 className="font-semibold text-slate-900">{template.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{template.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>{template.estimatedMinutes} min</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100">{template.difficulty}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {selectedTemplate && showPreview && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Template Preview</h2>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                Close
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900">{selectedTemplate.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{selectedTemplate.description}</p>
              </div>
              <div className="flex gap-3">
                <Link
                  href={selectedTemplate.route}
                  className="px-4 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors"
                >
                  Open Template
                </Link>
                <button
                  onClick={() => handleStartFromTemplate(selectedTemplate)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  Customize & Start
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates by name, description, or tags..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            {showUpload && (
              <button
                className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Template
              </button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty</label>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="relevance">Relevance</option>
                <option value="time">Time (Shortest First)</option>
                <option value="popularity">Popularity</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Template Grid/List */}
      {mode === "list" ? (
        <div className="space-y-3">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleTemplateClick(template)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{template.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{template.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {template.estimatedMinutes} min
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100">{template.difficulty}</span>
                    {template.tags?.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded bg-slate-100">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  {showPreview && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTemplateClick(template);
                      }}
                      className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                  )}
                  <Link
                    href={template.route}
                    onClick={(e) => e.stopPropagation()}
                    className="px-3 py-1.5 text-sm bg-sky-600 text-white rounded-lg hover:bg-sky-700"
                  >
                    Open
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleTemplateClick(template)}
              className="cursor-pointer"
            >
              <TemplateCard
                template={template}
                isFavorite={false}
                onToggleFavorite={() => {}}
                onDownload={() => {}}
              />
            </div>
          ))}
        </div>
      )}

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 text-slate-600">
          <p>No templates found matching your criteria.</p>
          <button
            onClick={() => {
              setSearch("");
              setDifficultyFilter("all");
              setCategoryFilter("all");
            }}
            className="mt-4 text-sky-600 hover:text-sky-700 underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Preview Modal */}
      {selectedTemplate && showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-semibold text-slate-900">Template Preview</h2>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-slate-600 hover:text-slate-900"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-slate-900">{selectedTemplate.title}</h3>
                <p className="text-slate-600 mt-2">{selectedTemplate.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-sm text-slate-700">
                    {selectedTemplate.difficulty}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-sm text-slate-700">
                    {selectedTemplate.estimatedMinutes} min
                  </span>
                  {selectedTemplate.tags?.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-slate-100 text-sm text-slate-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mb-6">
                <Link
                  href={selectedTemplate.route}
                  className="px-6 py-3 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors"
                >
                  Open Template
                </Link>
                <button
                  onClick={() => handleStartFromTemplate(selectedTemplate)}
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  Customize & Start
                </button>
              </div>
              {/* Live preview would go here - showing example output */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm text-slate-600">
                  Live preview coming soon. This will show an example of the template output.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
