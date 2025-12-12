"use client";

import { useMemo, useState, useEffect } from "react";
import ToolCard from "@/components/notes/ToolCard";

export function PacketJourneyTool() {
  const [text, setText] = useState("Hello world from packets");
  const [lossIndex, setLossIndex] = useState(-1);
  const packets = useMemo(() => text.split(" ").filter(Boolean), [text]);
  return (
    <ToolCard
      title="Packet journey"
      intent="See how messages are split and how loss affects delivery."
      predictPrompt="If one packet is lost, what part of the message is missing?"
      reflection="Which part of the path is easiest to disrupt?"
    >
      <label className="control">
        <span>Message</span>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a short message" />
      </label>
      <div className="tool-grid">
        <div className="stack">
          <p className="eyebrow">Packets</p>
          <ol className="stack">
            {packets.map((pkt, idx) => (
              <li key={idx} className={lossIndex === idx ? "muted" : ""}>
                #{idx + 1}: {lossIndex === idx ? "(lost)" : pkt}
              </li>
            ))}
          </ol>
        </div>
        <div className="stack">
          <p className="eyebrow">Simulate loss</p>
          <div className="control-row">
            <label className="control">
              <span>Lost packet index</span>
              <input
                type="number"
                min="-1"
                max={packets.length - 1}
                value={lossIndex}
                onChange={(e) => setLossIndex(Number(e.target.value))}
              />
            </label>
          </div>
          <p className="muted">-1 means no loss. Set to a packet number to see which word is missing.</p>
          <p className="status">
            <span className="eyebrow">Reassembly</span> {lossIndex >= 0 && lossIndex < packets.length ? "Needs retransmission" : "Complete"}
          </p>
        </div>
      </div>
    </ToolCard>
  );
}

export function LbtSimulator() {
  const [bandwidth, setBandwidth] = useState(10); // Mbps
  const [latency, setLatency] = useState(50); // ms
  const [loss, setLoss] = useState(0); // %
  const [sizeMb, setSizeMb] = useState(1); // MB

  const calc = useMemo(() => {
    const sizeMbBits = sizeMb * 8;
    const idealSeconds = sizeMbBits / bandwidth;
    const rtt = latency / 1000;
    const lossPenalty = 1 + loss / 100;
    const estimated = idealSeconds * lossPenalty + rtt;
    return { idealSeconds, estimated, rtt };
  }, [bandwidth, latency, loss, sizeMb]);

  return (
    <ToolCard
      title="Latency, bandwidth, throughput"
      intent="See how constraints interact."
      predictPrompt="Does doubling bandwidth halve delivery time with high latency?"
      reflection="Which constraint hurts secure handshakes most?"
    >
      <div className="control-row">
        <label className="control">
          <span>Bandwidth (Mbps)</span>
          <input type="number" min="1" value={bandwidth} onChange={(e) => setBandwidth(Number(e.target.value) || 1)} />
        </label>
        <label className="control">
          <span>Latency (ms)</span>
          <input type="number" min="0" value={latency} onChange={(e) => setLatency(Number(e.target.value) || 0)} />
        </label>
        <label className="control">
          <span>Loss (%)</span>
          <input type="number" min="0" max="100" value={loss} onChange={(e) => setLoss(Number(e.target.value) || 0)} />
        </label>
        <label className="control">
          <span>Message size (MB)</span>
          <input type="number" min="0.1" step="0.1" value={sizeMb} onChange={(e) => setSizeMb(Number(e.target.value) || 0.1)} />
        </label>
      </div>
      <div className="status">
        <div className="eyebrow">Results</div>
        <p className="muted">Ideal (no latency/loss): {calc.idealSeconds.toFixed(2)} s</p>
        <p className="muted">With latency/loss: {calc.estimated.toFixed(2)} s</p>
        <p className="muted">RTT component: {calc.rtt.toFixed(3)} s</p>
      </div>
    </ToolCard>
  );
}

