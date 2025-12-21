"use client";

import { useEffect, useMemo, useState } from "react";
import ExportConsentModal from "./ExportConsentModal";
import DonateButton from "@/components/donations/DonateButton";
import { exportTemplate } from "@/utils/templateExport";
import {
  hasDonationSupport,
  hasPermissionToken,
  setPermissionToken,
  unlockCommercialNoAttribution,
  getPermissionToken,
} from "@/lib/entitlements/entitlements";

export default function TemplateExportPanel({
  templateId,
  title,
  category,
  version = "1.0.0",
  prepareSections,
  attributionText,
  captureSelector = ".template-layout",
  captureElement,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingFormat, setPendingFormat] = useState(null);
  const [intendedUse, setIntendedUse] = useState("internal");
  const [includeAttribution, setIncludeAttribution] = useState(true);
  const [consentChecked, setConsentChecked] = useState(false);
  const [status, setStatus] = useState("");
  const [permissionInput, setPermissionInput] = useState("");
  const [hasDonation, setHasDonation] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    setHasDonation(hasDonationSupport());
    setHasPermission(hasPermissionToken());
    setPermissionInput(getPermissionToken() || "");
  }, [modalOpen]);

  const startExport = (format) => {
    setPendingFormat(format);
    setModalOpen(true);
    setStatus("");
    setConsentChecked(false);
    setIntendedUse("internal");
    setIncludeAttribution(true);
  };

  const unlocksNoAttribution = unlockCommercialNoAttribution();

  const syncedIncludeAttribution = useMemo(() => {
    if (intendedUse === "commercial-with") return true;
    if (intendedUse === "commercial-no-attr") return false;
    return includeAttribution;
  }, [includeAttribution, intendedUse]);

  const handleConfirm = async (use, includeAttr) => {
    if (use === "commercial-no-attr" && !unlocksNoAttribution) {
      setStatus("Commercial export without attribution requires a donation receipt or permission token.");
      return;
    }
    try {
      const prepared = prepareSections ? prepareSections() : [];
      const sections = Array.isArray(prepared) ? prepared : [];
      await exportTemplate({
        format: pendingFormat,
        templateId,
        title,
        category,
        version,
        sections,
        footerText: attributionText,
        intendedUse: use,
        includeAttribution: includeAttr,
        captureSelector,
        captureElement,
      });
      setStatus(`Exported ${pendingFormat.toUpperCase()} for ${use} use`);
    } catch (error) {
      setStatus("Export failed. Please try again.");
    } finally {
      setModalOpen(false);
      setPendingFormat(null);
    }
  };

  const handlePermissionSave = (token) => {
    setPermissionToken(token);
    setPermissionInput(token);
    setHasPermission(Boolean(token));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Exports</p>
          <p className="text-sm text-slate-700">
            Choose PDF, DOCX, or XLSX. A consent check will confirm intended use and attribution rules before download.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {["pdf", "docx", "xlsx", "png"].map((format) => (
            <button
              key={format}
              type="button"
              onClick={() => startExport(format)}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              Export {format.toUpperCase()}
            </button>
          ))}
          <DonateButton className="ml-1" />
        </div>
      </div>
      {status && <p className="mt-3 text-xs font-semibold text-slate-700">{status}</p>}

      <ExportConsentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        intendedUse={intendedUse}
        setIntendedUse={setIntendedUse}
        includeAttribution={syncedIncludeAttribution}
        setIncludeAttribution={setIncludeAttribution}
        consentChecked={consentChecked}
        setConsentChecked={setConsentChecked}
        hasDonation={hasDonation}
        hasPermission={hasPermission}
        permissionInput={permissionInput}
        onPermissionChange={handlePermissionSave}
        unlocksNoAttribution={unlocksNoAttribution}
      />
    </div>
  );
}
