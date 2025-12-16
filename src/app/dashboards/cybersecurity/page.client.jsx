"use client";

import dynamic from "next/dynamic";
import NotesLayout from "@/components/NotesLayout";
import ProgressBar from "@/components/notes/ProgressBar";
import ToolCard from "@/components/notes/ToolCard";
import ConceptCallout from "@/components/notes/Callout";
import DynamicDashboardLoader from "@/components/dashboard/DynamicDashboardLoader";
import SourceAndLicensing from "@/components/dashboard/SourceAndLicensing";

const PasswordEntropyDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/PasswordEntropyDashboard"), { ssr: false });
const HashingPlaygroundDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/HashingPlaygroundDashboard"), { ssr: false });
const SymmetricCryptoLabDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/SymmetricCryptoLabDashboard"), { ssr: false });
const PublicPrivateKeyLabDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/PublicPrivateKeyLabDashboard"), { ssr: false });
const TLSToyHandshakeDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/TLSToyHandshakeDashboard"), { ssr: false });
const UrlSafetyChecklistDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/UrlSafetyChecklistDashboard"), { ssr: false });
const DnsResolutionExplorerDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/DnsResolutionExplorerDashboard"), { ssr: false });
const PortSurfaceConceptDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/PortSurfaceConceptDashboard"), { ssr: false });
const NetworkZonesMapDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/NetworkZonesMapDashboard"), { ssr: false });
const ThreatModelCanvasDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/ThreatModelCanvasDashboard"), { ssr: false });
const RiskMatrixBuilderDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/RiskMatrixBuilderDashboard"), { ssr: false });
const AccessControlMatrixDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/AccessControlMatrixDashboard"), { ssr: false });
const DataClassificationDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/DataClassificationDashboard"), { ssr: false });
const LogTriageSandboxDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/LogTriageSandboxDashboard"), { ssr: false });
const PhishingEmailTrainerDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/PhishingEmailTrainerDashboard"), { ssr: false });
const VulnerabilityRegisterDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/VulnerabilityRegisterDashboard"), { ssr: false });
const ControlCoverageMapDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/ControlCoverageMapDashboard"), { ssr: false });
const IncidentTimelineDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/IncidentTimelineDashboard"), { ssr: false });
const RedBlueExercisePlannerDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/RedBlueExercisePlannerDashboard"), { ssr: false });
const PolicyExceptionRegisterDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/PolicyExceptionRegisterDashboard"), { ssr: false });

const sections = [
  { title: "Overview", anchor: "overview" },
  { title: "Password strength and entropy", anchor: "password-entropy" },
  { title: "Hashing and salting playground", anchor: "hashing-playground" },
  { title: "Symmetric encryption lab", anchor: "symmetric-crypto-lab" },
  { title: "Public and private key lab", anchor: "public-private-key-lab" },
  { title: "TLS toy handshake", anchor: "tls-toy-handshake" },
  { title: "URL safety checklist", anchor: "url-safety-checklist" },
  { title: "DNS resolution explorer", anchor: "dns-resolution-explorer" },
  { title: "Port and service surface concept", anchor: "port-surface-concept" },
  { title: "Network zones map", anchor: "network-zones-map" },
  { title: "Threat model canvas", anchor: "threat-model-canvas" },
  { title: "Risk matrix builder", anchor: "risk-matrix-builder" },
  { title: "Access control matrix", anchor: "access-control-matrix" },
  { title: "Data classification board", anchor: "data-classification-board" },
  { title: "Log triage sandbox", anchor: "log-triage-sandbox" },
  { title: "Phishing email trainer", anchor: "phishing-email-trainer" },
  { title: "Vulnerability register", anchor: "vulnerability-register" },
  { title: "Control coverage map", anchor: "control-coverage-map" },
  { title: "Incident timeline builder", anchor: "incident-timeline-builder" },
  { title: "Red team and blue team planner", anchor: "red-blue-exercise-planner" },
  { title: "Policy and exception register", anchor: "policy-exception-register" },
];

