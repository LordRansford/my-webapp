const practiceStrategySections = [
  "ai-advanced-transformers-and-agents",
  "ai-advanced-diffusion-and-generation",
  "ai-advanced-production-and-monitoring",
  "ai-advanced-governance-and-strategy",
];

const intermediateSections = [
  "ai-intermediate-prompts-and-patterns",
  "ai-intermediate-embeddings-and-search",
  "ai-intermediate-rag-with-docs",
  "ai-intermediate-simple-agents",
];

const summarySections = [
  "ai-summary-concepts",
  "ai-summary-scenarios",
  "ai-summary-create",
  "ai-summary-master",
];

export const aiSectionManifest = {
  foundations: [
    "ai-foundations-what-is-ai",
    "ai-foundations-data-and-representation",
    "ai-foundations-learning-paradigms",
    "ai-foundations-responsible-ai-basics",
  ],
  intermediate: intermediateSections,
  // Alias to support the main course structure.
  applied: intermediateSections,
  advanced: practiceStrategySections,
  "practice-strategy": practiceStrategySections,
  summary: summarySections,
};
