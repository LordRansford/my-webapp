"use client";

import { useMemo, useState } from "react";

type Step = {
  title: string;
  flags: string;
  clientSeq: number;
  serverSeq: number;
  ack: number | null;
  note: string;
};

export default function TcpHandshakeTimelineTool() {
  const [clientIsn, setClientIsn] = useState(1200);
  const [serverIsn, setServerIsn] = useState(7700);
  const [dropSynAck, setDropSynAck] = useState(false);

  const steps = useMemo(() => {
    const c = Math.max(0, Math.floor(Number(clientIsn) || 0));
    const s = Math.max(0, Math.floor(Number(serverIsn) || 0));

    const syn: Step = {
      title: "Client to server",
      flags: "SYN",
      clientSeq: c,
      serverSeq: s,
      ack: null,
      note: "Client proposes a new connection and picks an initial sequence number.",
    };

    const synAck: Step = {
      title: "Server to client",
      flags: "SYN, ACK",
      clientSeq: c,
      serverSeq: s,
      ack: c + 1,
      note: "Server acknowledges the client sequence and sends its own initial sequence number.",
    };

    const ack: Step = {
      title: "Client to server",
      flags: "ACK",
      clientSeq: c + 1,
      serverSeq: s,
      ack: s + 1,
      note: "Client acknowledges the server sequence. The connection is established.",
    };

    const out: Step[] = [syn];
    if (!dropSynAck) out.push(synAck, ack);
    if (dropSynAck) {
      out.push({
        title: "Network behaviour",
        flags: "Timeout",
        clientSeq: c,
        serverSeq: s,
        ack: null,
        note: "If SYN, ACK is lost, the client will retransmit SYN after a timeout. This is one reason TCP is considered reliable.",
      });
    }
    return out;
  }, [clientIsn, serverIsn, dropSynAck]);

  return (
    <div className="not-prose space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">TCP</div>
        <div className="mt-1 text-base font-semibold text-slate-900">Three way handshake timeline</div>
        <div className="mt-2 text-sm text-slate-700">
          This shows the minimum control messages used to start a TCP connection. It is a teaching model. Real stacks include options such as MSS and window scaling.
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Client ISN</div>
          <input
            value={clientIsn}
            onChange={(e) => setClientIsn(Number(e.target.value))}
            type="number"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
          />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Server ISN</div>
          <input
            value={serverIsn}
            onChange={(e) => setServerIsn(Number(e.target.value))}
            type="number"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
          />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Failure mode</div>
          <button
            type="button"
            onClick={() => setDropSynAck((v) => !v)}
            className={[
              "mt-2 w-full rounded-xl border px-3 py-2 text-sm font-semibold shadow-sm transition",
              dropSynAck ? "border-rose-200 bg-rose-50 text-rose-900" : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
            ].join(" ")}
          >
            {dropSynAck ? "Simulating lost SYN, ACK" : "Simulate lost SYN, ACK"}
          </button>
          <div className="mt-2 text-xs text-slate-600">This is passive reasoning. It does not generate real traffic.</div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Timeline</div>
        <div className="mt-3 space-y-3">
          {steps.map((s, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="text-sm font-semibold text-slate-900">{s.title}</div>
                <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">{s.flags}</div>
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-2">
                  <div className="text-xs font-semibold text-slate-600">Client seq</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">{s.clientSeq}</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-2">
                  <div className="text-xs font-semibold text-slate-600">Server seq</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">{s.serverSeq}</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-2">
                  <div className="text-xs font-semibold text-slate-600">Ack</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">{s.ack === null ? "None" : s.ack}</div>
                </div>
              </div>
              <div className="mt-2 text-sm text-slate-700">{s.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

