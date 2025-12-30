"use client";

import React from "react";
import { Shield, Target, AlertTriangle, FileCheck, Lock, Eye, BarChart3 } from "lucide-react";
import { OnboardingStep } from "@/components/studios/OnboardingFlow";

export const cyberStudioOnboardingSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to Cyber Studio",
    content: (
      <div className="space-y-4">
        <p>
          Cyber Studio is your workspace for building secure systems and protecting applications from security threats. 
          Here, you can assess threats, track risks, ensure compliance, and protect your systems.
        </p>
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-lg">
          <p className="text-sm font-semibold text-rose-900 mb-2">What you can do here:</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-rose-800">
            <li>Identify security threats to your systems</li>
            <li>Track and manage security risks</li>
            <li>Check compliance with security rules</li>
            <li>Create plans for responding to security problems</li>
            <li>Design secure system structures</li>
            <li>Find security weaknesses in your code</li>
          </ul>
        </div>
        <p className="text-sm text-slate-600">
          <strong>Tip:</strong> If you are new to cybersecurity, start with the learning studio at 
          <code className="bg-slate-100 px-2 py-1 rounded">/cyber-studios</code> to understand the concepts first.
        </p>
      </div>
    )
  },
  {
    id: "threat-modeling",
    title: "Threat Model Generator",
    content: (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-rose-100 rounded-lg">
            <Target className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">What is Threat Modeling?</h4>
            <p className="text-sm text-slate-600">Identifying potential security threats to your system</p>
          </div>
        </div>
        <p>
          Threat modeling is like checking your house for unlocked doors before a burglar tries to break in. 
          It helps you identify potential security problems before attackers can exploit them.
        </p>
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-lg">
          <p className="text-sm font-semibold text-rose-900 mb-2">How it works:</p>
          <ol className="list-decimal list-inside space-y-1 text-sm text-rose-800">
            <li>Describe your system (what it does, who uses it)</li>
            <li>The generator identifies potential threats</li>
            <li>Review the threats and plan how to protect against them</li>
            <li>Update your threat model as your system changes</li>
          </ol>
        </div>
        <p className="text-sm text-slate-600">
          <strong>Example:</strong> Describe a website that handles user payments. The generator identifies 
          threats like "unauthorised access to payment data" or "denial of service attacks".
        </p>
      </div>
    )
  },
  {
    id: "risk-register",
    title: "Risk Register Builder",
    content: (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-amber-100 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">What is a Risk Register?</h4>
            <p className="text-sm text-slate-600">A list of security risks and plans to reduce them</p>
          </div>
        </div>
        <p>
          A risk register is like making a list of things that could go wrong and deciding which ones to fix first. 
          A risk is the chance that something bad could happen, like data being stolen or a system being hacked.
        </p>
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
          <p className="text-sm font-semibold text-amber-900 mb-2">How it works:</p>
          <ol className="list-decimal list-inside space-y-1 text-sm text-amber-800">
            <li>List all the security risks you have identified</li>
            <li>Rate each risk by how likely it is and how bad it would be</li>
            <li>Create plans to reduce or eliminate each risk</li>
            <li>Track your progress in fixing risks</li>
          </ol>
        </div>
        <p className="text-sm text-slate-600">
          <strong>Example:</strong> Add a risk like "User passwords could be stolen" with a plan to use 
          strong encryption and require two-factor authentication.
        </p>
      </div>
    )
  },
  {
    id: "compliance",
    title: "Compliance Auditor",
    content: (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <FileCheck className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">What is Compliance?</h4>
            <p className="text-sm text-slate-600">Following security rules and regulations</p>
          </div>
        </div>
        <p>
          Compliance means following rules set by governments or organisations to protect people's information. 
          It is like following traffic laws to keep everyone safe on the road.
        </p>
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="text-sm font-semibold text-blue-900 mb-2">How it works:</p>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
            <li>Select which security rules you need to follow (like GDPR or HIPAA)</li>
            <li>The auditor checks your system against these rules</li>
            <li>Review any problems it finds</li>
            <li>Fix the problems and run the audit again</li>
          </ol>
        </div>
        <p className="text-sm text-slate-600">
          <strong>Example:</strong> Run a GDPR compliance audit. The auditor checks if you are protecting 
          EU user data correctly and shows any problems that need fixing.
        </p>
      </div>
    )
  },
  {
    id: "ready",
    title: "You are Ready to Start",
    content: (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 p-6 rounded-lg text-center">
          <p className="text-lg font-semibold text-green-900 mb-2">
            You now understand the main tools in Cyber Studio
          </p>
          <p className="text-sm text-green-800">
            Remember: you can always click the help icon (?) next to any feature to learn more about it.
          </p>
        </div>
        <div className="space-y-3">
          <p><strong>Next steps:</strong></p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700">
            <li>Start with the Threat Model Generator to identify security threats</li>
            <li>Use the Risk Register Builder to track and manage risks</li>
            <li>Run compliance audits to ensure you meet security requirements</li>
            <li>Create incident response playbooks for security problems</li>
            <li>Design secure system architectures</li>
            <li>Scan for vulnerabilities regularly</li>
          </ol>
        </div>
        <p className="text-sm text-slate-600">
          <strong>Tip:</strong> Start small. Identify threats for a simple system first, then gradually 
          work with more complex systems as you become more comfortable with the tools.
        </p>
      </div>
    )
  }
];



