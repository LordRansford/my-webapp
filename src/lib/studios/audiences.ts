/**
 * Audience Profile System
 * 
 * Defines audience profiles with feature flags and UI customizations
 */

export type AudienceType = "enterprise" | "professional" | "student" | "child";

export interface AudienceProfile {
  id: AudienceType;
  label: string;
  description: string;
  features: {
    teamCollaboration: boolean;
    exportCapabilities: boolean;
    complianceTools: boolean;
    advancedFeatures: boolean;
    realCredentials: boolean;
    computeLimits: {
      daily: number;
      perOperation: number;
    };
    uiSimplification: {
      simplifiedNavigation: boolean;
      visualAids: boolean;
      reducedOptions: boolean;
      largeButtons: boolean;
    };
    restrictions: {
      preApprovedTemplatesOnly: boolean;
      noRealData: boolean;
      noExternalConnections: boolean;
      parentalControls: boolean;
    };
  };
  recommendedStudios: string[];
  color: string;
}

export const AUDIENCE_PROFILES: Record<AudienceType, AudienceProfile> = {
  enterprise: {
    id: "enterprise",
    label: "Enterprise",
    description: "Advanced features, team collaboration, compliance tools",
    features: {
      teamCollaboration: true,
      exportCapabilities: true,
      complianceTools: true,
      advancedFeatures: true,
      realCredentials: true,
      computeLimits: {
        daily: 1000000, // 10,000 seconds
        perOperation: 10000 // 100 seconds
      },
      uiSimplification: {
        simplifiedNavigation: false,
        visualAids: false,
        reducedOptions: false,
        largeButtons: false
      },
      restrictions: {
        preApprovedTemplatesOnly: false,
        noRealData: false,
        noExternalConnections: false,
        parentalControls: false
      }
    },
    recommendedStudios: ["dev", "cyber", "data"],
    color: "indigo"
  },
  professional: {
    id: "professional",
    label: "Professional",
    description: "Full feature access, standard limits, export capabilities",
    features: {
      teamCollaboration: false,
      exportCapabilities: true,
      complianceTools: false,
      advancedFeatures: true,
      realCredentials: true,
      computeLimits: {
        daily: 100000, // 1,000 seconds
        perOperation: 1000 // 10 seconds
      },
      uiSimplification: {
        simplifiedNavigation: false,
        visualAids: false,
        reducedOptions: false,
        largeButtons: false
      },
      restrictions: {
        preApprovedTemplatesOnly: false,
        noRealData: false,
        noExternalConnections: false,
        parentalControls: false
      }
    },
    recommendedStudios: ["dev", "ai", "architecture"],
    color: "blue"
  },
  student: {
    id: "student",
    label: "Student",
    description: "Learning-focused features, educational discounts, progress tracking",
    features: {
      teamCollaboration: false,
      exportCapabilities: true,
      complianceTools: false,
      advancedFeatures: false,
      realCredentials: false,
      computeLimits: {
        daily: 30000, // 300 seconds
        perOperation: 500 // 5 seconds
      },
      uiSimplification: {
        simplifiedNavigation: true,
        visualAids: true,
        reducedOptions: true,
        largeButtons: false
      },
      restrictions: {
        preApprovedTemplatesOnly: true,
        noRealData: true,
        noExternalConnections: false,
        parentalControls: false
      }
    },
    recommendedStudios: ["ai", "dev", "architecture"],
    color: "emerald"
  },
  child: {
    id: "child",
    label: "Child",
    description: "Simplified UI, safe sandbox, visual learning aids",
    features: {
      teamCollaboration: false,
      exportCapabilities: false,
      complianceTools: false,
      advancedFeatures: false,
      realCredentials: false,
      computeLimits: {
        daily: 10000, // 100 seconds
        perOperation: 200 // 2 seconds
      },
      uiSimplification: {
        simplifiedNavigation: true,
        visualAids: true,
        reducedOptions: true,
        largeButtons: true
      },
      restrictions: {
        preApprovedTemplatesOnly: true,
        noRealData: true,
        noExternalConnections: true,
        parentalControls: true
      }
    },
    recommendedStudios: ["ai", "dev", "architecture"],
    color: "yellow"
  }
};

export function getAudienceProfile(audience: AudienceType): AudienceProfile {
  return AUDIENCE_PROFILES[audience];
}

export function getDefaultAudience(): AudienceType {
  // In production, this would check user preferences or account settings
  if (typeof window === "undefined") return "professional";
  const saved = localStorage.getItem("studio-audience");
  if (saved && saved in AUDIENCE_PROFILES) {
    return saved as AudienceType;
  }
  return "professional";
}

export function setAudience(audience: AudienceType): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("studio-audience", audience);
}

export function canUseFeature(audience: AudienceType, feature: keyof AudienceProfile["features"]): boolean {
  const profile = getAudienceProfile(audience);
  return profile.features[feature] as boolean;
}

export function getComputeLimit(audience: AudienceType, type: "daily" | "perOperation"): number {
  const profile = getAudienceProfile(audience);
  return profile.features.computeLimits[type];
}

