"use client";

import React, { memo, useMemo } from "react";
import { Filter, X } from "lucide-react";
import type { NormalisedItem } from "@/lib/updates/types";
import { getCVSSScore, getSeverityLevel } from "@/utils/updates/cvss";

interface FilterBarProps {
  items: NormalisedItem[];
  onFilterChange: (filtered: NormalisedItem[]) => void;
  className?: string;
}

const FilterBar = memo(function FilterBar({
  items,
  onFilterChange,
  className = "",
}: FilterBarProps) {
  const [selectedTopics, setSelectedTopics] = React.useState<string[]>([]);
  const [selectedSources, setSelectedSources] = React.useState<string[]>([]);
  const [timeWindow, setTimeWindow] = React.useState<string>("all");
  const [severity, setSeverity] = React.useState<string>("all");
  
  // Extract unique values
  const allTopics = useMemo(() => {
    const topics = new Set<string>();
    items.forEach((item) => {
      item.topic_tags?.forEach((tag) => topics.add(tag));
    });
    return Array.from(topics).sort();
  }, [items]);
  
  const allSources = useMemo(() => {
    const sources = new Set<string>();
    items.forEach((item) => sources.add(item.source_id));
    return Array.from(sources).sort();
  }, [items]);
  
  // Apply filters
  React.useEffect(() => {
    let filtered = [...items];
    
    // Topic filter
    if (selectedTopics.length > 0) {
      filtered = filtered.filter((item) =>
        selectedTopics.some((topic) => item.topic_tags?.includes(topic))
      );
    }
    
    // Source filter
    if (selectedSources.length > 0) {
      filtered = filtered.filter((item) => selectedSources.includes(item.source_id));
    }
    
    // Time window filter
    if (timeWindow !== "all") {
      const now = Date.now();
      const daysAgo = parseInt(timeWindow);
      const cutoff = now - daysAgo * 24 * 60 * 60 * 1000;
      filtered = filtered.filter(
        (item) => new Date(item.published_at).getTime() >= cutoff
      );
    }
    
    // Severity filter (CVE only)
    if (severity !== "all" && severity !== "none") {
      filtered = filtered.filter((item) => {
        if (!item.cve) return false;
        const score = getCVSSScore(item.cve);
        const itemSeverity = getSeverityLevel(score);
        return itemSeverity === severity;
      });
    } else if (severity === "none") {
      filtered = filtered.filter((item) => !item.cve);
    }
    
    onFilterChange(filtered);
  }, [selectedTopics, selectedSources, timeWindow, severity, items, onFilterChange]);
  
  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };
  
  const toggleSource = (source: string) => {
    setSelectedSources((prev) =>
      prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]
    );
  };
  
  const clearFilters = () => {
    setSelectedTopics([]);
    setSelectedSources([]);
    setTimeWindow("all");
    setSeverity("all");
  };
  
  const hasActiveFilters =
    selectedTopics.length > 0 ||
    selectedSources.length > 0 ||
    timeWindow !== "all" ||
    severity !== "all";
  
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-600" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-slate-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900"
            aria-label="Clear all filters"
            type="button"
          >
            <X className="w-4 h-4" aria-hidden="true" />
            Clear
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {/* Time Window */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-2">
            Time Window
          </label>
          <select
            value={timeWindow}
            onChange={(e) => setTimeWindow(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Time</option>
            <option value="1">Last 24 hours</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
        
        {/* Severity */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-2">
            Severity (CVEs)
          </label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="none">Non-CVE</option>
            <option value="critical">Critical (9.0+)</option>
            <option value="high">High (7.0-8.9)</option>
            <option value="medium">Medium (4.0-6.9)</option>
            <option value="low">Low (&lt;4.0)</option>
          </select>
        </div>
        
        {/* Sources */}
        {allSources.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              Sources
            </label>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {allSources.map((source) => (
                <label
                  key={source}
                  className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:bg-slate-50 p-1 rounded"
                >
                  <input
                    type="checkbox"
                    checked={selectedSources.includes(source)}
                    onChange={() => toggleSource(source)}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <span>{source}</span>
                </label>
              ))}
            </div>
          </div>
        )}
        
        {/* Topics */}
        {allTopics.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              Topics
            </label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {allTopics.slice(0, 20).map((topic) => (
                <button
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    selectedTopics.includes(topic)
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                  type="button"
                  aria-pressed={selectedTopics.includes(topic)}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default FilterBar;
