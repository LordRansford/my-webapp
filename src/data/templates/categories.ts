export type TemplateCategory = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  {
    id: "cybersecurity-architecture",
    title: "Cybersecurity Architecture",
    description: "Structures for threat modelling, controls, and resilient delivery.",
    icon: "shield",
  },
  {
    id: "data-architecture-governance",
    title: "Data Architecture and Governance",
    description: "Lineage, stewardship, retention, and trustworthy analytics foundations.",
    icon: "database",
  },
  {
    id: "ai-systems-models",
    title: "AI Systems and Models",
    description: "Model lifecycle, guardrails, and responsible deployment patterns.",
    icon: "spark",
  },
  {
    id: "digital-enterprise-architecture",
    title: "Digital and Enterprise Architecture",
    description: "Target states, capability maps, and portfolio roadmapping.",
    icon: "compass",
  },
  {
    id: "software-api-design",
    title: "Software and API Design",
    description: "Service shapes, contracts, and interoperability playbooks.",
    icon: "layout",
  },
  {
    id: "regulatory-compliance",
    title: "Regulatory and Compliance",
    description: "Evidence-led controls, audit readiness, and change governance.",
    icon: "scale",
  },
  {
    id: "engineering-systems-design",
    title: "Engineering and Systems Design",
    description: "Patterns for reliability, observability, and operability at scale.",
    icon: "circuit",
  },
  {
    id: "strategy-operating-models",
    title: "Strategy and Operating Models",
    description: "Decision rights, funding models, and measurable outcomes.",
    icon: "compass-rose",
  },
  {
    id: "analytics-decision-making",
    title: "Analytics and Decision Making",
    description: "Insight workflows, decision registers, and experiment hygiene.",
    icon: "analytics",
  },
];
