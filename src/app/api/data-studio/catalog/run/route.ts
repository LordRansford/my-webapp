import { NextRequest } from "next/server";
import { createToolExecutionHandler } from "@/lib/studios/toolExecutionHelper";

type DataType = "table" | "view" | "file" | "api" | "stream";
type Sensitivity = "public" | "internal" | "confidential" | "restricted";

interface DataAsset {
  id: string;
  name: string;
  type: DataType;
  description: string;
  owner: string;
  location: string;
  sensitivity: Sensitivity;
  tags: string[];
  schema?: string;
  lastUpdated?: string;
}

function validateCatalog(assets: DataAsset[]): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (assets.length === 0) {
    errors.push("Catalog must contain at least one data asset");
  }

  const assetNames = new Set<string>();
  assets.forEach((asset, index) => {
    if (!asset.name || asset.name.trim() === "") {
      errors.push(`Asset ${index + 1} must have a name`);
    } else if (assetNames.has(asset.name)) {
      warnings.push(`Duplicate asset name: ${asset.name}`);
    } else {
      assetNames.add(asset.name);
    }

    if (!asset.owner || asset.owner.trim() === "") {
      errors.push(`Asset "${asset.name || `Asset ${index + 1}`}" must have an owner`);
    }

    if (!asset.location || asset.location.trim() === "") {
      warnings.push(`Asset "${asset.name}" has no location specified`);
    }

    if (asset.sensitivity === "restricted" && asset.tags.length === 0) {
      warnings.push(`Restricted asset "${asset.name}" should have tags for better classification`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

function generateCatalogDocument(catalogName: string, assets: DataAsset[]): string {
  let doc = `DATA CATALOG\n`;
  doc += `===========\n\n`;
  doc += `Catalog Name: ${catalogName}\n`;
  doc += `Generated: ${new Date().toISOString()}\n\n`;

  doc += `SUMMARY\n`;
  doc += `-------\n`;
  doc += `Total Assets: ${assets.length}\n\n`;

  const byType = assets.reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const bySensitivity = assets.reduce((acc, a) => {
    acc[a.sensitivity] = (acc[a.sensitivity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  doc += `By Type:\n`;
  Object.entries(byType).forEach(([type, count]) => {
    doc += `  ${type}: ${count}\n`;
  });

  doc += `\nBy Sensitivity:\n`;
  Object.entries(bySensitivity).forEach(([sensitivity, count]) => {
    doc += `  ${sensitivity}: ${count}\n`;
  });

  doc += `\n\nASSETS\n`;
  doc += `======\n\n`;

  const sensitivityOrder: Sensitivity[] = ["restricted", "confidential", "internal", "public"];
  sensitivityOrder.forEach((sensitivity) => {
    const sensitivityAssets = assets.filter((a) => a.sensitivity === sensitivity);
    if (sensitivityAssets.length > 0) {
      doc += `${sensitivity.toUpperCase()} ASSETS\n`;
      doc += `${"-".repeat(sensitivity.length + 7)}\n\n`;

      sensitivityAssets.forEach((asset) => {
        doc += `${asset.name}\n`;
        doc += `  Type: ${asset.type}\n`;
        doc += `  Owner: ${asset.owner}\n`;
        doc += `  Location: ${asset.location || "Not specified"}\n`;
        if (asset.description) {
          doc += `  Description: ${asset.description}\n`;
        }
        if (asset.tags.length > 0) {
          doc += `  Tags: ${asset.tags.join(", ")}\n`;
        }
        if (asset.lastUpdated) {
          doc += `  Last Updated: ${asset.lastUpdated}\n`;
        }
        doc += `\n`;
      });
    }
  });

  doc += `\n--- END OF CATALOG ---\n`;
  return doc;
}

export const POST = createToolExecutionHandler({
  toolId: "data-studio-catalog",
  executeTool: async (userId, body) => {
    const executionStart = Date.now();
    const catalogName = body.catalogName || body.name || "Untitled Catalog";
    const assets: DataAsset[] = body.datasets || body.assets || [];

    const validation = validateCatalog(assets);

    if (!validation.valid) {
      return {
        result: {
          success: false,
          errors: validation.errors,
          warnings: validation.warnings,
          catalog: {
            name: catalogName,
            assets,
          },
        },
        actualUsage: {
          cpuMs: Date.now() - executionStart,
          memMb: 110,
          durationMs: Date.now() - executionStart,
        },
      };
    }

    const document = generateCatalogDocument(catalogName, assets);

    const allTags = new Set<string>();
    assets.forEach((asset) => {
      asset.tags.forEach((tag) => allTags.add(tag));
    });

    const summary = {
      totalAssets: assets.length,
      byType: assets.reduce((acc, a) => {
        acc[a.type] = (acc[a.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      bySensitivity: assets.reduce((acc, a) => {
        acc[a.sensitivity] = (acc[a.sensitivity] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      uniqueTags: Array.from(allTags),
      totalTags: allTags.size,
    };

    await new Promise((resolve) => setTimeout(resolve, 180));

    return {
      result: {
        success: true,
        catalog: {
          name: catalogName,
          assets,
          document,
          summary,
          metadata: {
            totalAssets: assets.length,
            uniqueOwners: new Set(assets.map((a) => a.owner)).size,
            uniqueLocations: new Set(assets.map((a) => a.location).filter(Boolean)).size,
          },
          validation: {
            valid: true,
            warnings: validation.warnings,
          },
          toolId: "data-studio-catalog",
          timestamp: new Date().toISOString(),
        },
      },
      actualUsage: {
        cpuMs: Date.now() - executionStart,
        memMb: 110,
        durationMs: Date.now() - executionStart,
      },
    };
  },
});
