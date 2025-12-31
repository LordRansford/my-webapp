import { NextRequest } from "next/server";
import { createToolExecutionHandler } from "@/lib/studios/toolExecutionHelper";

type PolicyType = "access_control" | "data_protection" | "incident_response" | "password" | "network_security" | "acceptable_use";
type PolicySection = "purpose" | "scope" | "policy" | "enforcement" | "review";

interface PolicySectionContent {
  id: string;
  section: PolicySection;
  content: string;
}

interface Policy {
  name: string;
  type: PolicyType;
  sections: PolicySectionContent[];
}

const policyTemplates: Record<PolicyType, Record<PolicySection, string>> = {
  access_control: {
    purpose: "This policy defines the access control requirements for all information systems and data resources.",
    scope: "This policy applies to all employees, contractors, and third parties who access organizational information systems.",
    policy: "Access to information systems shall be granted based on the principle of least privilege. All access requests must be approved by the appropriate authority.",
    enforcement: "Violations of this policy may result in disciplinary action, up to and including termination of employment.",
    review: "This policy shall be reviewed annually or when significant changes occur in the organization's structure or technology.",
  },
  data_protection: {
    purpose: "This policy establishes requirements for protecting sensitive and confidential data.",
    scope: "This policy applies to all data classified as confidential, restricted, or containing personal information.",
    policy: "All sensitive data must be encrypted at rest and in transit. Data access must be logged and monitored.",
    enforcement: "Non-compliance with this policy may result in legal action and disciplinary measures.",
    review: "This policy shall be reviewed annually to ensure compliance with applicable regulations.",
  },
  incident_response: {
    purpose: "This policy defines the procedures for responding to security incidents.",
    scope: "This policy applies to all security incidents affecting organizational information systems or data.",
    policy: "All security incidents must be reported immediately to the security team. Response procedures must be followed as defined in the incident response playbook.",
    enforcement: "Failure to report incidents in a timely manner may result in disciplinary action.",
    review: "This policy shall be reviewed after each major incident and updated as necessary.",
  },
  password: {
    purpose: "This policy establishes password requirements and management procedures.",
    scope: "This policy applies to all passwords used to access organizational information systems.",
    policy: "Passwords must be at least 12 characters long, contain uppercase, lowercase, numbers, and special characters. Passwords must be changed every 90 days.",
    enforcement: "Accounts with non-compliant passwords may be disabled until compliance is achieved.",
    review: "This policy shall be reviewed annually to align with current security best practices.",
  },
  network_security: {
    purpose: "This policy defines network security requirements and controls.",
    scope: "This policy applies to all network infrastructure and network-connected devices.",
    policy: "All network traffic must be monitored and logged. Firewalls must be configured according to security standards. Unauthorized network access is prohibited.",
    enforcement: "Violations of network security policies may result in immediate termination of network access.",
    review: "This policy shall be reviewed annually or when network infrastructure changes occur.",
  },
  acceptable_use: {
    purpose: "This policy defines acceptable use of organizational information systems and resources.",
    scope: "This policy applies to all users of organizational information systems, including employees, contractors, and third parties.",
    policy: "Information systems shall be used only for authorized business purposes. Prohibited activities include unauthorized access, data theft, and system disruption.",
    enforcement: "Violations of this policy may result in disciplinary action, legal action, or termination of access.",
    review: "This policy shall be reviewed annually to ensure it remains current with organizational needs and legal requirements.",
  },
};

