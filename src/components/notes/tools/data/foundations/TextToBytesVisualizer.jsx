"use client";

import { useMemo, useState } from "react";

const toBinary = (num) => num.toString(2).padStart(8, "0");

export default function TextToBytesVisualizer() {
  const [text, setText] = useState("Hello");

  const rows = useMemo(
    () =>
      Array.from(text.slice(0, 24)).map((char) => {
        const code = char.codePointAt(0) || 0;
        return { char, code, binary: toBinary(code % 256) };
      }),
    [text]
  );

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700">
        Type a short word or phrase. See how characters turn into numbers, then into bits.
      </p>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-sky-200"
        maxLength={50}
        aria-label="Text to convert to bytes"
      />
      {rows.length === 0 ? (
        <p className="text-xs text-slate-600">Start typing to see the breakdown.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-slate-700">
                <th className="border-b border-slate-200 py-1 pr-2">Character</th>
                <th className="border-b border-slate-200 py-1 pr-2">Number (code point)</th>
                <th className="border-b border-slate-200 py-1 pr-2">8-bit view</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={`${row.char}-${idx}`} className="text-slate-900">
                  <td className="py-1 pr-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-center font-semibold">
                      {row.char === " " ? "␠" : row.char}
                    </span>
                  </td>
                  <td className="py-1 pr-2">{row.code}</td>
                  <td className="py-1 pr-2 font-mono text-xs text-slate-700">{row.binary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
