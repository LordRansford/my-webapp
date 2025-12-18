// src/sections/cyberSectionManifest.ts

export type CyberSectionLevel = "foundations" | "applied" | "practice" | "summary";

export type CyberSectionTool = {
  id: string;
  title: string;
  type: "lab" | "game" | "quiz" | "exercise";
};

export type CyberSectionMeta = {
  id: string;
  slug: string;
  title: string;
  level: CyberSectionLevel;
  estimatedTime: number;
  shortDescription: string;
  dependencies: string[];
  tools: CyberSectionTool[];
};

export const cyberSectionManifest: CyberSectionMeta[] = [
  {
    id: "foundations-why-cyber-matters",
    slug: "/cybersecurity/beginner#foundations-why-cyber-matters",
    title: "Why cybersecurity matters in real life",
    level: "foundations",
    estimatedTime: 15,
    shortDescription:
      "Set the purpose and the human impact so the rest of the course stays grounded in real outcomes.",
    dependencies: [],
    tools: [{ id: "risk-dial", title: "Risk dial", type: "exercise" }],
  },
  {
    id: "foundations-data-and-bits",
    slug: "/cybersecurity/beginner#foundations-data-and-bits",
    title: "Data, bits and how information lives in a computer",
    level: "foundations",
    estimatedTime: 20,
    shortDescription:
      "Understand bits, bytes and encoding so data integrity and storage risks make sense.",
    dependencies: ["foundations-why-cyber-matters"],
    tools: [{ id: "bit-visualiser", title: "Play with bits and bytes", type: "lab" }],
  },
  {
    id: "foundations-networks-and-packets",
    slug: "/cybersecurity/beginner#foundations-networks-and-packets",
    title: "How data travels on networks",
    level: "foundations",
    estimatedTime: 20,
    shortDescription:
      "See packets, headers and metadata so you can reason about exposure and control points.",
    dependencies: ["foundations-data-and-bits"],
    tools: [
      { id: "packet-journey-lab", title: "Follow a packet", type: "lab" },
      { id: "metadata-leak-lab", title: "Metadata leak explorer", type: "lab" },
    ],
  },
  {
    id: "foundations-cia-and-simple-attacks",
    slug: "/cybersecurity/beginner#foundations-cia-and-simple-attacks",
    title: "Confidentiality, integrity, availability and simple attacks",
    level: "foundations",
    estimatedTime: 15,
    shortDescription:
      "Connect CIA to common mistakes so controls feel like decisions, not rules.",
    dependencies: ["foundations-networks-and-packets"],
    tools: [
      { id: "password-strength-lab", title: "Try building stronger passwords", type: "exercise" },
      { id: "cia-tradeoff-lab", title: "CIA trade off explorer", type: "exercise" },
    ],
  },
  {
    id: "applied-threat-modelling",
    slug: "/cybersecurity/intermediate#applied-threat-modelling",
    title: "Threat modelling and attacker thinking",
    level: "applied",
    estimatedTime: 20,
    shortDescription:
      "Map assets, threats and entry points so you can place controls where they matter.",
    dependencies: ["foundations-cia-and-simple-attacks"],
    tools: [{ id: "threat-model-canvas", title: "Sketch a simple threat model", type: "lab" }],
  },
  {
    id: "applied-attack-surfaces",
    slug: "/cybersecurity/intermediate#applied-attack-surfaces",
    title: "Attack surfaces and common failure classes",
    level: "applied",
    estimatedTime: 20,
    shortDescription:
      "Learn how exposure grows and why predictable failure patterns keep repeating.",
    dependencies: ["applied-threat-modelling"],
    tools: [{ id: "attack-surface-explorer", title: "Explore attack surfaces", type: "lab" }],
  },
  {
    id: "applied-auth-sessions-access",
    slug: "/cybersecurity/intermediate#applied-auth-sessions-access",
    title: "Authentication, sessions and access control",
    level: "applied",
    estimatedTime: 20,
    shortDescription:
      "Follow sessions and permissions so you can spot misuse and enforce least privilege.",
    dependencies: ["applied-attack-surfaces"],
    tools: [
      { id: "session-flow-sandbox", title: "Follow a session through a web app", type: "lab" },
      { id: "session-hijack-demo", title: "See session hijacking in action", type: "lab" },
    ],
  },
  {
    id: "applied-logging-and-risk",
    slug: "/cybersecurity/intermediate#applied-logging-and-risk",
    title: "Logging, monitoring and risk thinking",
    level: "applied",
    estimatedTime: 20,
    shortDescription:
      "Practice detection, alerting and risk trade offs to reduce time to respond.",
    dependencies: ["applied-auth-sessions-access"],
    tools: [
      { id: "log-triage-lab", title: "Practice spotting important events in logs", type: "lab" },
      { id: "risk-tradeoff-lab", title: "Play with risk trade offs", type: "exercise" },
    ],
  },
  {
    id: "advanced-crypto-practice",
    slug: "/cybersecurity/advanced#advanced-crypto-practice",
    title: "Cryptography in practice",
    level: "practice",
    estimatedTime: 25,
    shortDescription:
      "Connect key exchange, certificates and safe configuration to real deployment choices.",
    dependencies: ["applied-logging-and-risk"],
    tools: [
      { id: "tls-handshake-lab", title: "Explore a TLS handshake", type: "lab" },
      { id: "crypto-misuse-checker", title: "Spot bad crypto choices", type: "exercise" },
    ],
  },
  {
    id: "advanced-secure-architecture",
    slug: "/cybersecurity/advanced#advanced-secure-architecture",
    title: "Secure architecture and zero trust thinking",
    level: "practice",
    estimatedTime: 25,
    shortDescription:
      "Design with boundaries, layers and least privilege so breaches stay contained.",
    dependencies: ["advanced-crypto-practice"],
    tools: [
      { id: "zero-trust-map", title: "Map trust boundaries in a simple system", type: "lab" },
      { id: "defence-in-depth-planner", title: "Plan layered defences", type: "exercise" },
    ],
  },
  {
    id: "advanced-detection-response",
    slug: "/cybersecurity/advanced#advanced-detection-response",
    title: "Detection, response and threat hunting",
    level: "practice",
    estimatedTime: 25,
    shortDescription:
      "Build a response rhythm and learn how to turn signals into action.",
    dependencies: ["advanced-secure-architecture"],
    tools: [
      { id: "incident-timeline-lab", title: "Build an incident timeline", type: "lab" },
      { id: "threat-hunting-sandbox", title: "Practice a small threat hunt", type: "lab" },
    ],
  },
  {
    id: "advanced-governance-career",
    slug: "/cybersecurity/advanced#advanced-governance-career",
    title: "Governance, frameworks and your career",
    level: "practice",
    estimatedTime: 15,
    shortDescription:
      "Connect risk, evidence and accountability to the way real teams operate.",
    dependencies: ["advanced-detection-response"],
    tools: [
      { id: "framework-mapper", title: "Map controls to frameworks", type: "exercise" },
      { id: "security-career-planner", title: "Sketch your security learning path", type: "exercise" },
    ],
  },
  {
    id: "cyber-summary",
    slug: "/cybersecurity/summary",
    title: "Summary, games and next steps",
    level: "summary",
    estimatedTime: 45,
    shortDescription:
      "Recap the journey, play assessment games, and pick next steps to practice.",
    dependencies: ["advanced-governance-career"],
    tools: [
      { id: "crypto_misuse", title: "Hash, encrypt or sign", type: "game" },
      { id: "trust_boundary", title: "Spot the trust boundary", type: "game" },
      { id: "logging_blind_spot", title: "The silent logging failure", type: "game" },
      { id: "privilege_escalation", title: "Privilege escalation quick play", type: "game" },
    ],
  },
];
