/**
 * Cyber Studio Example Scenarios
 * 
 * Pre-built security scenarios for the Cyber Studio
 */

export interface CyberStudioExample {
  id: string;
  title: string;
  description: string;
  category: "threat-modeling" | "risk-assessment" | "compliance" | "incident-response" | "security-architecture";
  difficulty: "beginner" | "intermediate" | "advanced";
  scenario: string;
  threats: string[];
  controls: string[];
  complianceFrameworks: string[];
  estimatedTime: string;
  credits: number;
}

export const cyberExamples: CyberStudioExample[] = [
  {
    id: "ecommerce-security",
    title: "E-commerce Security Assessment",
    description: "Comprehensive security assessment for an online store",
    category: "threat-modeling",
    difficulty: "intermediate",
    scenario: "An e-commerce platform handling customer payments and personal data",
    threats: [
      "Payment card data theft",
      "Account takeover",
      "DDoS attacks",
      "SQL injection",
      "Cross-site scripting (XSS)"
    ],
    controls: [
      "PCI DSS compliance",
      "Multi-factor authentication",
      "Rate limiting",
      "Input validation",
      "Content Security Policy"
    ],
    complianceFrameworks: ["PCI DSS", "GDPR", "SOC 2"],
    estimatedTime: "2-3 days",
    credits: 300
  },
  {
    id: "api-security",
    title: "API Security Assessment",
    description: "Security assessment for a public API",
    category: "threat-modeling",
    difficulty: "intermediate",
    scenario: "A public REST API serving multiple clients",
    threats: [
      "API key theft",
      "Rate limit bypass",
      "Injection attacks",
      "Unauthorized access",
      "Data exposure"
    ],
    controls: [
      "API authentication",
      "Rate limiting",
      "Input validation",
      "Authorization checks",
      "Encryption in transit"
    ],
    complianceFrameworks: ["OWASP API Security"],
    estimatedTime: "1-2 days",
    credits: 200
  },
  {
    id: "gdpr-compliance",
    title: "GDPR Compliance Assessment",
    description: "GDPR compliance gap analysis",
    category: "compliance",
    difficulty: "advanced",
    scenario: "A SaaS platform processing EU customer data",
    threats: [
      "Data breach",
      "Unauthorized access",
      "Data retention violations",
      "Consent management failures"
    ],
    controls: [
      "Data encryption",
      "Access controls",
      "Data retention policies",
      "Consent management",
      "Right to erasure"
    ],
    complianceFrameworks: ["GDPR", "ISO 27001"],
    estimatedTime: "3-5 days",
    credits: 500
  },
  {
    id: "cloud-security",
    title: "Cloud Security Architecture",
    description: "Design secure cloud infrastructure",
    category: "security-architecture",
    difficulty: "advanced",
    scenario: "Multi-cloud deployment with sensitive data",
    threats: [
      "Misconfigured cloud resources",
      "Unauthorized access",
      "Data leakage",
      "Account compromise"
    ],
    controls: [
      "Identity and access management",
      "Network segmentation",
      "Encryption at rest",
      "Cloud security monitoring",
      "Backup and recovery"
    ],
    complianceFrameworks: ["CIS Benchmarks", "NIST CSF"],
    estimatedTime: "4-6 days",
    credits: 600
  },
  {
    id: "incident-response",
    title: "Incident Response Playbook",
    description: "Create incident response procedures",
    category: "incident-response",
    difficulty: "intermediate",
    scenario: "Security incident response for a web application",
    threats: [
      "Data breach",
      "Malware infection",
      "Unauthorized access",
      "DDoS attack"
    ],
    controls: [
      "Incident detection",
      "Containment procedures",
      "Evidence collection",
      "Recovery procedures",
      "Post-incident review"
    ],
    complianceFrameworks: ["NIST SP 800-61"],
    estimatedTime: "2-3 days",
    credits: 350
  },
  {
    id: "mobile-app-security",
    title: "Mobile App Security",
    description: "Security assessment for mobile applications",
    category: "threat-modeling",
    difficulty: "intermediate",
    scenario: "Mobile app handling sensitive user data",
    threats: [
      "Reverse engineering",
      "Data interception",
      "Insecure storage",
      "Weak authentication",
      "Code injection"
    ],
    controls: [
      "Code obfuscation",
      "Certificate pinning",
      "Secure storage",
      "Biometric authentication",
      "Input validation"
    ],
    complianceFrameworks: ["OWASP Mobile Top 10"],
    estimatedTime: "2-3 days",
    credits: 300
  },
  {
    id: "supply-chain-risk",
    title: "Supply Chain Risk Assessment",
    description: "Assess security risks from third-party vendors",
    category: "risk-assessment",
    difficulty: "advanced",
    scenario: "Evaluating security posture of software vendors",
    threats: [
      "Compromised dependencies",
      "Vendor data breach",
      "Malicious code injection",
      "Weak vendor security"
    ],
    controls: [
      "Vendor security questionnaires",
      "Dependency scanning",
      "Code review",
      "Security SLAs",
      "Incident notification procedures"
    ],
    complianceFrameworks: ["ISO 27001", "SOC 2"],
    estimatedTime: "3-4 days",
    credits: 450
  },
  {
    id: "zero-trust-architecture",
    title: "Zero Trust Architecture",
    description: "Design zero trust security architecture",
    category: "security-architecture",
    difficulty: "advanced",
    scenario: "Implementing zero trust principles across the organization",
    threats: [
      "Insider threats",
      "Compromised credentials",
      "Lateral movement",
      "Privilege escalation"
    ],
    controls: [
      "Identity verification",
      "Least privilege access",
      "Micro-segmentation",
      "Continuous monitoring",
      "Device trust"
    ],
    complianceFrameworks: ["NIST Zero Trust Architecture"],
    estimatedTime: "5-7 days",
    credits: 800
  },
  {
    id: "penetration-testing",
    title: "Penetration Testing Plan",
    description: "Plan and execute penetration testing",
    category: "threat-modeling",
    difficulty: "advanced",
    scenario: "Comprehensive penetration testing of web application",
    threats: [
      "OWASP Top 10 vulnerabilities",
      "Authentication bypass",
      "Authorization flaws",
      "Business logic errors"
    ],
    controls: [
      "Vulnerability scanning",
      "Manual testing",
      "Code review",
      "Remediation tracking",
      "Retesting"
    ],
    complianceFrameworks: ["OWASP Testing Guide"],
    estimatedTime: "5-10 days",
    credits: 1000
  },
  {
    id: "data-privacy-assessment",
    title: "Data Privacy Impact Assessment",
    description: "DPIA for new data processing activities",
    category: "compliance",
    difficulty: "intermediate",
    scenario: "Assessing privacy risks for new feature processing personal data",
    threats: [
      "Unauthorized data access",
      "Data breach",
      "Privacy violations",
      "Consent issues"
    ],
    controls: [
      "Data minimization",
      "Purpose limitation",
      "Consent management",
      "Data encryption",
      "Access controls"
    ],
    complianceFrameworks: ["GDPR", "CCPA"],
    estimatedTime: "2-3 days",
    credits: 300
  }
];

export function getCyberExamplesByCategory(category: string) {
  return cyberExamples.filter(ex => ex.category === category);
}

export function getCyberExamplesByDifficulty(difficulty: string) {
  return cyberExamples.filter(ex => ex.difficulty === difficulty);
}

export function getCyberExample(id: string) {
  return cyberExamples.find(ex => ex.id === id);
}