export default function ClientPage() {
  return (
    <NotesLayout
      meta={{
        title: "Cybersecurity dashboards",
        description: "Interactive cybersecurity sandboxes covering passwords, crypto, networks, threats, risk, and governance.",
        section: "cybersecurity",
        slug: "/dashboards/cybersecurity",
        level: "Dashboards",
      }}
      headings={sections.map((s) => ({ id: s.anchor, title: s.title, depth: 2 }))}
    >
      <main className="relative flex-1 space-y-10">
        <ProgressBar />
        <header className="rounded-3xl border border-gray-200 bg-white/90 p-5 shadow-sm backdrop-blur">
          <p className="eyebrow m-0 text-gray-600">Dashboards · Cybersecurity</p>
          <h1 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">Cybersecurity dashboards</h1>
          <p className="max-w-2xl text-sm text-gray-700">
            Safe, client-side practice environments covering passwords, crypto, networks, threats, risk, and governance. Nothing
            here scans the internet or stores your inputs.
          </p>
        </header>

        <style jsx global>{`
          /* Light, high-contrast skin scoped to the cybersecurity dashboards */
          #cyber-dashboards {
            background: #f9fafb;
          }
          /* Soften all dark slate surfaces into light cards */
          #cyber-dashboards [class*="bg-slate-9"],
          #cyber-dashboards [class*="bg-slate-8"],
          #cyber-dashboards [class*="bg-slate-7"] {
            background-color: #ffffff !important;
          }
          #cyber-dashboards [class*="ring-slate"] {
            box-shadow: inset 0 0 0 1px #e5e7eb !important;
            border-color: #e5e7eb !important;
          }
          /* Harmonise text to dark-on-light */
          #cyber-dashboards [class*="text-slate-50"],
          #cyber-dashboards [class*="text-slate-100"],
          #cyber-dashboards [class*="text-slate-200"],
          #cyber-dashboards [class*="text-slate-300"] {
            color: #0f172a !important;
          }
          #cyber-dashboards [class*="text-slate-400"],
          #cyber-dashboards [class*="text-slate-500"],
          #cyber-dashboards [class*="text-slate-600"] {
            color: #334155 !important;
          }
          /* Inputs and select controls */
          #cyber-dashboards input[type="text"],
          #cyber-dashboards input[type="number"],
          #cyber-dashboards input[type="email"],
          #cyber-dashboards input[type="password"],
          #cyber-dashboards input[type="range"],
          #cyber-dashboards textarea,
          #cyber-dashboards select {
            background-color: #ffffff !important;
            color: #0f172a !important;
            border: 1px solid #d1d5db !important;
          }
          #cyber-dashboards input[type="range"]::-webkit-slider-thumb {
            background-color: #0ea5e9 !important;
          }
          #cyber-dashboards input[type="range"]::-moz-range-thumb {
            background-color: #0ea5e9 !important;
          }
          /* Progress bars and meters */
          #cyber-dashboards .h-2,
          #cyber-dashboards .overflow-hidden.rounded-full {
            background-color: #e5e7eb !important;
          }
          /* Cards and panels */
          #cyber-dashboards [class*="rounded-2xl"],
          #cyber-dashboards [class*="rounded-xl"] {
            box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08) !important;
          }
          /* Ensure readable text on colored fills */
          #cyber-dashboards [class*="bg-red-"],
          #cyber-dashboards [class*="bg-orange-"],
          #cyber-dashboards [class*="bg-yellow-"],
          #cyber-dashboards [class*="bg-green-"],
          #cyber-dashboards [class*="bg-blue-"],
          #cyber-dashboards [class*="bg-purple-"],
          #cyber-dashboards [class*="bg-emerald-"] {
            color: #0f172a !important;
          }
          #cyber-dashboards [class*="text-red-"],
          #cyber-dashboards [class*="text-orange-"],
          #cyber-dashboards [class*="text-yellow-"],
          #cyber-dashboards [class*="text-green-"],
          #cyber-dashboards [class*="text-blue-"],
          #cyber-dashboards [class*="text-purple-"],
          #cyber-dashboards [class*="text-emerald-"] {
            color: #0f172a !important;
          }
          /* Minimum readable sizes */
          #cyber-dashboards .text-xs,
          #cyber-dashboards [class*="text-[0.65rem]"],
          #cyber-dashboards [class*="text-[0.7rem]"] {
            font-size: 0.9rem !important;
          }
        `}</style>

        <article className="prose prose-slate max-w-none dark:prose-invert" id="cyber-dashboards">
          <section id="overview" className="rn-section" style={{ marginTop: "0" }}>
            <h2 className="rn-h2">Overview</h2>
            <p className="rn-body">
              These dashboards are safe practice environments. They do not scan the internet or attack anything. They help you see
              core security ideas with small interactive examples, from passwords and crypto to threats, logs, risk and
              governance.
            </p>
            <ConceptCallout>
              These dashboards are educational. They are not a full penetration test or a formal security audit. Use them
              responsibly and only on systems you own or are allowed to test.
            </ConceptCallout>
          </section>

          <section id="password-entropy" className="rn-section">
            <h2 className="rn-h2">Password strength and entropy</h2>
            <p className="rn-body">
              Password strength is often described in vague language. Entropy gives a clearer way to think about how many guesses
              an attacker might need. This dashboard helps you see how length and character set affect the search space.
            </p>
            <p className="rn-body">
              You type a password pattern and choose which character sets it uses such as letters, digits or symbols. The tool
              estimates search space size and a rough time to crack for different attacker speeds. It does not store real
              passwords. It is a way to build intuition for what strong really means.
            </p>
            <ToolCard title="Password entropy dashboard" description="Explore how length and character sets affect password search space.">
              <DynamicDashboardLoader>
                <PasswordEntropyDashboard />
              </DynamicDashboardLoader>
            </ToolCard>
          </section>

          <section id="hashing-playground" className="rn-section">
            <h2 className="rn-h2">Hashing and salting playground</h2>
            <p className="rn-body">
              Hash functions turn input data into fixed length outputs. They are designed to be one way. Salting adds unique random
              data so that identical passwords do not produce identical hashes. This dashboard shows those effects in a controlled
              way.
            </p>
            <p className="rn-body">
              You enter a short phrase and a salt. The tool shows hashes for common algorithms and how tiny input changes lead to
              very different outputs. It also shows how using a salt makes rainbow table style attacks harder.
            </p>
            <ToolCard title="Hashing playground" description="Type text and salt to see how hash outputs change.">
              <DynamicDashboardLoader>
                <HashingPlaygroundDashboard />
              </DynamicDashboardLoader>
            </ToolCard>
          </section>

          <section id="symmetric-crypto-lab" className="rn-section">
            <h2 className="rn-h2">Symmetric encryption lab</h2>
            <p className="rn-body">
              Symmetric encryption uses the same key to encrypt and decrypt. It protects confidentiality when both parties can keep
              the key safe. This lab lets you see encryption and decryption on small messages with a shared key.
            </p>
            <p className="rn-body">
              You supply a short message and a key phrase. The tool uses the browser crypto API to encrypt and decrypt locally. It
              shows the ciphertext and confirms that the original message can be recovered when the same key is used.
            </p>
            <ToolCard title="Symmetric encryption lab" description="Encrypt and decrypt small messages with a shared key in your browser.">
              <DynamicDashboardLoader>
                <SymmetricCryptoLabDashboard />
              </DynamicDashboardLoader>
            </ToolCard>
          </section>

          <section id="public-private-key-lab" className="rn-section">
            <h2 className="rn-h2">Public and private key lab</h2>
            <p className="rn-body">
              Public key systems use a key pair. The public key can be shared. The private key must be kept secret. They are used
              for confidentiality, signatures and key exchange. This lab gives you a small, visual way to see that relationship.
            </p>
            <p className="rn-body">
              You generate a key pair in the browser. You can then encrypt a short message with the public key and decrypt with the
              private key, as well as sign a message and verify the signature. It connects directly to your notes on public and
              private keys.
            </p>
            <ToolCard
              title="Public and private key lab"
              description="Generate a key pair and try simple encrypt, decrypt, sign and verify flows."
            >
              <DynamicDashboardLoader>
                <PublicPrivateKeyLabDashboard />
              </DynamicDashboardLoader>
            </ToolCard>
          </section>

          <section id="tls-toy-handshake" className="rn-section">
            <h2 className="rn-h2">TLS toy handshake</h2>
            <p className="rn-body">
              Transport Layer Security protects data in transit. The handshake is the process where client and server agree keys
              and parameters. The real protocol is detailed, but the core idea can be shown in a simplified sequence.
            </p>
            <p className="rn-body">
              This dashboard lets you step through a toy handshake. Each step shows what is sent, which key is used and what each
              side learns. It does not perform real network traffic. It is an animated, visual story.
            </p>
            <ToolCard title="TLS toy handshake" description="Step through a simplified TLS style handshake and see what each side learns.">
              <DynamicDashboardLoader>
                <TLSToyHandshakeDashboard />
              </DynamicDashboardLoader>
            </ToolCard>
          </section>

          <section id="url-safety-checklist" className="rn-section">
            <h2 className="rn-h2">URL safety checklist</h2>
            <p className="rn-body">
              Many attacks rely on misleading links. Looking closely at a URL gives early warning before any request is made. This
              dashboard helps you practise reading URLs and spotting common signs of trouble.
            </p>
            <p className="rn-body">
              You paste a URL string. The tool parses it locally and highlights patterns such as punycode, lookalike domains and
              long query strings. It does not fetch the URL or call any external service. It is purely a static check and training
              aid.
            </p>
            <ToolCard title="URL safety checklist" description="Paste a URL and get a simple, local safety checklist.">
              <DynamicDashboardLoader>
                <UrlSafetyChecklistDashboard />
              </DynamicDashboardLoader>
            </ToolCard>
          </section>

          <section id="dns-resolution-explorer" className="rn-section">
            <h2 className="rn-h2">DNS resolution explorer</h2>
            <p className="rn-body">
              Domain Name System resolution turns names into addresses. Attackers can misuse DNS through hijacking or spoofing.
              Understanding the normal lookup steps makes abnormal behaviour easier to reason about.
            </p>
            <p className="rn-body">
              This dashboard lets you type a hostname and step through a simulated lookup chain, from local cache through resolvers
              to authoritative servers. It does not query real DNS. It is a local, animated explanation.
            </p>
            <ToolCard title="DNS resolution explorer" description="Walk through a simulated DNS lookup for a hostname.">
              <DynamicDashboardLoader>
                <DnsResolutionExplorerDashboard />
              </DynamicDashboardLoader>
            </ToolCard>
          </section>

          <section id="port-surface-concept" className="rn-section">
            <h2 className="rn-h2">Port and service surface concept</h2>
            <p className="rn-body">
              Open ports expose services. The more open ports you have, the more surface there is to defend. This dashboard gives a
              safe, conceptual way to see a host with a small set of ports and services.
            </p>
            <p className="rn-body">
              You toggle ports on and off and map simple services to them. The view shows how the visible surface grows or shrinks.
              It reinforces the idea that closing unused services is a powerful control.
            </p>
            <ToolCard title="Port and service surface" description="Toggle simple ports and services to see how attack surface changes.">
              <DynamicDashboardLoader>
                <PortSurfaceConceptDashboard />
              </DynamicDashboardLoader>
            </ToolCard>
          </section>

          <section id="network-zones-map" className="rn-section">
            <h2 className="rn-h2">Network zones map</h2>
            <p className="rn-body">
              Many architectures use zones such as internet, demilitarised zone and internal network. Firewalls and gateways manage
              traffic between zones. A simple map helps make this visible.
            </p>
            <p className="rn-body">
              This dashboard lets you drag simple icons representing systems into zones and mark allowed flows. It highlights paths
              from internet to high value systems so you can see where controls are most important.
            </p>
            <ToolCard title="Network zones map" description="Arrange systems into zones and see where traffic is allowed.">
              <DynamicDashboardLoader>
                <NetworkZonesMapDashboard />
              </DynamicDashboardLoader>
            </ToolCard>
          </section>

          <section id="threat-model-canvas" className="rn-section">
            <h2 className="rn-h2">Threat model canvas</h2>
            <p className="rn-body">
              Threat modelling is a structured way to think about what could go wrong. It looks at assets, actors, entry points and
              trust boundaries. A canvas view keeps this simple and repeatable.
            </p>
            <p className="rn-body">
              This dashboard guides you through listing assets, key actors, important trust boundaries and likely threats. It then
              produces a short summary of the main concerns to carry into design and control choices.
            </p>
            <ToolCard title="Threat model canvas" description="Capture assets, actors, boundaries and threats in one view.">
              <DynamicDashboardLoader>
                <ThreatModelCanvasDashboard />
              </DynamicDashboardLoader>
            </ToolCard>
          </section>

          <section id="risk-matrix-builder" className="rn-section">
            <h2 className="rn-h2">Risk matrix builder</h2>
            <p className="rn-body">
              Risk is often described as likelihood and impact. A risk matrix is a simple visual that helps teams discuss which
              risks matter most. This dashboard makes a small, interactive matrix for security risks.
            </p>
            <p className="rn-body">
              You add risk entries and set likelihood and impact on a three or five point scale. The matrix view shows which risks
              cluster in the top right so they are harder to ignore.
            </p>
            <ToolCard
              title="Risk matrix builder"
              description="Add security risks and place them on a small likelihood and impact grid."
            >
              <DynamicDashboardLoader>
                <RiskMatrixBuilderDashboard />
              </DynamicDashboardLoader>
            </ToolCard>
          </section>

          <section id="access-control-matrix" className="rn-section">
            <h2 className="rn-h2">Access control matrix</h2>
            <p className="rn-body">
              Access control is about who can do what on which resource. A matrix is a clear way to see roles and permissions. It
              also shows where privileges are excessive.
            </p>
            <p className="rn-body">
              This dashboard lets you define roles and resources, then grant read, write or admin permissions. It highlights entries
              that might be risky such as admin on sensitive resources.
            </p>
            <ToolCard title="Access control matrix" description="Map roles to resources and see where access is too broad.">
              <DynamicDashboardLoader>
                <AccessControlMatrixDashboard />
              </DynamicDashboardLoader>
            </ToolCard>
          </section>

          <section id="data-classification-board" className="rn-section">
            <h2 className="rn-h2">Data classification board</h2>
            <p className="rn-body">
              Data classification labels such as public, internal and confidential guide how data is handled. A simple board makes
              these labels concrete.
            </p>
            <p className="rn-body">
              This dashboard lets you place example data items into classes and shows suggested handling rules. It is a quick way to
              practise consistent classification.
            </p>
            <ToolCard title="Data classification board" description="Place example data items into labels and see handling rules.">
              <DynamicDashboardLoader>
                <DataClassificationDashboard />
              </DynamicDashboardLoader>
            </ToolCard>
          </section>

          <section id="log-triage-sandbox" className="rn-section">
            <h2 className="rn-h2">Log triage sandbox</h2>
            <p className="rn-body">
              Security teams live in logs. Triage is the process of deciding which events matter. This sandbox presents small,
              synthetic log lines and lets you practise sorting them into noise or signal.
            </p>
            <p className="rn-body">
              You see short log entries and choose whether they look normal, suspicious or urgent. The tool explains what an analyst
              might think when seeing each pattern.
            </p>
            <ToolCard title="Log triage sandbox" description="Classify small synthetic log entries and compare with an analyst view.">
              <DynamicDashboardLoader>
                <LogTriageSandboxDashboard />
              </DynamicDashboardLoader>
            </ToolCard>
          </section>

          <section id="phishing-email-trainer" className="rn-section">
            <h2 className="rn-h2">Phishing email trainer</h2>
            <p className="rn-body">
              Phishing remains a common way in. Training works best when people can practise on realistic examples. This trainer
              shows short, synthetic emails and lets you decide whether to trust them.
            </p>
            <p className="rn-body">
              You mark each example as safe or suspicious. The dashboard then reveals key clues you may have missed. It does not use
              real mail. It is purely a local exercise.
            </p>
            <ToolCard title="Phishing email trainer" description="Review synthetic emails and practise spotting phishing clues.">
              <DynamicDashboardLoader>
                <PhishingEmailTrainerDashboard />
              </DynamicDashboardLoader>
            </ToolCard>
          </section>

          <section id="vulnerability-register" className="rn-section">
            <h2 className="rn-h2">Vulnerability register</h2>
            <p className="rn-body">
              Vulnerabilities need to be tracked and prioritised. A small register that records system, weakness, severity and
              status is a practical tool.
            </p>
            <p className="rn-body">
              This dashboard lets you record sample vulnerabilities and mark their remediation state. It highlights which ones are
              overdue based on a simple age rule.
            </p>
            <ToolCard title="Vulnerability register" description="Capture vulnerabilities with severity and remediation status.">
              <DynamicDashboardLoader>
                <VulnerabilityRegisterDashboard />
              </DynamicDashboardLoader>
            </ToolCard>
          </section>

          <section id="control-coverage-map" className="rn-section">
            <h2 className="rn-h2">Control coverage map</h2>
            <p className="rn-body">
              Security frameworks contain many controls. It is rare to implement all of them. A coverage map shows which control
              families are strong and which are weak.
            </p>
            <p className="rn-body">
              This dashboard uses a small set of control families such as identity, network and application. You rate implementation
              strength and see a heat view.
            </p>
            <ToolCard title="Control coverage map" description="Rate control families and see a simple coverage heatmap.">
              <DynamicDashboardLoader>
                <ControlCoverageMapDashboard />
              </DynamicDashboardLoader>
            </ToolCard>
          </section>

          <section id="incident-timeline-builder" className="rn-section">
            <h2 className="rn-h2">Incident timeline builder</h2>
            <p className="rn-body">
              Incident reviews are more useful when the sequence of events is clear. A simple timeline with events and impact helps
              teams learn.
            </p>
            <p className="rn-body">
              This dashboard lets you add events with time and category. It draws a visual timeline and prompts you to record key
              lessons.
            </p>
            <ToolCard title="Incident timeline builder" description="Build a small incident timeline and capture lessons.">
              <DynamicDashboardLoader>
                <IncidentTimelineDashboard />
              </DynamicDashboardLoader>
            </ToolCard>
          </section>

          <section id="red-blue-exercise-planner" className="rn-section">
            <h2 className="rn-h2">Red team and blue team planner</h2>
            <p className="rn-body">
              Exercises where one group attacks and another defends are powerful learning tools. Planning them carefully keeps them
              safe and useful.
            </p>
            <p className="rn-body">
              This dashboard helps you outline objectives, scope, rules and expected learning for a small red team or blue team
              style exercise.
            </p>
            <ToolCard title="Red and blue exercise planner" description="Outline scope, objectives and safety rules for a security exercise.">
              <DynamicDashboardLoader>
                <RedBlueExercisePlannerDashboard />
              </DynamicDashboardLoader>
            </ToolCard>
          </section>

          <section id="policy-exception-register" className="rn-section">
            <h2 className="rn-h2">Policy and exception register</h2>
            <p className="rn-body">
              Exceptions to policy are sometimes necessary. They are safer when recorded and time bound. A simple register keeps
              them transparent.
            </p>
            <p className="rn-body">
              This dashboard lets you record exceptions with reason, owner and review date. It highlights exceptions that are near
              or past review.
            </p>
            <ToolCard title="Policy and exception register" description="Track policy exceptions with clear ownership and review dates.">
              <DynamicDashboardLoader>
                <PolicyExceptionRegisterDashboard />
              </DynamicDashboardLoader>
            </ToolCard>
          </section>

          <section id="data-limits" className="rn-section">
            <h2 className="rn-h2">Data and limits</h2>
            <p className="rn-body">
              All dashboards on this page run entirely client-side. No external calls. No data collection. They use sample datasets
              and synthetic examples designed for learning.
            </p>
            <SourceAndLicensing
              title="Sources and licensing"
              updatedAtISO="2025-12-14"
              sources={[
                {
                  name: "Ransfords Notes, educational dashboards",
                  licence: "All components are client-side only",
                  notes: "No external calls. No scanning. All visualisations generated in the browser.",
                },
              ]}
              disclaimers={[
                "Educational content, not advice.",
                "Do not use these dashboards as a basis for operational decisions without proper analysis.",
                "No user data is collected by this page.",
              ]}
            />
          </section>
        </article>
      </main>
    </NotesLayout>
  );
}
