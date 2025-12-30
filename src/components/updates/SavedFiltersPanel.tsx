/**
 * Saved filters panel component
 */

import React, { memo, useState } from "react";
import { Bookmark, X, Plus } from "lucide-react";
import { useSavedFilters } from "@/hooks/updates/useSavedFilters";
import type { SavedFilter } from "@/hooks/updates/useSavedFilters";

interface SavedFiltersPanelProps {
  onLoadFilter: (filter: SavedFilter) => void;
  className?: string;
}

const SavedFiltersPanel = memo(function SavedFiltersPanel({
  onLoadFilter,
  className = "",
}: SavedFiltersPanelProps) {
  const { savedFilters, deleteFilter } = useSavedFilters();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState("");

  if (savedFilters.length === 0 && !showSaveDialog) {
    return null;
  }

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <Bookmark className="w-4 h-4" aria-hidden="true" />
          Saved Filters
        </h3>
        <button
          onClick={() => setShowSaveDialog(true)}
          className="p-1 text-slate-600 hover:text-slate-900 rounded transition-colors"
          aria-label="Save current filter"
          type="button"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {showSaveDialog && (
        <div className="mb-3 p-3 bg-slate-50 rounded-lg">
          <input
            type="text"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            placeholder="Filter name"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm mb-2"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                // Save logic would go here
                setShowSaveDialog(false);
                setFilterName("");
              }}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
              type="button"
            >
              Save
            </button>
            <button
              onClick={() => {
                setShowSaveDialog(false);
                setFilterName("");
              }}
              className="px-3 py-1 bg-slate-200 text-slate-700 rounded text-sm"
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {savedFilters.map((filter) => (
          <div
            key={filter.id}
            className="flex items-center justify-between p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <button
              onClick={() => onLoadFilter(filter)}
              className="flex-1 text-left text-sm text-slate-700 hover:text-slate-900"
              type="button"
            >
              {filter.name}
            </button>
            <button
              onClick={() => deleteFilter(filter.id)}
              className="p-1 text-slate-400 hover:text-slate-600"
              aria-label={`Delete filter ${filter.name}`}
              type="button"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});

export default SavedFiltersPanel;
