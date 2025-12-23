export function canUserDownloadCertificate(params) {
  const userId = String(params?.userId || "").trim();
  const owner = String(params?.issuanceUserId || "").trim();
  return Boolean(userId && owner && userId === owner);
}


