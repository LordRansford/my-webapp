import fs from "node:fs";

function read(p) {
  return fs.readFileSync(p, "utf8");
}

function fail(msg) {
  console.error(`Dashboard quality gate failed: ${msg}`);
  process.exit(1);
}

const appAiPath = "src/app/dashboards/ai/page.client.jsx";
const pagesAiPath = "src/pages/dashboards/ai.js";
const aiPagePath = fs.existsSync(appAiPath) ? appAiPath : pagesAiPath;

const appCyberPath = "src/app/dashboards/cybersecurity/page.client.jsx";
const pagesCyberPath = "src/pages/dashboards/cybersecurity.js";
const cyberPagePath = fs.existsSync(appCyberPath) ? appCyberPath : pagesCyberPath;

const requiredPages = ["src/pages/dashboards/index.js", aiPagePath, cyberPagePath];

for (const p of requiredPages) {
  if (!fs.existsSync(p)) fail(`Missing required page ${p}`);
}

const aiPage = read(aiPagePath);

if (aiPagePath === pagesAiPath) {
  if (!aiPage.includes("SourceAndLicensing")) fail("AI dashboard must render SourceAndLicensing");
  if (!aiPage.includes("Data and limits")) fail("AI dashboard must include Data and limits section");
  if (!aiPage.includes("AITrendsDashboard")) fail("AI dashboard must include AITrendsDashboard tool");
} else {
  const requiredTools = ["AIDatasetExplorer", "EvaluationMetricsExplorer", "RetrievalSandbox"];
  for (const tool of requiredTools) {
    if (!aiPage.includes(tool)) fail(`AI dashboard must include ${tool}`);
  }
}

const cyberPage = read(cyberPagePath);
if (cyberPagePath === pagesCyberPath) {
  if (!cyberPage.includes("CybersecurityDashboard")) fail("Cybersecurity dashboard must include CybersecurityDashboard tool");
  if (!cyberPage.includes("Data and limits")) fail("Cybersecurity dashboard must include Data and limits section");
} else {
  const requiredSections = ["Password entropy dashboard", "Hashing playground", "Data and limits"];
  for (const chunk of requiredSections) {
    if (!cyberPage.includes(chunk)) fail(`Cybersecurity dashboard must include ${chunk}`);
  }
}

const landing = read("src/pages/dashboards/index.js");
if (!landing.includes("Dashboards")) fail("Dashboards landing missing heading");
if (!landing.includes("Licensing")) fail("Landing must explain licensing safety");

console.log("Dashboard content gates passed");
