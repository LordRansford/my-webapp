/**
 * Highlight search terms in text
 */

export function highlightSearch(text: string, query: string): string {
  if (!query.trim() || !text) {
    return text;
  }

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return text.replace(regex, '<mark class="bg-yellow-200 text-yellow-900">$1</mark>');
}

export function highlightSearchInHTML(text: string, query: string): string {
  if (!query.trim() || !text) {
    return text;
  }

  // Create a temporary element to safely parse HTML
  const div = document.createElement("div");
  div.textContent = text;

  const textContent = div.textContent || "";
  const highlighted = highlightSearch(textContent, query);

  // Return as HTML string (caller should use dangerouslySetInnerHTML carefully)
  return highlighted;
}
