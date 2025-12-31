/**
 * Script to add CreditEstimate component to all tool pages
 * Run with: node scripts/add-credit-estimate.js
 */

const fs = require('fs');
const path = require('path');

const toolPages = [
  // Dev Studio
  { file: 'src/pages/dev-studio/security.tsx', toolId: 'dev-studio-security' },
  { file: 'src/pages/dev-studio/performance.tsx', toolId: 'dev-studio-performance' },
  { file: 'src/pages/dev-studio/cost.tsx', toolId: 'dev-studio-cost' },
  
  // Cyber Studio
  { file: 'src/pages/cyber-studio/risk-register.tsx', toolId: 'cyber-studio-risk-register' },
  { file: 'src/pages/cyber-studio/compliance.tsx', toolId: 'cyber-studio-compliance' },
  { file: 'src/pages/cyber-studio/ir-playbook.tsx', toolId: 'cyber-studio-ir-playbook' },
  { file: 'src/pages/cyber-studio/security-architecture.tsx', toolId: 'cyber-studio-security-architecture' },
  { file: 'src/pages/cyber-studio/vulnerability-scanner.tsx', toolId: 'cyber-studio-vulnerability-scanner' },
  { file: 'src/pages/cyber-studio/metrics.tsx', toolId: 'cyber-studio-metrics' },
  { file: 'src/pages/cyber-studio/policy-generator.tsx', toolId: 'cyber-studio-policy-generator' },
  
  // Data Studio
  { file: 'src/pages/data-studio/pipelines.tsx', toolId: 'data-studio-pipelines' },
  { file: 'src/pages/data-studio/quality.tsx', toolId: 'data-studio-quality' },
  { file: 'src/pages/data-studio/catalog.tsx', toolId: 'data-studio-catalog' },
  { file: 'src/pages/data-studio/dashboards.tsx', toolId: 'data-studio-dashboards' },
  { file: 'src/pages/data-studio/privacy.tsx', toolId: 'data-studio-privacy' },
  { file: 'src/pages/data-studio/lineage.tsx', toolId: 'data-studio-lineage' },
  { file: 'src/pages/data-studio/schema.tsx', toolId: 'data-studio-schema' },
  { file: 'src/pages/data-studio/governance.tsx', toolId: 'data-studio-governance' },
];

toolPages.forEach(({ file, toolId }) => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file} - file not found`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if already has CreditEstimate
  if (content.includes('CreditEstimate')) {
    console.log(`Skipping ${file} - already has CreditEstimate`);
    return;
  }
  
  // Add import
  if (!content.includes("import CreditEstimate")) {
    const importMatch = content.match(/(import.*from.*HelpTooltip.*;)/);
    if (importMatch) {
      content = content.replace(
        importMatch[0],
        `${importMatch[0]}\nimport CreditEstimate from "@/components/studios/CreditEstimate";`
      );
    } else {
      // Try to find any import from studios
      const studiosImportMatch = content.match(/(import.*from.*@\/components\/studios\/.*;)/);
      if (studiosImportMatch) {
        content = content.replace(
          studiosImportMatch[0],
          `${studiosImportMatch[0]}\nimport CreditEstimate from "@/components/studios/CreditEstimate";`
        );
      }
    }
  }
  
  // Add component before main content div
  const mainContentMatch = content.match(/(<div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">)/);
  if (mainContentMatch) {
    content = content.replace(
      mainContentMatch[0],
      `${mainContentMatch[0]}\n            {/* Credit Estimate */}\n            <div className="mb-6">\n              <CreditEstimate toolId="${toolId}" />\n            </div>\n\n`
    );
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});

console.log('Done!');
