"use client";

import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";

export default function PasswordStrengthLab() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "password-strength-lab",
    initial_state: { password: "" },
  });

  if (!is_ready) return <p className="text-sm text-gray-600">Loading...</p>;

  const password = state.password || "";

  // Calculate entropy and strength
  function calculateEntropy(pwd) {
    if (!pwd) return 0;
    
    let charsetSize = 0;
    if (/[a-z]/.test(pwd)) charsetSize += 26;
    if (/[A-Z]/.test(pwd)) charsetSize += 26;
    if (/[0-9]/.test(pwd)) charsetSize += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) charsetSize += 32;
    
    return pwd.length * Math.log2(charsetSize);
  }

  function timeToCrack(entropy) {
    // Assume 100 billion guesses per second (modern GPU)
    const guessesPerSecond = 100_000_000_000;
    const totalCombinations = Math.pow(2, entropy);
    const seconds = totalCombinations / (guessesPerSecond * 2); // Avg is half
    
    if (seconds < 1) return "Instant";
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 31536000 * 100) return `${Math.round(seconds / 31536000)} years`;
    return "Millions of years";
  }

  const entropy = calculateEntropy(password);
  const crackTime = timeToCrack(entropy);
  
  const hasLength = password.length >= 12;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  
  const commonPasswords = ["password", "123456", "qwerty", "admin", "letmein", "welcome", "monkey", "dragon"];
  const isCommon = commonPasswords.some(common => password.toLowerCase().includes(common));
  
  const strength = entropy < 30 ? "Very Weak" : 
                   entropy < 40 ? "Weak" : 
                   entropy < 60 ? "Moderate" : 
                   entropy < 80 ? "Strong" : "Very Strong";
  
  const strengthColor = entropy < 30 ? "text-red-600" : 
                        entropy < 40 ? "text-orange-600" : 
                        entropy < 60 ? "text-yellow-600" : 
                        entropy < 80 ? "text-blue-600" : "text-green-600";

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">
        Test password strength and see realistic crack times. Length matters more than complexity!
      </p>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Enter a password to test
        </label>
        <input
          type="text"
          value={password}
          onChange={(e) => set_state({ password: e.target.value })}
          placeholder="Type a password..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
        />
      </div>

      {password && (
        <div className="space-y-3">
          <div className="p-4 bg-slate-100 rounded-lg border border-slate-300">
            <div className="flex justify-between items-center mb-2">
              <div className="font-semibold">Strength Assessment</div>
              <div className={`text-lg font-bold ${strengthColor}`}>{strength}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-slate-600">Entropy</div>
                <div className="font-semibold">{entropy.toFixed(1)} bits</div>
              </div>
              <div>
                <div className="text-slate-600">Time to Crack</div>
                <div className="font-semibold">{crackTime}</div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <div className="font-semibold mb-2">Password Criteria</div>
            <div className="space-y-1 text-xs">
              <div className={`flex items-center gap-2 ${hasLength ? 'text-green-700' : 'text-red-700'}`}>
                <span>{hasLength ? '✓' : '✗'}</span>
                <span>At least 12 characters</span>
              </div>
              <div className={`flex items-center gap-2 ${hasLower ? 'text-green-700' : 'text-gray-500'}`}>
                <span>{hasLower ? '✓' : '○'}</span>
                <span>Lowercase letters</span>
              </div>
              <div className={`flex items-center gap-2 ${hasUpper ? 'text-green-700' : 'text-gray-500'}`}>
                <span>{hasUpper ? '✓' : '○'}</span>
                <span>Uppercase letters</span>
              </div>
              <div className={`flex items-center gap-2 ${hasNumber ? 'text-green-700' : 'text-gray-500'}`}>
                <span>{hasNumber ? '✓' : '○'}</span>
                <span>Numbers</span>
              </div>
              <div className={`flex items-center gap-2 ${hasSpecial ? 'text-green-700' : 'text-gray-500'}`}>
                <span>{hasSpecial ? '✓' : '○'}</span>
                <span>Special characters</span>
              </div>
              {isCommon && (
                <div className="flex items-center gap-2 text-red-700 font-semibold">
                  <span>⚠️</span>
                  <span>Contains common password pattern!</span>
                </div>
              )}
            </div>
          </div>

          {isCommon && (
            <div className="p-3 bg-red-50 border border-red-300 rounded-lg">
              <div className="font-semibold text-red-900 mb-1">⚠️ Warning</div>
              <p className="text-xs text-red-800">
                This password contains a common word or pattern found in breach databases. Attackers use dictionaries of common passwords first. Even with modifications like &quot;P@ssw0rd&quot;, it&apos;s easily cracked.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="p-4 bg-blue-50 border border-blue-300 rounded-lg">
        <div className="font-semibold text-blue-900 mb-2">💡 Key Insights</div>
        <div className="space-y-2 text-xs text-blue-800">
          <div>
            <strong>Length vs Complexity:</strong> A 16-character password of all lowercase letters is stronger than an 8-character password with mixed case, numbers, and symbols.
          </div>
          <div>
            <strong>Why &quot;P@ssw0rd1!&quot; is terrible:</strong> Predictable substitutions (@ for a, 0 for o) don&apos;t fool modern cracking tools. Dictionary attacks check these variations automatically.
          </div>
          <div>
            <strong>Best practice:</strong> Use a passphrase (4+ random words) or password manager to generate truly random passwords. Example: &quot;correct horse battery staple&quot; (XKCD reference).
          </div>
        </div>
      </div>

      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
        <div className="font-semibold text-slate-900 mb-2">Try these examples:</div>
        <div className="space-y-1 text-xs">
          <button onClick={() => set_state({ password: "password" })} className="text-blue-600 hover:underline block">
            • &quot;password&quot; - Most common password
          </button>
          <button onClick={() => set_state({ password: "P@ssw0rd1!" })} className="text-blue-600 hover:underline block">
            • &quot;P@ssw0rd1!&quot; - Predictable substitutions
          </button>
          <button onClick={() => set_state({ password: "Tr0ub4dor&3" })} className="text-blue-600 hover:underline block">
            • &quot;Tr0ub4dor&amp;3&quot; - Complex but short (still weak)
          </button>
          <button onClick={() => set_state({ password: "correcthorsebatterystaple" })} className="text-blue-600 hover:underline block">
            • &quot;correcthorsebatterystaple&quot; - Long passphrase (strong)
          </button>
          <button onClick={() => set_state({ password: "7vQ#mP9$xL2@nR5%" })} className="text-blue-600 hover:underline block">
            • &quot;7vQ#mP9$xL2@nR5%&quot; - Truly random (very strong)
          </button>
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
