"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { AlertCircle, CheckCircle2, Clock, Info, HelpCircle, Rss, RefreshCw, AlertTriangle } from "lucide-react";
import { loadSnapshot } from "@/lib/updates/load";
import type { NewsSnapshot, NormalisedItem } from "@/lib/updates/types";
import UpdateCard from "@/components/updates/UpdateCard";
import FilterBar from "@/components/updates/FilterBar";
import SearchBar from "@/components/updates/SearchBar";
import AudienceModeToggle, { type AudienceMode } from "@/components/updates/AudienceModeToggle";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import SkeletonLoader from "@/components/studios/SkeletonLoader";
import ARIALiveRegion from "@/components/updates/ARIALiveRegion";
import SkipLink from "@/components/updates/SkipLink";
import ExportButton from "@/components/updates/ExportButton";
import { useKeyboardShortcuts } from "@/hooks/updates/useKeyboardShortcuts";
import { useSavedFilters } from "@/hooks/updates/useSavedFilters";
import { getCVSSScore } from "@/utils/updates/cvss";

type Tab = "highlights" | "vulnerabilities" | "ai-regulation" | "standards" | "all";

const ITEMS_PER_PAGE = 20;

export default function UpdatesPage() {
  const [snapshot, setSnapshot] = useState<NewsSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("highlights");
  const [audienceMode, setAudienceMode] = useState<AudienceMode>("engineer");
  const [filteredItems, setFilteredItems] = useState<NormalisedItem[]>([]);
  const [searchFiltered, setSearchFiltered] = useState<NormalisedItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showHelp, setShowHelp] = useState(false);
  const [liveMessage, setLiveMessage] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const currentItemRef = useRef<number>(0);

  const { savedFilters, saveFilter, loadFilter } = useSavedFilters();

  // Load snapshot function (reusable)
  const loadData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) {
      setIsRefreshing(true);
      setRefreshError(null);
    }
    
    try {
      const result = await loadSnapshot();
      if (result.success && result.snapshot) {
        setSnapshot(result.snapshot);
        setIsFallback(result.isFallback);
        setError(null);
        setLastRefreshTime(new Date());
        setLiveMessage(`Loaded ${result.snapshot.items.length} updates from ${result.snapshot.metadata.source_count} sources`);
      } else {
        setError(result.error || "Failed to load updates");
        setRefreshError(result.error || "Failed to load updates");
        setLiveMessage("Failed to load updates");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      setError(errorMsg);
      setRefreshError(errorMsg);
      setLiveMessage("Error loading updates");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Load snapshot on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Manual refresh handler
  const handleRefresh = useCallback(() => {
    loadData(true);
  }, [loadData]);

  // Get items for current tab
  const tabItems = useMemo(() => {
    if (!snapshot) return [];
    
    const items = snapshot.items;
    
    switch (activeTab) {
      case "highlights":
        return items
          .filter((item) => {
            const isKEV = item.cve?.kev || false;
            const cvss = getCVSSScore(item.cve);
            const isHighSeverity = cvss >= 7.0;
            const isRecent = Date.now() - new Date(item.published_at).getTime() < 7 * 24 * 60 * 60 * 1000;
            return isKEV || isHighSeverity || isRecent || item.topic_tags?.includes("highlight");
          })
          .sort((a, b) => {
            // Sort by: KEV first, then CVSS, then recency
            const aKEV = a.cve?.kev ? 1 : 0;
            const bKEV = b.cve?.kev ? 1 : 0;
            if (aKEV !== bKEV) return bKEV - aKEV;
            
            const aCVSS = getCVSSScore(a.cve);
            const bCVSS = getCVSSScore(b.cve);
            if (aCVSS !== bCVSS) return bCVSS - aCVSS;
            
            return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
          });
      
      case "vulnerabilities":
        return items
          .filter((item) => item.cve)
          .sort((a, b) => {
            const aScore = getCVSSScore(a.cve);
            const bScore = getCVSSScore(b.cve);
            return bScore - aScore;
          });
      
      case "ai-regulation":
        return items
          .filter((item) => 
            item.topic_tags?.some((tag) => 
              tag.includes("ai") || tag.includes("regulation") || tag.includes("government")
            )
          )
          .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
      
      case "standards":
        return items
          .filter((item) => 
            item.topic_tags?.some((tag) => 
              tag.includes("standard") || tag.includes("interoperability")
            )
          )
          .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
      
      case "all":
      default:
        return items.sort(
          (a, b) =>
            new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
        );
    }
  }, [snapshot, activeTab]);

  // Apply search to filtered items
  const displayItems = useMemo(() => {
    if (searchFiltered.length > 0) {
      return searchFiltered;
    }
    return filteredItems.length > 0 ? filteredItems : tabItems;
  }, [searchFiltered, filteredItems, tabItems]);

  // Pagination
  const totalPages = Math.ceil(displayItems.length / ITEMS_PER_PAGE);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return displayItems.slice(start, start + ITEMS_PER_PAGE);
  }, [displayItems, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
    currentItemRef.current = 0;
  }, [displayItems.length, activeTab]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onFocusSearch: () => {
      searchInputRef.current?.focus();
      setLiveMessage("Search focused");
    },
    onFocusFilters: () => {
      filtersRef.current?.focus();
      setLiveMessage("Filters focused");
    },
    onExport: () => {
      // Trigger export via button click
      const exportBtn = document.querySelector('[aria-label="Export options"]') as HTMLButtonElement;
      exportBtn?.click();
    },
    onShowHelp: () => {
      setShowHelp((prev) => !prev);
    },
    onRefresh: () => {
      handleRefresh();
    },
    onNavigateNext: () => {
      if (currentItemRef.current < paginatedItems.length - 1) {
        currentItemRef.current++;
        const itemElement = document.querySelector(`[data-item-index="${currentItemRef.current}"]`) as HTMLElement;
        itemElement?.focus();
        itemElement?.scrollIntoView({ behavior: "smooth", block: "center" });
        setLiveMessage(`Item ${currentItemRef.current + 1} of ${paginatedItems.length}`);
      }
    },
    onNavigatePrev: () => {
      if (currentItemRef.current > 0) {
        currentItemRef.current--;
        const itemElement = document.querySelector(`[data-item-index="${currentItemRef.current}"]`) as HTMLElement;
        itemElement?.focus();
        itemElement?.scrollIntoView({ behavior: "smooth", block: "center" });
        setLiveMessage(`Item ${currentItemRef.current + 1} of ${paginatedItems.length}`);
      }
    },
    enabled: !loading && !error,
  });

  const getStatusBadge = () => {
    if (!snapshot) return null;
    
    const generatedAt = new Date(snapshot.metadata.generated_at);
    const hoursSinceUpdate = (Date.now() - generatedAt.getTime()) / (1000 * 60 * 60);
    
    if (isFallback) {
      return (
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-amber-600" aria-hidden="true" />
          <span className="text-sm text-amber-800">
            Showing last verified snapshot from {generatedAt.toLocaleString()}
          </span>
        </div>
      );
    }
    
    if (hoursSinceUpdate > 12) {
      return (
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
          <Clock className="w-5 h-5 text-amber-600" aria-hidden="true" />
          <span className="text-sm text-amber-800">Stale (last updated {hoursSinceUpdate.toFixed(1)}h ago)</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
        <CheckCircle2 className="w-5 h-5 text-green-600" aria-hidden="true" />
        <span className="text-sm text-green-800">Live</span>
      </div>
    );
  };

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    itemsRef.current?.scrollIntoView({ behavior: "smooth" });
    setLiveMessage(`Page ${page} of ${totalPages}`);
  }, [totalPages]);

  if (loading) {
    return (
      <SecureErrorBoundary studio="updates">
        <SkipLink />
        <div className="min-h-screen bg-slate-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SkeletonLoader variant="card" count={5} />
          </div>
        </div>
      </SecureErrorBoundary>
    );
  }

  if (error || !snapshot) {
    return (
      <SecureErrorBoundary studio="updates">
        <SkipLink />
        <div className="min-h-screen bg-slate-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-white border border-rose-200 p-8 text-center">
              <AlertCircle className="w-12 h-12 text-rose-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Failed to Load Updates</h2>
              <p className="text-slate-600 mb-4">{error || "Unknown error"}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </SecureErrorBoundary>
    );
  }

  return (
    <SecureErrorBoundary studio="updates">
      <SkipLink />
      <ARIALiveRegion message={liveMessage} />
      <div className="min-h-screen bg-slate-50 py-12 print:bg-white print:py-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="mb-8 print:hidden">
            <div className="rounded-3xl bg-gradient-to-br from-white to-slate-50/50 border border-slate-200 p-8 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-slate-900 mb-2">News and Updates</h1>
                  <p className="text-lg text-slate-600">
                    Curated index of authoritative sources for energy system digitalisation, cybersecurity, AI governance, and standards
                  </p>
                </div>
                {getStatusBadge()}
              </div>
              
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <AudienceModeToggle mode={audienceMode} onChange={setAudienceMode} />
                  <ExportButton items={displayItems} />
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    aria-label="Refresh updates"
                    type="button"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} aria-hidden="true" />
                    <span className="hidden sm:inline">{isRefreshing ? "Refreshing..." : "Refresh"}</span>
                  </button>
                  <a
                    href="/api/updates/rss"
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                    aria-label="RSS feed"
                  >
                    <Rss className="w-4 h-4" aria-hidden="true" />
                    <span className="hidden sm:inline">RSS</span>
                  </a>
                  <button
                    onClick={() => setShowHelp(!showHelp)}
                    className="p-2 text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
                    aria-label="Keyboard shortcuts help"
                    type="button"
                  >
                    <HelpCircle className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span>
                    {snapshot.metadata.item_count} items from {snapshot.metadata.source_count} sources
                  </span>
                  {lastRefreshTime && (
                    <span className="text-xs text-slate-500">
                      Last refreshed: {lastRefreshTime.toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Keyboard shortcuts help */}
          {showHelp && (
            <div className="mb-6 rounded-2xl bg-blue-50 border border-blue-200 p-6 print:hidden">
              <h3 className="font-semibold text-slate-900 mb-3">Keyboard Shortcuts</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div><kbd className="px-2 py-1 bg-white rounded border">/</kbd> Focus search</div>
                <div><kbd className="px-2 py-1 bg-white rounded border">f</kbd> Focus filters</div>
                <div><kbd className="px-2 py-1 bg-white rounded border">e</kbd> Export</div>
                <div><kbd className="px-2 py-1 bg-white rounded border">r</kbd> Refresh updates</div>
                <div><kbd className="px-2 py-1 bg-white rounded border">?</kbd> Show/hide help</div>
                <div><kbd className="px-2 py-1 bg-white rounded border">j</kbd> Next item</div>
                <div><kbd className="px-2 py-1 bg-white rounded border">k</kbd> Previous item</div>
              </div>
            </div>
          )}
          
          {/* Refresh error banner */}
          {refreshError && (
            <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 print:hidden">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div className="flex-1">
                  <h3 className="font-semibold text-rose-900 mb-1">Refresh Failed</h3>
                  <p className="text-sm text-rose-700 mb-2">{refreshError}</p>
                  <button
                    onClick={handleRefresh}
                    className="text-sm text-rose-700 hover:text-rose-900 underline font-medium"
                    type="button"
                  >
                    Try again
                  </button>
                </div>
                <button
                  onClick={() => setRefreshError(null)}
                  className="text-rose-600 hover:text-rose-800"
                  aria-label="Dismiss error"
                  type="button"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* About section */}
          <div className="mb-8 rounded-2xl bg-blue-50 border border-blue-200 p-6 print:hidden">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-2">About this feed</h3>
                <p className="text-sm text-slate-700 mb-2">
                  We index authoritative sources and preserve provenance. We do not republish restricted content—we link out for full details.
                  Every item shows its source, licence posture, and when it was fetched.
                </p>
                <p className="text-xs text-slate-600">
                  Last updated: {new Date(snapshot.metadata.generated_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-6 print:hidden" ref={filtersRef} tabIndex={-1}>
              <FilterBar items={tabItems} onFilterChange={setFilteredItems} />
            </aside>
            
            {/* Main content */}
            <main id="main-content" className="lg:col-span-3" ref={itemsRef}>
              {/* Tabs */}
              <div className="mb-6 print:hidden">
                <div className="flex items-center gap-2 border-b border-slate-200">
                  {[
                    { id: "highlights", label: "Highlights" },
                    { id: "vulnerabilities", label: "Vulnerabilities" },
                    { id: "ai-regulation", label: "AI & Regulation" },
                    { id: "standards", label: "Standards" },
                    { id: "all", label: "All Updates" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as Tab)}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                        activeTab === tab.id
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-slate-600 hover:text-slate-900"
                      }`}
                      aria-pressed={activeTab === tab.id}
                      type="button"
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Search */}
              <div className="mb-6 print:hidden">
                <SearchBar 
                  items={tabItems} 
                  onSearchChange={setSearchFiltered}
                  inputRef={searchInputRef}
                />
              </div>
              
              {/* Items */}
              <div className="space-y-4">
                {paginatedItems.length === 0 ? (
                  <div className="rounded-2xl bg-white border border-slate-200 p-8 text-center">
                    {snapshot.metadata.item_count === 0 ? (
                      <>
                        <Info className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No Updates Available Yet</h3>
                        <p className="text-slate-600 mb-4">
                          The news ingestion system is still initializing. Updates will appear here once the ingestion process completes.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
                          <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                            type="button"
                          >
                            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} aria-hidden="true" />
                            {isRefreshing ? "Checking for updates..." : "Check for updates"}
                          </button>
                          <a
                            href="https://github.com/LordRansford/my-webapp/actions/workflows/news-ingest.yml"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-700 underline"
                          >
                            View ingestion status
                          </a>
                        </div>
                        <p className="text-sm text-slate-500 mt-4">
                          Last check: {new Date(snapshot.metadata.generated_at).toLocaleString()}
                        </p>
                      </>
                    ) : (
                      <p className="text-slate-600">No updates found matching your filters.</p>
                    )}
                  </div>
                ) : (
                  <>
                    {paginatedItems.map((item, index) => (
                      <div
                        key={item.id}
                        data-item-index={index}
                        tabIndex={0}
                        className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-2xl"
                      >
                        <UpdateCard item={item} audienceMode={audienceMode} />
                      </div>
                    ))}
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-8 print:hidden">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                          aria-label="Previous page"
                        >
                          Previous
                        </button>
                        <span className="px-4 py-2 text-sm text-slate-600">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                          aria-label="Next page"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          .print\\:bg-white {
            background-color: white !important;
  }
          .print\\:py-0 {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
        }
      `}</style>
    </SecureErrorBoundary>
  );
}
