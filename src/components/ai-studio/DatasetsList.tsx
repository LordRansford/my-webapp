"use client";

/**
 * Datasets List Component
 * 
 * Displays a list of datasets with filtering and pagination
 */

import React, { useState } from "react";
import { useDatasets } from "@/hooks/useDatasets";
import { Database, Filter, Search, MoreVertical, Loader2 } from "lucide-react";
import Link from "next/link";

interface DatasetsListProps {
  onSelectDataset?: (datasetId: string) => void;
}

export default function DatasetsList({ onSelectDataset }: DatasetsListProps) {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { datasets, isLoading, error, refetch } = useDatasets({
    status: statusFilter || undefined,
    autoFetch: true,
  });

  const filteredDatasets = datasets.filter((dataset) =>
    searchQuery
      ? dataset.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800 border-green-200";
      case "processing":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-semibold text-red-900">Error loading datasets</p>
        <p className="text-sm text-red-700 mt-1">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search datasets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white"
          >
            <option value="">All Status</option>
            <option value="verified">Verified</option>
            <option value="processing">Processing</option>
            <option value="uploaded">Uploaded</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400 mx-auto" />
          <p className="text-sm text-slate-600 mt-2">Loading datasets...</p>
        </div>
      ) : filteredDatasets.length === 0 ? (
        <div className="text-center py-12 rounded-2xl border border-slate-200 bg-slate-50">
          <Database className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-sm font-medium text-slate-900">No datasets found</p>
          <p className="text-sm text-slate-600 mt-1">
            {searchQuery || statusFilter ? "Try adjusting your filters" : "Upload your first dataset to get started"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDatasets.map((dataset) => (
            <div
              key={dataset.id}
              className="p-4 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
              onClick={() => onSelectDataset?.(dataset.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="p-2 bg-primary-100 rounded-lg flex-shrink-0">
                    <Database className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">{dataset.name}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-600">
                      <span className="capitalize">{dataset.type}</span>
                      <span className="text-slate-300">•</span>
                      <span>{formatBytes(dataset.size)}</span>
                      <span className="text-slate-300">•</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                          dataset.status
                        )}`}
                      >
                        {dataset.status}
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/ai-studio/datasets/${dataset.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <MoreVertical className="w-5 h-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

