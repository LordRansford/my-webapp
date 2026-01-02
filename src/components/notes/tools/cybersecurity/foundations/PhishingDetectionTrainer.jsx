"use client";

import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";
import { useState } from "react";

const PHISHING_EXAMPLES = [
  {
    id: 1,
    from: "security@paypa1-support.com",
    subject: "Urgent: Account Suspended - Verify Now",
    body: "Your PayPal account has been temporarily suspended due to unusual activity. Click here to verify your identity within 24 hours or your account will be permanently closed.",
    link: "http://paypa1-verify.com/secure",
    isPhishing: true,
    indicators: [
      "Spoofed domain (paypa1 with number 1, not paypal)",
      "Creates urgency and fear (suspended, 24 hours)",
      "Suspicious link domain doesn't match PayPal",
      "Poor grammar in URL",
    ],
  },
  {
    id: 2,
    from: "noreply@amazon.com",
    subject: "Your Order #1234567890 Has Shipped",
    body: "Good news! Your recent order has been shipped and will arrive within 3-5 business days. Track your package using the link below.",
    link: "https://www.amazon.com/orders",
    isPhishing: false,
    indicators: [
      "Legitimate Amazon domain",
      "No urgency or threats",
      "Matches expected email format",
      "HTTPS secure link to official site",
    ],
  },
  {
    id: 3,
    from: "IT.Department@company-support.net",
    subject: "Mandatory: Password Reset Required",
    body: "Our IT team has detected a security breach. All employees must reset passwords immediately. Use this secure portal: http://company-portal-reset.net/login",
    link: "http://company-portal-reset.net/login",
    isPhishing: true,
    indicators: [
      "Unusual sender domain (not official company domain)",
      "No HTTP**S** - link is insecure",
      "Creates false urgency (security breach)",
      "External domain for internal process",
    ],
  },
  {
    id: 4,
    from: "rewards@microsoftonline.com",
    subject: "You've Won a Free Xbox Series X!",
    body: "Congratulations! You've been selected as a winner in our annual giveaway. Claim your prize now by entering your shipping details and credit card for $1 verification.",
    link: "http://microsoft-rewards-claim.org/winner",
    isPhishing: true,
    indicators: [
      "Unexpected prize (you didn't enter a contest)",
      "Asks for credit card for 'verification'",
      "Wrong domain (microsoft-rewards-claim.org)",
      "Too good to be true offer",
    ],
  },
  {
    id: 5,
    from: "billing@netflix.com",
    subject: "Payment Failed - Update Billing Info",
    body: "We were unable to process your payment. Please update your billing information to avoid service interruption.",
    link: "https://www.netflix.com/account",
    isPhishing: false,
    indicators: [
      "Legitimate Netflix domain",
      "Matches expected billing notification",
      "Secure HTTPS link to official site",
      "Professional tone and formatting",
    ],
  },
  {
    id: 6,
    from: "ceo@company.com",
    subject: "Urgent Wire Transfer Needed",
    body: "I'm in a meeting and need you to send a wire transfer of $50,000 to our new vendor immediately. Details attached. Don't tell anyone - confidential deal.",
    link: null,
    isPhishing: true,
    indicators: [
      "CEO fraud / Business Email Compromise",
      "Unusual request without proper process",
      "Demands secrecy ('Don't tell anyone')",
      "Creates urgency to bypass controls",
    ],
  },
  {
    id: 7,
    from: "alerts@bankofamerica.com",
    subject: "Suspicious Activity Detected",
    body: "We detected a $500 charge at an unusual location. If this wasn't you, please call 1-800-XXX-XXXX immediately or login to review.",
    link: "https://www.bankofamerica.com/alerts",
    isPhishing: false,
    indicators: [
      "Legitimate bank domain",
      "Provides phone number (verify independently)",
      "Secure HTTPS official website link",
      "Reasonable security notification format",
    ],
  },
  {
    id: 8,
    from: "support@app1e-icloud.com",
    subject: "iCloud Storage Full - Upgrade Now 50% Off",
    body: "Your iCloud storage is 98% full. Upgrade today and get 50% off. Limited time offer! Click here to claim your discount.",
    link: "http://app1e-icloud-upgrade.com/offer",
    isPhishing: true,
    indicators: [
      "Spoofed domain (app1e with number 1, not apple)",
      "Creates false urgency (limited time)",
      "Insecure HTTP link",
      "Suspicious domain for Apple service",
    ],
  },
];

