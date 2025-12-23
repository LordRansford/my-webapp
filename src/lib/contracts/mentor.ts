export type MentorHeading = { id: string; text: string; depth?: number };
export type MentorTocItem = { id: string; text: string };

export type MentorPageContext = {
  pathname: string;
  title?: string;
  text?: string;
  headings?: MentorHeading[];
  toc?: MentorTocItem[];
  tools?: Array<{ id?: string; title: string }>;
};

export type MentorRequest = {
  question: string;
  pageUrl?: string;
  pageContext?: MentorPageContext;
  projectId?: string;
  note?: string;
};

export type MentorCitation = { title: string; href: string; why?: string };
export type MentorSource = { title: string; href: string; excerpt?: string };
export type MentorTryNext = { title: string; href: string; steps: string[] };

export type MentorResponse =
  | { message: string }
  | {
      answer: string;
      answerFromSite?: string;
      citationsTitle: string;
      citations: { title: string; href: string; why: string }[];
      sources?: MentorSource[];
      tryNext: MentorTryNext | null;
      note: string;
      lowConfidence: boolean;
      receipt?: any;
    };


