"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import ControlRoom from "./sections/ControlRoom";
import FrontendLab from "./sections/FrontendLab";
import BackendApiLab from "./sections/BackendApiLab";
import ArchitecturePatternsLab from "./sections/ArchitecturePatternsLab";
import PipelineDeployLab from "./sections/PipelineDeployLab";
import SecurityQualityLab from "./sections/SecurityQualityLab";
import ObservabilityLab from "./sections/ObservabilityLab";
import AgentBuilderLab from "./sections/AgentBuilderLab";
import RequirementsLab from "./sections/RequirementsLab";
import SystemDesignLab from "./sections/SystemDesignLab";
import TradeoffSimulatorLab from "./sections/TradeoffSimulatorLab";
import ReflectionNextSteps from "./sections/ReflectionNextSteps";
import { SecurityNotice } from "@/components/SecurityNotice";
import { SecurityBanner } from "@/components/dev-studios/SecurityBanner";

const tabs = [
  { id: "overview", label: "Overview", component: ControlRoom },
  { id: "requirements", label: "Requirements and domain modelling", component: RequirementsLab },
  { id: "system-design", label: "Architecture and system design", component: SystemDesignLab },
  { id: "architecture-sandbox", label: "Architecture sandbox", component: ArchitecturePatternsLab },
  { id: "backend", label: "Backend and API design", component: BackendApiLab },
  { id: "frontend", label: "Frontend and integration", component: FrontendLab },
  { id: "security", label: "Security and reliability", component: SecurityQualityLab },
  { id: "deploy", label: "Deployment and operations", component: PipelineDeployLab },
  { id: "observability", label: "Observability basics", component: ObservabilityLab },
  { id: "tradeoffs", label: "Trade-off simulator", component: TradeoffSimulatorLab },
  { id: "reflection", label: "Reflection and next steps", component: ReflectionNextSteps },
  // Keep this available but not on the main path yet.
  { id: "agent", label: "Assistive agent (local)", component: AgentBuilderLab },
];