export default function PhishingDetectionTrainer() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "phishing-detection-trainer",
    initial_state: { 
      currentIndex: 0,
      answers: {},
      showFeedback: {},
      score: 0,
      completed: 0,
    },
  });

  if (!is_ready) return <p className="text-sm text-gray-600">Loading...</p>;

  const currentIndex = state.currentIndex || 0;
  const answers = state.answers || {};
  const showFeedback = state.showFeedback || {};
  const email = PHISHING_EXAMPLES[currentIndex];
  const totalEmails = PHISHING_EXAMPLES.length;
  const answered = Object.keys(answers).length;
  const correct = Object.values(answers).filter(a => a.correct).length;
  const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;

  function handleAnswer(isPhishing) {
    const correct = isPhishing === email.isPhishing;
    const newAnswers = {
      ...answers,
      [email.id]: { answer: isPhishing, correct, emailId: email.id },
    };
    const newShowFeedback = { ...showFeedback, [email.id]: true };
    
    set_state({
      ...state,
      answers: newAnswers,
      showFeedback: newShowFeedback,
    });
  }

  function nextEmail() {
    if (currentIndex < totalEmails - 1) {
      set_state({
        ...state,
        currentIndex: currentIndex + 1,
      });
    }
  }

  function previousEmail() {
    if (currentIndex > 0) {
      set_state({
        ...state,
        currentIndex: currentIndex - 1,
      });
    }
  }

  const hasAnswered = !!answers[email.id];
  const showingFeedback = !!showFeedback[email.id];

  return (
    <div className="space-y-4 text-sm">
      <div className="flex justify-between items-center p-3 bg-slate-100 rounded-lg">
        <div>
          <div className="font-semibold">Email {currentIndex + 1} of {totalEmails}</div>
          <div className="text-xs text-slate-600">Accuracy: {accuracy}% ({correct}/{answered} correct)</div>
        </div>
        <div className={`text-2xl font-bold ${accuracy >= 90 ? 'text-green-600' : accuracy >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
          {accuracy}%
        </div>
      </div>

      {accuracy >= 90 && answered === totalEmails && (
        <div className="p-4 bg-green-50 border border-green-300 rounded-lg">
          <div className="font-semibold text-green-900 mb-1">🎉 Excellent! You&apos;ve reached 90% accuracy</div>
          <p className="text-xs text-green-800">
            You&apos;ve demonstrated strong phishing detection skills. In real-world scenarios, always verify suspicious emails through alternative channels before taking action.
          </p>
        </div>
      )}

      <div className="border border-slate-300 rounded-lg overflow-hidden">
        {/* Email Header */}
        <div className="bg-slate-50 p-3 border-b border-slate-300">
          <div className="space-y-1 text-xs">
            <div className="flex gap-2">
              <span className="font-semibold min-w-16">From:</span>
              <span className="font-mono">{email.from}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold min-w-16">Subject:</span>
              <span>{email.subject}</span>
            </div>
          </div>
        </div>

        {/* Email Body */}
        <div className="p-4 bg-white">
          <p className="text-sm text-slate-800 leading-relaxed">{email.body}</p>
          
          {email.link && (
            <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
              <div className="text-xs text-slate-600 mb-1">Link:</div>
              <div className="font-mono text-xs text-blue-700 break-all">{email.link}</div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {!hasAnswered && (
          <div className="p-4 bg-slate-50 border-t border-slate-300 flex gap-3">
            <button
              onClick={() => handleAnswer(true)}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition"
            >
              🎣 Phishing
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition"
            >
              ✓ Legitimate
            </button>
          </div>
        )}

        {/* Feedback */}
        {hasAnswered && showingFeedback && (
          <div className={`p-4 border-t ${answers[email.id].correct ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
            <div className={`font-semibold mb-2 ${answers[email.id].correct ? 'text-green-900' : 'text-red-900'}`}>
              {answers[email.id].correct ? '✓ Correct!' : '✗ Incorrect'}
            </div>
            
            <div className="text-xs space-y-1 mb-3">
              <div className="font-semibold">
                This email is: {email.isPhishing ? '🎣 Phishing' : '✓ Legitimate'}
              </div>
            </div>

            <div className="text-xs">
              <div className="font-semibold mb-1">Key Indicators:</div>
              <ul className="space-y-1 ml-4">
                {email.indicators.map((indicator, i) => (
                  <li key={i} className="list-disc">{indicator}</li>
                ))}
              </ul>
            </div>

            {!answers[email.id].correct && (
              <div className="mt-3 p-2 bg-yellow-50 border border-yellow-300 rounded">
                <p className="text-xs text-yellow-800">
                  <strong>Learning point:</strong> {email.isPhishing 
                    ? "Always verify sender domains, check for urgency tactics, and inspect links before clicking."
                    : "Legitimate emails use official domains, HTTPS links, and don't create false urgency. When in doubt, contact the company directly."
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={previousEmail}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md font-medium hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>
        
        <div className="text-xs text-slate-600">
          {hasAnswered ? "Reviewed" : "Not yet answered"}
        </div>
        
        <button
          onClick={nextEmail}
          disabled={currentIndex === totalEmails - 1}
          className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md font-medium hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>

      {/* Summary */}
      {answered === totalEmails && (
        <div className="p-4 bg-blue-50 border border-blue-300 rounded-lg">
          <div className="font-semibold text-blue-900 mb-2">Training Complete</div>
          <p className="text-xs text-blue-800 mb-2">
            You&apos;ve reviewed all {totalEmails} emails. Your final accuracy: <strong>{accuracy}%</strong>
          </p>
          <div className="text-xs text-blue-800">
            <strong>Next steps:</strong>
            <ul className="ml-4 mt-1 space-y-1">
              <li className="list-disc">Apply these skills to real emails you receive</li>
              <li className="list-disc">Report suspicious emails to your IT/security team</li>
              <li className="list-disc">Verify urgent requests through alternative channels</li>
              <li className="list-disc">Never click links or download attachments from unknown senders</li>
            </ul>
          </div>
        </div>
      )}

      <ToolStateActions
        onReset={reset}
        onCopy={copy_share_link}
        onExport={export_json}
        onImport={import_json}
      />
    </div>
  );
}
