import test from "node:test";
import assert from "node:assert/strict";

import { canUserDownloadCertificate } from "../src/lib/certificates/access.core.js";

test("canUserDownloadCertificate: only owner can download", () => {
  assert.equal(canUserDownloadCertificate({ userId: "u1", issuanceUserId: "u1" }), true);
  assert.equal(canUserDownloadCertificate({ userId: "u1", issuanceUserId: "u2" }), false);
  assert.equal(canUserDownloadCertificate({ userId: "", issuanceUserId: "u1" }), false);
});


