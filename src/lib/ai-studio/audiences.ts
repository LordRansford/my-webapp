export interface AudienceProfile {
  id: string;
  name: string;
  description: string;
  recommendedExamples: string[];
  simplifiedUI: boolean;
  safetyRestrictions: string[];
  creditLimits: {
    daily: number;
    monthly: number;
  };
  features: {
    cloudTraining: boolean;
    deployment: boolean;
    advancedModels: boolean;
  };
}

export const audienceProfiles: Record<string, AudienceProfile> = {
  children: {
    id: "children",
    name: "Children",
    description: "Safe, fun, and educational AI projects for kids",
    recommendedExamples: ["story-generator", "drawing-classifier"],
    simplifiedUI: true,
    safetyRestrictions: [
      "No external API access",
      "No cloud training",
      "No deployment",
      "Pre-approved examples only",
      "Parent/guardian controls required",
    ],
    creditLimits: {
      daily: 10,
      monthly: 50,
    },
    features: {
      cloudTraining: false,
      deployment: false,
      advancedModels: false,
    },
  },
  student: {
    id: "student",
    name: "Student",
    description: "Educational projects and learning tools for students",
    recommendedExamples: ["homework-helper", "notes-summarizer", "sentiment-analyzer"],
    simplifiedUI: false,
    safetyRestrictions: [
      "Limited cloud training",
      "No production deployment",
      "Educational use only",
    ],
    creditLimits: {
      daily: 50,
      monthly: 200,
    },
    features: {
      cloudTraining: true,
      deployment: false,
      advancedModels: true,
    },
  },
  professional: {
    id: "professional",
    name: "Professional",
    description: "Full-featured AI development for business and production use",
    recommendedExamples: [
      "customer-support-bot",
      "document-analyzer",
      "recommendation-system",
    ],
    simplifiedUI: false,
    safetyRestrictions: [],
    creditLimits: {
      daily: 1000,
      monthly: 10000,
    },
    features: {
      cloudTraining: true,
      deployment: true,
      advancedModels: true,
    },
  },
  educator: {
    id: "educator",
    name: "Educator",
    description: "Tools for teaching and creating educational content",
    recommendedExamples: [
      "homework-helper",
      "notes-summarizer",
      "sentiment-analyzer",
    ],
    simplifiedUI: false,
    safetyRestrictions: [
      "Educational use only",
      "No commercial deployment",
    ],
    creditLimits: {
      daily: 200,
      monthly: 1000,
    },
    features: {
      cloudTraining: true,
      deployment: false,
      advancedModels: true,
    },
  },
  researcher: {
    id: "researcher",
    name: "Researcher",
    description: "Advanced tools for research and experimentation",
    recommendedExamples: [
      "document-analyzer",
      "image-classifier",
      "sentiment-analyzer",
    ],
    simplifiedUI: false,
    safetyRestrictions: [],
    creditLimits: {
      daily: 500,
      monthly: 5000,
    },
    features: {
      cloudTraining: true,
      deployment: true,
      advancedModels: true,
    },
  },
};

export function getAudienceProfile(audienceId: string): AudienceProfile | undefined {
  return audienceProfiles[audienceId];
}

export function getAllAudiences(): AudienceProfile[] {
  return Object.values(audienceProfiles);
}

