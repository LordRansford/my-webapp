# Studio Components - Integration Examples

This guide provides practical examples of how to integrate the new advanced automation components into your studio pages.

## Quick Reference

### Import All Components

```tsx
// Modes
import { ModeToggle, type UserMode, BeginnerView, ExpertPanel } from "@/components/studios/modes";

// AI Components
import { AISuggestionEngine } from "@/components/studios/ai/AISuggestionEngine";
import { NLPInterface } from "@/components/studios/ai/NLPInterface";
import { LearningSystem } from "@/components/studios/ai/LearningSystem";

// Automation
import { WorkflowEngine, type WorkflowStep } from "@/components/studios/automation/WorkflowEngine";
import { IntelligentDefaults } from "@/components/studios/automation/IntelligentDefaults";
import { ExampleLibrary } from "@/components/studios/automation/ExampleLibrary";

// Outputs
import { OutputGenerator, type OutputFile } from "@/components/studios/outputs/OutputGenerator";

// Security
import { SecurityValidator } from "@/components/studios/security/SecurityValidator";

// UX
import { HelpSystem } from "@/components/studios/ux/HelpSystem";
```

---

## Example 1: Basic Integration (Beginner Mode)

```tsx
"use client";

import React, { useState } from "react";
import { ModeToggle, type UserMode, BeginnerView } from "@/components/studios/modes";
import { WorkflowEngine, type WorkflowStep } from "@/components/studios/automation/WorkflowEngine";
import { AISuggestionEngine } from "@/components/studios/ai/AISuggestionEngine";

export default function MyStudioPage() {
  const [mode, setMode] = useState<UserMode>("beginner");
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);

  const steps = [
    { id: "step-1", title: "Enter Data", description: "Provide your input", completed: false },
    { id: "step-2", title: "Process", description: "Automated processing", completed: false }
  ];

  return (
    <div>
      <ModeToggle mode={mode} onChange={setMode} />
      
      {mode === "beginner" && (
        <BeginnerView title="My Studio" steps={steps}>
          <AISuggestionEngine context={{}} />
          {workflowSteps.length > 0 && (
            <WorkflowEngine steps={workflowSteps} autoStart={true} />
          )}
        </BeginnerView>
      )}
    </div>
  );
}
```

---

## Example 2: Full-Featured Integration

```tsx
"use client";

import React, { useState, useCallback } from "react";
import { ModeToggle, BeginnerView, ExpertPanel } from "@/components/studios/modes";
import { AISuggestionEngine } from "@/components/studios/ai/AISuggestionEngine";
import { NLPInterface } from "@/components/studios/ai/NLPInterface";
import { WorkflowEngine } from "@/components/studios/automation/WorkflowEngine";
import { OutputGenerator } from "@/components/studios/outputs/OutputGenerator";
import { SecurityValidator } from "@/components/studios/security/SecurityValidator";
import { HelpSystem } from "@/components/studios/ux/HelpSystem";

export default function FullFeaturedStudio() {
  const [mode, setMode] = useState<UserMode>("beginner");
  const [input, setInput] = useState("");
  const [outputs, setOutputs] = useState([]);

  const handleNLPCommand = useCallback(async (command) => {
    // Handle natural language commands
    switch (command.intent) {
      case "generate-code":
        // Generate code
        break;
      case "process-data":
        // Process data
        break;
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1>My Studio</h1>
        <div className="flex gap-4">
          <ModeToggle mode={mode} onChange={setMode} />
          <HelpSystem />
        </div>
      </div>

      {/* AI Suggestions */}
      <AISuggestionEngine
        context={{ input }}
        onSuggestionApply={(suggestion) => {
          console.log("Applied:", suggestion);
        }}
      />

      {/* NLP Interface */}
      <NLPInterface onCommand={handleNLPCommand} />

      {/* Main Content */}
      {mode === "beginner" ? (
        <BeginnerView title="Process Your Data" steps={[]}>
          <SecurityValidator value={input} type="text" />
          <WorkflowEngine steps={workflowSteps} autoStart={true} />
          <OutputGenerator outputs={outputs} />
        </BeginnerView>
      ) : (
        <ExpertPanel sections={expertSections} />
      )}
    </div>
  );
}
```

