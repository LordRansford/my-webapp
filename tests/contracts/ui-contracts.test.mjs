import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..", "..");

function read(relPath) {
  return readFileSync(path.join(projectRoot, relPath), "utf8");
}

test("Header nav matches contract (no dropdowns or extras)", () => {
  const header = read("src/components/Header.tsx");
  const navPairs = [...header.matchAll(/\{\s*label:\s*"([^"]+)"\s*,\s*href:\s*"([^"]+)"\s*\}/g)].map(([, label, href]) => ({ label, href }));
  assert.ok(navPairs.length >= 4, "Header must declare nav label+href pairs");
  const navItems = navPairs.filter((item) => item.label !== "Donate");
  const expectedNav = [
    { label: "Learn", href: "/courses" },
    { label: "Labs", href: "/tools" },
    { label: "Studios", href: "/studios" },
    { label: "Play", href: "/games" },
  ];
  assert.deepStrictEqual(navItems, expectedNav, "Header navItems must stay aligned to contract order and labels");

  const donateMatch = header.match(/const donateLink[^=]*=\s*\{\s*label:\s*"([^"]+)"\s*,\s*href:\s*"([^"]+)"\s*\}/);
  assert.ok(donateMatch, "donateLink missing");
  assert.equal(donateMatch[1], "Donate", "donateLink label must be Donate");
  assert.equal(donateMatch[2], "/support/donate", "donateLink href must be /support/donate");

  assert.ok(!/dropdown/i.test(header), "Dropdown menus are forbidden in GlobalHeader");
});

test("AppShell is the only shell (root + pages router)", () => {
  const appLayout = read("src/app/layout.js");
  assert.ok(appLayout.includes("AppShell"), "src/app/layout.js must import AppShell");
  assert.ok(/<AppShell>/.test(appLayout), "src/app/layout.js must wrap children in <AppShell>");

  const legacyLayout = read("src/components/Layout.js");
  assert.ok(legacyLayout.includes("AppShell"), "src/components/Layout.js must import AppShell");
  assert.ok(/<AppShell>/.test(legacyLayout), "src/components/Layout.js must wrap children in <AppShell>");
});

test("Course-only navigation: NotesLayout gates progress + sidebars", () => {
  const notesLayout = read("src/components/notes/Layout.jsx");
  assert.ok(notesLayout.includes("const isCourseNavigationAllowed"), "NotesLayout must declare isCourseNavigationAllowed");
  assert.ok(/resolvedShowContentsSidebar[\s\S]*isCourseNavigationAllowed/.test(notesLayout), "Contents sidebar must be gated by course allowance");
  assert.ok(/resolvedShowStepper[\s\S]*isCourseNavigationAllowed/.test(notesLayout), "Stepper must be gated by course allowance");
  assert.ok(/showCourseProgress\s*\?\s*<ProgressBar/.test(notesLayout), "Progress bar must be behind showCourseProgress check");
});

test("Compute components expose aria labels", () => {
  const meter = read("src/components/ComputeMeter.tsx");
  assert.ok(meter.includes('aria-label="Compute meter"'), "ComputeMeter must expose aria-label");

  const meterPanel = read("src/components/compute/ComputeMeterPanel.tsx");
  assert.ok(meterPanel.includes('aria-label="Compute meter"'), "ComputeMeterPanel must expose aria-label on bar");
});

test("Assistants remain text-labeled, not icon-only", () => {
  const professor = read("src/components/assistants/ProfessorRansfordAssistant.tsx");
  assert.ok(/aria-label="Professor drawer"/.test(professor), "ProfessorRansfordAssistant must keep Professor drawer aria-label");
  assert.ok(/>Professor Ransford</.test(professor), "ProfessorRansfordAssistant must render visible Professor heading");

  const feedback = read("src/components/assistants/FeedbackAssistant.tsx");
  assert.ok(/aria-label="Feedback drawer"/.test(feedback), "FeedbackAssistant must keep Feedback drawer aria-label");
  assert.ok(/>Feedback</.test(feedback), "FeedbackAssistant must render visible Feedback heading");
});

