/**
 * Date Utilities for Streak Tracking
 */

/**
 * Get today's date string (YYYY-MM-DD UTC)
 */
export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getUTCFullYear();
  const month = String(today.getUTCMonth() + 1).padStart(2, '0');
  const day = String(today.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get current month string (YYYY-MM)
 */
export function getCurrentMonthString(): string {
  const today = new Date();
  const year = today.getUTCFullYear();
  const month = String(today.getUTCMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Get yesterday's date string
 */
export function getYesterdayDateString(): string {
  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const year = yesterday.getUTCFullYear();
  const month = String(yesterday.getUTCMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if date string is today
 */
export function isToday(dateString: string): boolean {
  return dateString === getTodayDateString();
}

/**
 * Check if date string is yesterday
 */
export function isYesterday(dateString: string): boolean {
  return dateString === getYesterdayDateString();
}

/**
 * Parse date string and get days difference from today
 */
export function getDaysDifference(dateString: string): number {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  
  const diffTime = today.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}