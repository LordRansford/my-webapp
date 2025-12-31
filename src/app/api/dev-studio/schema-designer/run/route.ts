import { NextRequest } from "next/server";
import { createToolExecutionHandler } from "@/lib/studios/toolExecutionHelper";

interface Field {
  id: string;
  name: string;
  type: "string" | "number" | "boolean" | "date" | "text" | "json";
  nullable: boolean;
  unique: boolean;
  primaryKey: boolean;
  defaultValue?: string;
}

interface Table {
  id: string;
  name: string;
  fields: Field[];
}

interface Relationship {
  id: string;
  fromTable: string;
  fromField: string;
  toTable: string;
  toField: string;
  type: "one-to-one" | "one-to-many" | "many-to-many";
}

function mapFieldTypeToSQL(type: string): string {
  const typeMap: Record<string, string> = {
    string: "VARCHAR(255)",
    number: "INTEGER",
    boolean: "BOOLEAN",
    date: "DATE",
    text: "TEXT",
    json: "JSON",
  };
  return typeMap[type] || "VARCHAR(255)";
}

function validateSchema(tables: Table[], relationships: Relationship[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!tables || tables.length === 0) {
    errors.push("Schema must contain at least one table");
    return { valid: false, errors };
  }

  const tableNames = new Set<string>();
  for (const table of tables) {
    if (!table.name || table.name.trim() === "") {
      errors.push("Table name cannot be empty");
    } else if (tableNames.has(table.name)) {
      errors.push(`Duplicate table name: ${table.name}`);
    } else {
      tableNames.add(table.name);
    }

    if (!table.fields || table.fields.length === 0) {
      errors.push(`Table ${table.name} must have at least one field`);
    }

    const fieldNames = new Set<string>();
    let primaryKeyCount = 0;
    for (const field of table.fields) {
      if (!field.name || field.name.trim() === "") {
        errors.push(`Table ${table.name} has a field with empty name`);
      } else if (fieldNames.has(field.name)) {
        errors.push(`Table ${table.name} has duplicate field name: ${field.name}`);
      } else {
        fieldNames.add(field.name);
      }

      if (field.primaryKey) {
        primaryKeyCount++;
      }
    }

    if (primaryKeyCount === 0) {
      errors.push(`Table ${table.name} must have at least one primary key field`);
    } else if (primaryKeyCount > 1) {
      errors.push(`Table ${table.name} has multiple primary keys (composite keys not yet supported)`);
    }
  }

  if (relationships && relationships.length > 0) {
    for (const rel of relationships) {
      const fromTable = tables.find((t) => t.id === rel.fromTable);
      const toTable = tables.find((t) => t.id === rel.toTable);

      if (!fromTable) {
        errors.push(`Relationship references non-existent table: ${rel.fromTable}`);
      }
      if (!toTable) {
        errors.push(`Relationship references non-existent table: ${rel.toTable}`);
      }

      if (fromTable && !fromTable.fields.find((f) => f.id === rel.fromField)) {
        errors.push(`Relationship references non-existent field in ${fromTable.name}`);
      }
      if (toTable && !toTable.fields.find((f) => f.id === rel.toField)) {
        errors.push(`Relationship references non-existent field in ${toTable.name}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function generateSQL(tables: Table[], relationships: Relationship[]): string {
  let sql = "-- Generated Database Schema\n";
  sql += `-- Generated at: ${new Date().toISOString()}\n\n`;

  for (const table of tables) {
    sql += `CREATE TABLE ${table.name} (\n`;
    const fieldDefinitions: string[] = [];

    for (const field of table.fields) {
      let def = `  ${field.name} ${mapFieldTypeToSQL(field.type)}`;

      if (field.primaryKey) {
        def += " PRIMARY KEY";
        if (field.defaultValue === "AUTO_INCREMENT") {
          def += " AUTO_INCREMENT";
        }
      }

      if (!field.nullable) {
        def += " NOT NULL";
      }

      if (field.unique && !field.primaryKey) {
        def += " UNIQUE";
      }

      if (field.defaultValue && field.defaultValue !== "AUTO_INCREMENT") {
        def += ` DEFAULT '${field.defaultValue}'`;
      }

      fieldDefinitions.push(def);
    }

    sql += fieldDefinitions.join(",\n");
    sql += "\n);\n\n";
  }

  if (relationships && relationships.length > 0) {
    for (const rel of relationships) {
      const fromTable = tables.find((t) => t.id === rel.fromTable);
      const toTable = tables.find((t) => t.id === rel.toTable);
      const fromField = fromTable?.fields.find((f) => f.id === rel.fromField);
      const toField = toTable?.fields.find((f) => f.id === rel.toField);

      if (fromTable && toTable && fromField && toField) {
        sql += `ALTER TABLE ${fromTable.name}\n`;
        sql += `  ADD CONSTRAINT fk_${fromTable.name}_${toTable.name}\n`;
        sql += `  FOREIGN KEY (${fromField.name}) REFERENCES ${toTable.name}(${toField.name});\n\n`;
      }
    }
  }

  return sql;
}

export const POST = createToolExecutionHandler({
  toolId: "dev-studio-schema-designer",
  executeTool: async (userId, body) => {
    const executionStart = Date.now();
    const tables: Table[] = body.tables || [];
    const relationships: Relationship[] = body.relationships || [];

    const validation = validateSchema(tables, relationships);

    if (!validation.valid) {
      return {
        result: {
          success: false,
          errors: validation.errors,
          schema: {
            name: body.schemaName || "Untitled Schema",
            tables,
            relationships,
          },
        },
        actualUsage: {
          cpuMs: Date.now() - executionStart,
          memMb: 80,
          durationMs: Date.now() - executionStart,
        },
      };
    }

    const sqlScript = generateSQL(tables, relationships);

    await new Promise((resolve) => setTimeout(resolve, 200));

    return {
      result: {
        success: true,
        schema: {
          name: body.schemaName || "Untitled Schema",
          tables,
          relationships,
        },
        sqlScript,
        validation: {
          valid: true,
          tableCount: tables.length,
          fieldCount: tables.reduce((sum, t) => sum + t.fields.length, 0),
          relationshipCount: relationships.length,
        },
        toolId: "dev-studio-schema-designer",
        timestamp: new Date().toISOString(),
      },
      actualUsage: {
        cpuMs: Date.now() - executionStart,
        memMb: 80,
        durationMs: Date.now() - executionStart,
      },
    };
  },
});