---

## Example 3: Workflow with Outputs

```tsx
import { WorkflowEngine, type WorkflowStep } from "@/components/studios/automation/WorkflowEngine";
import { OutputGenerator, type OutputFile } from "@/components/studios/outputs/OutputGenerator";

const workflowSteps: WorkflowStep[] = [
  {
    id: "validate",
    name: "Validate Input",
    description: "Check input for errors",
    status: "pending",
    autoExecute: true,
    execute: async () => {
      // Validation logic
      return { valid: true };
    }
  },
  {
    id: "process",
    name: "Process Data",
    description: "Run processing",
    status: "pending",
    autoExecute: true,
    dependencies: ["validate"],
    execute: async () => {
      // Processing logic
      return { result: "processed" };
    }
  }
];

const outputs: OutputFile[] = [
  {
    id: "code-1",
    type: "code",
    name: "processor.py",
    content: "def process(data): ...",
    language: "python"
  }
];

<>
  <WorkflowEngine
    steps={workflowSteps}
    autoStart={true}
    onComplete={(results) => {
      // Handle completion
    }}
  />
  <OutputGenerator outputs={outputs} />
</>
```

---

## Example 4: Security Integration

```tsx
import { SecurityValidator } from "@/components/studios/security/SecurityValidator";
import { SafetyGuardrails } from "@/components/studios/security/SafetyGuardrails";

// Validate user input
<SecurityValidator
  value={userInput}
  type="text"
  onValidationChange={(isValid) => {
    if (!isValid) {
      // Handle validation failure
    }
  }}
/>

// Check guardrails
<SafetyGuardrails
  context={{
    fileSize: file.size,
    operation: "upload"
  }}
  onViolation={(violation) => {
    // Handle violation
  }}
/>
```

---

## Example 5: AI-Powered Features

```tsx
import { AISuggestionEngine } from "@/components/studios/ai/AISuggestionEngine";
import { NLPInterface } from "@/components/studios/ai/NLPInterface";
import { LearningSystem } from "@/components/studios/ai/LearningSystem";

// AI Suggestions
<AISuggestionEngine
  context={{
    fileSize: 10 * 1024 * 1024, // 10MB
    rowCount: 50000
  }}
  history={userActions}
  onSuggestionApply={(suggestion) => {
    // Apply suggestion
  }}
/>

// Natural Language Interface
<NLPInterface
  onCommand={async (command) => {
    // Handle command
    return { success: true };
  }}
/>

// Learning System
<LearningSystem
  userActions={actionHistory}
  onRecommend={(pattern) => {
    // Use recommended pattern
  }}
/>
```

---

## Example 6: Complete Studio Page Template

See `src/pages/studios/llm-agent-lab/enhanced-example.jsx` for a complete, production-ready example that integrates all components.

---

## Best Practices

1. **Start Simple**: Begin with ModeToggle and BeginnerView, then add features incrementally
2. **Use TypeScript**: All components are fully typed - leverage this for better DX
3. **Handle Errors**: Wrap async operations in try-catch blocks
4. **Track Actions**: Use LearningSystem to track user actions for better suggestions
5. **Validate Inputs**: Always use SecurityValidator for user inputs
6. **Provide Context**: Pass rich context to AISuggestionEngine for better suggestions

---

## Common Patterns

### Pattern 1: Mode-Based Rendering
```tsx
{mode === "beginner" ? (
  <BeginnerView>...</BeginnerView>
) : (
  <ExpertPanel>...</ExpertPanel>
)}
```

### Pattern 2: Workflow with Outputs
```tsx
<WorkflowEngine
  steps={steps}
  onComplete={(results) => {
    setOutputs(generateOutputs(results));
  }}
/>
{outputs.length > 0 && <OutputGenerator outputs={outputs} />}
```

### Pattern 3: AI Suggestions with Actions
```tsx
<AISuggestionEngine
  context={context}
  onSuggestionApply={(suggestion) => {
    if (suggestion.action) {
      suggestion.action();
    }
  }}
/>
```

---

For more details, see:
- `QUICK-START.md` - Quick start guide
- `COMPLETE-IMPLEMENTATION-REPORT.md` - Full feature list
- Component files - Inline TypeScript documentation