export function InterceptionExplorer() {
  const points = [
    { id: "local", name: "Local network", risk: "Eavesdrop, ARP spoofing, simple DoS" },
    { id: "wifi", name: "Public Wi-Fi", risk: "Eavesdrop, captive portal tricks, injection" },
    { id: "isp", name: "ISP / transit", risk: "Metadata capture, selective blocking" },
    { id: "endpoint", name: "Endpoint", risk: "Malware, keylogging, TLS interception" },
  ];
  const [active, setActive] = useState(points[0].id);
  const current = points.find((p) => p.id === active);
  return (
    <ToolCard
      title="Interception points"
      intent="See where attacks can occur along a path."
      predictPrompt="Which points threaten confidentiality most?"
      reflection="Which point is easiest for you to harden today?"
    >
      <div className="control-row">
        {points.map((p) => (
          <button
            key={p.id}
            className={`pill ${active === p.id ? "pill--accent" : "pill--ghost"}`}
            onClick={() => setActive(p.id)}
            type="button"
          >
            {p.name}
          </button>
        ))}
      </div>
      <p className="status">
        <span className="eyebrow">Risks</span> {current?.risk}
      </p>
    </ToolCard>
  );
}

export function DNSJourney() {
  const [poisoned, setPoisoned] = useState(false);
  const [domain, setDomain] = useState("example.com");
  return (
    <ToolCard
      title="DNS resolution journey"
      intent="Understand how names become destinations."
      predictPrompt="What changes if the cache is poisoned?"
      reflection="How would you detect or prevent this?"
    >
      <label className="control">
        <span>Domain</span>
        <input value={domain} onChange={(e) => setDomain(e.target.value)} />
      </label>
      <div className="status">
        <span className="eyebrow">Resolver</span> {poisoned ? "Returns malicious IP" : "Returns correct IP"}
      </div>
      <p className="muted">If poisoned, traffic goes to an attacker-controlled host even with encryption.</p>
      <label className="control">
        <input type="checkbox" checked={poisoned} onChange={(e) => setPoisoned(e.target.checked)} /> Simulate cache poisoning
      </label>
      <p className="status">
        <span className="eyebrow">Outcome</span> {poisoned ? "Redirection risk" : "Trusted destination"}
      </p>
    </ToolCard>
  );
}

export function HandshakeExplorer() {
  const steps = [
    { id: "hello", label: "Client hello", focus: "Proposes versions/ciphers" },
    { id: "cert", label: "Server certificate", focus: "Presents identity" },
    { id: "key", label: "Key exchange", focus: "Derives shared secret" },
    { id: "secure", label: "Secure channel", focus: "Data encrypted" },
  ];
  const [idx, setIdx] = useState(0);
  const step = steps[idx];
  return (
    <ToolCard
      title="Secure handshake model"
      intent="See which steps add secrecy vs identity."
      predictPrompt="Which step fails if the certificate is wrong?"
      reflection="Why do users click through warnings?"
    >
      <div className="control-row">
        <button type="button" className="button secondary" onClick={() => setIdx((i) => Math.max(0, i - 1))}>
          Prev
        </button>
        <span className="muted">
          {idx + 1} / {steps.length}
        </span>
        <button type="button" className="button secondary" onClick={() => setIdx((i) => Math.min(steps.length - 1, i + 1))}>
          Next
        </button>
      </div>
      <p className="eyebrow">{step.label}</p>
      <p className="muted">{step.focus}</p>
    </ToolCard>
  );
}

