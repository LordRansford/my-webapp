'use client'

import { useMemo, useState } from "react";

export default function BinaryCarryTrainer() {
  const [a, setA] = useState("1011");
  const [b, setB] = useState("0110");

  const steps = useMemo(() => addBinary(a, b), [a, b]);

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">
        Add two binary numbers and watch carry positions. Limit to 8 bits to keep it readable.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="First number" value={a} onChange={setA} />
        <Field label="Second number" value={b} onChange={setB} />
      </div>

      <div className="rounded-lg border px-3 py-3 bg-gray-50 leading-6">
        <div className="font-semibold text-gray-800 mb-1">Result</div>
        <p className="font-mono text-lg text-gray-900">{steps.result}</p>
        <p className="text-xs text-gray-600">Carry positions: {steps.carries.length ? steps.carries.join(", ") : "None"}</p>
      </div>

      <div className="rounded-lg border px-3 py-3 leading-6">
        <div className="font-semibold text-gray-800 mb-1">Step by step</div>
        <ol className="list-decimal ml-5 space-y-1 text-gray-800">
          {steps.detail.map((d, i) => (
            <li key={i} className={d.carry ? "text-blue-700" : ""}>
              Bit {d.pos}: {d.sum} (carry {d.carry ? "1" : "0"})
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs uppercase tracking-wide text-gray-500">{label}</span>
      <input
        className="w-full rounded-md border px-2 py-2 font-mono text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^01]/g, "").slice(0, 8))}
        placeholder="e.g., 1011"
      />
    </label>
  );
}

function addBinary(a, b) {
  const maxLen = Math.max(a.length, b.length);
  const pa = a.padStart(maxLen, "0");
  const pb = b.padStart(maxLen, "0");
  let carry = 0;
  let result = "";
  const detail = [];
  const carries = [];

  for (let i = maxLen - 1; i >= 0; i--) {
    const sum = Number(pa[i]) + Number(pb[i]) + carry;
    const bit = sum % 2;
    carry = sum >= 2 ? 1 : 0;
    const pos = maxLen - i; // 1-based from right
    detail.unshift({ pos, sum, carry });
    if (carry) carries.push(pos);
    result = bit + result;
  }
  if (carry) {
    result = "1" + result;
    carries.push(maxLen + 1);
  }

  return { result, carries, detail };
}
