import { NextRequest } from "next/server";
import { createToolExecutionHandler } from "@/lib/studios/toolExecutionHelper";

interface FieldInfo {
  name: string;
  type: string;
  nullable: boolean;
  sampleValues: unknown[];
  unique: boolean;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
}

function inferType(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value === "string") {
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) return "date";
    if (/^\d{4}-\d{2}-\d{2}T/.test(value)) return "datetime";
    if (/^https?:\/\//.test(value)) return "url";
    if (/^[\w.-]+@[\w.-]+\.\w+/.test(value)) return "email";
    return "string";
  }
  if (typeof value === "number") {
    if (Number.isInteger(value)) return "integer";
    return "number";
  }
  if (typeof value === "boolean") return "boolean";
  if (Array.isArray(value)) return "array";
  if (typeof value === "object") return "object";
  return "unknown";
}

function analyzeSchema(data: unknown[]): Record<string, FieldInfo> {
  const schemaMap: Record<string, FieldInfo> = {};

  data.forEach((item) => {
    if (typeof item !== "object" || item === null) return;

    Object.keys(item).forEach((key) => {
      if (!schemaMap[key]) {
        schemaMap[key] = {
          name: key,
          type: "unknown",
          nullable: false,
          sampleValues: [],
          unique: true,
        };
      }

      const field = schemaMap[key];
      const value = (item as Record<string, unknown>)[key];

      // Update type if more specific
      const inferredType = inferType(value);
      if (inferredType !== "unknown" && field.type === "unknown") {
        field.type = inferredType;
      }

      // Check nullable
      if (value === null || value === undefined) {
        field.nullable = true;
      }

      // Collect sample values
      if (field.sampleValues.length < 5 && value !== null && value !== undefined) {
        field.sampleValues.push(value);
      }

      // Check uniqueness (simplified - assumes unique if all values seen so far are different)
      if (field.unique && field.sampleValues.length > 1) {
        const uniqueValues = new Set(field.sampleValues);
        if (uniqueValues.size < field.sampleValues.length) {
          field.unique = false;
        }
      }

      // Update string length constraints
      if (typeof value === "string") {
        const len: number = value.length;
        if (field.minLength === undefined || len < field.minLength) {
          field.minLength = len;
        }
        if (field.maxLength === undefined || len > field.maxLength) {
          field.maxLength = len;
        }
      }

      // Update numeric constraints
      if (typeof value === "number") {
        const numValue: number = value;
        if (field.minValue === undefined || numValue < field.minValue) {
          field.minValue = numValue;
        }
        if (field.maxValue === undefined || numValue > field.maxValue) {
          field.maxValue = numValue;
        }
      }
    });
  });

  return schemaMap;
}

function validateSchema(schema: Record<string, FieldInfo>): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  const fields = Object.values(schema);

  if (fields.length === 0) {
    errors.push("Schema has no fields");
  }

  fields.forEach((field) => {
    if (field.type === "unknown") {
      warnings.push(`Field ${field.name} has unknown type`);
    }

    if (field.type === "string" && field.maxLength && field.maxLength > 10000) {
      warnings.push(`Field ${field.name} has very large max length (${field.maxLength})`);
    }

    if (field.type === "number" && field.minValue !== undefined && field.maxValue !== undefined) {
      if (field.maxValue - field.minValue > 1000000) {
        warnings.push(`Field ${field.name} has very wide numeric range`);
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export const POST = createToolExecutionHandler({
  toolId: "data-studio-schema",
  executeTool: async (userId, body) => {
    const executionStart = Date.now();

    try {
      // Parse input data
      let data: unknown[];
      if (body.jsonData) {
        const parsed = JSON.parse(body.jsonData);
        data = Array.isArray(parsed) ? parsed : [parsed];
      } else if (body.data) {
        data = Array.isArray(body.data) ? body.data : [body.data];
      } else {
        return {
          result: {
            success: false,
            error: "No data provided. Please provide jsonData or data field.",
          },
          actualUsage: {
            cpuMs: Date.now() - executionStart,
            memMb: 120,
            durationMs: Date.now() - executionStart,
          },
        };
      }

      if (data.length === 0) {
        return {
          result: {
            success: false,
            error: "Data array is empty",
          },
          actualUsage: {
            cpuMs: Date.now() - executionStart,
            memMb: 120,
            durationMs: Date.now() - executionStart,
          },
        };
      }

      // Analyze schema
      const schema = analyzeSchema(data);
      const validation = validateSchema(schema);

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 200));

      return {
        result: {
          success: true,
          schema: {
            dataset: body.dataset || "Unknown",
            fields: Object.values(schema),
            fieldCount: Object.keys(schema).length,
            rowCount: data.length,
            validation,
            toolId: "data-studio-schema",
            timestamp: new Date().toISOString(),
          },
        },
        actualUsage: {
          cpuMs: Date.now() - executionStart,
          memMb: 120,
          durationMs: Date.now() - executionStart,
        },
      };
    } catch (error) {
      return {
        result: {
          success: false,
          error: error instanceof Error ? error.message : "Failed to analyze schema",
        },
        actualUsage: {
          cpuMs: Date.now() - executionStart,
          memMb: 120,
          durationMs: Date.now() - executionStart,
        },
      };
    }
  },
});
