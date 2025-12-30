/**
 * Bookmark button component
 */

import React, { memo } from "react";
import { Star } from "lucide-react";
import { useBookmarks } from "@/hooks/updates/useBookmarks";

interface BookmarkButtonProps {
  itemId: string;
  className?: string;
}

const BookmarkButton = memo(function BookmarkButton({
  itemId,
  className = "",
}: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(itemId);

  return (
    <button
      onClick={() => toggleBookmark(itemId)}
      className={`p-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
        bookmarked
          ? "text-yellow-500 hover:text-yellow-600"
          : "text-slate-400 hover:text-slate-600"
      } ${className}`}
      aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
      aria-pressed={bookmarked}
      type="button"
    >
      <Star
        className={`w-5 h-5 ${bookmarked ? "fill-current" : ""}`}
        aria-hidden="true"
      />
    </button>
  );
});

export default BookmarkButton;