export default function DevStudiosPage() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [openJourney, setOpenJourney] = useState<string | null>(null);
  const ActiveComp = useMemo(() => tabs.find((t) => t.id === activeTab)?.component || ControlRoom, [activeTab]);

  return (
    <div className="page-content max-w-6xl mx-auto space-y-8">
      <div className="rounded-3xl bg-gradient-to-br from-slate-50 via-sky-50/60 to-slate-50 ring-1 ring-slate-100 px-6 py-6 sm:px-8 sm:py-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] space-y-3">
        <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 text-white px-3 py-1 text-xs font-semibold">
          New
          <span aria-hidden="true">•</span> Ransford&apos;s Software Development Studio
        </div>
        <h1 className="text-3xl font-semibold text-slate-900">Ransford&apos;s Software Development Studio</h1>
        <p className="text-base text-slate-700 max-w-3xl leading-relaxed">
          This is my workshop for shipping software safely. We sketch systems, pick stacks, check security, and get friendly nudges from a local “agent”. No cloud calls, no telemetry. Just guidance, templates and checklists that behave.
        </p>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Link href="/software-architecture" className="font-semibold text-emerald-700 hover:underline">
            Back to software architecture notes
          </Link>
          <span className="text-slate-300" aria-hidden="true">
            |
          </span>
          <Link href="/cybersecurity" className="font-semibold text-emerald-700 hover:underline">
            Back to cybersecurity notes
          </Link>
        </div>
      </div>

      <SecurityNotice />
      <SecurityBanner />

      <section aria-labelledby="guided-journeys-title" className="space-y-3">
        <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <span className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-3 py-1 text-xs font-semibold text-white">New</span>
            <span>Guided journeys</span>
          </div>
          <p id="guided-journeys-title" className="text-lg font-semibold text-slate-900">
            Walk BookTrack through the core labs
          </p>
          <p className="text-sm text-slate-700">
            Two guided runs for BookTrack. They are text-only, local-only, and point you at the existing labs so you can feel how architecture, backend, frontend, and
            delivery connect.
          </p>

          <div className="space-y-2">
            {[
              {
                id: "journey-1",
                title: "Journey 1 - Ship BookTrack v1 without embarrassing ourselves",
                content: (
                  <div className="space-y-4 text-sm text-slate-800">
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-slate-900">Who this is for</h3>
                      <p>
                        Someone who wants to walk through the whole studio once and see how architecture, backend, frontend and delivery fit together for a small but real
                        product.
                      </p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-slate-900">Outcome</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>A clear BookTrack architecture with a few recorded decisions.</li>
                        <li>A simple but realistic API design with security and error behaviour.</li>
                        <li>A basic front end flow that talks to those mocked APIs.</li>
                        <li>A release plan that would not terrify a security engineer.</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-base font-semibold text-slate-900">Step 1. Frame the system in Architecture Lab</h3>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Open Architecture Lab.</li>
                        <li>
                          In the BookTrack scenario intro, read the short description and add one sentence in your own words about what matters most to you. Reliability,
                          speed, cost or security.
                        </li>
                        <li>
                          In the System landscape canvas:
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Keep the pre filled components.</li>
                            <li>Change one thing that worries you. For example, send notifications through a queue instead of calling the email service directly.</li>
                            <li>Look at the “Looks sensible / Might be a problem” badges and fix at least one “problem” row.</li>
                          </ul>
                        </li>
                        <li>
                          In the Domain model sandbox:
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Add one new attribute to Order (for example loyaltyPointsUsed).</li>
                            <li>Add one relationship that matters for security or compliance. For example “Order references Customer address history”.</li>
                          </ul>
                        </li>
                        <li>
                          In the Architecture decision log:
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Add two decisions:</li>
                            <li>One about data storage (for example “Use Postgres for orders because we need strong consistency”).</li>
                            <li>
                              One about security (for example “Separate User Service from Order Service so that not every service sees password hashes”).
                            </li>
                          </ul>
                        </li>
                      </ol>
                      <p className="italic text-slate-700">
                        Reflection: If this design fails in production, where will it fail first and what can you do now to make that failure graceful instead of dramatic?
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-base font-semibold text-slate-900">Step 2. Make the API feel real in Backend &amp; API Lab</h3>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Open Backend &amp; API Lab.</li>
                        <li>
                          In the API overview card, note the four main endpoints. Write a short note to yourself in the UI explaining which one is riskiest if it goes wrong.
                        </li>
                        <li>
                          In the API request builder:
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Use the preset “List books” and hit Send.</li>
                            <li>Read the mock response as if it was real. Ask “what would a client actually do with this shape of data”.</li>
                            <li>Switch to “Create order”, tweak the request body and send again.</li>
                          </ul>
                        </li>
                        <li>
                          In the Auth and security panel:
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Toggle through “No auth”, “API key” and “JWT”.</li>
                            <li>For each mode, read the explanation and type a short comment into a nearby notes field or decision log about when you would or would not use it.</li>
                          </ul>
                        </li>
                        <li>
                          In the Error and rate limit simulator:
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Force a 401 and a 429 for POST /orders.</li>
                            <li>In your own words, write how the frontend should respond in each case. Show a clear message, not a stack trace.</li>
                          </ul>
                        </li>
                        <li>Tick any relevant items in the Backend checklist once you feel you understand why they matter.</li>
                      </ol>
                      <p className="italic text-slate-700">
                        Reflection: If someone abuses this API, which three logs would you want to see first and why?
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-base font-semibold text-slate-900">Step 3. Shape the experience in Frontend Lab</h3>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Open Frontend Lab.</li>
                        <li>
                          In the Component gallery:
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Switch the preview to mobile.</li>
                            <li>Look at the Book list and Order summary. Ask yourself “Would I happily use this on a phone on a train”.</li>
                          </ul>
                        </li>
                        <li>
                          In the Data flow explainer:
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Follow the described flow for “Place order”.</li>
                            <li>Mentally map each step back to an API endpoint from the previous lab.</li>
                          </ul>
                        </li>
                        <li>
                          Try a mini design improvement:
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Change one bit of microcopy to be clearer but still kind. For example “Place order” to “Place order and pay”.</li>
                            <li>Keep it accessible, no tiny grey fonts on slightly lighter grey.</li>
                          </ul>
                        </li>
                        <li>
                          In the Accessibility snapshot:
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Tab through the example components using the keyboard.</li>
                            <li>Confirm that you can place an order without touching the mouse.</li>
                          </ul>
                        </li>
                        <li>Read the What could go wrong callout and identify one risk that your own projects have probably had before.</li>
                      </ol>
                      <p className="italic text-slate-700">
                        Reflection: If the API is slow or fails, what will the user actually see and remember about your product in that moment?
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-base font-semibold text-slate-900">Step 4. Plan a safe release in Delivery &amp; Ops Lab</h3>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Open Delivery &amp; Ops Lab.</li>
                        <li>
                          In the Pipeline overview, imagine BookTrack is going live for a small beta.
                          <ul className="list-disc pl-5 space-y-1">
                            <li>For each stage, write one sentence about what success looks like.</li>
                          </ul>
                        </li>
                        <li>
                          Use the Environment toggle panel:
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Select Staging and describe what sort of data is allowed there.</li>
                            <li>Select Production like and note who is allowed to access its logs.</li>
                          </ul>
                        </li>
                        <li>
                          In the Release checklist:
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Tick anything you understand and can justify.</li>
                            <li>Leave unticked anything you are unsure about and treat it as homework.</li>
                          </ul>
                        </li>
                        <li>Read the Incident drill teaser and decide which part of your design from Step 1 would help you respond fastest.</li>
                      </ol>
                      <p className="italic text-slate-700">
                        Reflection: Something will always go wrong. Did you design BookTrack so that it fails loudly and clearly, or silently and expensively?
                      </p>
                    </div>
                  </div>
                ),
              },
              {
                id: "journey-2",
                title: "Journey 2 - Prepare BookTrack for a big scary peak day",
                content: (
                  <div className="space-y-4 text-sm text-slate-800">
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-slate-900">Outcome</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Stress tested their architecture for peak load.</li>
                        <li>Tightened API behaviours under pressure.</li>
                        <li>Improved front end patterns for errors and retries.</li>
                        <li>Upgraded their delivery view to think about rollbacks and blast radius.</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-base font-semibold text-slate-900">Step 1. Stress the design in Architecture Lab</h3>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>In Architecture Lab, imagine BookTrack is being promoted by a big influencer tomorrow.</li>
                        <li>
                          In the System landscape canvas:
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Mark which components will be hit hardest (for example Web App, API Gateway, Order Service).</li>
                            <li>Add one new component to absorb load, for example a caching layer or a read replica.</li>
                          </ul>
                        </li>
                        <li>
                          In the Domain model sandbox:
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Add a field like priorityFlag on Order or Shipment to represent premium customers or urgent orders.</li>
                            <li>Think about how that might change downstream processing.</li>
                          </ul>
                        </li>
                        <li>
                          In the Architecture decision log:
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Add at least two decisions that explicitly talk about scale and resilience.</li>
                            <li>For each, mention one trade off (cost, complexity or latency).</li>
                          </ul>
                        </li>
                      </ol>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-base font-semibold text-slate-900">Step 2. Hard mode for the API</h3>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>In Backend &amp; API Lab, treat every request as if it might be part of a flood.</li>
                        <li>
                          In the API request builder:
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Use the rate limit simulator to send a 429 for POST /orders.</li>
                            <li>Write guidance text about a backoff strategy (wait and retry) in the UI notes.</li>
                          </ul>
                        </li>
                        <li>
                          In the Auth and security panel:
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Consider how rate limits and suspicious patterns are logged. Add one decision entry about this.</li>
                          </ul>
                        </li>
                        <li>
                          In the Error simulator, use 500 and think through how many times the frontend should retry before giving up.
                        </li>
                      </ol>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-base font-semibold text-slate-900">Step 3. Hard mode for the frontend</h3>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>In Frontend Lab, switch to mobile view again.</li>
                        <li>
                          Use the Data flow explainer:
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Modify the narrative slightly to include loading states, skeleton screens and clear error banners.</li>
                          </ul>
                        </li>
                        <li>
                          Update the example microcopy so that:
                          <ul className="list-disc pl-5 space-y-1">
                            <li>
                              Errors are specific but safe. For example “We could not place your order right now. Your card has not been charged. Please try again in a few
                              minutes”.
                            </li>
                          </ul>
                        </li>
                        <li>In the Accessibility snapshot, confirm that error messages are reachable by screen readers and not only by colour.</li>
                      </ol>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-base font-semibold text-slate-900">Step 4. Release with a safety net</h3>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>In Delivery &amp; Ops Lab, imagine this is a high risk release.</li>
                        <li>
                          In the Pipeline overview, add a note under one of the stages about blue green or canary releases.
                        </li>
                        <li>In the Environment panel, think about using Staging for a realistic load test with synthetic data.</li>
                        <li>In the Release checklist, add a custom item such as “Operational runbook updated for surge traffic”.</li>
                        <li>
                          In the Incident drill teaser, write down in your own words how you would roll back if BookTrack starts failing right after deployment.
                        </li>
                      </ol>
                    </div>
                  </div>
                ),
              },
            ].map((journey) => {
              const isOpen = openJourney === journey.id;
              return (
                <div key={journey.id} className="rounded-2xl border border-slate-100 bg-slate-50/70">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                    aria-expanded={isOpen}
                    aria-controls={`${journey.id}-panel`}
                    onClick={() => setOpenJourney(isOpen ? null : journey.id)}
                  >
                    <span>{journey.title}</span>
                    <span className="text-xs text-slate-600">{isOpen ? "Hide" : "Show"}</span>
                  </button>
                  {isOpen && (
                    <div id={`${journey.id}-panel`} className="border-t border-slate-100 px-4 py-3">
                      {journey.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="overflow-x-auto">
        <div className="flex min-w-full gap-2" role="tablist" aria-label="Development Studios">
          {tabs.filter((t) => t.id !== "agent").map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
                activeTab === tab.id
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div id={`panel-${activeTab}`} role="tabpanel" aria-label={tabs.find((t) => t.id === activeTab)?.label}>
        <ActiveComp />
      </div>
    </div>
  );
}
