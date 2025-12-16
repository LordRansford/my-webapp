export const RULES = {
  advanced: {
    requiredSections: [
      "Security architecture and system design thinking",
      "Applied cryptography and protocol reasoning",
      "Identity, trust, and zero trust architecture",
      "Detection, response, and operational security",
      "Supply chain and systemic risk",
      "Adversarial trade offs and failure analysis",
    ],
    minWordsPerSection: 0,
    minToolCardsPerSection: 1,
    minQuizQuestionsPerSection: 4,
    minConceptCalloutsPerSection: 0,
    requireAdversarialScenarioPerSection: false,
    requireMathOrFormalPerSection: false,
  },
  practitioner: {
    requireRoleMeta: true,
    minIncidentScenarios: 0,
    minEthicsSections: 0,
    minWordsPerSection: 0,
    minToolCardsPerSection: 0,
    minQuizQuestionsPerSection: 2,
    requireDecisionEvidenceConsequenceTriplet: false,
  },
};
