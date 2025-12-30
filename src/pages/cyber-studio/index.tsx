"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Shield, 
  AlertTriangle, 
  FileCheck, 
  BarChart3,
  Target,
  Lock,
  Eye,
  TrendingDown,
  Users,
  FileText
} from "lucide-react";
import StudioNavigation from "@/components/studios/StudioNavigation";
import StudioPageHeader from "@/components/studios/StudioPageHeader";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import LoadingSpinner from "@/components/ai-studio/LoadingSpinner";
import { getAudienceProfile, getDefaultAudience } from "@/lib/studios/audiences";
import HelpTooltip from "@/components/studios/HelpTooltip";
import { auditLogger, AuditActions } from "@/lib/studios/security/auditLogger";
import OnboardingFlow from "@/components/studios/OnboardingFlow";
import { cyberStudioOnboardingSteps } from "@/lib/studios/onboarding/cyber-studio-onboarding";

const tools = [
  {
    id: "threat-modeling",
    name: "Threat Model Generator",
    description: "Automated threat modeling from system descriptions",
    icon: <Target className="w-6 h-6" />,
    href: "/cyber-studio/threat-modeling",
    color: "rose",
    credits: 84
  },
  {
    id: "risk-register",
    name: "Risk Register Builder",
    description: "Comprehensive risk tracking with mitigation plans",
    icon: <AlertTriangle className="w-6 h-6" />,
    href: "/cyber-studio/risk-register",
    color: "amber",
    credits: 54
  },
  {
    id: "compliance",
    name: "Compliance Auditor",
    description: "Automated compliance gap analysis",
    icon: <FileCheck className="w-6 h-6" />,
    href: "/cyber-studio/compliance",
    color: "blue",
    credits: 750
  },
  {
    id: "ir-playbook",
    name: "Incident Response Playbook Builder",
    description: "Create and test IR procedures",
    icon: <FileText className="w-6 h-6" />,
    href: "/cyber-studio/ir-playbook",
    color: "red",
    credits: 200
  },
  {
    id: "security-architecture",
    name: "Security Architecture Designer",
    description: "Visual security architecture with attack surface mapping",
    icon: <Shield className="w-6 h-6" />,
    href: "/cyber-studio/security-architecture",
    color: "indigo",
    credits: 180
  },
  {
    id: "vulnerability-scanner",
    name: "Vulnerability Scanner",
    description: "Integration with OWASP, CVE databases",
    icon: <Eye className="w-6 h-6" />,
    href: "/cyber-studio/vulnerability-scanner",
    color: "purple",
    credits: 550
  },
  {
    id: "security-metrics",
    name: "Security Metrics Dashboard",
    description: "KPIs, KRIs, compliance scores",
    icon: <BarChart3 className="w-6 h-6" />,
    href: "/cyber-studio/metrics",
    color: "emerald",
    credits: 50
  },
  {
    id: "policy-generator",
    name: "Security Policy Generator",
    description: "Generate policies from templates",
    icon: <Lock className="w-6 h-6" />,
    href: "/cyber-studio/policy-generator",
    color: "slate",
    credits: 100
  }
];

