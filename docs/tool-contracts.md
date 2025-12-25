# Tool Contracts Specification

Every tool on `/tools` must have a complete contract in `data/tool-contracts.json` with the following fields.

## Required Fields

### Basic Metadata
- `id`: Unique identifier (e.g., "python-playground")
- `title`: Display name
- `description`: Short description shown in tool card
- `category`: Tool category (AI, Cybersecurity, Data, Software Architecture, Digitalisation)
- `difficulty`: Beginner | Intermediate | Advanced
- `route`: Full route path (e.g., "/tools/ai/python-playground")

### Execution Configuration
- `executionModes`: Array of supported modes
  - `["local"]`: Only local (browser) execution
  - `["local", "compute"]`: Both local and server-side compute available
- `defaultMode`: Default mode when tool loads ("local" or "compute")
- `execution`: Legacy field, maps to executionModes
  - "browser-only" → `["local"]`
  - "sandboxed-server" → `["compute"]` (or `["local", "compute"]` if local also supported)
  - "static-analysis" → `["local"]`

### Inputs Schema
- `inputs`: Array of input definitions
  - `name`: Input field name
  - `type`: "string" | "number" | "boolean" | "enum" | "file" | "array"
  - `limits`: Human-readable limit description
  - `required`: boolean (default: true)
  - `default`: Default value (optional)

### Limits
- `limits`: Resource limits object
  - `cpuMs`: Maximum CPU time in milliseconds
  - `wallMs`: Maximum wall-clock time (includes I/O wait)
  - `memoryMb`: Maximum memory in MB
  - `inputKb`: Maximum input size in KB
  - `outputKb`: Maximum output size in KB

### Credit Model
- `creditModel`: Credit calculation
  - `baseCredits`: Base cost per run (number)
  - `perKbCredits`: Additional credits per KB of input (number)
  - `complexityMultiplierHints`: Object with hints for complexity estimation
    - For JS: `{ hasLoops: 1.2, hasAsync: 1.3 }`
    - For Python: `{ hasImports: 1.1, hasLoops: 1.2 }`
    - For SQL: `{ hasJoins: 1.5, hasGroupBy: 1.3 }`
- `credits`: Legacy field, maps to `creditModel.baseCredits`

### Runner
- `runner`: Execution endpoint
  - `"local"`: Runs in browser (no API call)
  - `"/api/tools/run/<toolId>"`: Server-side execution endpoint

### Error Handling
- `failureModes`: Array of possible error codes
- `statusStates`: Array of valid state transitions

### Security
- `securityNotes`: Human-readable security notes (optional)
  - Example: "No network access. No file system access. Output truncated at limits."

## Example Contract

```json
{
  "id": "python-playground",
  "title": "Python playground",
  "description": "Run small Python experiments in-browser (Pyodide).",
  "category": "AI",
  "difficulty": "Intermediate",
  "route": "/tools/ai/python-playground",
  "executionModes": ["local", "compute"],
  "defaultMode": "local",
  "inputs": [
    {
      "name": "code",
      "type": "string",
      "limits": "max 10KB, ideal under 100 lines",
      "required": true
    }
  ],
  "limits": {
    "cpuMs": 5000,
    "wallMs": 10000,
    "memoryMb": 256,
    "inputKb": 10,
    "outputKb": 128
  },
  "creditModel": {
    "baseCredits": 0,
    "perKbCredits": 0.1,
    "complexityMultiplierHints": {
      "hasLoops": 1.2,
      "hasImports": 1.1
    }
  },
  "runner": "local",
  "failureModes": ["syntax_error", "runtime_error", "timeout", "memory_exceeded"],
  "statusStates": ["idle", "running", "completed", "failed"],
  "securityNotes": "Runs in isolated Pyodide worker. No network or file system access. Output truncated at 128KB."
}
```

## Validation Rules

1. Every tool in `/tools` hub must have a contract
2. `executionModes` must include at least "local" for tools that run
3. `defaultMode` must be one of the `executionModes`
4. All limit fields must be numbers >= 0
5. `creditModel.baseCredits` must be >= 0
6. If `executionModes` includes "compute", `runner` must start with "/api/"

## CI Enforcement

The build will fail if:
- Any tool route lacks a contract
- Any contract is missing required fields
- Any contract has invalid values (negative limits, etc.)
