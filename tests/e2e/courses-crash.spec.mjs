import { test, expect } from "@playwright/test";

async function captureClientErrors(page, errors) {
  const warnings = [];
  const failed = [];
  page.on("pageerror", (err) => {
    errors.push({ type: "pageerror", message: String(err?.message || err), stack: err?.stack || "" });
  });
  page.on("response", (res) => {
    const status = res.status();
    if (status === 404 || status === 500 || status === 503) {
      const url = res.url();
      // Ignore local-only Vercel Speed Insights path.
      if (url.includes("/_vercel/speed-insights/script.js")) return;
      failed.push({ status, url });
    }
  });
  page.on("requestfailed", (req) => {
    const url = req.url();
    if (url.includes("/_vercel/speed-insights/script.js")) return;
    failed.push({ status: "FAILED", url });
  });
  page.on("console", (msg) => {
    const type = msg.type();
    if (type === "error") {
      const text = msg.text() || "";
      // Local `next start` doesn't serve Vercel Speed Insights endpoint; ignore this non-app error.
      if (text.includes("/_vercel/speed-insights/script.js")) return;
      // Some browsers emit this generic message for missing optional assets without including a URL.
      // We still capture real failures via `pageerror` and response/requestfailed hooks above.
      if (text.startsWith("Failed to load resource:")) return;
      // React hydration/DOM nesting warnings can be logged as console.error in dev.
      // We treat actual runtime failures as errors; warnings are noise for this crash repro.
      if (text.startsWith("Warning:")) {
        warnings.push(text);
        return;
      }
      errors.push({ type: "console.error", message: text, stack: "" });
    }
  });
  return { warnings, failed };
}

async function gotoAndFailOnErrors(page, url, errors, failed = []) {
  errors.length = 0;
  await page.goto(url, { waitUntil: "domcontentloaded" });
  // Allow any deferred client-side hydration errors to surface.
  await page.waitForTimeout(750);
  if (errors.length) {
    const failedTail = failed.slice(-10).map((f) => `${f.status} ${f.url}`).join("\n");
    throw new Error(
      `Client errors on ${url}:\n${JSON.stringify(errors, null, 2)}${failedTail ? `\n\nFailed requests (latest):\n${failedTail}` : ""}`
    );
  }
}

test("courses: no client exceptions on AI and course routes", async ({ page }) => {
  const errors = [];
  const { warnings, failed } = await captureClientErrors(page, errors);

  await gotoAndFailOnErrors(page, "/courses/ai", errors, failed);
  try {
    await gotoAndFailOnErrors(page, "/ai", errors, failed);
  } catch (err) {
    // Attach last warnings to help pinpoint hydration mismatches.
    throw new Error(
      `${String(err)}\n\nWarnings (latest):\n${warnings.slice(-5).join("\n\n")}\n\nFailed requests (latest):\n${failed
        .slice(-10)
        .map((f) => `${f.status} ${f.url}`)
        .join("\n")}`
    );
  }

  // Hit a representative AI content page (these routes are commonly referenced from /ai).
  await gotoAndFailOnErrors(page, "/ai/beginner", errors, failed);

  // Sanity check: page renders a heading so we know we didn't silently fail.
  await expect(page.getByRole("heading").first()).toBeVisible();
});

test("cpd: core CPD pages do not crash when logged out", async ({ page }) => {
  const errors = [];
  const { failed } = await captureClientErrors(page, errors);

  await gotoAndFailOnErrors(page, "/cpd", errors, failed);
  await gotoAndFailOnErrors(page, "/my-cpd", errors, failed);
  await gotoAndFailOnErrors(page, "/my-cpd/evidence", errors, failed);
  await gotoAndFailOnErrors(page, "/my-cpd/records", errors, failed);

  await expect(page.getByRole("heading").first()).toBeVisible();
});

test("courses: key course routes do not crash when logged out", async ({ page }) => {
  const errors = [];
  const { failed } = await captureClientErrors(page, errors);

  await gotoAndFailOnErrors(page, "/courses/ai", errors, failed);
  await gotoAndFailOnErrors(page, "/courses/cybersecurity", errors, failed);
  await gotoAndFailOnErrors(page, "/courses/digitalisation", errors, failed);

  // Representative lesson pages (common entrypoints from course overview pages).
  await gotoAndFailOnErrors(page, "/courses/ai/course", errors, failed);
  await gotoAndFailOnErrors(page, "/courses/cybersecurity/rsa-lab", errors, failed);
  await gotoAndFailOnErrors(page, "/courses/digitalisation/course", errors, failed);

  await expect(page.getByRole("heading").first()).toBeVisible();
});

test("account: account page does not crash when logged out", async ({ page }) => {
  const errors = [];
  const { failed } = await captureClientErrors(page, errors);
  await gotoAndFailOnErrors(page, "/account", errors, failed);
  await expect(page.getByRole("heading").first()).toBeVisible();
});


