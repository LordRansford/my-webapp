"use client";

import { useMemo, useState } from "react";

function textToVector(text) {
  const safeText = (text || "").toLowerCase();
  let vowels = 0;
  let consonants = 0;
  let digits = 0;
  let spaces = 0;

  for (const char of safeText) {
    if ("aeiou".includes(char)) {
      vowels += 1;
    } else if (char >= "a" && char <= "z") {
      consonants += 1;
    } else if (char >= "0" && char <= "9") {
      digits += 1;
    } else if (char === " ") {
      spaces += 1;
    }
  }

  const length = safeText.length;
  return [length, vowels, consonants, digits, spaces];
}

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, val, idx) => sum + val * b[idx], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

export default function VectorVisualiserTool() {
  const [leftText, setLeftText] = useState("secure login");
  const [rightText, setRightText] = useState("safe sign in");

  const leftVector = useMemo(() => textToVector(leftText), [leftText]);
  const rightVector = useMemo(() => textToVector(rightText), [rightText]);
  const similarity = useMemo(() => cosineSimilarity(leftVector, rightVector), [leftVector, rightVector]);

  return (
    <div className="space-y-3 text-sm text-gray-800">
      <p className="text-xs text-gray-600">
        This is a simple numeric encoding, not a real embedding. It shows how text can become numbers for a model.
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-gray-600">Phrase A</label>
          <input
            value={leftText}
            onChange={(e) => setLeftText(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            type="text"
          />
          <div className="mt-2 rounded-xl border border-gray-200 bg-white/70 p-2 text-xs text-gray-700">
            Vector: [{leftVector.join(", ")}]
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600">Phrase B</label>
          <input
            value={rightText}
            onChange={(e) => setRightText(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            type="text"
          />
          <div className="mt-2 rounded-xl border border-gray-200 bg-white/70 p-2 text-xs text-gray-700">
            Vector: [{rightVector.join(", ")}]
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white/70 p-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Cosine similarity</div>
        <div className="mt-1 text-lg font-semibold text-gray-900">{(similarity * 100).toFixed(1)}%</div>
        <p className="mt-1 text-xs text-gray-600">
          Real embeddings use many more numbers, but the idea is the same: encode, compare, and decide.
        </p>
      </div>
    </div>
  );
}
