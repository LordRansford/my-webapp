"use client";

import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";

export default function MfaDeepDiveLab() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "mfa-deep-dive-lab",
    initial_state: { selectedMethod: "sms" },
  });

  if (!is_ready) return <p className="text-sm text-gray-600">Loading...</p>;

  const methods = {
    sms: {
      name: "SMS (Text Message)",
      security: "Low",
      pros: ["Easy to set up", "Widely supported", "No app needed"],
      cons: ["Vulnerable to SIM swap attacks", "Can be intercepted", "Requires cell signal"],
      recommendation: "Use only if no other option available",
      color: "red"
    },
    app: {
      name: "Authenticator App (TOTP)",
      security: "High",
      pros: ["Works offline", "Not vulnerable to SIM swap", "Free apps available"],
      cons: ["Requires smartphone", "Must backup codes", "Can lose access if phone lost"],
      recommendation: "Recommended for most users",
      color: "green"
    },
    hardware: {
      name: "Hardware Token (YubiKey)",
      security: "Very High",
      pros: ["Phishing resistant", "No batteries needed", "Extremely secure"],
      cons: ["Costs money ($25-50)", "Can be lost/damaged", "Not universally supported"],
      recommendation: "Best for high-value accounts",
      color: "blue"
    },
    biometric: {
      name: "Biometrics (Fingerprint/Face)",
      security: "Moderate",
      pros: ["Very convenient", "Can't forget", "Fast authentication"],
      cons: ["Can't change if compromised", "Privacy concerns", "False positives"],
      recommendation: "Good for device unlock, combine with other methods",
      color: "purple"
    }
  };

  const selected = methods[state.selectedMethod] || methods.sms;

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">
        Compare different 2FA/MFA methods. Not all 2FA is created equal—some methods are more secure than others.
      </p>

      <div className="grid grid-cols-2 gap-2">
        {Object.entries(methods).map(([key, method]) => (
          <button
            key={key}
            onClick={() => set_state({ selectedMethod: key })}
            className={`p-3 rounded-lg border-2 text-left transition ${
              state.selectedMethod === key
                ? `border-${method.color}-500 bg-${method.color}-50`
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="font-semibold text-sm">{method.name}</div>
            <div className={`text-xs mt-1 font-medium ${
              method.security === "Very High" ? "text-green-600" :
              method.security === "High" ? "text-blue-600" :
              method.security === "Moderate" ? "text-yellow-600" : "text-red-600"
            }`}>
              {method.security} Security
            </div>
          </button>
        ))}
      </div>

      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
        <div className="font-semibold text-lg mb-3">{selected.name}</div>
        
        <div className="grid md:grid-cols-2 gap-4 mb-3">
          <div>
            <div className="font-semibold text-green-700 mb-1">✓ Advantages</div>
            <ul className="text-xs space-y-1">
              {selected.pros.map((pro, i) => (
                <li key={i} className="flex gap-2">
                  <span>•</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <div className="font-semibold text-red-700 mb-1">✗ Disadvantages</div>
            <ul className="text-xs space-y-1">
              {selected.cons.map((con, i) => (
                <li key={i} className="flex gap-2">
                  <span>•</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold text-blue-900 mb-1">Recommendation</div>
          <div className="text-xs text-blue-800">{selected.recommendation}</div>
        </div>
      </div>

      <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
        <div className="font-semibold text-yellow-900 mb-2">⚠️ Real Attack: Uber 2022 MFA Fatigue</div>
        <p className="text-xs text-yellow-800 mb-2">
          Attacker sent repeated MFA push notifications to an Uber employee. After many denials, the tired employee approved one—giving the attacker access.
        </p>
        <p className="text-xs text-yellow-800">
          <strong>Defense:</strong> Use number-matching or TOTP apps instead of simple push notifications. Always verify unexpected MFA requests.
        </p>
      </div>

      <div className="p-4 bg-purple-50 border border-purple-300 rounded-lg">
        <div className="font-semibold text-purple-900 mb-2">🎯 Your Action Plan</div>
        <div className="text-xs text-purple-800 space-y-2">
          <div>
            <strong>Priority 1 (This Week):</strong> Enable 2FA on email and banking using authenticator app
          </div>
          <div>
            <strong>Priority 2 (This Month):</strong> Enable 2FA on work accounts, social media, password manager
          </div>
          <div>
            <strong>Priority 3 (Optional):</strong> Purchase hardware token for highest-value accounts
          </div>
        </div>
      </div>

      <ToolStateActions
        onReset={reset}
        onCopy={copy_share_link}
        onExport={export_json}
        onImport={import_json}
      />
    </div>
  );
}
