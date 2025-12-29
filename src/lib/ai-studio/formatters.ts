/**
 * Formatting Utilities for AI Studio
 * 
 * Common formatting functions for display
 */

/**
 * Format file size in bytes to human-readable string
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Format duration in seconds to human-readable string
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

/**
 * Format cost for display
 */
export function formatCost(cost: number): string {
  if (cost === 0) return "Free";
  if (cost < 0.01) return "< $0.01";
  return `$${cost.toFixed(2)}`;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format date relative to now
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = typeof date === "string" ? new Date(date) : date;
  const diffMs = now.getTime() - then.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return then.toLocaleDateString();
}

/**
 * Format status badge color
 */
export function getStatusColor(status: string): string {
  const statusMap: Record<string, string> = {
    // Success states
    verified: "bg-green-100 text-green-800 border-green-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    active: "bg-green-100 text-green-800 border-green-200",
    deployed: "bg-green-100 text-green-800 border-green-200",
    
    // Processing states
    processing: "bg-amber-100 text-amber-800 border-amber-200",
    training: "bg-amber-100 text-amber-800 border-amber-200",
    queued: "bg-blue-100 text-blue-800 border-blue-200",
    running: "bg-blue-100 text-blue-800 border-blue-200",
    uploading: "bg-blue-100 text-blue-800 border-blue-200",
    
    // Error states
    failed: "bg-red-100 text-red-800 border-red-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
    error: "bg-red-100 text-red-800 border-red-200",
    
    // Neutral states
    pending: "bg-slate-100 text-slate-800 border-slate-200",
    uploaded: "bg-slate-100 text-slate-800 border-slate-200",
    created: "bg-slate-100 text-slate-800 border-slate-200",
  };

  return statusMap[status.toLowerCase()] || "bg-slate-100 text-slate-800 border-slate-200";
}

/**
 * Format model type for display
 */
export function formatModelType(type: string): string {
  const typeMap: Record<string, string> = {
    transformer: "Transformer",
    cnn: "CNN",
    rnn: "RNN",
    custom: "Custom",
  };

  return typeMap[type.toLowerCase()] || type;
}

/**
 * Format compute type for display
 */
export function formatComputeType(type: string): string {
  return type.toUpperCase();
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

