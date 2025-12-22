export type LearnerLink = {
  label: string;
  href: string;
  kind: "course" | "tools" | "templates" | "studios" | "cpd";
  note?: string;
};

export type LearnerPath = {
  trackId: "ai" | "cybersecurity" | "data" | "digitalisation" | "software-architecture";
  title: string;
  courseHref: string;
  cpdHref: string;
  templatesCategoryHref: string;
  recommended: LearnerLink[];
};

export const LEARNER_PATHS: Record<LearnerPath["trackId"], LearnerPath> = {
  ai: {
    trackId: "ai",
    title: "AI",
    courseHref: "/ai",
    cpdHref: "/my-cpd",
    templatesCategoryHref: "/templates/ai-systems-models",
    recommended: [
      { kind: "templates", label: "AI templates", href: "/templates/ai-systems-models", note: "Run a structured template and save CPD evidence." },
      { kind: "tools", label: "AI tools", href: "/tools/ai", note: "Practice in a dedicated tool workspace." },
      { kind: "studios", label: "AI studio", href: "/ai-studios", note: "Long-form labs and reflection." },
      { kind: "cpd", label: "CPD evidence", href: "/my-cpd/evidence", note: "Copy/export your evidence summary." },
    ],
  },
  cybersecurity: {
    trackId: "cybersecurity",
    title: "Cybersecurity",
    courseHref: "/courses/cybersecurity",
    cpdHref: "/my-cpd",
    templatesCategoryHref: "/templates/cybersecurity-architecture",
    recommended: [
      { kind: "templates", label: "Cybersecurity templates", href: "/templates/cybersecurity-architecture", note: "Risk, threat modelling, evidence packs." },
      { kind: "tools", label: "Cyber tools", href: "/tools/cyber", note: "Small, safe browser labs." },
      { kind: "studios", label: "Cyber studio", href: "/cyber-studios", note: "Hands-on labs aligned to defensive practice." },
      { kind: "cpd", label: "CPD evidence", href: "/my-cpd/evidence" },
    ],
  },
  data: {
    trackId: "data",
    title: "Data",
    courseHref: "/data",
    cpdHref: "/my-cpd",
    templatesCategoryHref: "/templates/data-architecture-governance",
    recommended: [
      { kind: "templates", label: "Data templates", href: "/templates/data-architecture-governance", note: "Governance, stewardship, quality, and metrics." },
      { kind: "tools", label: "Data tools", href: "/tools/data", note: "SQL and schema practice." },
      { kind: "studios", label: "Data studio", href: "/data-studios", note: "Governance and architecture labs." },
      { kind: "cpd", label: "CPD evidence", href: "/my-cpd/evidence" },
    ],
  },
  digitalisation: {
    trackId: "digitalisation",
    title: "Digitalisation",
    courseHref: "/digitalisation",
    cpdHref: "/my-cpd",
    templatesCategoryHref: "/templates/digital-enterprise-architecture",
    recommended: [
      { kind: "templates", label: "Enterprise architecture templates", href: "/templates/digital-enterprise-architecture", note: "Target state, capability maps, sequencing." },
      { kind: "tools", label: "Digitalisation tools", href: "/tools/digitalisation", note: "Process and delivery practice." },
      { kind: "studios", label: "Data studio (roadmap labs)", href: "/data-studios", note: "Roadmaps, governance, and operating model practice." },
      { kind: "cpd", label: "CPD evidence", href: "/my-cpd/evidence" },
    ],
  },
  "software-architecture": {
    trackId: "software-architecture",
    title: "Software Architecture",
    courseHref: "/software-architecture",
    cpdHref: "/my-cpd",
    templatesCategoryHref: "/templates/software-api-design",
    recommended: [
      { kind: "templates", label: "Software & API templates", href: "/templates/software-api-design", note: "Contracts, versioning, integration patterns." },
      { kind: "tools", label: "Architecture tools", href: "/tools/software-architecture", note: "Regex, JS sandbox, decision logs." },
      { kind: "studios", label: "Dev studios", href: "/dev-studios", note: "Build labs and professional exercises." },
      { kind: "cpd", label: "CPD evidence", href: "/my-cpd/evidence" },
    ],
  },
};

export function getLearnerPath(trackId: LearnerPath["trackId"]) {
  return LEARNER_PATHS[trackId];
}


