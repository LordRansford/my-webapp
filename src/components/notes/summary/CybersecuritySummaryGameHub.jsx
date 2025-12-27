"use client";

import GameHub from "@/components/GameHub";
import CryptoMisuseSimulator from "@/tools/cybersecurity/CryptoMisuseSimulator";
import TrustBoundaryExplorer from "@/tools/cybersecurity/TrustBoundaryExplorer";
import LoggingBlindSpotSimulator from "@/tools/cybersecurity/LoggingBlindSpotSimulator";
import PrivilegeEscalationGame from "@/tools/cybersecurity/PrivilegeEscalationGame";

const games = [
  {
    id: "crypto_misuse",
    title: "Hash, encrypt or sign?",
    level: "Warm up",
    minutes: 5,
    summary: "Choose the right primitive for a work document, a login flow, or a shared file.",
    component: (
      <div className="space-y-3">
        <p className="text-sm text-slate-800">
          Skill focus: choosing the right primitive for the job. You are practising confidentiality, integrity, and authenticity as a decision.
        </p>
        <CryptoMisuseSimulator storageKey="cyber_game_crypto_misuse" />
        <p className="text-sm text-slate-800">
          Reflection: where would your organisation pick the wrong option because it is convenient. What default would prevent that mistake without slowing delivery.
        </p>
      </div>
    ),
  },
  {
    id: "trust_boundary",
    title: "Spot the trust boundary",
    level: "Core",
    minutes: 6,
    summary: "Mark where trust changes in logins, shared folders, or admin pages.",
    component: (
      <div className="space-y-3">
        <p className="text-sm text-slate-800">
          Skill focus: seeing where assumptions change. Trust boundaries are where controls and logging need to get serious.
        </p>
        <TrustBoundaryExplorer storageKey="cyber_game_trust_boundary" />
        <p className="text-sm text-slate-800">
          Reflection: which boundary in your real systems is treated as internal so it is fine. What would you do first. Tighten access, add checks, or improve detection.
        </p>
      </div>
    ),
  },
  {
    id: "logging_blind_spot",
    title: "The silent logging failure",
    level: "Core",
    minutes: 6,
    summary: "Tune logging around a suspicious email login and see what you miss.",
    component: (
      <div className="space-y-3">
        <p className="text-sm text-slate-800">
          Skill focus: choosing logs that support decisions under pressure. You are learning the difference between noise, signals, and missing evidence.
        </p>
        <LoggingBlindSpotSimulator storageKey="cyber_game_logging_blind_spot" />
        <p className="text-sm text-slate-800">
          Reflection: if this happened tomorrow, what could you prove from your current logs. Name the first two log sources you would require to reduce guesswork.
        </p>
      </div>
    ),
  },
  {
    id: "privilege_escalation",
    title: "Privilege escalation quick play",
    level: "Stretch",
    minutes: 7,
    summary: "Assign roles for a small team or a kids gaming account and spot gaps.",
    component: (
      <div className="space-y-3">
        <p className="text-sm text-slate-800">
          Skill focus: least privilege in practice. You are identifying roles, risky permissions, and safe defaults that reduce blast radius.
        </p>
        <PrivilegeEscalationGame storageKey="cyber_game_privilege_escalation" />
        <p className="text-sm text-slate-800">
          Reflection: which role in your system is too broad. What two permissions would you remove first if you had to reduce risk without breaking work.
        </p>
      </div>
    ),
  },
];

export default function CybersecuritySummaryGameHub() {
  return (
    <GameHub
      storageKey="cyber_summary_games"
      title={null}
      subtitle="Choose a game. Make the call. See the consequences."
      games={games}
    />
  );
}