test("Key pages use the correct templates", () => {
  const home = read("src/pages/index.js");
  assert.ok(home.includes("MarketingPageTemplate"), "Home page must use MarketingPageTemplate");

  const about = read("src/pages/about.js");
  assert.ok(about.includes("StaticInfoTemplate"), "About page must use StaticInfoTemplate");

  const contact = read("src/pages/contact.js");
  assert.ok(contact.includes("StaticInfoTemplate"), "Contact page must use StaticInfoTemplate");

  const privacy = read("src/pages/privacy.js");
  assert.ok(privacy.includes("StaticInfoTemplate"), "Privacy page must use StaticInfoTemplate");

  const terms = read("src/pages/terms.js");
  assert.ok(terms.includes("StaticInfoTemplate"), "Terms page must use StaticInfoTemplate");

  const accessibility = read("src/pages/accessibility.js");
  assert.ok(accessibility.includes("StaticInfoTemplate"), "Accessibility page must use StaticInfoTemplate");

  const donate = read("src/pages/donate.js");
  assert.ok(donate.includes("StaticInfoTemplate"), "Donate page must use StaticInfoTemplate");

  const subscribe = read("src/pages/subscribe.js");
  assert.ok(subscribe.includes("StaticInfoTemplate"), "Subscribe page must use StaticInfoTemplate");

  const listen = read("src/pages/listen.js");
  assert.ok(listen.includes("StaticInfoTemplate"), "Listen page must use StaticInfoTemplate");

  const trust = read("src/pages/trust.js");
  assert.ok(trust.includes("StaticInfoTemplate"), "Trust page must use StaticInfoTemplate");

  const trustAbout = read("src/pages/trust-and-about.js");
  assert.ok(trustAbout.includes("StaticInfoTemplate"), "Trust-and-about page must use StaticInfoTemplate");

  const templateLicence = read("src/pages/template-licence.js");
  assert.ok(templateLicence.includes("StaticInfoTemplate"), "Template licence page must use StaticInfoTemplate");

  const pricing = read("src/app/pricing/page.jsx");
  assert.ok(pricing.includes("MarketingPageTemplate"), "Pricing page must use MarketingPageTemplate");

  const gamesHub = read("src/app/games/page.tsx");
  assert.ok(gamesHub.includes("GameHubTemplate"), "Games hub must use GameHubTemplate");

  const gameCanvas = read("src/app/games/[slug]/page.tsx");
  assert.ok(gameCanvas.includes("GameCanvasTemplate"), "Game canvas page must use GameCanvasTemplate");

  const studioLanding = read("src/app/studios/architecture-diagram-studio/page.client.jsx");
  assert.ok(studioLanding.includes("StudioLandingTemplate"), "Architecture studio landing must use StudioLandingTemplate");

  const studioWizard = read("src/app/studios/architecture-diagram-studio/wizard/page.client.jsx");
  assert.ok(studioWizard.includes("StudioToolTemplate"), "Architecture wizard must use StudioToolTemplate");
  assert.ok(studioWizard.includes("StudioResultsTemplate"), "Architecture wizard must use StudioResultsTemplate for outputs");

  const studioTemplates = read("src/app/studios/architecture-diagram-studio/templates/page.client.jsx");
  assert.ok(studioTemplates.includes("StudioToolTemplate"), "Architecture templates must use StudioToolTemplate");
  assert.ok(studioTemplates.includes("StudioResultsTemplate"), "Architecture templates must wrap preview in StudioResultsTemplate");

  const studioEditor = read("src/app/studios/architecture-diagram-studio/editor/page.client.jsx");
  assert.ok(studioEditor.includes("StudioToolTemplate"), "Architecture editor must use StudioToolTemplate");
  assert.ok(studioEditor.includes("StudioResultsTemplate"), "Architecture editor must use StudioResultsTemplate for outputs");
});

test("Non-course app pages do not import course UI", () => {
  const bannedImports = ["ProgressBar", "ContentsSidebar", "NotesStepper", "CourseProgressBar", "CourseStepper", "LevelProgressBar"];

  function collect(dir) {
    return readdirSync(dir)
      .flatMap((entry) => {
        const full = path.join(dir, entry);
        if (statSync(full).isDirectory()) return collect(full);
        if (!/\.(t|j)sx?$/.test(entry)) return [];
        return [full];
      });
  }

  const nonCourseDirs = ["src/app/play", "src/app/games", "src/app/mentor", "src/app/feedback", "src/app/support", "src/app/pricing", "src/app/templates", "src/app/studios", "src/app/tools"];
  const files = nonCourseDirs.flatMap((d) => {
    try {
      return collect(path.join(projectRoot, d));
    } catch {
      return [];
    }
  });

  const offenders = [];
  for (const file of files) {
    const content = readFileSync(file, "utf8");
    const matches = bannedImports.filter((name) => new RegExp(`\\b${name}\\b`).test(content));
    if (matches.length) offenders.push({ file, imports: matches });
  }

  assert.deepStrictEqual(offenders, [], "Non-course pages must not import course-only UI (progress/sidebars/steppers)");
});

test("Component contracts file defines required contracts", () => {
  const contracts = read("src/components/contracts.ts");
  ["HeaderContract", "FooterContract", "CourseProgressBarContract", "CourseSidebarContract", "ToolCardContract", "MentorChatWidgetContract", "FeedbackChatWidgetContract", "GameCanvasContract", "StudioToolbarContract"].forEach((name) => {
    assert.ok(new RegExp(`export const ${name}\\b`).test(contracts), `${name} must be defined in contracts.ts`);
  });

  assert.ok(/TOOL_METADATA/.test(contracts), "TOOL_METADATA must be defined");
  assert.ok(/architecture-diagram-studio/.test(contracts), "Architecture diagram studio metadata must be present");
});
