'use client'

import { useMemo, useState } from "react";

export default function ControlMappingTool() {
  const [threat, setThreat] = useState("Attacker steals credentials");
  const [prevent, setPrevent] = useState("Phishing-resistant MFA, device binding");
  const [detect, setDetect] = useState("Impossible travel alerts, anomaly detection");
  const [respond, setRespond] = useState("Revoke sessions, force reset, inform users");
  const [recover, setRecover] = useState("Restore access, validate integrity, post-incident review");

  const coverage = useMemo(() => {
    const fields = [prevent, detect, respond, recover];
    const filled = fields.filter((f) => f.trim().length > 0).length;
    return Math.round((filled / fields.length) * 100);
  }, [prevent, detect, respond, recover]);

  return (
    <div className="space-y-4">
      <label className="block text-sm space-y-1">
        <span className="text-xs uppercase tracking-wide text-gray-500">Threat</span>
        <input
          className="w-full rounded-md border px-2 py-2 text-sm"
          value={threat}
          onChange={(e) => setThreat(e.target.value)}
        />
      </label>

      <Grid>
        <ControlField label="Prevent" value={prevent} onChange={setPrevent} />
        <ControlField label="Detect" value={detect} onChange={setDetect} />
        <ControlField label="Respond" value={respond} onChange={setRespond} />
        <ControlField label="Recover" value={recover} onChange={setRecover} />
      </Grid>

      <div className="rounded-lg border px-3 py-3 bg-gray-50 text-sm leading-6">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-gray-800">Coverage</div>
          <span className="text-xs text-gray-600">{coverage}% complete</span>
        </div>
        <p className="text-gray-700 mt-2">
          {coverage === 100
            ? "You have prevention, detection, response, and recovery. Check the control quality next."
            : "Fill all four columns so one control failure does not become total failure."}
        </p>
      </div>
    </div>
  );
}

function ControlField({ label, value, onChange }) {
  return (
    <label className="block text-sm space-y-1">
      <span className="text-xs uppercase tracking-wide text-gray-500">{label}</span>
      <textarea
        className="w-full rounded-md border px-2 py-2 text-sm leading-5"
        rows={2}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function Grid({ children }) {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>;
}
