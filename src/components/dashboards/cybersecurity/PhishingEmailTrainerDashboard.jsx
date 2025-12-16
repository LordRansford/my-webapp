"use client";

import React, { useState } from "react";
import { Mail, AlertTriangle, CheckCircle } from "lucide-react";

const SAMPLE_EMAILS = [
  {
    id: 1,
    from: "security@example.com",
    subject: "Urgent: Verify your account",
    body: "Your account will be closed in 24 hours unless you verify immediately. Click here to verify.",
    clues: ["Urgent language", "Threat of account closure", "Generic greeting"],
    isPhishing: true,
  },
  {
    id: 2,
    from: "noreply@trustedbank.com",
    subject: "Monthly statement available",
    body: "Your monthly statement for January is now available. Log in to your account to view it.",
    clues: ["Legitimate sender domain", "No urgency", "No request for action"],
    isPhishing: false,
  },
  {
    id: 3,
    from: "support@amaz0n.com",
    subject: "Payment issue with your order",
    body: "We need to verify your payment method. Please update your card details using this link.",
    clues: ["Lookalike domain (0 instead of o)", "Request for payment details", "Suspicious link"],
    isPhishing: true,
  },
];

export default function PhishingEmailTrainerDashboard() {
  const [currentEmail, setCurrentEmail] = useState(0);
  const [userChoice, setUserChoice] = useState(null);
  const [showClues, setShowClues] = useState(false);

  const email = SAMPLE_EMAILS[currentEmail];

  const handleChoice = (choice) => {
    setUserChoice(choice);
    setShowClues(true);
  };

  const nextEmail = () => {
    setCurrentEmail((prev) => (prev + 1) % SAMPLE_EMAILS.length);
    setUserChoice(null);
    setShowClues(false);
  };

  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-slate-950/80 p-4 text-slate-50 shadow-sm ring-1 ring-slate-800 md:flex-row md:p-5">
      {/* Left: email */}
      <div className="flex flex-1 flex-col gap-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-slate-50">
            Phishing email trainer
          </h3>
          <p className="mt-1 text-xs text-slate-300">
            Review synthetic emails and decide whether to trust them. The dashboard reveals key
            clues you may have missed.
          </p>
        </div>

        <div className="rounded-xl bg-slate-900/80 p-4 ring-1 ring-slate-800">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Email {currentEmail + 1} of {SAMPLE_EMAILS.length}
            </span>
            <button
              onClick={nextEmail}
              className="rounded bg-sky-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-sky-700"
            >
              Next email
            </button>
          </div>
          <div className="space-y-3 rounded-lg border border-slate-700 bg-slate-950/80 p-3">
            <div>
              <div className="text-[0.65rem] text-slate-400">From</div>
              <div className="text-xs font-medium text-slate-200">{email.from}</div>
            </div>
            <div>
              <div className="text-[0.65rem] text-slate-400">Subject</div>
              <div className="text-xs font-medium text-slate-200">{email.subject}</div>
            </div>
            <div>
              <div className="text-[0.65rem] text-slate-400">Body</div>
              <div className="text-xs text-slate-300">{email.body}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-slate-900/80 p-3 ring-1 ring-slate-800">
          <label className="mb-2 block text-xs font-medium text-slate-200">
            Is this email safe or suspicious?
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleChoice("safe")}
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                userChoice === "safe"
                  ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                  : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Safe
            </button>
            <button
              onClick={() => handleChoice("suspicious")}
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                userChoice === "suspicious"
                  ? "border-red-500 bg-red-500/20 text-red-300"
                  : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Suspicious
            </button>
          </div>
        </div>
      </div>

      {/* Right: analysis */}
      <div className="flex w-full max-w-xs flex-col gap-4 md:max-w-sm">
        {showClues && (
          <div className="rounded-2xl bg-slate-900/80 p-4 ring-1 ring-slate-800">
            <div className="mb-3 flex items-center gap-2">
              <Mail size={18} className="text-sky-400" />
              <h4 className="text-xs font-semibold text-slate-100">Analysis</h4>
            </div>
            <div className="space-y-3">
              <div>
                <div className="mb-1 text-xs text-slate-400">Your assessment</div>
                <div
                  className={`text-sm font-medium ${
                    userChoice === "safe" ? "text-emerald-300" : "text-red-300"
                  }`}
                >
                  {userChoice === "safe" ? "Safe" : "Suspicious"}
                </div>
              </div>
              <div>
                <div className="mb-1 text-xs text-slate-400">Actual classification</div>
                <div
                  className={`text-sm font-medium ${
                    email.isPhishing ? "text-red-300" : "text-emerald-300"
                  }`}
                >
                  {email.isPhishing ? (
                    <span className="flex items-center gap-1">
                      <AlertTriangle size={14} />
                      Phishing
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <CheckCircle size={14} />
                      Safe
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div className="mb-2 text-xs font-medium text-slate-300">Key clues</div>
                <ul className="space-y-1 text-[0.7rem] text-slate-300">
                  {email.clues.map((clue, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-orange-400">•</span>
                      <span>{clue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-2xl bg-slate-900/80 p-3 text-xs text-slate-200 ring-1 ring-slate-800">
          <p className="font-semibold text-sky-200">Red flags</p>
          <ul className="mt-1 space-y-1 text-[0.7rem] text-slate-300">
            <li>• Urgent language or threats</li>
            <li>• Requests for credentials or payment</li>
            <li>• Lookalike domains or typos</li>
            <li>• Generic greetings</li>
            <li>• Suspicious links or attachments</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

