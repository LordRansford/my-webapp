const RoleCapabilities = {
  public: [],
  registered: ["canSaveUnlimitedProgress"],
  supporter: ["canSaveUnlimitedProgress", "canDownloadTemplates", "canExportCPDCertificates", "canAccessAdvancedLabs"],
  professional: [
    "canSaveUnlimitedProgress",
    "canDownloadTemplates",
    "canExportCPDCertificates",
    "canAccessAdvancedLabs",
    "canUseProfessionalDashboards",
  ],
};

function roleHasCapability(role, capability) {
  return (RoleCapabilities[role] || []).includes(capability);
}

export { RoleCapabilities, roleHasCapability };


