"use client";

import React, { useState } from "react";
import { FileText, Image, Music, Video, Database, Presentation, FileSpreadsheet, Type } from "lucide-react";
import { supportedFormats, FileFormatInfo } from "@/lib/studios/file-formats";
import HelpTooltip from "./HelpTooltip";

const categoryIcons = {
  image: <Image className="w-5 h-5" />,
  document: <FileText className="w-5 h-5" />,
  audio: <Music className="w-5 h-5" />,
  video: <Video className="w-5 h-5" />,
  data: <Database className="w-5 h-5" />,
  presentation: <Presentation className="w-5 h-5" />,
  spreadsheet: <FileSpreadsheet className="w-5 h-5" />,
  text: <Type className="w-5 h-5" />
};

const categoryLabels = {
  image: "Images",
  document: "Documents",
  audio: "Audio",
  video: "Video",
  data: "Data Files",
  presentation: "Presentations",
  spreadsheet: "Spreadsheets",
  text: "Text Files"
};

export default function FileFormatGuide() {
  const [selectedCategory, setSelectedCategory] = useState<FileFormatInfo["category"] | "all">("all");
  const [selectedFormat, setSelectedFormat] = useState<FileFormatInfo | null>(null);

  const filteredFormats = selectedCategory === "all"
    ? supportedFormats
    : supportedFormats.filter(f => f.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Supported File Formats</h2>
        <p className="text-sm text-slate-700 mb-4">
          You can upload and work with many different types of files. Each file type stores information in a specific way. 
          Understanding the structure helps you use them effectively.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            selectedCategory === "all"
              ? "bg-blue-600 text-white"
              : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
          }`}
        >
          All Formats
        </button>
        {Object.entries(categoryLabels).map(([category, label]) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category as FileFormatInfo["category"])}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
              selectedCategory === category
                ? "bg-blue-600 text-white"
                : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
          >
            {categoryIcons[category as keyof typeof categoryIcons]}
            {label}
          </button>
        ))}
      </div>

      {/* Formats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFormats.map((format) => (
          <div
            key={format.extension}
            className="rounded-2xl bg-white border border-slate-200 p-5 hover:shadow-md transition-all cursor-pointer"
            onClick={() => setSelectedFormat(format)}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                {categoryIcons[format.category]}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 mb-1">{format.name}</h3>
                <p className="text-xs text-slate-600 font-mono">{format.extension}</p>
              </div>
            </div>
            <p className="text-sm text-slate-700 mb-3 line-clamp-2">{format.description}</p>
            <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded">
              <strong>Example:</strong> {format.example}
            </div>
          </div>
        ))}
      </div>

      {/* Format Detail Modal */}
      {selectedFormat && (
        <FormatDetailModal
          format={selectedFormat}
          onClose={() => setSelectedFormat(null)}
        />
      )}
    </div>
  );
}

function FormatDetailModal({ format, onClose }: { format: FileFormatInfo; onClose: () => void }) {
  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{format.name}</h2>
            <p className="text-sm text-slate-600 font-mono mt-1">{format.extension}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">What is this format?</h3>
            <p className="text-sm text-slate-700">{format.description}</p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-2">How is the data structured?</h3>
            <p className="text-sm text-slate-700 mb-2">{format.structure}</p>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-xs text-slate-700 font-semibold mb-1">Simple Explanation:</p>
              <p className="text-sm text-slate-700">{format.childFriendlyExample}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-2">What information can you store?</h3>
            <p className="text-sm text-slate-700 mb-2">{format.dataStructure}</p>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-xs text-slate-600 mb-2"><strong>Common uses:</strong></p>
              <p className="text-sm text-slate-700">{format.commonUse}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Real-world examples</h3>
            <p className="text-sm text-slate-700">{format.example}</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
            <p className="text-xs font-semibold text-amber-900 mb-1">Why structure matters</p>
            <p className="text-sm text-amber-800">
              The structure of a file format is like the layout of a house. Just as a house needs rooms, doors, and windows 
              arranged in a specific way, file formats organise information in a particular structure so that computers can 
              find and use the information correctly. If the structure is wrong, the computer cannot read the file properly, 
              just like you cannot use a door that is in the wrong place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