export function CertificateChainExplorer() {
  const chain = ["Root CA", "Intermediate CA", "example.com"];
  const [breakAt, setBreakAt] = useState("");
  return (
    <ToolCard
      title="Certificate chain explorer"
      intent="Understand how trust is constructed."
      predictPrompt="What happens if an intermediate is untrusted?"
      reflection="Why are warnings important?"
    >
      <div className="control-row">
        <label className="control">
          <span>Break trust at</span>
          <select value={breakAt} onChange={(e) => setBreakAt(e.target.value)}>
            <option value="">No break</option>
            {chain.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>
      <ol className="stack">
        {chain.map((c) => (
          <li key={c} className={breakAt === c ? "muted" : ""}>
            {c} {breakAt === c ? "- trust fails here" : ""}
          </li>
        ))}
      </ol>
      <p className="status">
        <span className="eyebrow">Result</span> {breakAt ? "Channel not trusted" : "Chain trusted"}
      </p>
    </ToolCard>
  );
}

export function IntegrityLab() {
  const [message, setMessage] = useState("Hello");
  const [tamper, setTamper] = useState(false);
  const [secret, setSecret] = useState("shared-secret");

  const hash = useMemo(() => {
    const encoder = new TextEncoder();
    const base = tamper ? `${message}!` : message;
    const data = encoder.encode(base + secret);
    return crypto.subtle.digest("SHA-256", data).then((buf) => {
      const arr = Array.from(new Uint8Array(buf));
      return arr.map((b) => b.toString(16).padStart(2, "0")).join("");
    });
  }, [message, tamper, secret]);

  const [hashValue, setHashValue] = useState("");
  useEffect(() => {
    let cancelled = false;
    hash.then((h) => {
      if (!cancelled) setHashValue(h);
    });
    return () => {
      cancelled = true;
    };
  }, [hash]);

  return (
    <ToolCard
      title="Integrity lab"
      intent="See how tampering is detected with a shared secret."
      predictPrompt="What changes if the message is altered?"
      reflection="Why does a plain hash not prove identity?"
    >
      <label className="control">
        <span>Message</span>
        <input value={message} onChange={(e) => setMessage(e.target.value)} />
      </label>
      <label className="control">
        <span>Shared secret</span>
        <input value={secret} onChange={(e) => setSecret(e.target.value)} />
      </label>
      <label className="control">
        <input type="checkbox" checked={tamper} onChange={(e) => setTamper(e.target.checked)} /> Simulate tampering
      </label>
      <p className="mono">{hashValue || "..."}</p>
      <p className="muted">If tampered, the verifier will detect a mismatch.</p>
    </ToolCard>
  );
}

export function MiniIncidentSimulator() {
  const scenarios = [
    {
      id: "phish-dns",
      title: "Phishing + DNS tampering",
      hint: "Users click a link; resolver cache is poisoned.",
      best: "Isolate accounts and fix DNS",
    },
    {
      id: "cert-warning",
      title: "Certificate warning ignored",
      hint: "Users proceed after a cert mismatch.",
      best: "Block access and validate certificate",
    },
    {
      id: "mfa-fatigue",
      title: "MFA push spam",
      hint: "Repeated prompts outside hours.",
      best: "Lock account, reset credentials",
    },
  ];
  const actions = [
    "Do nothing yet",
    "Isolate accounts and reset secrets",
    "Fix DNS / cert path first",
    "Notify users and block access",
  ];

  const [scenario, setScenario] = useState(scenarios[0].id);
  const [action, setAction] = useState(actions[1]);

  const current = scenarios.find((s) => s.id === scenario);
  const correct = useMemo(() => {
    if (!current) return "";
    if (current.id === "phish-dns") return "Isolate accounts and fix DNS";
    if (current.id === "cert-warning") return "Notify users and block access";
    if (current.id === "mfa-fatigue") return "Isolate accounts and reset secrets";
    return "";
  }, [current]);

  const isBest = action.includes(correct.split(" ")[0]) || action === correct;

  return (
    <ToolCard
      title="Mini incident simulator"
      intent="Practice a first safe action under uncertainty."
      predictPrompt="Which move reduces harm fastest?"
      reflection="Did you preserve evidence and contain first?"
    >
      <div className="control-row">
        <label className="control">
          <span>Scenario</span>
          <select value={scenario} onChange={(e) => setScenario(e.target.value)}>
            {scenarios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </label>
        <p className="muted" style={{ margin: 0 }}>
          Hint: {current?.hint}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {actions.map((a) => (
          <button
            key={a}
            type="button"
            className={`px-3 py-2 rounded-md border text-left text-sm ${
              action === a ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-800"
            }`}
            onClick={() => setAction(a)}
          >
            {a}
          </button>
        ))}
      </div>

      <div className="rounded-lg border px-3 py-3 bg-gray-50 leading-6">
        <div className="font-semibold text-gray-800 mb-1">Feedback</div>
        <p className="text-gray-800">
          {isBest
            ? "Good. Contain and preserve evidence before deeper remediation."
            : "Consider containment and evidence first. Blocking access or fixing trust path reduces harm fastest."}
        </p>
      </div>
    </ToolCard>
  );
}
