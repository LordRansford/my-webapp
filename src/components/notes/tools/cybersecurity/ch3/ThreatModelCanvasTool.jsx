'use client'

import { useState } from "react";

const presets = {
  login: {
    assets: "Accounts, credentials, session tokens",
    entry: "Login form, password reset, MFA prompt",
    trust: "Browser → edge → auth service",
    goals: "Account takeover, token reuse, session fixation",
  },
  upload: {
    assets: "Files, storage bucket, metadata",
    entry: "Upload form, API endpoint",
    trust: "Client → API → storage",
    goals: "Malicious file, exfiltration, overwrite",
  },
  reset: {
    assets: "User identity, reset tokens, email channel",
    entry: "Reset form, email link, SMS link",
    trust: "Browser → API → mail",
    goals: "Account takeover, token replay, phishing",
  },
};

export default function ThreatModelCanvasTool() {
  const [scenario, setScenario] = useState("login");
  const [assets, setAssets] = useState(presets.login.assets);
  const [entryPoints, setEntryPoints] = useState(presets.login.entry);
  const [trustBoundaries, setTrustBoundaries] = useState(presets.login.trust);
  const [goals, setGoals] = useState(presets.login.goals);

  function loadPreset(key) {
    setScenario(key);
    setAssets(presets[key].assets);
    setEntryPoints(presets[key].entry);
    setTrustBoundaries(presets[key].trust);
    setGoals(presets[key].goals);
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center">
        <label className="text-xs text-gray-600">Scenario</label>
        <select
          value={scenario}
          onChange={(e) => loadPreset(e.target.value)}
          className="rounded-md border px-2 py-1 text-sm"
        >
          <option value="login">Login</option>
          <option value="upload">File upload</option>
          <option value="reset">Password reset</option>
        </select>
      </div>

      <Field
        label="Assets to protect"
        value={assets}
        onChange={setAssets}
        placeholder="What is valuable here?"
      />
      <Field
        label="Entry points"
        value={entryPoints}
        onChange={setEntryPoints}
        placeholder="Where can an attacker interact?"
      />
      <Field
        label="Trust boundaries"
        value={trustBoundaries}
        onChange={setTrustBoundaries}
        placeholder="Where does data change trust zone?"
      />
      <Field
        label="Attacker goals"
        value={goals}
        onChange={setGoals}
        placeholder="What would success look like for an attacker?"
      />

      <div className="rounded-lg border bg-gray-50 px-3 py-3 text-sm leading-6">
        <div className="font-semibold text-gray-800 mb-1">Quick summary</div>
        <ul className="list-disc ml-4 text-gray-700">
          <li>Most exposed entry: {entryPoints.split(",")[0] || entryPoints}</li>
          <li>Highest value asset: {assets.split(",")[0] || assets}</li>
          <li>Watch the trust line at: {trustBoundaries.split(",")[0] || trustBoundaries}</li>
          <li>Primary attacker goal: {goals.split(",")[0] || goals}</li>
        </ul>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <label className="block space-y-1 text-sm">
      <span className="text-xs uppercase tracking-wide text-gray-500">{label}</span>
      <textarea
        className="w-full rounded-md border px-2 py-2 text-sm leading-5"
        rows={2}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
