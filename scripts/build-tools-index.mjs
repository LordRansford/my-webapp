import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const TOOL_CONTRACTS_PATH = path.join(ROOT, "data", "tool-contracts.json");
const TOOL_CATALOG_PATH = path.join(ROOT, "data", "tools", "catalog.json");
const OUT_PATH = path.join(ROOT, "public", "tools-index.json");

function ensureDir(p) {
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function buildToolsIndex() {
  const contracts = JSON.parse(fs.readFileSync(TOOL_CONTRACTS_PATH, "utf8"));
  let catalog = { tools: [] };
  
  if (fs.existsSync(TOOL_CATALOG_PATH)) {
    catalog = JSON.parse(fs.readFileSync(TOOL_CATALOG_PATH, "utf8"));
  }

  const tools = contracts.tools.map((contract) => {
    const catalogEntry = catalog.tools.find((t) => t.id === contract.id);
    
    return {
      id: contract.id,
      title: contract.title,
      description: contract.description || contract.purpose || "",
      category: contract.category,
      difficulty: contract.difficulty,
      route: contract.route,
      listed: Boolean(contract.listed),
      executionModes: contract.executionModes || (contract.execution === "sandboxed-server" ? ["compute"] : ["local"]),
      defaultMode: contract.defaultMode || "local",
      limits: {
        ...contract.limits,
        inputKb: contract.limits.inputKb || 64, // Default if missing
      },
      creditModel: contract.creditModel || {
        baseCredits: (contract.credits?.costPerRun) || 0,
        perKbCredits: 0,
        complexityMultiplierHints: {},
      },
      // Include fields needed by loadContract
      runner: contract.runner || (contract.execution === "sandboxed-server" ? "/api/tools/run" : "local"),
      failureModes: contract.failureModes || ["validation_error", "execution_error", "timeout", "security_error"],
      statusStates: contract.statusStates || ["idle", "running", "completed", "failed"],
      inputs: contract.inputs || [],
      securityNotes: contract.securityNotes,
      // Catalog fields
      defaultInputs: catalogEntry?.defaultInputs || {},
      examples: catalogEntry?.examples || [],
      explain: catalogEntry?.explain || "",
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    tools,
  };
}

const index = buildToolsIndex();
ensureDir(OUT_PATH);
fs.writeFileSync(OUT_PATH, JSON.stringify(index, null, 2), "utf8");
console.log(`Wrote ${OUT_PATH} (${index.tools.length} tools)`);
