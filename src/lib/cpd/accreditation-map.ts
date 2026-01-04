export type CompetencyDomain = "technical" | "professional" | "governance" | "ethics" | "leadership";

export type EvidenceType = "reflection" | "template_output" | "assessment" | "project" | "certificate";

export type AssessmentMethod = "self_assessment" | "template_completion" | "reflection_required" | "practical_exercise";

export type AccreditorBody = "cpd_certification_service" | "bcs" | "iet" | "engineering_council" | "ico_aligned";

export type LearningOutcome = {
  id: string;
  description: string;
  competencyDomains: CompetencyDomain[];
  evidenceTypes: EvidenceType[];
  assessmentMethods: AssessmentMethod[];
};

export type AccreditationMapping = {
  courseId: string;
  moduleId?: string;
  templateId?: string;
  learningOutcomes: LearningOutcome[];
  applicableBodies: AccreditorBody[];
  cpdHours: number;
  version: string;
};

const competencyDomains: Record<CompetencyDomain, string> = {
  technical: "Technical knowledge and application",
  professional: "Professional practice and standards",
  governance: "Governance, risk, and compliance",
  ethics: "Ethics and professional responsibility",
  leadership: "Leadership and communication",
};

const evidenceTypes: Record<EvidenceType, string> = {
  reflection: "Reflective learning notes",
  template_output: "Template-generated outputs",
  assessment: "Completed assessments",
  project: "Practical project work",
  certificate: "Certificate of completion",
};

const assessmentMethods: Record<AssessmentMethod, string> = {
  self_assessment: "Self-assessment against criteria",
  template_completion: "Template completion with outputs",
  reflection_required: "Written reflection submission",
  practical_exercise: "Hands-on practical exercise",
};

export const ACCREDITATION_MAP: AccreditationMapping[] = [
  {
    courseId: "cybersecurity",
    learningOutcomes: [
      {
        id: "cyber-1",
        description: "Apply CIA triad principles to system design",
        competencyDomains: ["technical", "governance"],
        evidenceTypes: ["template_output", "reflection"],
        assessmentMethods: ["template_completion", "reflection_required"],
      },
      {
        id: "cyber-2",
        description: "Design threat models and control stacks",
        competencyDomains: ["technical", "governance"],
        evidenceTypes: ["template_output", "assessment"],
        assessmentMethods: ["template_completion", "practical_exercise"],
      },
    ],
    applicableBodies: ["cpd_certification_service", "bcs", "iet"],
    cpdHours: 56,
    version: "1.0.0",
  },
  {
    courseId: "ai",
    learningOutcomes: [
      {
        id: "ai-1",
        description: "Evaluate AI systems for production readiness",
        competencyDomains: ["technical", "ethics"],
        evidenceTypes: ["template_output", "reflection"],
        assessmentMethods: ["template_completion", "reflection_required"],
      },
      {
        id: "ai-2",
        description: "Design retrieval and reasoning architectures",
        competencyDomains: ["technical", "professional"],
        evidenceTypes: ["template_output", "project"],
        assessmentMethods: ["template_completion", "practical_exercise"],
      },
    ],
    applicableBodies: ["cpd_certification_service", "bcs", "ico_aligned"],
    cpdHours: 10,
    version: "1.0.0",
  },
  {
    courseId: "software-architecture",
    learningOutcomes: [
      {
        id: "arch-1",
        description: "Map capabilities to service boundaries",
        competencyDomains: ["technical", "governance"],
        evidenceTypes: ["template_output", "reflection"],
        assessmentMethods: ["template_completion", "reflection_required"],
      },
      {
        id: "arch-2",
        description: "Document architectural decisions with trade-offs",
        competencyDomains: ["technical", "professional"],
        evidenceTypes: ["template_output", "assessment"],
        assessmentMethods: ["template_completion", "practical_exercise"],
      },
    ],
    applicableBodies: ["cpd_certification_service", "bcs", "iet", "engineering_council"],
    cpdHours: 12,
    version: "1.0.0",
  },
  {
    courseId: "data",
    learningOutcomes: [
      {
        id: "data-1",
        description: "Design data governance and quality frameworks",
        competencyDomains: ["governance", "ethics"],
        evidenceTypes: ["template_output", "reflection"],
        assessmentMethods: ["template_completion", "reflection_required"],
      },
    ],
    applicableBodies: ["cpd_certification_service", "ico_aligned"],
    cpdHours: 8,
    version: "1.0.0",
  },
  {
    courseId: "digitalisation",
    learningOutcomes: [
      {
        id: "dig-1",
        description: "Plan digitalisation strategies with measurable outcomes",
        competencyDomains: ["professional", "leadership"],
        evidenceTypes: ["template_output", "reflection"],
        assessmentMethods: ["template_completion", "reflection_required"],
      },
    ],
    applicableBodies: ["cpd_certification_service", "bcs"],
    cpdHours: 6,
    version: "1.0.0",
  },
];

export const getMappingForCourse = (courseId: string): AccreditationMapping | undefined => {
  return ACCREDITATION_MAP.find((m) => m.courseId === courseId);
};

export const getMappingForTemplate = (templateId: string): AccreditationMapping | undefined => {
  return ACCREDITATION_MAP.find((m) => m.templateId === templateId);
};

export { competencyDomains, evidenceTypes, assessmentMethods };
