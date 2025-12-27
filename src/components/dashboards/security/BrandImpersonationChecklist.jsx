"use client"

import { useMemo, useState, useEffect } from "react"
import { CheckPill } from "@/components/ui/CheckPill"

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

  const setChecked = (key) => (checked) => {
    setAnswers((current) => ({ ...current, [key]: checked }))
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
          <div className="space-y-2">
            <CheckPill checked={answers.logoLowQuality} onCheckedChange={setChecked("logoLowQuality")} tone="sky">
              Logo looks blurred, stretched, or copied from a screenshot.
            </CheckPill>
            <CheckPill
              checked={answers.logoDifferentFromOfficial}
              onCheckedChange={setChecked("logoDifferentFromOfficial")}
              tone="sky"
            >
              Colours, fonts, or logo layout look different from the official brand.
            </CheckPill>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 space-y-4">
          <h3 className="text-base font-semibold text-slate-900 mb-2">Sender and address</h3>
          <div className="space-y-2">
            <CheckPill checked={answers.senderDomainMismatch} onCheckedChange={setChecked("senderDomainMismatch")} tone="violet">
              Sender address domain does not match the official brand domain.
            </CheckPill>
            <CheckPill checked={answers.replyToDifferentDomain} onCheckedChange={setChecked("replyToDifferentDomain")} tone="violet">
              Reply to address uses a different domain from the From address.
            </CheckPill>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 space-y-4">
          <h3 className="text-base font-semibold text-slate-900 mb-2">Language and pressure</h3>
          <div className="space-y-2">
            <CheckPill checked={answers.urgentLanguage} onCheckedChange={setChecked("urgentLanguage")} tone="amber">
              Uses urgency or threats, such as account closure or legal action.
            </CheckPill>
            <CheckPill checked={answers.genericGreeting} onCheckedChange={setChecked("genericGreeting")} tone="amber">
              Greeting is generic or wrong, such as Dear Customer when the brand normally uses your name.
            </CheckPill>
            <CheckPill checked={answers.smallTypos} onCheckedChange={setChecked("smallTypos")} tone="amber">
              Small spelling or grammar mistakes you would not expect from a large brand.
            </CheckPill>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 space-y-4">
          <h3 className="text-base font-semibold text-slate-900 mb-2">Requests and attachments</h3>
          <div className="space-y-2">
            <CheckPill checked={answers.asksForPassword} onCheckedChange={setChecked("asksForPassword")} tone="rose">
              Asks you to enter or confirm a password or a one time code.
            </CheckPill>
            <CheckPill checked={answers.asksForPayment} onCheckedChange={setChecked("asksForPayment")} tone="rose">
              Asks for payment details or unusual transfers.
            </CheckPill>
            <CheckPill checked={answers.unexpectedAttachment} onCheckedChange={setChecked("unexpectedAttachment")} tone="rose">
              Includes an attachment you did not expect to receive.
            </CheckPill>
          </div>
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
