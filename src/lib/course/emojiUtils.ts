import { getCourseEmoji, getSectionEmoji, getEmojiLabel, type CourseId, type SectionType } from "./emojiMap";

/**
 * Utility functions for emoji selection and usage in course pages.
 */

/**
 * Get the appropriate emoji for a section header based on variant and course.
 * 
 * @param variant - The section header variant
 * @param courseId - Optional course ID for course-specific emojis
 * @returns The recommended emoji for the section
 */
export function getSectionHeaderEmoji(
  variant: "guide" | "practice" | "content",
  courseId?: string
): string {
  if (variant === "guide") {
    return getSectionEmoji("guide");
  }
  if (variant === "practice") {
    return getSectionEmoji("practice");
  }
  // For content sections, use course-specific emoji if available
  if (courseId) {
    const courseEmoji = getCourseEmoji(courseId);
    if (courseEmoji) {
      return courseEmoji;
    }
  }
  // Default: no emoji for content sections (can be added manually if needed)
  return "";
}

/**
 * Check if an emoji should be used in a subsection header.
 * 
 * Use sparingly - only when it adds clarity or visual interest.
 * 
 * @param context - The context of the subsection
 * @returns Whether an emoji should be used
 */
export function shouldUseSubsectionEmoji(context: string): boolean {
  const emojiKeywords = [
    "warning",
    "important",
    "checkpoint",
    "quick check",
    "exploration",
    "discovery",
    "tip",
    "insight",
  ];

  const lowerContext = context.toLowerCase();
  return emojiKeywords.some((keyword) => lowerContext.includes(keyword));
}

/**
 * Get the appropriate emoji for a subsection based on context.
 * 
 * @param context - The subsection title or context
 * @returns The recommended emoji, or empty string if none
 */
export function getSubsectionEmoji(context: string): string {
  const lowerContext = context.toLowerCase();

  if (lowerContext.includes("warning") || lowerContext.includes("important")) {
    return getSectionEmoji("warning");
  }
  if (lowerContext.includes("checkpoint") || lowerContext.includes("quick check")) {
    return getSectionEmoji("checkpoint");
  }
  if (lowerContext.includes("exploration") || lowerContext.includes("discovery")) {
    return getSectionEmoji("exploration");
  }
  if (lowerContext.includes("tip") || lowerContext.includes("insight")) {
    return getSectionEmoji("insight");
  }

  return "";
}

/**
 * Create an accessible label for an emoji in a header context.
 * 
 * @param emoji - The emoji character
 * @param headerText - The header text
 * @param headerLevel - The header level (h2 or h3)
 * @returns A descriptive label for screen readers
 */
export function createHeaderEmojiLabel(
  emoji: string,
  headerText: string,
  headerLevel: "h2" | "h3" = "h2"
): string {
  const level = headerLevel === "h2" ? "Section" : "Subsection";
  return getEmojiLabel(emoji, `${level}: ${headerText}`);
}

