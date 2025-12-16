"use client";

import React, { useState } from "react";
import { ArrowRight, Lock, Shield } from "lucide-react";

const STEPS = [
  {
    id: 1,
    title: "Client Hello",
    client: "Sends supported cipher suites and random number",
    server: "Waiting...",
    explanation: "Client announces what it can do and sends a random value for key generation.",
  },
  {
    id: 2,
    title: "Server Hello",
    client: "Received server choices",
    server: "Sends selected cipher suite and random number",
    explanation: "Server picks a cipher suite both sides support and sends its own random value.",
  },
  {
    id: 3,
    title: "Server Certificate",
    client: "Received server certificate",
    server: "Sends certificate chain",
    explanation: "Server proves its identity by sending a certificate signed by a trusted authority.",
  },
  {
    id: 4,
    title: "Key Exchange",
    client: "Generates pre-master secret",
    server: "Receives encrypted pre-master secret",
    explanation: "Client encrypts a secret with the server's public key. Only the server can decrypt it.",
  },
  {
    id: 5,
    title: "Change Cipher Spec",
    client: "Switches to encrypted mode",
    server: "Switches to encrypted mode",
    explanation: "Both sides switch to using the agreed keys and cipher suite.",
  },
  {
    id: 6,
    title: "Encrypted Handshake",
    client: "Sends encrypted finish message",
    server: "Sends encrypted finish message",
    explanation: "Both sides verify the handshake completed correctly using encrypted messages.",
  },
];

export default function TLSToyHandshakeDashboard() {
  const [currentStep, setCurrentStep] = useState(0);

  const step = STEPS[currentStep];
  const canGoNext = currentStep < STEPS.length - 1;
  const canGoPrev = currentStep > 0;

  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-slate-950/80 p-4 text-slate-50 shadow-sm ring-1 ring-slate-800 md:flex-row md:p-5">
      {/* Left: controls */}
      <div className="flex flex-1 flex-col gap-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-slate-50">
            TLS handshake steps
          </h3>
          <p className="mt-1 text-xs text-slate-300">
            Step through a simplified TLS handshake. Each step shows what the client and server
            exchange and what they learn.
          </p>
        </div>

        <div className="rounded-xl bg-slate-900/80 p-4 ring-1 ring-slate-800">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300">
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <span className="text-xs text-slate-400">{step.title}</span>
          </div>
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={!canGoPrev}
              className="flex-1 rounded-lg bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-slate-700 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))}
              disabled={!canGoNext}
              className="flex-1 rounded-lg bg-sky-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-sky-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-950/80 p-3 text-xs text-slate-300">
            {step.explanation}
          </div>
        </div>
      </div>

      {/* Right: visual */}
      <div className="flex w-full max-w-xs flex-col gap-4 md:max-w-sm">
        <div className="rounded-2xl bg-slate-900/80 p-4 ring-1 ring-slate-800">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock size={18} className="text-sky-400" />
              <h4 className="text-xs font-semibold text-slate-100">Handshake flow</h4>
            </div>
            <div className={`rounded-full px-2 py-1 text-[0.65rem] font-medium ${
              currentStep === STEPS.length - 1
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-slate-800 text-slate-400"
            }`}>
              {currentStep === STEPS.length - 1 ? "Complete" : "In progress"}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-slate-700 bg-slate-950/80 p-3">
              <div className="mb-2 flex items-center gap-2">
                <Shield size={14} className="text-blue-400" />
                <span className="text-xs font-medium text-slate-200">Client</span>
              </div>
              <p className="text-[0.7rem] text-slate-300">{step.client}</p>
            </div>

            <div className="flex items-center justify-center">
              <ArrowRight size={20} className="text-slate-500" />
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-950/80 p-3">
              <div className="mb-2 flex items-center gap-2">
                <Shield size={14} className="text-purple-400" />
                <span className="text-xs font-medium text-slate-200">Server</span>
              </div>
              <p className="text-[0.7rem] text-slate-300">{step.server}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900/80 p-3 text-xs text-slate-200 ring-1 ring-slate-800">
          <p className="font-semibold text-sky-200">Real TLS</p>
          <p className="mt-1 text-[0.7rem] text-slate-300">
            The real TLS handshake includes more steps such as certificate validation, key derivation
            and optional client authentication. This simplified version shows the core idea: both sides
            agree on keys and parameters before encrypting data.
          </p>
        </div>
      </div>
    </div>
  );
}

