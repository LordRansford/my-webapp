/**
 * Canonical Mentor Response Types
 * 
 * Single source of truth for Mentor API response structure.
 * All Mentor responses must conform to this shape.
 */

export type MentorCitationV2 = {
  title: string;
  urlOrPath: string;
  anchorOrHeading?: string;
};

export type MentorResponse = {
  answer: string;
  answerMode: "rag" | "general-guidance" | "fallback";
  citationsV2: MentorCitationV2[];
  suggestedActions?: Array<{
    label: string;
    href: string;
  }>;
  debug?: {
    retrievalCount: number;
    fallbackReason?: string;
  };
};

