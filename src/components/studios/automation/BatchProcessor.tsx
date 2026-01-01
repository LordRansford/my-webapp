"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Play, Pause, Square, CheckCircle2, AlertCircle, Loader2, Zap, FileText } from "lucide-react";

interface BatchItem {
  id: string;
  name: string;
  data?: any;
  status: "pending" | "processing" | "completed" | "failed";
  result?: any;
  error?: Error;
}

interface BatchProcessorProps {
  items: BatchItem[];
  processItem: (item: BatchItem) => Promise<any>;
  onComplete?: (results: Record<string, any>) => void;
  onItemComplete?: (item: BatchItem, result: any) => void;
  batchSize?: number;
  autoStart?: boolean;
  showProgress?: boolean;
  className?: string;
}

export function BatchProcessor({
  items,
  processItem,
  onComplete,
  onItemComplete,
  batchSize = 5,
  autoStart = false,
  showProgress = true,
  className = ""
}: BatchProcessorProps) {
  const [batchItems, setBatchItems] = useState<BatchItem[]>(items);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, any>>({});

  const updateItemStatus = useCallback((itemId: string, status: BatchItem["status"], result?: any, error?: Error) => {
    setBatchItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, status, result, error };
      }
      return item;
    }));

    if (result !== undefined) {
      setResults(prev => ({ ...prev, [itemId]: result }));
    }
  }, []);

  const processBatch = useCallback(async () => {
    if (isRunning) return;

    setIsRunning(true);
    setIsPaused(false);
    setCurrentItemId(null);
    setResults({});

    // Reset all items to pending
    setBatchItems(prev => prev.map(item => ({ ...item, status: "pending" as const })));

    const pendingItems = [...batchItems];
    let processedCount = 0;

    while (pendingItems.length > 0 && !isPaused) {
      // Get next batch
      const currentBatch = pendingItems
        .filter(item => item.status === "pending")
        .slice(0, batchSize);

      if (currentBatch.length === 0) break;

      // Process batch in parallel
      await Promise.all(
        currentBatch.map(async (item) => {
          setCurrentItemId(item.id);
          updateItemStatus(item.id, "processing");

          try {
            const result = await processItem(item);
            updateItemStatus(item.id, "completed", result);
            
            if (onItemComplete) {
              onItemComplete(item, result);
            }
            processedCount++;
          } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            updateItemStatus(item.id, "failed", undefined, err);
            processedCount++;
          } finally {
            if (currentItemId === item.id) {
              setCurrentItemId(null);
            }
          }
        })
      );

      // Remove processed items
      pendingItems.splice(0, currentBatch.length);
    }

    setIsRunning(false);

    if (onComplete) {
      onComplete(results);
    }
  }, [isRunning, isPaused, batchItems, batchSize, processItem, updateItemStatus, onComplete, onItemComplete, results, currentItemId]);

  const pauseProcessing = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeProcessing = useCallback(() => {
    setIsPaused(false);
    processBatch();
  }, [processBatch]);

  const stopProcessing = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentItemId(null);
  }, []);

  const resetProcessing = useCallback(() => {
    stopProcessing();
    setBatchItems(prev => prev.map(item => ({ ...item, status: "pending" as const })));
    setResults({});
  }, [stopProcessing]);

  const completedCount = useMemo(() => {
    return batchItems.filter(item => item.status === "completed").length;
  }, [batchItems]);

  const failedCount = useMemo(() => {
    return batchItems.filter(item => item.status === "failed").length;
  }, [batchItems]);

  const progress = useMemo(() => {
    if (batchItems.length === 0) return 0;
    return ((completedCount + failedCount) / batchItems.length) * 100;
  }, [completedCount, failedCount, batchItems.length]);

  React.useEffect(() => {
    if (autoStart && !isRunning && batchItems.length > 0) {
      processBatch();
    }
  }, [autoStart, isRunning, batchItems.length, processBatch]);

  const getItemIcon = (item: BatchItem) => {
    switch (item.status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case "processing":
        return <Loader2 className="w-4 h-4 text-sky-600 animate-spin" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-sky-600" />
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Batch Processing</h2>
            <p className="text-sm text-slate-600">
              {completedCount} completed, {failedCount} failed, {batchItems.length - completedCount - failedCount} pending
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {!isRunning && batchItems.some(item => item.status === "pending") && (
            <button
              onClick={processBatch}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Start
            </button>
          )}
          {isRunning && !isPaused && (
            <button
              onClick={pauseProcessing}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <Pause className="w-4 h-4" />
              Pause
            </button>
          )}
          {isPaused && (
            <button
              onClick={resumeProcessing}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Resume
            </button>
          )}
          {isRunning && (
            <button
              onClick={stopProcessing}
              className="px-4 py-2 border border-rose-300 text-rose-700 rounded-lg font-medium hover:bg-rose-50 transition-colors flex items-center gap-2"
            >
              <Square className="w-4 h-4" />
              Stop
            </button>
          )}
          {!isRunning && (completedCount > 0 || failedCount > 0) && (
            <button
              onClick={resetProcessing}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {showProgress && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {batchItems.map((item) => {
          const isCurrent = currentItemId === item.id;
          const hasError = item.error;

          return (
            <div
              key={item.id}
              className={`rounded-lg border-2 p-3 transition-all ${
                isCurrent
                  ? "border-sky-500 bg-sky-50"
                  : item.status === "completed"
                  ? "border-emerald-200 bg-emerald-50"
                  : item.status === "failed"
                  ? "border-rose-200 bg-rose-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {getItemIcon(item)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900 truncate">{item.name}</span>
                    <span className="text-xs text-slate-500 ml-2">
                      {item.status}
                    </span>
                  </div>
                  {hasError && (
                    <p className="text-xs text-rose-600 mt-1 truncate">
                      {hasError.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {batchItems.length === 0 && (
        <div className="text-center py-8 text-slate-600">
          <FileText className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <p>No items to process.</p>
        </div>
      )}
    </div>
  );
}
