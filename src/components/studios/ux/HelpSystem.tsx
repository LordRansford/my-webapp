"use client";

import React, { useState, useCallback } from "react";
import { HelpCircle, Search, BookOpen, Video, FileText, X } from "lucide-react";

interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
}

interface HelpSystemProps {
  articles?: HelpArticle[];
  onSearch?: (query: string) => HelpArticle[];
  showInline?: boolean;
  className?: string;
}

const defaultArticles: HelpArticle[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    content: "Learn how to use studio tools with guided workflows and examples.",
    category: "Basics",
    tags: ["beginner", "tutorial"]
  },
  {
    id: "automation",
    title: "Using Automation",
    content: "The workflow engine automates 95% of the work. Learn how to configure and use it.",
    category: "Automation",
    tags: ["workflow", "automation"]
  },
  {
    id: "expert-mode",
    title: "Expert Mode",
    content: "Access advanced controls and customization options in Expert mode.",
    category: "Advanced",
    tags: ["expert", "advanced"]
  }
];

export function HelpSystem({
  articles = defaultArticles,
  onSearch,
  showInline = false,
  className = ""
}: HelpSystemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);

  const filteredArticles = useMemo(() => {
    if (!search.trim()) return articles;

    const query = search.toLowerCase();
    return articles.filter(article =>
      article.title.toLowerCase().includes(query) ||
      article.content.toLowerCase().includes(query) ||
      article.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [articles, search]);

  const handleSearch = useCallback((query: string) => {
    setSearch(query);
    if (onSearch) {
      onSearch(query);
    }
  }, [onSearch]);

  if (showInline) {
    return (
      <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-sky-600" />
          <h3 className="text-lg font-semibold text-slate-900">Help & Documentation</h3>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search help articles..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="space-y-2">
          {filteredArticles.map((article) => (
            <button
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <div className="font-medium text-slate-900">{article.title}</div>
              <div className="text-sm text-slate-600 mt-1">{article.content}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-slate-500">{article.category}</span>
                {article.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {selectedArticle && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900">{selectedArticle.title}</h3>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="text-slate-600 hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <p className="text-slate-700">{selectedArticle.content}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-600 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-100"
        aria-label="Help"
      >
        <HelpCircle className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-lg z-50">
            <div className="p-4 border-b border-slate-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search help..."
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto p-2">
              {filteredArticles.slice(0, 5).map((article) => (
                <button
                  key={article.id}
                  onClick={() => {
                    setSelectedArticle(article);
                    setIsOpen(false);
                  }}
                  className="w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="font-medium text-slate-900 text-sm">{article.title}</div>
                  <div className="text-xs text-slate-600 mt-1 line-clamp-2">{article.content}</div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
