export type EmployerStatus = "pending" | "verified" | "suspended";

export type SponsorLink = {
  token: string;
  label: string;
  allowedCourses: string[];
  allowedLevels?: string[];
  expiresAt?: string;
  learnerCap?: number;
  sponsoredHours?: number;
  aggregates: {
    learners: number;
    completionRate: number;
    avgHours: number;
    certificatesShared: number;
  };
};

export type CourseSkillMapping = {
  courseId: string;
  courseTitle: string;
  roleTrack: "cyber" | "ai" | "software" | "data";
  skills: string[];
  frameworks: string[];
  employerStatement: string;
};

export type Employer = {
  employerId: string;
  organisationName: string;
  contactEmail: string;
  verifiedDomain: string;
  status: EmployerStatus;
  sponsoredLinks: SponsorLink[];
  trustSignals: {
    teachingPhilosophy: string;
    assessmentTransparency: string;
    commitmentToUpdates: string;
  };
};

export const courseSkillMappings: CourseSkillMapping[] = [
  {
    courseId: "cybersecurity/practitioner",
    courseTitle: "Cybersecurity Practitioner",
    roleTrack: "cyber",
    skills: ["Threat modelling", "Control selection", "Incident playbooks"],
    frameworks: ["NIST CSF", "ISO 27001"],
    employerStatement:
      "Learners completing this level demonstrate practical understanding of mapping threats to controls, documenting playbooks, and prioritising mitigations.",
  },
  {
    courseId: "ai/advanced",
    courseTitle: "AI Advanced",
    roleTrack: "ai",
    skills: ["Model evaluation", "Fairness checks", "Deployment risk review"],
    frameworks: ["NIST AI RMF", "Model cards"],
    employerStatement:
      "Learners completing this level demonstrate practical understanding of model evaluation, bias detection, and deployment guardrails using hands-on labs.",
  },
  {
    courseId: "software-architecture/patterns",
    courseTitle: "Software Architecture Patterns",
    roleTrack: "software",
    skills: ["Service decomposition", "API design", "Resilience patterns"],
    frameworks: ["C4 modelling", "Twelve-Factor"],
    employerStatement:
      "Learners completing this level demonstrate practical understanding of designing services, producing stable APIs, and applying resilience patterns.",
  },
  {
    courseId: "data/intermediate",
    courseTitle: "Data Intermediate",
    roleTrack: "data",
    skills: ["Data quality controls", "Lineage basics", "Access governance"],
    frameworks: ["DAMABOK (light)", "Data contracts"],
    employerStatement:
      "Learners completing this level demonstrate practical understanding of data quality controls, lineage documentation, and access governance with working examples.",
  },
];

export const employers: Employer[] = [
  {
    employerId: "emp-acme",
    organisationName: "Acme Industries",
    contactEmail: "talent@acme.example",
    verifiedDomain: "acme.example",
    status: "verified",
    sponsoredLinks: [
      {
        token: "acme-onboarding-2025",
        label: "Acme security onboarding",
        allowedCourses: ["cybersecurity/practitioner", "data/intermediate"],
        allowedLevels: ["beginner", "intermediate"],
        expiresAt: "2025-12-31",
        learnerCap: 150,
        sponsoredHours: 3200,
        aggregates: {
          learners: 94,
          completionRate: 0.78,
          avgHours: 11.5,
          certificatesShared: 28,
        },
      },
      {
        token: "acme-ai-cohort",
        label: "AI safety uplift",
        allowedCourses: ["ai/advanced"],
        allowedLevels: ["intermediate", "advanced"],
        expiresAt: "2026-03-31",
        learnerCap: 80,
        sponsoredHours: 1450,
        aggregates: {
          learners: 52,
          completionRate: 0.64,
          avgHours: 9.2,
          certificatesShared: 19,
        },
      },
    ],
    trustSignals: {
      teachingPhilosophy: "Hands-on, scenario led learning with clear outcomes and zero fluff.",
      assessmentTransparency: "Transparent rubrics, no hidden curves, feedback is specific and actionable.",
      commitmentToUpdates: "Curricula reviewed monthly against frameworks and vendor changes.",
    },
  },
  {
    employerId: "emp-nimbus",
    organisationName: "Nimbus Analytics",
    contactEmail: "learning@nimbus.example",
    verifiedDomain: "nimbus.example",
    status: "pending",
    sponsoredLinks: [
      {
        token: "nimbus-data-lift",
        label: "Data architecture uplift",
        allowedCourses: ["data/intermediate", "software-architecture/patterns"],
        allowedLevels: ["intermediate"],
        learnerCap: 60,
        sponsoredHours: 900,
        aggregates: {
          learners: 31,
          completionRate: 0.71,
          avgHours: 10.4,
          certificatesShared: 8,
        },
      },
    ],
    trustSignals: {
      teachingPhilosophy: "Practical, production-ready skills with minimal theory overhead.",
      assessmentTransparency: "Skills demonstrated through labs and short writeups that map to frameworks.",
      commitmentToUpdates: "Employer feedback loop baked in; updates tracked per release.",
    },
  },
];

export function findSponsorLink(token: string) {
  for (const employer of employers) {
    const link = employer.sponsoredLinks.find((s) => s.token === token);
    if (link) {
      return { employer, link };
    }
  }
  return null;
}
