/**
 * Export button component for News and Updates
 */

import React, { memo, useState, useRef, useEffect } from "react";
import { Download, FileJson, FileSpreadsheet } from "lucide-react";
import type { NormalisedItem } from "@/lib/updates/types";
import { exportToJSON, exportToCSV, downloadFile } from "@/utils/updates/export";

interface ExportButtonProps {
  items: NormalisedItem[];
  className?: string;
}

const ExportButton = memo(function ExportButton({
  items,
  className = "",
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleExportJSON = () => {
    const json = exportToJSON(items);
    downloadFile(json, `news-updates-${new Date().toISOString().split("T")[0]}.json`, "application/json");
    setIsOpen(false);
  };

  const handleExportCSV = () => {
    const csv = exportToCSV(items);
    downloadFile(csv, `news-updates-${new Date().toISOString().split("T")[0]}.csv`, "text/csv");
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        aria-label="Export options"
        aria-haspopup="true"
        aria-expanded={isOpen}
        type="button"
      >
        <Download className="w-4 h-4" aria-hidden="true" />
        <span className="hidden sm:inline">Export</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
          <div className="py-1">
            <button
              onClick={handleExportJSON}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
              type="button"
            >
              <FileJson className="w-4 h-4" aria-hidden="true" />
              Export as JSON
            </button>
            <button
              onClick={handleExportCSV}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
              type="button"
            >
              <FileSpreadsheet className="w-4 h-4" aria-hidden="true" />
              Export as CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default ExportButton;
