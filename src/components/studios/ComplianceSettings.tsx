"use client";

import React, { useState, useEffect, memo, useCallback, useMemo } from "react";
import { Shield, Download, Trash2, Settings, CheckCircle2, AlertCircle } from "lucide-react";
import { complianceManager } from "@/lib/studios/governance/compliance";
import { auditLogger, AuditActions } from "@/lib/studios/security/auditLogger";
import HelpTooltip from "./HelpTooltip";
import SecureErrorBoundary from "./SecureErrorBoundary";

const ComplianceSettings = memo(function ComplianceSettings() {
  const [settings, setSettings] = useState(complianceManager.getSettings());
  const [gdprCheck, setGdprCheck] = useState(complianceManager.checkGDPRCompliance());
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    setSettings(complianceManager.getSettings());
    setGdprCheck(complianceManager.checkGDPRCompliance());
  }, []);

  const handleUpdate = (updates: Partial<typeof settings>) => {
    complianceManager.updateSettings(updates);
    setSettings(complianceManager.getSettings());
    setGdprCheck(complianceManager.checkGDPRCompliance());
    auditLogger.log(AuditActions.SETTINGS_CHANGED, "studios", { settings: updates });
  };

  const handleExport = () => {
    const logs = auditLogger.exportLogs();
    const blob = new Blob([logs], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `studio-audit-logs-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    auditLogger.log(AuditActions.SETTINGS_CHANGED, "studios", { action: "export_logs" });
  };

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all local data? This cannot be undone.")) {
      auditLogger.clearLogs();
      localStorage.removeItem("studio-compliance-settings");
      setSettings(complianceManager.getSettings());
      auditLogger.log(AuditActions.SETTINGS_CHANGED, "studios", { action: "clear_data" });
      alert("All local data has been cleared.");
    }
  };

  return (
    <SecureErrorBoundary studio="studios">
      <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-bold text-slate-900">Compliance & Governance</h2>
        <HelpTooltip
          title="Compliance & Governance"
          content={
            <div className="space-y-4">
              <p>
                These settings help you manage data privacy, retention, and compliance with regulations like GDPR.
              </p>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Data Retention</h3>
                <p className="text-sm text-slate-700">
                  How long your data is kept. After this period, data may be automatically deleted to comply with 
                  privacy regulations.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Data Export</h3>
                <p className="text-sm text-slate-700">
                  Allows you to download all your data in JSON format. This is required by GDPR so you can take 
                  your data elsewhere.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Data Deletion</h3>
                <p className="text-sm text-slate-700">
                  Allows you to delete all your local data. This is required by GDPR so you can request data deletion.
                </p>
              </div>
            </div>
          }
          examples={[
            "Set data retention to 90 days for GDPR compliance",
            "Export your data to take it to another service",
            "Delete your data if you no longer want to use the service"
          ]}
        />
      </div>

      {/* GDPR Compliance Check */}
      <div className={`rounded-2xl border p-4 ${
        gdprCheck.compliant 
          ? "bg-green-50 border-green-200" 
          : "bg-amber-50 border-amber-200"
      }`}>
        <div className="flex items-start gap-3">
          {gdprCheck.compliant ? (
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 mb-1">
              GDPR Compliance: {gdprCheck.compliant ? "Compliant" : "Issues Found"}
            </h3>
            {gdprCheck.issues.length > 0 && (
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 mt-2">
                {gdprCheck.issues.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <div>
          <label className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-900">Data Retention Period</span>
            <span className="text-xs text-slate-600">{settings.dataRetentionDays} days</span>
          </label>
          <input
            type="range"
            min="7"
            max="365"
            value={settings.dataRetentionDays}
            onChange={(e) => handleUpdate({ dataRetentionDays: parseInt(e.target.value) })}
            className="w-full"
          />
          <p className="text-xs text-slate-600 mt-1">
            Data older than this will be automatically cleaned up. Recommended: 90 days for GDPR compliance.
          </p>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <div>
            <label className="text-sm font-semibold text-slate-900">Allow Data Export</label>
            <p className="text-xs text-slate-600">You can download all your data</p>
          </div>
          <input
            type="checkbox"
            checked={settings.allowDataExport}
            onChange={(e) => handleUpdate({ allowDataExport: e.target.checked })}
            className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <div>
            <label className="text-sm font-semibold text-slate-900">Allow Data Deletion</label>
            <p className="text-xs text-slate-600">You can delete all your local data</p>
          </div>
          <input
            type="checkbox"
            checked={settings.allowDataDeletion}
            onChange={(e) => handleUpdate({ allowDataDeletion: e.target.checked })}
            className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <div>
            <label className="text-sm font-semibold text-slate-900">Require Consent</label>
            <p className="text-xs text-slate-600">User consent required for data processing</p>
          </div>
          <input
            type="checkbox"
            checked={settings.requireConsent}
            onChange={(e) => handleUpdate({ requireConsent: e.target.checked })}
            className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
        <button
          onClick={handleExport}
          disabled={!settings.allowDataExport}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Audit Logs
        </button>
        <button
          onClick={handleClearData}
          disabled={!settings.allowDataDeletion}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Clear All Data
        </button>
      </div>
      </div>
    </SecureErrorBoundary>
  );
});

export default ComplianceSettings;

