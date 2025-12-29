/**
 * Course-specific emoji mapping for consistent visual branding.
 * 
 * Each course has a primary emoji that represents its domain.
 * These emojis are used in section headers and tool cards to create
 * visual consistency and brand recognition.
 */

export const COURSE_EMOJIS = {
  ai: "🧠",
  cybersecurity: "🛡️",
  data: "📊",
  digitalisation: "🌐",
  "software-architecture": "🏗️",
} as const;

export type CourseId = keyof typeof COURSE_EMOJIS;

/**
 * Section type emojis for consistent usage across all courses.
 */
export const SECTION_EMOJIS = {
  guide: "📚",
  practice: "🛠️",
  checkpoint: "✅",
  warning: "⚠️",
  exploration: "🔍",
  insight: "💡",
  target: "🎯",
} as const;

export type SectionType = keyof typeof SECTION_EMOJIS;

/**
 * Get the primary emoji for a course.
 * 
 * @param courseId - The course identifier
 * @returns The emoji for the course, or undefined if not found
 */
export function getCourseEmoji(courseId: string): string | undefined {
  return COURSE_EMOJIS[courseId as CourseId];
}

/**
 * Get an emoji for a section type.
 * 
 * @param sectionType - The section type
 * @returns The emoji for the section type
 */
export function getSectionEmoji(sectionType: SectionType): string {
  return SECTION_EMOJIS[sectionType];
}

/**
 * Get a descriptive label for an emoji (for accessibility).
 * 
 * @param emoji - The emoji character
 * @param context - Additional context for the label
 * @returns A descriptive label for screen readers
 */
export function getEmojiLabel(emoji: string, context: string): string {
  const emojiMap: Record<string, string> = {
    "🧠": "AI",
    "🛡️": "Security",
    "📊": "Data",
    "🌐": "Digitalisation",
    "🏗️": "Architecture",
    "📚": "Guide",
    "🛠️": "Practice",
    "✅": "Checkpoint",
    "⚠️": "Warning",
    "🔍": "Exploration",
    "💡": "Insight",
    "🎯": "Target",
  };

  const emojiName = emojiMap[emoji] || "Icon";
  return `${emojiName}: ${context}`;
}

