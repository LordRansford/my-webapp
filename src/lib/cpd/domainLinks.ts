type DomainLink = { title: string; href: string };

type Params = {
  courseId: string;
  levelId: string;
  domain: string;
};

function key(courseId: string, levelId: string, domain: string) {
  return `${courseId}:${levelId}:${domain}`;
}

const CYBER_DOMAIN_LINKS: Record<string, DomainLink> = {
  // Foundations domains
  [key("cybersecurity", "foundations", "basics")]: {
    title: "What security is",
    href: "/cybersecurity/beginner#foundations-f0-what-security-is",
  },
  [key("cybersecurity", "foundations", "risk")]: {
    title: "Risk and outcomes",
    href: "/cybersecurity/beginner#foundations-f1-risk-and-outcomes",
  },
  [key("cybersecurity", "foundations", "crypto")]: {
    title: "Data and integrity",
    href: "/cybersecurity/beginner#foundations-f2-data-and-integrity",
  },
  [key("cybersecurity", "foundations", "network")]: {
    title: "Networks and transport",
    href: "/cybersecurity/beginner#foundations-f3-networks-and-transport",
  },
  [key("cybersecurity", "foundations", "identity")]: {
    title: "Identity and access",
    href: "/cybersecurity/beginner#foundations-f5-identity-and-access",
  },
  [key("cybersecurity", "foundations", "response")]: {
    title: "Capstone",
    href: "/cybersecurity/beginner#foundations-f8-foundations-capstone",
  },

  // Applied domains
  [key("cybersecurity", "applied", "web")]: {
    title: "Web app security",
    href: "/cybersecurity/intermediate#applied-a3-web-app-security",
  },
  [key("cybersecurity", "applied", "api")]: {
    title: "API and service security",
    href: "/cybersecurity/intermediate#applied-a4-api-and-service-security",
  },
  [key("cybersecurity", "applied", "auth")]: {
    title: "Identity and access control",
    href: "/cybersecurity/intermediate#applied-a2-identity-and-access-control",
  },
  [key("cybersecurity", "applied", "secrets")]: {
    title: "Verification and release gates",
    href: "/cybersecurity/intermediate#applied-a5-verification-and-release-gates",
  },
  [key("cybersecurity", "applied", "logging")]: {
    title: "Logging and detection basics",
    href: "/cybersecurity/intermediate#applied-a6-logging-and-detection-basics",
  },
  [key("cybersecurity", "applied", "cloud")]: {
    title: "Applied capstone",
    href: "/cybersecurity/intermediate#applied-a7-applied-capstone",
  },

  // Practice domains
  [key("cybersecurity", "practice", "sdlc")]: {
    title: "Secure SDLC",
    href: "/cybersecurity/advanced#practice-p1-secure-sdlc",
  },
  [key("cybersecurity", "practice", "zero-trust")]: {
    title: "Exposure reduction and zero trust",
    href: "/cybersecurity/advanced#practice-p2-exposure-reduction-zero-trust",
  },
  [key("cybersecurity", "practice", "runtime")]: {
    title: "Runtime and cloud security",
    href: "/cybersecurity/advanced#practice-p3-runtime-and-cloud-security",
  },
  [key("cybersecurity", "practice", "vulnerability")]: {
    title: "Vulnerability management",
    href: "/cybersecurity/advanced#practice-p5-vulnerability-management",
  },
  [key("cybersecurity", "practice", "detection")]: {
    title: "Detection and incident response",
    href: "/cybersecurity/advanced#practice-p6-detection-and-incident-response",
  },
  [key("cybersecurity", "practice", "governance")]: {
    title: "Capstone professional practice",
    href: "/cybersecurity/advanced#practice-p9-capstone-professional-practice",
  },
};

export function getDomainLink(params: Params): DomainLink | null {
  const courseId = String(params.courseId || "");
  const levelId = String(params.levelId || "");
  const domain = String(params.domain || "").trim();
  if (!courseId || !levelId || !domain) return null;
  return CYBER_DOMAIN_LINKS[key(courseId, levelId, domain)] || null;
}

