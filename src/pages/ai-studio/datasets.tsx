/**
 * AI Studio - Datasets Page
 * 
 * Example page demonstrating dataset management
 */

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { AIStudioErrorBoundary } from "@/components/ai-studio/AIStudioErrorBoundary";
import DatasetUpload from "@/components/ai-studio/DatasetUpload";
import DatasetsList from "@/components/ai-studio/DatasetsList";
import ErrorDisplay from "@/components/ai-studio/ErrorDisplay";
import LoadingSpinner from "@/components/ai-studio/LoadingSpinner";
import { useApiError } from "@/hooks/useApiError";
import { useDataset } from "@/hooks/useDataset";
import { Database, Upload } from "lucide-react";

// Dynamically import DatasetExplorer to reduce initial bundle size
const DatasetExplorer = dynamic(
  () => import("@/components/ai-studio/DatasetExplorer").then(mod => ({ default: mod.default })),
  {
    ssr: false,
    loading: () => <LoadingSpinner message="Loading dataset explorer..." />,
  }
);

export default function DatasetsPage() {
  const { error, handleError, clearError } = useApiError();
  const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const { dataset: selectedDataset } = useDataset({
    datasetId: selectedDatasetId,
    autoFetch: !!selectedDatasetId,
    onError: handleError,
  });

  const handleUploadComplete = (dataset: any) => {
    console.log("Dataset uploaded:", dataset);
    setShowUpload(false);
    // Refresh list would happen automatically via useDatasets hook
  };

  const handleSelectDataset = (datasetId: string) => {
    setSelectedDatasetId(datasetId);
  };

  return (
    <AIStudioErrorBoundary>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                  <Database className="w-8 h-8 text-primary-600" />
                  Datasets
                </h1>
                <p className="text-slate-600 mt-2">
                  Manage your training datasets. Upload, validate, and prepare data for AI model training.
                </p>
              </div>
              <button
                onClick={() => setShowUpload(!showUpload)}
                className="button primary flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Dataset
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6">
              <ErrorDisplay
                error={error}
                onDismiss={clearError}
              />
            </div>
          )}

          {/* Upload Section */}
          {showUpload && (
            <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Upload New Dataset</h2>
              <DatasetUpload
                onUploadComplete={handleUploadComplete}
                onError={handleError}
              />
            </div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Dataset List */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Your Datasets</h2>
                <DatasetsList onSelectDataset={handleSelectDataset} />
              </div>
            </div>

            {/* Dataset Explorer */}
            <div className="lg:col-span-1">
              {selectedDatasetId ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sticky top-8">
                  <h2 className="text-xl font-semibold text-slate-900 mb-4">Dataset Details</h2>
                  {selectedDataset ? (
                    <DatasetExplorer dataset={selectedDataset as any} onSelect={handleSelectDataset} />
                  ) : (
                    <LoadingSpinner message="Loading dataset..." />
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-sm text-slate-600 text-center py-8">
                    Select a dataset to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AIStudioErrorBoundary>
  );
}

