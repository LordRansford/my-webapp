"use client";

import React, { memo, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import type { NormalisedItem } from "@/lib/updates/types";

interface SearchBarProps {
  items: NormalisedItem[];
  onSearchChange: (filtered: NormalisedItem[]) => void;
  className?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

const SearchBar = memo(function SearchBar({
  items,
  onSearchChange,
  className = "",
  inputRef,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  
  const filtered = useMemo(() => {
    if (!query.trim()) {
      return items;
    }
    
    const lowerQuery = query.toLowerCase();
    return items.filter((item) => {
      const searchableText = [
        item.title,
        item.publisher,
        ...(item.topic_tags || []),
        item.audience_notes.exec_brief,
        item.audience_notes.engineer_detail,
        item.audience_notes.learner_explain,
        item.cve?.cve_id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      
      return searchableText.includes(lowerQuery);
    });
  }, [query, items]);
  
  React.useEffect(() => {
    onSearchChange(filtered);
  }, [filtered, onSearchChange]);
  
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" aria-hidden="true" />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search updates... (Press / to focus)"
        className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Search updates"
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
          aria-label="Clear search"
          type="button"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
});

export default SearchBar;
