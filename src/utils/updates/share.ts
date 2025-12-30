/**
 * Share utilities for News and Updates
 */

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textArea);
      return success;
    }
  } catch (error) {
    console.warn("Failed to copy to clipboard:", error);
    return false;
  }
}

export function shareItem(item: { title: string; url: string }): Promise<boolean> {
  const shareText = `${item.title}\n\n${item.url}`;

  if (navigator.share) {
    return navigator
      .share({
        title: item.title,
        text: item.title,
        url: item.url,
      })
      .then(() => true)
      .catch(() => false);
  } else {
    return copyToClipboard(shareText);
  }
}

export function getShareableLink(itemId: string, baseUrl?: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : baseUrl || "";
  return `${origin}/updates?item=${itemId}`;
}
