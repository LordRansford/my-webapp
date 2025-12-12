'use client';

import { useMemo, useState } from "react";

const gates = [
  { id: "and", name: "AND", fn: (a, b) => a && b },
  { id: "or", name: "OR", fn: (a, b) => a || b },
  { id: "xor", name: "XOR", fn: (a, b) => (a || b) && !(a && b) },
  { id: "nand", name: "NAND", fn: (a, b) => !(a && b) },
];

export default function LogicGateLab() {
  const [gate, setGate] = useState("and");
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  const output = useMemo(() => {
    const g = gates.find((g) => g.id === gate);
    return g ? Number(g.fn(Boolean(a), Boolean(b))) : 0;
  }, [gate, a, b]);

  return (
    <div className="stack" style={{ gap: "0.6rem" }}>
      <p className="muted">Toggle inputs and pick a gate to see outputs and the corresponding truth table.</p>

      <div className="control-row">
        <label className="control">
          <span>Gate</span>
          <select value={gate} onChange={(e) => setGate(e.target.value)}>
            {gates.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </label>
        <label className="control">
          <span>Input A</span>
          <input type="checkbox" checked={!!a} onChange={(e) => setA(e.target.checked ? 1 : 0)} />
        </label>
        <label className="control">
          <span>Input B</span>
          <input type="checkbox" checked={!!b} onChange={(e) => setB(e.target.checked ? 1 : 0)} />
        </label>
      </div>

      <div className="rounded-lg border px-3 py-3 bg-gray-50">
        <p className="eyebrow">Output</p>
        <p className="text-2xl font-semibold text-gray-900">{output}</p>
        <p className="muted text-sm">1 means true, 0 means false.</p>
      </div>

      <div className="rounded-lg border px-3 py-3">
        <p className="eyebrow">Truth table</p>
        <table className="thin-table">
          <thead>
            <tr>
              <th>A</th>
              <th>B</th>
              <th>{gates.find((g) => g.id === gate)?.name}</th>
            </tr>
          </thead>
          <tbody>
            {[0, 1].map((ia) =>
              [0, 1].map((ib) => (
                <tr key={`${ia}-${ib}`}>
                  <td>{ia}</td>
                  <td>{ib}</td>
                  <td>{Number(gates.find((g) => g.id === gate)?.fn(Boolean(ia), Boolean(ib)))}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
