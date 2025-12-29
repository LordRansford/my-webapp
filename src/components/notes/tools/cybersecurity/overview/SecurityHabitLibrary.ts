/**
 * Cybersecurity Course Habit Library
 * Pre-defined habits aligned with the cybersecurity course content and learning objectives.
 */

export interface SecurityHabit {
  id: string;
  label: string;
  description: string;
  category: "foundations" | "intermediate" | "advanced" | "general";
  difficulty: "easy" | "medium" | "hard";
  estimatedMinutes: number;
  guardrail?: string; // Suggested guardrail to practise
}

export const SECURITY_HABITS: SecurityHabit[] = [
  // Foundations habits
  {
    id: "check-domain-before-click",
    label: "Check domain before clicking links",
    description: "Before clicking any link, verify the domain matches what you expect. Hover to see the actual URL.",
    category: "foundations",
    difficulty: "easy",
    estimatedMinutes: 2,
    guardrail: "Always verify domain matches sender and purpose",
  },
  {
    id: "verify-sender-identity",
    label: "Verify sender identity for sensitive requests",
    description: "When asked for sensitive information or actions, verify the sender through a separate channel.",
    category: "foundations",
    difficulty: "easy",
    estimatedMinutes: 3,
    guardrail: "Never trust email alone for sensitive requests",
  },
  {
    id: "use-strong-passwords",
    label: "Use strong, unique passwords",
    description: "Create passwords that are long, unique, and not reused across accounts. Use a password manager.",
    category: "foundations",
    difficulty: "easy",
    estimatedMinutes: 5,
    guardrail: "One password per account, minimum 16 characters",
  },
  {
    id: "enable-2fa",
    label: "Enable two-factor authentication",
    description: "Add an extra layer of security by enabling 2FA on important accounts.",
    category: "foundations",
    difficulty: "easy",
    estimatedMinutes: 10,
    guardrail: "2FA required for all accounts with sensitive data",
  },
  {
    id: "review-permissions",
    label: "Review app and service permissions",
    description: "Regularly review what permissions apps and services have. Revoke unnecessary access.",
    category: "foundations",
    difficulty: "medium",
    estimatedMinutes: 15,
    guardrail: "Grant minimum permissions needed for function",
  },

  // Intermediate habits
  {
    id: "inspect-email-headers",
    label: "Inspect email headers for suspicious signs",
    description: "Check email headers for mismatched sender addresses, suspicious routing, or unusual patterns.",
    category: "intermediate",
    difficulty: "medium",
    estimatedMinutes: 5,
    guardrail: "Verify SPF, DKIM, and DMARC alignment",
  },
  {
    id: "verify-certificates",
    label: "Verify SSL/TLS certificates",
    description: "Check that websites use valid certificates. Look for certificate warnings and understand what they mean.",
    category: "intermediate",
    difficulty: "medium",
    estimatedMinutes: 5,
    guardrail: "Never proceed past certificate warnings without verification",
  },
  {
    id: "assess-phishing-attempts",
    label: "Assess potential phishing attempts",
    description: "Look for urgency, poor grammar, suspicious links, and requests for credentials or sensitive data.",
    category: "intermediate",
    difficulty: "medium",
    estimatedMinutes: 3,
    guardrail: "When in doubt, verify through separate channel",
  },
  {
    id: "review-access-logs",
    label: "Review access logs weekly",
    description: "Check login attempts, unusual access patterns, and unrecognised devices accessing your accounts.",
    category: "intermediate",
    difficulty: "medium",
    estimatedMinutes: 10,
    guardrail: "Investigate any unrecognised access immediately",
  },
  {
    id: "update-software-regularly",
    label: "Keep software updated",
    description: "Apply security updates promptly. Enable automatic updates where possible.",
    category: "intermediate",
    difficulty: "easy",
    estimatedMinutes: 10,
    guardrail: "Updates applied within 48 hours of release",
  },

  // Advanced habits
  {
    id: "conduct-threat-modelling",
    label: "Conduct threat modelling for new features",
    description: "Before deploying new features, identify threats, vulnerabilities, and appropriate controls.",
    category: "advanced",
    difficulty: "hard",
    estimatedMinutes: 30,
    guardrail: "Document threats and controls before deployment",
  },
  {
    id: "review-security-controls",
    label: "Review security controls quarterly",
    description: "Assess whether security controls are effective, properly configured, and aligned with threats.",
    category: "advanced",
    difficulty: "hard",
    estimatedMinutes: 60,
    guardrail: "Controls tested and validated regularly",
  },
  {
    id: "practice-incident-response",
    label: "Practice incident response procedures",
    description: "Run through incident response scenarios. Test detection, containment, and recovery procedures.",
    category: "advanced",
    difficulty: "hard",
    estimatedMinutes: 45,
    guardrail: "Response procedures tested at least quarterly",
  },
  {
    id: "audit-third-party-access",
    label: "Audit third-party access and integrations",
    description: "Review what third-party services can access, what permissions they have, and whether access is still needed.",
    category: "advanced",
    difficulty: "medium",
    estimatedMinutes: 30,
    guardrail: "Third-party access reviewed and minimised",
  },

  // General habits
  {
    id: "question-security-assumptions",
    label: "Question security assumptions weekly",
    description: "Challenge assumptions about what is secure. Ask: 'What could go wrong?' and 'How would we detect it?'",
    category: "general",
    difficulty: "medium",
    estimatedMinutes: 15,
    guardrail: "Assumptions documented and tested",
  },
  {
    id: "share-security-lessons",
    label: "Share security lessons with team",
    description: "Discuss security incidents, near-misses, or lessons learned with your team.",
    category: "general",
    difficulty: "easy",
    estimatedMinutes: 15,
    guardrail: "Lessons documented and shared",
  },
  {
    id: "stay-informed-threats",
    label: "Stay informed about current threats",
    description: "Read security advisories, threat intelligence, and industry news relevant to your systems.",
    category: "general",
    difficulty: "easy",
    estimatedMinutes: 10,
    guardrail: "Threat awareness updated weekly",
  },
];

/**
 * Get habits by category
 */
export function getSecurityHabitsByCategory(category: SecurityHabit["category"]): SecurityHabit[] {
  return SECURITY_HABITS.filter((habit) => habit.category === category);
}

/**
 * Get habit by ID
 */
export function getSecurityHabitById(id: string): SecurityHabit | undefined {
  return SECURITY_HABITS.find((habit) => habit.id === id);
}

/**
 * Get habits by difficulty
 */
export function getSecurityHabitsByDifficulty(difficulty: SecurityHabit["difficulty"]): SecurityHabit[] {
  return SECURITY_HABITS.filter((habit) => habit.difficulty === difficulty);
}

