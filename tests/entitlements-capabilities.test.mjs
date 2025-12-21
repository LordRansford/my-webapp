import test from "node:test";
import assert from "node:assert/strict";
import { roleHasCapability } from "../src/lib/entitlements.capabilities.js";

test("public has no premium capabilities", () => {
  assert.equal(roleHasCapability("public", "canDownloadTemplates"), false);
});

test("supporter can download templates and export certificates", () => {
  assert.equal(roleHasCapability("supporter", "canDownloadTemplates"), true);
  assert.equal(roleHasCapability("supporter", "canExportCPDCertificates"), true);
});

test("professional inherits supporter and adds pro dashboards", () => {
  assert.equal(roleHasCapability("professional", "canUseProfessionalDashboards"), true);
});