function validatePolicy(policy: Policy): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!policy.name || policy.name.trim() === "") {
    errors.push("Policy name cannot be empty");
  }

  const requiredSections: PolicySection[] = ["purpose", "scope", "policy", "enforcement", "review"];
  const presentSections = new Set(policy.sections?.map((s) => s.section) || []);

  requiredSections.forEach((section) => {
    if (!presentSections.has(section)) {
      errors.push(`Required section missing: ${section}`);
    }
  });

  policy.sections?.forEach((section) => {
    if (!section.content || section.content.trim() === "") {
      warnings.push(`Section "${section.section}" is empty`);
    }

    if (section.content && section.content.length < 50) {
      warnings.push(`Section "${section.section}" is very short (${section.content.length} characters)`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

function generatePolicyDocument(policy: Policy): string {
  let doc = `POLICY DOCUMENT\n`;
  doc += `================\n\n`;
  doc += `Policy Name: ${policy.name}\n`;
  doc += `Policy Type: ${policy.type.replace(/_/g, " ").toUpperCase()}\n`;
  doc += `Generated: ${new Date().toISOString()}\n\n`;
  doc += `TABLE OF CONTENTS\n`;
  doc += `==================\n`;

  const sectionOrder: PolicySection[] = ["purpose", "scope", "policy", "enforcement", "review"];
  sectionOrder.forEach((sectionType, index) => {
    const section = policy.sections?.find((s) => s.section === sectionType);
    if (section) {
      doc += `${index + 1}. ${sectionType.charAt(0).toUpperCase() + sectionType.slice(1).replace(/_/g, " ")}\n`;
    }
  });

  doc += `\n\n`;

  sectionOrder.forEach((sectionType) => {
    const section = policy.sections?.find((s) => s.section === sectionType);
    if (section && section.content) {
      doc += `${sectionType.charAt(0).toUpperCase() + sectionType.slice(1).replace(/_/g, " ").toUpperCase()}\n`;
      doc += `${"=".repeat(sectionType.length)}\n\n`;
      doc += `${section.content}\n\n`;
    }
  });

  doc += `\n--- END OF POLICY DOCUMENT ---\n`;
  return doc;
}

function getComplianceFrameworks(policyType: PolicyType): string[] {
  const frameworks: Record<PolicyType, string[]> = {
    access_control: ["ISO 27001", "NIST CSF", "SOC 2"],
    data_protection: ["GDPR", "CCPA", "HIPAA", "ISO 27001"],
    incident_response: ["NIST CSF", "ISO 27035", "CIS Controls"],
    password: ["NIST 800-63B", "ISO 27001", "CIS Controls"],
    network_security: ["NIST CSF", "ISO 27001", "PCI DSS"],
    acceptable_use: ["ISO 27001", "SOC 2"],
  };

  return frameworks[policyType] || [];
}

export const POST = createToolExecutionHandler({
  toolId: "cyber-studio-policy-generator",
  executeTool: async (userId, body) => {
    const executionStart = Date.now();

    const policy: Policy = {
      name: body.policyName || body.name || "Security Policy",
      type: body.policyType || body.type || "access_control",
      sections: body.sections || [],
    };

    // If sections are empty, load template
    if (!policy.sections || policy.sections.length === 0) {
      const template = policyTemplates[policy.type];
      policy.sections = [
        { id: "1", section: "purpose", content: template.purpose },
        { id: "2", section: "scope", content: template.scope },
        { id: "3", section: "policy", content: template.policy },
        { id: "4", section: "enforcement", content: template.enforcement },
        { id: "5", section: "review", content: template.review },
      ];
    }

    // Validate policy
    const validation = validatePolicy(policy);

    if (!validation.valid) {
      return {
        result: {
          success: false,
          errors: validation.errors,
          warnings: validation.warnings,
          policy,
        },
        actualUsage: {
          cpuMs: Date.now() - executionStart,
          memMb: 140,
          durationMs: Date.now() - executionStart,
        },
      };
    }

    // Generate policy document
    const policyDocument = generatePolicyDocument(policy);
    const complianceFrameworks = getComplianceFrameworks(policy.type);

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 250));

    return {
      result: {
        success: true,
        policy: {
          name: policy.name,
          type: policy.type,
          sections: policy.sections,
          document: policyDocument,
          complianceFrameworks,
          validation: {
            valid: true,
            warnings: validation.warnings,
          },
          toolId: "cyber-studio-policy-generator",
          timestamp: new Date().toISOString(),
        },
      },
      actualUsage: {
        cpuMs: Date.now() - executionStart,
        memMb: 140,
        durationMs: Date.now() - executionStart,
      },
    };
  },
});
