import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Layout from "@/components/Layout";
import RsaPlayground from "@/components/RsaPlayground";

const sections = [
  { id: "big-picture", label: "The big picture" },
  { id: "data", label: "Data" },
  { id: "computers", label: "Computers" },
  { id: "networks", label: "Networks" },
  { id: "goals", label: "Security goals" },
  { id: "attacks", label: "Common attacks" },
  { id: "defences", label: "First defences" },
  { id: "studio", label: "Practice studio" },
  { id: "checkpoint", label: "Checkpoint" },
];

export default function CybersecurityBeginner() {
  const [activeId, setActiveId] = useState("big-picture");
  const [hashInput, setHashInput] = useState("Hello world");
  const [hashOutput, setHashOutput] = useState("");

  const tocIds = useMemo(() => sections.map((s) => s.id), []);

  useEffect(() => {
    const handler = () => {
      let current = activeId;
      for (const id of tocIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 140 && rect.bottom >= 140) {
          current = id;
          break;
        }
      }
      if (current !== activeId) setActiveId(current);
    };

    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [tocIds, activeId]);

  const computeHash = async (value) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(value);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    setHashOutput(hashHex);
  };

  return (
    <Layout title="Cybersecurity Notes - Beginner" description="Chapter 1: Foundations for Beginners.">
      <Head>
        <title>Cybersecurity Notes - Beginner</title>
      </Head>
      <div className="note-layout">
        <aside className="note-sidebar" aria-label="Contents">
          <p className="eyebrow">On this page</p>
          <ul className="note-toc">
            {sections.map((section) => (
              <li key={section.id}>
                <a className={activeId === section.id ? "note-toc__link is-active" : "note-toc__link"} href={`#${section.id}`}>
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <article className="note-article">
          <header className="page-header">
            <p className="eyebrow">Cybersecurity Notes</p>
            <h1>Chapter 1: Foundations for Beginners</h1>
            <blockquote className="panel">
              <p className="eyebrow">Welcome</p>
              <p>
                This is not a course. It is my notes, written for someone who wants a single place to understand cybersecurity properly.
                The vibe is simple: learn a small idea, test it immediately, then build the next idea on top.
              </p>
            </blockquote>
          </header>

          <section id="big-picture" className="note-section">
            <h2>1 The big picture</h2>
            <h3>1.1 What cybersecurity really is</h3>
            <p>
              Cybersecurity is the practice of protecting <strong>systems</strong>, <strong>networks</strong>, and <strong>data</strong> from harm.
              Harm is defined by the <strong>CIA triad</strong>:
            </p>
            <ul>
              <li>
                <strong>Confidentiality</strong>: only the right people can see it.
              </li>
              <li>
                <strong>Integrity</strong>: it stays correct and unaltered.
              </li>
              <li>
                <strong>Availability</strong>: it is accessible when needed.
              </li>
            </ul>
            <blockquote className="panel">
              <p className="eyebrow">Memory hook</p>
              <p>Confidentiality is about secrets. Integrity is about truth. Availability is about uptime.</p>
            </blockquote>

            <h3>1.2 The three things every secure system needs</h3>
            <ul>
              <li>
                <strong>People</strong>: behaviour, mistakes, incentives, trust.
              </li>
              <li>
                <strong>Process</strong>: repeatable steps, approvals, checks, incident plans.
              </li>
              <li>
                <strong>Technology</strong>: controls like encryption, MFA, firewalls, logging.
              </li>
            </ul>
            <p>If you ignore people, you build a perfect lock on a door nobody closes.</p>

            <h3>1.3 How professionals talk about secure</h3>
            <ul>
              <li>
                <strong>Asset</strong>: something valuable (database, laptop, reputation, service).
              </li>
              <li>
                <strong>Threat</strong>: something that could cause harm (criminal, flood, mistake).
              </li>
              <li>
                <strong>Vulnerability</strong>: a weakness that can be exploited (unpatched software, weak password).
              </li>
              <li>
                <strong>Risk</strong>: chance of loss when a threat meets a vulnerability.
              </li>
            </ul>
            <div className="panel">
              <p className="eyebrow">Risk formula</p>
              <p className="mono">Risk = Likelihood × Impact</p>
              <p className="muted">Use it to prioritise.</p>
            </div>

            <h3>1.4 Practice tool: Cybersecurity translator</h3>
            <div className="panel stack">
              <p className="eyebrow">Mission</p>
              <ol className="stack">
                <li>Pick a scenario: lost phone, phishing email, WiFi at a cafe.</li>
                <li>Fill four boxes: asset, threat, vulnerability, risk.</li>
                <li>Generate a short executive summary and a beginner summary.</li>
                <li>Edit until it feels true.</li>
              </ol>
            </div>

            <h3>1.5 Beginner questions</h3>
            <ol className="stack">
              <li>Define cybersecurity without using the word protect.</li>
              <li>Explain confidentiality with a real example.</li>
              <li>Explain integrity with a real example.</li>
              <li>Explain availability with a real example.</li>
              <li>What is an asset? Give three examples.</li>
              <li>What is a threat? Give three examples.</li>
              <li>What is a vulnerability? Give three examples.</li>
              <li>Explain risk using Risk = Likelihood × Impact.</li>
              <li>Why do people matter as much as technology?</li>
              <li>If you could improve only one of people, process, or technology first, which and why?</li>
            </ol>
          </section>

          <section id="data" className="note-section">
            <h2>2 Data: from bits to meaning</h2>
            <h3>2.1 Bits and bytes, explained physically</h3>
            <p>
              A computer is a physical machine using two states (high or low voltage). That is why it stores information as <strong>bits</strong>.
            </p>
            <p className="mono">bit ∈ {`{0,1}`}</p>
            <p>A byte is 8 bits. A byte has 256 distinct values (0 to 255).</p>
            <blockquote className="panel">
              <p className="eyebrow">Tiny memory trick</p>
              <p>8 bits is one byte. 2 to the power 8 is 256.</p>
            </blockquote>

            <h3>2.2 Number bases: binary, decimal, hex</h3>
            <p>Humans like base 10. Computers like base 2. Cybersecurity often shows base 16 (hex) because it is compact.</p>
            <div className="panel stack">
              <p className="eyebrow">Binary</p>
              <p className="mono">1011₂ = 11₁₀</p>
            </div>
            <div className="panel stack">
              <p className="eyebrow">Hex basics</p>
              <p>Hex uses digits 0 to 9 then A to F. One hex digit is four bits (16 = 2⁴). Two hex digits are one byte.</p>
              <p className="mono">11111111₂ = 255₁₀ = FF₁₆</p>
            </div>

            <h3>2.3 ASCII, Unicode, and UTF-8</h3>
            <p>
              Computers store text as numbers. An <strong>encoding</strong> maps characters to bytes. ASCII covers common English characters. Unicode is universal. UTF-8 encodes Unicode, keeps ASCII for the first 128 characters, and uses more bytes for others.
            </p>
            <blockquote className="panel">
              <p className="eyebrow">Why cybersecurity cares</p>
              <p>Security bugs often happen when systems interpret the same bytes differently.</p>
            </blockquote>

            <h3>2.4 Data integrity: checksums vs cryptographic hashes</h3>
            <p>A checksum is designed to detect accidents. A cryptographic hash is designed to resist attackers.</p>
            <div className="panel stack">
              <p className="eyebrow">Hashing quick check</p>
              <label className="control">
                Enter text to hash
                <textarea
                  value={hashInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    setHashInput(value);
                    computeHash(value);
                  }}
                  rows={3}
                />
              </label>
              <div className="control-row">
                <button className="button primary" type="button" onClick={() => computeHash(hashInput)}>
                  Compute hash (SHA-256)
                </button>
                {hashOutput && <p className="mono">{hashOutput}</p>}
              </div>
              <p className="muted">Notice the avalanche effect when you change a single character.</p>
            </div>

            <h3>2.5 Practice tools</h3>
            <ul>
              <li>Text to bytes lab: see text become bytes, binary, and hex.</li>
              <li>Base conversion trainer: make binary and hex feel normal.</li>
            </ul>

            <h3>2.6 Beginner questions</h3>
            <ol className="stack">
              <li>What is a bit in physical terms?</li>
              <li>Why is binary convenient for electronics?</li>
              <li>Why does 2⁸ = 256 matter in computing?</li>
              <li>Convert 1010₂ into decimal.</li>
              <li>Convert 13 into binary.</li>
              <li>Why does one hex digit match 4 bits?</li>
              <li>Convert FF₁₆ into decimal.</li>
              <li>What is the difference between Unicode and UTF-8?</li>
              <li>Why can encoding differences lead to security problems?</li>
              <li>Explain the difference between a checksum and a cryptographic hash.</li>
            </ol>
          </section>

          <section id="computers" className="note-section">
            <h2>3 Computers: how the machine thinks</h2>
            <h3>3.1 Hardware in the simplest correct model</h3>
            <ul>
              <li>CPU: executes instructions.</li>
              <li>RAM: fast temporary working memory.</li>
              <li>Storage: long term data, SSD or HDD.</li>
              <li>Network interface: moves data between machines.</li>
              <li>Operating system: the manager that controls everything safely.</li>
            </ul>

            <h3>3.2 The operating system as a security boundary</h3>
            <p>
              The operating system decides which program can run, what memory it can access, what files it can read or write, and what network connections it can open.
              Many cyber incidents are permission problems.
            </p>

            <h3>3.3 Processes, memory, and isolation</h3>
            <p>
              A <strong>process</strong> is a running program. A core security idea is <strong>isolation</strong>: one process should not read or modify another process memory. When isolation fails you get critical vulnerabilities.
            </p>

            <h3>3.4 Identity and permissions in plain English</h3>
            <ul>
              <li>
                <strong>Authentication</strong>: prove who you are.
              </li>
              <li>
                <strong>Authorisation</strong>: what you are allowed to do.
              </li>
              <li>
                <strong>Accounting</strong>: logs and evidence for investigations.
              </li>
            </ul>

            <h3>3.5 Practice tools</h3>
            <ul>
              <li>Permission theatre: learn least privilege without learning a command line.</li>
              <li>Memory and process visualiser: see what process isolation means.</li>
            </ul>

            <h3>3.6 Beginner questions</h3>
            <ol className="stack">
              <li>Define CPU, RAM, and storage with one sentence each.</li>
              <li>Why is RAM called temporary?</li>
              <li>What does the operating system control?</li>
              <li>What is a process?</li>
              <li>What does isolation mean in computing?</li>
              <li>Why is isolation important for security?</li>
              <li>Define authentication and give three examples.</li>
              <li>Define authorisation and give three examples.</li>
              <li>What does accounting mean in AAA?</li>
              <li>Explain least privilege using an example from a school or workplace.</li>
            </ol>
          </section>

          <section id="networks" className="note-section">
            <h2>4 Networks and the OSI model</h2>
            <h3>4.1 Networks as structured message delivery</h3>
            <p>A network moves data between devices. Large messages are broken into packets and reassembled.</p>
            <ul>
              <li>source address</li>
              <li>destination address</li>
              <li>sequence info</li>
              <li>payload data</li>
            </ul>

            <h3>4.2 IP addresses and ports</h3>
            <p>An IP address is the building address. A port is the door number for a specific service.</p>

            <h3>4.3 OSI model as a learning ladder</h3>
            <p>Seven layers from lowest to highest: Physical, Data link, Network, Transport, Session, Presentation, Application.</p>

            <h3>4.4 Layer by layer with what can go wrong</h3>
            <ul className="stack">
              <li>
                <strong>Layer 1 Physical</strong>: device theft, cable tapping.
              </li>
              <li>
                <strong>Layer 2 Data link</strong>: spoofing on local networks.
              </li>
              <li>
                <strong>Layer 3 Network</strong>: routing misconfigurations.
              </li>
              <li>
                <strong>Layer 4 Transport</strong>: port scanning, denial of service.
              </li>
              <li>
                <strong>Layer 5 Session</strong>: session hijacking concept.
              </li>
              <li>
                <strong>Layer 6 Presentation</strong>: parsing issues and encoding confusion.
              </li>
              <li>
                <strong>Layer 7 Application</strong>: phishing, SQL injection concept.
              </li>
            </ul>

            <h3>4.5 Practice tools</h3>
            <ul>
              <li>Packet postcard studio: see headers and payload without real captures.</li>
              <li>OSI stack builder: drag and drop layer cards and check answers.</li>
            </ul>

            <h3>4.6 Beginner questions</h3>
            <ol className="stack">
              <li>What is a packet in your own words?</li>
              <li>Why split data into packets?</li>
              <li>What is an IP address?</li>
              <li>What is a port?</li>
              <li>Name the OSI layers in order.</li>
              <li>Which layer handles routing?</li>
              <li>Which layer is closest to the user?</li>
              <li>Give one example threat at layer 1.</li>
              <li>Give one example threat at layer 7.</li>
              <li>Explain why OSI helps when diagnosing incidents.</li>
            </ol>
          </section>

          <section id="goals" className="note-section">
            <h2>5 Security goals and core frameworks</h2>
            <h3>5.1 CIA triad with real life examples</h3>
            <p>
              Confidentiality looks like locked messages and access controls. Integrity looks like tamper evidence and verification. Availability looks like resilience, redundancy, and recovery.
            </p>

            <h3>5.2 STRIDE for beginners</h3>
            <ul>
              <li>Spoofing</li>
              <li>Tampering</li>
              <li>Repudiation</li>
              <li>Information disclosure</li>
              <li>Denial of service</li>
              <li>Elevation of privilege</li>
            </ul>

            <h3>5.3 Prevent, detect, respond, recover</h3>
            <ul>
              <li>Prevent: reduce likelihood.</li>
              <li>Detect: find problems early.</li>
              <li>Respond: act quickly and safely.</li>
              <li>Recover: restore service and improve.</li>
            </ul>

            <h3>5.4 Practice tools</h3>
            <ul>
              <li>STRIDE story maker: answer questions and get suggested controls.</li>
              <li>Risk matrix mini: rate likelihood and impact, place on a matrix.</li>
            </ul>

            <h3>5.5 Beginner questions</h3>
            <ol className="stack">
              <li>Define confidentiality and give one example.</li>
              <li>Define integrity and give one example.</li>
              <li>Define availability and give one example.</li>
              <li>What does STRIDE stand for?</li>
              <li>Give an example of spoofing.</li>
              <li>Give an example of tampering.</li>
              <li>Give an example of denial of service in real life terms.</li>
              <li>Why is prevention alone not enough?</li>
              <li>What should detection do for you?</li>
              <li>Difference between response and recovery?</li>
            </ol>
          </section>

          <section id="attacks" className="note-section">
            <h2>6 Common attacks you will meet first</h2>
            <h3>6.1 Phishing as human hacking</h3>
            <p>
              Phishing is a fraudulent message designed to trick you into revealing information, installing malware, or sending money. It often uses urgency and impersonation.
            </p>

            <h3>6.2 Malware and ransomware in plain language</h3>
            <p>
              Malware is software designed to harm. Ransomware encrypts your data and demands payment. It often hits confidentiality, integrity, and availability at once.
            </p>

            <h3>6.3 Hashing vs encryption, the common confusion</h3>
            <p>
              Hashing creates a fixed size fingerprint for integrity and authentication. Encryption protects confidentiality by making data unreadable without a key. Hashing is deterministic and hard to reverse.
            </p>

            <h3>6.4 Practice tools</h3>
            <ul>
              <li>Phishing spotter with confidence meter.</li>
              <li>Hashing playground using WebCrypto to teach the avalanche effect.</li>
            </ul>

            <h3>6.5 Beginner questions</h3>
            <ol className="stack">
              <li>What is phishing?</li>
              <li>What human emotion does phishing often exploit?</li>
              <li>What is malware?</li>
              <li>What is ransomware?</li>
              <li>Which CIA pillars does ransomware hit first?</li>
              <li>What is a hash in one sentence?</li>
              <li>Why is hashing not encryption?</li>
              <li>What does deterministic mean for hashes?</li>
              <li>Why is hard to reverse important?</li>
              <li>Name one safe action when you suspect phishing.</li>
            </ol>
          </section>

          <section id="defences" className="note-section">
            <h2>7 The first defences that actually work</h2>
            <h3>7.1 Passwords, passphrases, and entropy</h3>
            <p>A passphrase is long, memorable, and hard to guess. Entropy is about unpredictability. Length and uniqueness beat clever substitutions.</p>

            <h3>7.2 MFA and why it changes the game</h3>
            <p>
              MFA means using more than one factor: something you know, something you have, something you are. Even if a password is stolen, MFA can block access.
            </p>

            <h3>7.3 Updates, backups, and recovery</h3>
            <p>Updates reduce vulnerabilities. Backups protect availability. Rule: 3 copies, 2 storage types, 1 offsite.</p>

            <h3>7.4 Practice tools</h3>
            <ul>
              <li>Passphrase builder.</li>
              <li>MFA simulator.</li>
              <li>Backup planner.</li>
            </ul>

            <h3>7.5 Beginner questions</h3>
            <ol className="stack">
              <li>What is a passphrase?</li>
              <li>What is entropy in simple language?</li>
              <li>Why is password reuse dangerous?</li>
              <li>What does MFA mean?</li>
              <li>Name the factor categories.</li>
              <li>Why do updates matter?</li>
              <li>What is a backup for?</li>
              <li>Explain the 3 2 1 rule.</li>
              <li>Which control is preventive, MFA or backups?</li>
              <li>Which control is corrective, MFA or backups, and why?</li>
            </ol>
          </section>

          <section id="studio" className="note-section">
            <h2>8 Practice studio</h2>
            <blockquote className="panel">
              <p className="eyebrow">Premium lab bench</p>
              <p>Each tool is a minimal card with an input, an output, and a short mission. Collapse tools if you want pure reading.</p>
            </blockquote>
            <h3>8.1 Tool catalogue</h3>
            <ul>
              <li>Translator: asset, threat, vulnerability, risk.</li>
              <li>Text to bytes.</li>
              <li>Base conversion trainer.</li>
              <li>Permission theatre.</li>
              <li>Packet postcard studio.</li>
              <li>OSI stack builder.</li>
              <li>STRIDE story maker.</li>
              <li>Risk matrix mini.</li>
              <li>Phishing spotter.</li>
              <li>Hashing playground.</li>
              <li>Passphrase builder.</li>
              <li>MFA simulator.</li>
              <li>Backup planner.</li>
            </ul>
            <h3>8.2 Step by step practice flow</h3>
            <ol className="stack">
              <li>Read a section.</li>
              <li>Do the tool mission.</li>
              <li>Answer the mini questions.</li>
              <li>Continue.</li>
            </ol>
            <p className="muted">Add a calm mark-as-done toggle per section stored locally.</p>
          </section>

          <section id="checkpoint" className="note-section">
            <h2>9 Beginner checkpoint</h2>
            <h3>9.1 Mini test</h3>
            <p>Deliver one question at a time with immediate feedback. Store results locally unless a user opts in.</p>
            <h3>9.2 The one paragraph summary you should be able to say</h3>
            <p>
              By the end of this chapter you should be able to explain what cybersecurity protects, how data becomes bytes, how networks move packets, why the OSI model matters, what CIA triad means, how to think in threats and risk, and why simple controls like MFA, updates, and backups prevent most everyday harm.
            </p>
            <div className="panel stack">
              <p className="eyebrow">Browser Python (hidden code)</p>
              <p className="muted">Generate and inspect a small RSA key pair locally. Code stays hidden.</p>
              <RsaPlayground />
            </div>
          </section>
        </article>
      </div>
    </Layout>
  );
}
