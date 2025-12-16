"use client"

import { useMemo, useState, useEffect } from "react"

const initialState = {
  logoLowQuality: false,
  logoDifferentFromOfficial: false,
  senderDomainMismatch: false,
  replyToDifferentDomain: false,
  urgentLanguage: false,
  asksForPassword: false,
  asksForPayment: false,
  unexpectedAttachment: false,
  genericGreeting: false,
  smallTypos: false
}

export default function BrandImpersonationChecklist() {
  const [answers, setAnswers] = useState(initialState)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const riskScore = useMemo(() => {
    return Object.values(answers).filter(Boolean).length
  }, [answers])

  const riskLevel = useMemo(() => {
    if (riskScore >= 7) return "High"
    if (riskScore >= 4) return "Medium"
    if (riskScore >= 1) return "Low"
    return "Very low"
  }, [riskScore])

  const toggle = (key) => {
    setAnswers((current) => ({ ...current, [key]: !current[key] }))
  }

  const reset = () => setAnswers(initialState)

  if (!mounted) {
    return (
      <div className="space-y-4 text-sm text-slate-700">
        <p className="text-sm text-slate-500">Loading checklist...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 text-sm text-slate-700">
      <p className="text-sm text-slate-600 leading-relaxed">
        Use this checklist when you review an email or page that claims to be from a brand. Do not upload images or paste sensitive content. Answer based on what you see.
      </p>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 space-y-4">
          <h3 className="text-base font-semibold text-slate-900 mb-2">Visual cues</h3>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={answers.logoLowQuality}
              onChange={() => toggle("logoLowQuality")}
              className="mt-0.5 h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 cursor-pointer"
              style={{ zIndex: 10, position: "relative" }}
            />
            <span className="text-sm text-slate-700 leading-relaxed flex-1">
              Logo looks blurred, stretched or copied from a screenshot.
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={answers.logoDifferentFromOfficial}
              onChange={() => toggle("logoDifferentFromOfficial")}
              className="mt-0.5 h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 cursor-pointer"
              style={{ zIndex: 10, position: "relative" }}
            />
            <span className="text-sm text-slate-700 leading-relaxed flex-1">
              Colours, fonts or logo layout look different from the official brand.
            </span>
          </label>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 space-y-4">
          <h3 className="text-base font-semibold text-slate-900 mb-2">Sender and address</h3>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={answers.senderDomainMismatch}
              onChange={() => toggle("senderDomainMismatch")}
              className="mt-0.5 h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 cursor-pointer"
              style={{ zIndex: 10, position: "relative" }}
            />
            <span className="text-sm text-slate-700 leading-relaxed flex-1">
              Sender address domain does not match the official brand domain.
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={answers.replyToDifferentDomain}
              onChange={() => toggle("replyToDifferentDomain")}
              className="mt-0.5 h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 cursor-pointer"
              style={{ zIndex: 10, position: "relative" }}
            />
            <span className="text-sm text-slate-700 leading-relaxed flex-1">
              Reply To address uses a different domain from the From address.
            </span>
          </label>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 space-y-4">
          <h3 className="text-base font-semibold text-slate-900 mb-2">Language and pressure</h3>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={answers.urgentLanguage}
              onChange={() => toggle("urgentLanguage")}
              className="mt-0.5 h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 cursor-pointer"
              style={{ zIndex: 10, position: "relative" }}
            />
            <span className="text-sm text-slate-700 leading-relaxed flex-1">
              Message uses urgency or threats such as account closure or legal action.
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={answers.genericGreeting}
              onChange={() => toggle("genericGreeting")}
              className="mt-0.5 h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 cursor-pointer"
              style={{ zIndex: 10, position: "relative" }}
            />
            <span className="text-sm text-slate-700 leading-relaxed flex-1">
              Greeting is generic or wrong such as Dear Customer when the brand normally uses your name.
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={answers.smallTypos}
              onChange={() => toggle("smallTypos")}
              className="mt-0.5 h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 cursor-pointer"
              style={{ zIndex: 10, position: "relative" }}
            />
            <span className="text-sm text-slate-700 leading-relaxed flex-1">
              Small spelling or grammar mistakes you would not expect from a large brand.
            </span>
          </label>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 space-y-4">
          <h3 className="text-base font-semibold text-slate-900 mb-2">Requests and attachments</h3>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={answers.asksForPassword}
              onChange={() => toggle("asksForPassword")}
              className="mt-0.5 h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 cursor-pointer"
              style={{ zIndex: 10, position: "relative" }}
            />
            <span className="text-sm text-slate-700 leading-relaxed flex-1">
              Message asks you to enter or confirm a password or one time code.
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={answers.asksForPayment}
              onChange={() => toggle("asksForPayment")}
              className="mt-0.5 h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 cursor-pointer"
              style={{ zIndex: 10, position: "relative" }}
            />
            <span className="text-sm text-slate-700 leading-relaxed flex-1">
              Message asks for payment details or unusual transfers.
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={answers.unexpectedAttachment}
              onChange={() => toggle("unexpectedAttachment")}
              className="mt-0.5 h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 cursor-pointer"
              style={{ zIndex: 10, position: "relative" }}
            />
            <span className="text-sm text-slate-700 leading-relaxed flex-1">
              Message includes an attachment you did not expect to receive.
            </span>
          </label>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <p className="text-base font-semibold text-slate-900 mb-2">
            Overall risk level: <span className={`${
              riskLevel === "High" ? "text-rose-700" :
              riskLevel === "Medium" ? "text-orange-700" :
              riskLevel === "Low" ? "text-yellow-700" :
              "text-green-700"
            }`}>{riskLevel}</span>
          </p>
          <p className="text-sm text-slate-600 mb-2">
            Checked signals: {riskScore} of {Object.keys(initialState).length}
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            This checklist is a guide, not a guarantee. If you feel unsure, contact the organisation through a trusted channel.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
          style={{ zIndex: 10, position: "relative" }}
        >
          Reset checklist
        </button>
      </section>
    </div>
  )
}
