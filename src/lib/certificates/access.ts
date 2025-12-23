import { canUserDownloadCertificate as canUserDownloadCertificateCore } from "./access.core";

export function canUserDownloadCertificate(params: { userId: string; issuanceUserId: string | null | undefined }) {
  return canUserDownloadCertificateCore(params as any);
}


