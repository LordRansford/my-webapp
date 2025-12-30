/**
 * Share button component
 */

import React, { memo, useState } from "react";
import { Share2, Check } from "lucide-react";
import { shareItem, copyToClipboard, getShareableLink } from "@/utils/updates/share";

interface ShareButtonProps {
  item: { title: string; url: string; id: string };
  className?: string;
}

const ShareButton = memo(function ShareButton({
  item,
  className = "",
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // Try native share first, fallback to copy
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.title,
          url: item.url,
        });
        return;
      } catch (error) {
        // User cancelled or error - fall through to copy
      }
    }
    
    // Fallback: copy link
    const link = getShareableLink(item.id);
    const success = await copyToClipboard(link);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-900 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        aria-label="Share item"
        type="button"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Share</span>
          </>
        )}
      </button>
    </div>
  );
});

export default ShareButton;
