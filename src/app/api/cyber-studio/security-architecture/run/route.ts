import { NextRequest } from "next/server";
import { createToolExecutionHandler } from "@/lib/studios/toolExecutionHelper";

type ComponentType = "firewall" | "load_balancer" | "web_server" | "database" | "api_gateway" | "cache" | "cdn" | "vpn";
type TrustZone = "public" | "dmz" | "internal" | "restricted";

interface SecurityComponent {
  id: string;
  name: string;
  type: ComponentType;
  trustZone: TrustZone;
  description: string;
  securityControls: string[];
  vulnerabilities: string[];
}

interface SecurityConnection {
  from: string;
  to: string;
  protocol: string;
  encrypted: boolean;
}

function validateArchitecture(components: SecurityComponent[], connections: SecurityConnection[]): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (components.length === 0) {
    errors.push("Architecture must contain at least one component");
  }

  const componentIds = new Set<string>();
  components.forEach((component, index) => {
    if (!component.name || component.name.trim() === "") {
      errors.push(`Component ${index + 1} must have a name`);
    } else if (componentIds.has(component.id)) {
      errors.push(`Duplicate component ID: ${component.id}`);
    } else {
      componentIds.add(component.id);
    }

    if (component.trustZone === "public" && component.securityControls.length === 0) {
      warnings.push(`Public component "${component.name}" should have security controls`);
    }

    if (component.vulnerabilities.length > 0 && component.securityControls.length === 0) {
      warnings.push(`Component "${component.name}" has vulnerabilities but no security controls`);
    }
  });

  connections.forEach((conn, index) => {
    const fromComponent = components.find((c) => c.id === conn.from);
    const toComponent = components.find((c) => c.id === conn.to);

    if (!fromComponent) {
      errors.push(`Connection ${index + 1} references non-existent source component: ${conn.from}`);
    }
    if (!toComponent) {
      errors.push(`Connection ${index + 1} references non-existent destination component: ${conn.to}`);
    }

    if (fromComponent && toComponent && !conn.encrypted && (fromComponent.trustZone === "public" || toComponent.trustZone === "public")) {
      warnings.push(`Unencrypted connection between "${fromComponent.name}" and "${toComponent.name}" involving public zone`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

function calculateSecurityScore(components: SecurityComponent[], connections: SecurityConnection[]): number {
  let score = 100;

  components.forEach((component) => {
    if (component.securityControls.length === 0) {
      score -= 5;
    }
    if (component.vulnerabilities.length > 0) {
      score -= component.vulnerabilities.length * 3;
    }
    if (component.trustZone === "public" && component.securityControls.length < 2) {
      score -= 5;
    }
  });

  connections.forEach((conn) => {
    if (!conn.encrypted) {
      score -= 2;
    }
  });

  return Math.max(0, Math.min(100, score));
}

function generateArchitectureReport(
  architectureName: string,
  components: SecurityComponent[],
  connections: SecurityConnection[]
): string {
  let report = `SECURITY ARCHITECTURE REPORT\n`;
  report += `===========================\n\n`;
  report += `Architecture: ${architectureName}\n`;
  report += `Generated: ${new Date().toISOString()}\n\n`;

  const securityScore = calculateSecurityScore(components, connections);

  report += `EXECUTIVE SUMMARY\n`;
  report += `=================\n`;
  report += `Security Score: ${securityScore}/100\n`;
  report += `Total Components: ${components.length}\n`;
  report += `Total Connections: ${connections.length}\n`;
  report += `Components with Controls: ${components.filter((c) => c.securityControls.length > 0).length}\n`;
  report += `Components with Vulnerabilities: ${components.filter((c) => c.vulnerabilities.length > 0).length}\n\n`;

  report += `COMPONENTS BY TRUST ZONE\n`;
  report += `=======================\n\n`;

  const zoneOrder: TrustZone[] = ["public", "dmz", "internal", "restricted"];
  zoneOrder.forEach((zone) => {
    const zoneComponents = components.filter((c) => c.trustZone === zone);
    if (zoneComponents.length > 0) {
      report += `${zone.toUpperCase()} ZONE\n`;
      report += `${"-".repeat(zone.length + 5)}\n\n`;

      zoneComponents.forEach((component) => {
        report += `${component.name}\n`;
        report += `  Type: ${component.type.replace(/_/g, " ")}\n`;
        report += `  Description: ${component.description || "Not provided"}\n`;
        report += `  Security Controls: ${component.securityControls.length}\n`;
        if (component.securityControls.length > 0) {
          component.securityControls.forEach((control) => {
            report += `    - ${control}\n`;
          });
        }
        report += `  Vulnerabilities: ${component.vulnerabilities.length}\n`;
        if (component.vulnerabilities.length > 0) {
          component.vulnerabilities.forEach((vuln) => {
            report += `    - ${vuln}\n`;
          });
        }
        report += `\n`;
      });
    }
  });

  report += `\nCONNECTIONS\n`;
  report += `===========\n\n`;

  connections.forEach((conn, index) => {
    const fromComponent = components.find((c) => c.id === conn.from);
    const toComponent = components.find((c) => c.id === conn.to);
    report += `${index + 1}. ${fromComponent?.name || conn.from} → ${toComponent?.name || conn.to}\n`;
    report += `   Protocol: ${conn.protocol}\n`;
    report += `   Encrypted: ${conn.encrypted ? "Yes" : "No"}\n`;
    if (!conn.encrypted) {
      report += `   ⚠️  WARNING: Unencrypted connection\n`;
    }
    report += `\n`;
  });

  report += `\n--- END OF REPORT ---\n`;
  return report;
}

export const POST = createToolExecutionHandler({
  toolId: "cyber-studio-security-architecture",
  executeTool: async (userId, body) => {
    const executionStart = Date.now();
    const architectureName = body.architectureName || body.name || "Untitled Architecture";
    const components: SecurityComponent[] = body.components || [];
    const connections: SecurityConnection[] = body.connections || [];

    const validation = validateArchitecture(components, connections);

    if (!validation.valid) {
      return {
        result: {
          success: false,
          errors: validation.errors,
          warnings: validation.warnings,
          architecture: {
            name: architectureName,
            components,
            connections,
          },
        },
        actualUsage: {
          cpuMs: Date.now() - executionStart,
          memMb: 170,
          durationMs: Date.now() - executionStart,
        },
      };
    }

    const securityScore = calculateSecurityScore(components, connections);
    const report = generateArchitectureReport(architectureName, components, connections);

    const summary = {
      totalComponents: components.length,
      totalConnections: connections.length,
      byType: components.reduce((acc, c) => {
        acc[c.type] = (acc[c.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byTrustZone: components.reduce((acc, c) => {
        acc[c.trustZone] = (acc[c.trustZone] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      encryptedConnections: connections.filter((c) => c.encrypted).length,
      componentsWithControls: components.filter((c) => c.securityControls.length > 0).length,
      componentsWithVulnerabilities: components.filter((c) => c.vulnerabilities.length > 0).length,
    };

    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      result: {
        success: true,
        architecture: {
          name: architectureName,
          components,
          connections,
          securityScore,
          report,
          summary,
          validation: {
            valid: true,
            warnings: validation.warnings,
          },
          toolId: "cyber-studio-security-architecture",
          timestamp: new Date().toISOString(),
        },
      },
      actualUsage: {
        cpuMs: Date.now() - executionStart,
        memMb: 170,
        durationMs: Date.now() - executionStart,
      },
    };
  },
});
