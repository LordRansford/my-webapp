"use client";

import { use_tool_state } from "@/components/notes/hooks/use_tool_state";
import ToolStateActions from "@/components/notes/ToolStateActions";

export default function PasswordManagerWorkshop() {
  const { state, set_state, reset, copy_share_link, export_json, import_json, is_ready } = use_tool_state({
    tool_id: "password-manager-workshop",
    initial_state: { 
      completedSteps: [],
      accounts: [],
    },
  });

  if (!is_ready) return <p className="text-sm text-gray-600">Loading...</p>;

  const completedSteps = state.completedSteps || [];
  const accounts = state.accounts || [];

  function toggleStep(step) {
    const newSteps = completedSteps.includes(step)
      ? completedSteps.filter(s => s !== step)
      : [...completedSteps, step];
    set_state({ ...state, completedSteps: newSteps });
  }

  const progress = Math.round((completedSteps.length / 7) * 100);

  return (
    <div className="space-y-4 text-sm">
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex justify-between items-center">
          <div className="font-semibold text-blue-900">Workshop Progress</div>
          <div className="text-2xl font-bold text-blue-600">{progress}%</div>
        </div>
        <div className="mt-2 bg-blue-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="p-4 bg-white rounded-lg border border-slate-200">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={completedSteps.includes("choose")}
              onChange={() => toggleStep("choose")}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="font-semibold">Step 1: Choose a password manager</div>
              <p className="text-xs text-slate-600 mt-1">
                Recommended: Bitwarden (free, open-source), 1Password (paid, premium features), KeePass (local-only, advanced users)
              </p>
            </div>
          </label>
        </div>

        <div className="p-4 bg-white rounded-lg border border-slate-200">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={completedSteps.includes("install")}
              onChange={() => toggleStep("install")}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="font-semibold">Step 2: Install and create master password</div>
              <p className="text-xs text-slate-600 mt-1">
                Your master password should be long (16+ characters), memorable, and unique. Use a passphrase. Write it down and store securely if needed.
              </p>
            </div>
          </label>
        </div>

        <div className="p-4 bg-white rounded-lg border border-slate-200">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={completedSteps.includes("import")}
              onChange={() => toggleStep("import")}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="font-semibold">Step 3: Import existing passwords</div>
              <p className="text-xs text-slate-600 mt-1">
                Most managers can import from browsers (Chrome, Firefox, Safari). Review and delete weak/duplicate passwords after import.
              </p>
            </div>
          </label>
        </div>

        <div className="p-4 bg-white rounded-lg border border-slate-200">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={completedSteps.includes("generate")}
              onChange={() => toggleStep("generate")}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="font-semibold">Step 4: Generate strong passwords for critical accounts</div>
              <p className="text-xs text-slate-600 mt-1">
                Target: Email, banking, work accounts. Use 16+ character random passwords. Let the password manager generate them.
              </p>
            </div>
          </label>
        </div>

        <div className="p-4 bg-white rounded-lg border border-slate-200">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={completedSteps.includes("organize")}
              onChange={() => toggleStep("organize")}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="font-semibold">Step 5: Organize by risk level</div>
              <p className="text-xs text-slate-600 mt-1">
                Create folders: Critical (banking, email), Work, Personal, Low-risk. Prioritize updating Critical accounts first.
              </p>
            </div>
          </label>
        </div>

        <div className="p-4 bg-white rounded-lg border border-slate-200">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={completedSteps.includes("2fa")}
              onChange={() => toggleStep("2fa")}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="font-semibold">Step 6: Enable 2FA on critical accounts</div>
              <p className="text-xs text-slate-600 mt-1">
                Enable two-factor authentication on email, banking, and work accounts. Use authenticator app (not SMS if possible).
              </p>
            </div>
          </label>
        </div>

        <div className="p-4 bg-white rounded-lg border border-slate-200">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={completedSteps.includes("backup")}
              onChange={() => toggleStep("backup")}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="font-semibold">Step 7: Set up recovery and backup</div>
              <p className="text-xs text-slate-600 mt-1">
                Configure account recovery options. Export encrypted backup. Store recovery codes securely (not in password manager).
              </p>
            </div>
          </label>
        </div>
      </div>

      {progress === 100 && (
        <div className="p-4 bg-green-50 border border-green-300 rounded-lg">
          <div className="font-semibold text-green-900 mb-1">🎉 Workshop Complete!</div>
          <p className="text-xs text-green-800">
            You&apos;ve completed the password manager setup. Continue using it for all new accounts and gradually update old ones.
          </p>
        </div>
      )}

      <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
        <div className="font-semibold text-yellow-900 mb-2">💡 Best Practices</div>
        <ul className="text-xs text-yellow-800 space-y-1 ml-4">
          <li className="list-disc">Never reuse passwords across accounts</li>
          <li className="list-disc">Use password manager&apos;s generator—don&apos;t create passwords yourself</li>
          <li className="list-disc">Enable browser extension for auto-fill convenience</li>
          <li className="list-disc">Regularly audit and remove old/unused accounts</li>
          <li className="list-disc">Don&apos;t share your master password with anyone</li>
        </ul>
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