export default function CyberStudioPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [audience, setAudience] = useState<"enterprise" | "professional" | "student" | "child">("professional");
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      setAudience(getDefaultAudience());
      setIsLoading(false);
    }
  }, []);
  
  const profile = getAudienceProfile(audience);

  useEffect(() => {
    if (!isLoading) {
      auditLogger.log(AuditActions.TOOL_OPENED, "cyber-studio", { page: "dashboard" });
    }
  }, [isLoading]);

  return (
    <SecureErrorBoundary studio="cyber-studio">
      <OnboardingFlow
        flowId="cyber-studio"
        steps={cyberStudioOnboardingSteps}
        showProgress={true}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/30 to-slate-50">
        {isLoading ? (
          <LoadingSpinner message="Loading Cyber Studio..." />
        ) : (
          <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <StudioPageHeader
              studioType="cyber"
              title="Cyber Studio"
              description="Production-ready security tools for building secure systems. Assess threats, track risks, ensure compliance, and protect your applications from security vulnerabilities."
              learnHref="/cyber-studios"
              liveHref="/cyber-studio"
              icon={<Shield className="w-6 h-6" />}
              color="rose"
            />

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="rounded-2xl bg-white border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-5 h-5 text-rose-600" />
                  <span className="text-sm font-semibold text-slate-700">Threat Models</span>
                </div>
                <p className="text-3xl font-bold text-slate-900">0</p>
                <p className="text-xs text-slate-600 mt-1">Active models</p>
              </div>
              <div className="rounded-2xl bg-white border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-semibold text-slate-700">Risks Tracked</span>
                </div>
                <p className="text-3xl font-bold text-slate-900">0</p>
                <p className="text-xs text-slate-600 mt-1">In risk register</p>
              </div>
              <div className="rounded-2xl bg-white border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingDown className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-semibold text-slate-700">Compliance Score</span>
                </div>
                <p className="text-3xl font-bold text-slate-900">--</p>
                <p className="text-xs text-slate-600 mt-1">Overall score</p>
              </div>
            </div>

            {/* Introduction */}
            <section className="mb-8 rounded-3xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Shield className="w-8 h-8 text-rose-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-900 mb-2">What is Cyber Studio?</h2>
                  <p className="text-sm text-slate-700 mb-3">
                    Cyber Studio is your workspace for building secure systems and protecting applications from security threats. 
                    Here you can assess threats, track risks, ensure compliance, and protect your systems from vulnerabilities.
                  </p>
                  <p className="text-sm text-slate-700">
                    <strong>New to cybersecurity?</strong> Start with the{" "}
                    <Link href="/cyber-studios" className="text-rose-600 hover:underline font-semibold">
                      learning studio
                    </Link>
                    {" "}to understand security concepts first. Each tool below has a help icon (?) you can click to learn more.
                  </p>
                </div>
              </div>
            </section>

            {/* Tools Grid */}
            <section className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Security Tools</h2>
                <HelpTooltip
                  title="Security Tools"
                  content={
                    <div className="space-y-4">
                      <p>
                        These tools help you build secure systems and protect applications. Each tool has a specific purpose:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-sm text-slate-700">
                        <li><strong>Threat Model Generator:</strong> Identifies potential security threats to your system</li>
                        <li><strong>Risk Register Builder:</strong> Tracks security risks and plans how to reduce them</li>
                        <li><strong>Compliance Auditor:</strong> Checks if your system meets security rules and regulations</li>
                        <li><strong>Incident Response Playbook:</strong> Creates plans for responding to security problems</li>
                        <li><strong>Security Architecture Designer:</strong> Designs secure system structures</li>
                        <li><strong>Vulnerability Scanner:</strong> Finds security weaknesses in your code</li>
                        <li><strong>Security Metrics Dashboard:</strong> Shows how secure your system is</li>
                        <li><strong>Security Policy Generator:</strong> Creates security rules and guidelines</li>
                      </ul>
                    </div>
                  }
                  examples={[
                    "Start with Threat Model Generator to identify security threats",
                    "Use Risk Register Builder to track and manage security risks",
                    "Use Compliance Auditor to check if your system meets security requirements"
                  ]}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {tools.map((tool) => {
                  const colorClasses = {
                    rose: "from-rose-500 to-rose-600",
                    amber: "from-amber-500 to-amber-600",
                    blue: "from-blue-500 to-blue-600",
                    red: "from-red-500 to-red-600",
                    indigo: "from-indigo-500 to-indigo-600",
                    purple: "from-purple-500 to-purple-600",
                    emerald: "from-emerald-500 to-emerald-600",
                    slate: "from-slate-500 to-slate-600"
                  };

                  const toolExplanations: Record<string, { whatItDoes: string; whyItMatters: string; howToUse: string[] }> = {
                    "threat-modeling": {
                      whatItDoes: "Helps you identify potential security threats to your system. A threat is something that could harm your system, like a hacker trying to break in or a virus infecting your computer.",
                      whyItMatters: "Understanding threats helps you protect your system before problems occur. It is like checking your house for unlocked doors before a burglar tries to break in.",
                      howToUse: [
                        "Describe your system (what it does, who uses it)",
                        "The generator identifies potential threats",
                        "Review the threats and plan how to protect against them",
                        "Update your threat model as your system changes"
                      ]
                    },
                    "risk-register": {
                      whatItDoes: "Helps you track security risks and plan how to reduce them. A risk is the chance that something bad could happen, like data being stolen or a system being hacked.",
                      whyItMatters: "Tracking risks helps you prioritise which security problems to fix first. It is like making a list of things that could go wrong and deciding which ones to fix first.",
                      howToUse: [
                        "List all the security risks you have identified",
                        "Rate each risk by how likely it is and how bad it would be",
                        "Create plans to reduce or eliminate each risk",
                        "Track your progress in fixing risks"
                      ]
                    },
                    "compliance": {
                      whatItDoes: "Checks if your system meets security rules and regulations. Compliance means following rules set by governments or organisations to protect people's information.",
                      whyItMatters: "Following security rules protects user data and prevents legal problems. It is like following traffic laws to keep everyone safe on the road.",
                      howToUse: [
                        "Select which security rules you need to follow (like GDPR or HIPAA)",
                        "The auditor checks your system against these rules",
                        "Review any problems it finds",
                        "Fix the problems and run the audit again"
                      ]
                    },
                    "ir-playbook": {
                      whatItDoes: "Creates plans for responding to security problems. An incident response playbook is like a step-by-step guide for what to do when something goes wrong.",
                      whyItMatters: "Having a plan helps you respond quickly and effectively when security problems occur. It is like having a fire escape plan so you know what to do if there is a fire.",
                      howToUse: [
                        "Identify different types of security problems you might face",
                        "Create step-by-step plans for each type of problem",
                        "Test your plans to make sure they work",
                        "Update your plans as you learn more"
                      ]
                    },
                    "security-architecture": {
                      whatItDoes: "Helps you design secure system structures. Security architecture is like the blueprint of a house, but for security instead of rooms.",
                      whyItMatters: "A well-designed security architecture makes it harder for attackers to break into your system. It is like building a house with strong locks and security systems.",
                      howToUse: [
                        "Design the structure of your system",
                        "Identify where security controls are needed",
                        "Map out potential attack paths",
                        "Design defences to block these attacks"
                      ]
                    },
                    "vulnerability-scanner": {
                      whatItDoes: "Finds security weaknesses in your code. A vulnerability is a weakness that attackers could use to break into your system.",
                      whyItMatters: "Finding and fixing vulnerabilities prevents attackers from breaking into your system. It is like checking your house for weak spots and fixing them before burglars find them.",
                      howToUse: [
                        "Run the scanner on your code",
                        "Review the vulnerabilities it finds",
                        "Fix the vulnerabilities using the suggestions provided",
                        "Run the scanner again to verify the fixes"
                      ]
                    },
                    "security-metrics": {
                      whatItDoes: "Shows how secure your system is using numbers and charts. Metrics help you understand if your security is getting better or worse over time.",
                      whyItMatters: "Tracking security metrics helps you see if your security efforts are working. It is like tracking your health with regular check-ups.",
                      howToUse: [
                        "View your security metrics dashboard",
                        "Review key security indicators (like number of threats, risks, vulnerabilities)",
                        "Track changes over time",
                        "Use the metrics to make decisions about security improvements"
                      ]
                    },
                    "policy-generator": {
                      whatItDoes: "Creates security rules and guidelines for your organisation. Policies are like rules that everyone must follow to keep things secure.",
                      whyItMatters: "Clear security policies help everyone understand how to keep systems secure. It is like having house rules that everyone follows to keep the house safe.",
                      howToUse: [
                        "Choose a security policy template",
                        "Customise the policy for your organisation",
                        "Review and approve the policy",
                        "Share the policy with your team"
                      ]
                    }
                  };

                  const explanation = toolExplanations[tool.id] || {
                    whatItDoes: tool.description,
                    whyItMatters: "This tool helps you build more secure systems.",
                    howToUse: ["Click 'Open' to start using this tool"]
                  };

                  return (
                    <div key={tool.id} className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${colorClasses[tool.color as keyof typeof colorClasses]} text-white`}>
                          {tool.icon}
                        </div>
                        <HelpTooltip
                          title={tool.name}
                          content={
                            <div className="space-y-4">
                              <div>
                                <h3 className="font-semibold text-slate-900 mb-2">What is this?</h3>
                                <p className="text-sm text-slate-700">{tool.description}</p>
                              </div>
                              <div>
                                <h3 className="font-semibold text-slate-900 mb-2">What does it do?</h3>
                                <p className="text-sm text-slate-700">{explanation.whatItDoes}</p>
                              </div>
                              <div>
                                <h3 className="font-semibold text-slate-900 mb-2">Why does this matter?</h3>
                                <p className="text-sm text-slate-700">{explanation.whyItMatters}</p>
                              </div>
                              <div>
                                <h3 className="font-semibold text-slate-900 mb-2">How do I use it?</h3>
                                <ol className="list-decimal list-inside space-y-1 text-sm text-slate-700">
                                  {explanation.howToUse.map((step, idx) => (
                                    <li key={idx}>{step}</li>
                                  ))}
                                </ol>
                              </div>
                            </div>
                          }
                          examples={[
                            `Use ${tool.name} to ${tool.description.toLowerCase()}`,
                            `Click 'Open' to start using ${tool.name}`
                          ]}
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">{tool.name}</h3>
                      <p className="text-sm text-slate-600 mb-4">{tool.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                          ~{tool.credits} credits
                        </span>
                      </div>
                      <Link
                        href={tool.href}
                        onClick={() => auditLogger.log(AuditActions.TOOL_OPENED, "cyber-studio", { tool: tool.id })}
                        className="block w-full text-center px-4 py-2 bg-rose-600 hover:bg-rose-700 rounded-lg text-sm font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                        aria-label={`Open ${tool.name}: ${tool.description}`}
                      >
                        Open {tool.name}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Getting Started */}
            <section className="rounded-3xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Getting Started</h2>
              <p className="text-sm text-slate-700 mb-6">
                Follow these steps to secure your systems. Each step builds on the previous one, 
                so it is best to do them in order.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-rose-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-white font-bold text-sm">
                      1
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Assess Threats</h3>
                  </div>
                  <p className="text-sm text-slate-700 mb-3">
                    Use the Threat Model Generator to identify potential security threats to your system. 
                    A threat is something that could harm your system, like a hacker trying to break in.
                  </p>
                  <p className="text-xs text-slate-600">
                    <strong>Example:</strong> Describe your website that handles user payments. The generator 
                    identifies threats like "unauthorised access to payment data" or "denial of service attacks".
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-rose-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-white font-bold text-sm">
                      2
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Track Risks</h3>
                  </div>
                  <p className="text-sm text-slate-700 mb-3">
                    Build a comprehensive risk register to track security risks and plan how to reduce them. 
                    A risk is the chance that something bad could happen, like data being stolen.
                  </p>
                  <p className="text-xs text-slate-600">
                    <strong>Example:</strong> Add a risk like "User passwords could be stolen" with a plan to 
                    use strong encryption and require two-factor authentication.
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-rose-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-white font-bold text-sm">
                      3
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Ensure Compliance</h3>
                  </div>
                  <p className="text-sm text-slate-700 mb-3">
                    Run compliance audits to check if your system meets security rules and regulations. 
                    Compliance means following rules to protect people's information.
                  </p>
                  <p className="text-xs text-slate-600">
                    <strong>Example:</strong> Run a GDPR compliance audit. The auditor checks if you are 
                    protecting EU user data correctly and shows any problems that need fixing.
                  </p>
                </div>
              </div>
            </section>

            {/* Learn More */}
            <section className="mt-8 rounded-3xl bg-gradient-to-br from-slate-50 to-rose-50 border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Need More Help?</h3>
              <div className="space-y-3 text-sm text-slate-700">
                <p>
                  <strong>New to cybersecurity?</strong> Start with the{" "}
                  <Link href="/cyber-studios" className="font-semibold text-rose-600 hover:underline">
                    learning studio
                  </Link>
                  {" "}to understand security fundamentals before building real security systems.
                </p>
                <p>
                  <strong>Not sure what a tool does?</strong> Click the help icon (?) next to any tool or feature 
                  to see detailed explanations, examples, and step-by-step instructions.
                </p>
                <p>
                  <strong>Want to see examples?</strong> Each tool includes example templates you can load and 
                  customise. This helps you understand how to use the tool effectively.
                </p>
                <p>
                  <strong>Stuck on something?</strong> Use the contextual help button (?) throughout the studio 
                  for guidance on specific features and concepts.
                </p>
              </div>
            </section>
          </div>
        )}
      </div>
    </SecureErrorBoundary>
  );
}

