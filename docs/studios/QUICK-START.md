# Studio Advanced Automation - Quick Start Guide

## Overview

The studio tools now have advanced automation features that handle 95% of the work automatically while providing expert-level control when needed. This guide shows you how to use these features.

## Getting Started

### 1. Navigation

All studio pages now have consistent navigation:
- **Home** link to return to the main site
- **Studios Hub** link to see all studios
- **Breadcrumbs** showing your current location
- **Quick Switch** to jump between studios

### 2. Choose Your Mode

Toggle between **Beginner** and **Expert** modes:

```tsx
import { ModeToggle } from "@/components/studios/modes";

<ModeToggle mode={mode} onChange={setMode} />
```

- **Beginner Mode**: Guided workflows with smart defaults
- **Expert Mode**: Full control with advanced options

### 3. Use Examples

Start from pre-configured examples:

```tsx
import { ExampleLibrary } from "@/components/studios/automation";

<ExampleLibrary
  examples={examples}
  onSelect={(example) => {
    // Load example data
  }}
/>
```

### 4. Let Automation Work

The workflow engine handles multi-step processes:

```tsx
import { WorkflowEngine } from "@/components/studios/automation";

<WorkflowEngine
  steps={workflowSteps}
  autoStart={true}
  onComplete={(results) => {
    // Handle completion
  }}
/>
```

### 5. Get Smart Suggestions

The system suggests optimal configurations:

```tsx
import { IntelligentDefaults } from "@/components/studios/automation";

<IntelligentDefaults
  context={{ filename: "data.csv", rowCount: 1000 }}
  fields={formFields}
  onApply={(fieldId, value) => setValue(fieldId, value)}
/>
```

### 6. Generate Production Outputs

Create production-ready code, configs, and docs:

```tsx
import { OutputGenerator } from "@/components/studios/outputs";

<OutputGenerator
  outputs={generatedFiles}
  onGenerate={async (type) => {
    // Generate output
  }}
/>
```

### 7. Deploy Your Work

Use the deployment wizard:

```tsx
import { DeploymentWizard } from "@/components/studios/integration";

<DeploymentWizard
  target="github"
  onDeploy={async (target, config) => {
    // Deploy
  }}
/>
```

## Common Workflows

### Beginner Workflow

1. Select an example from the library
2. Follow the guided steps
3. Review smart suggestions and apply them
4. Let the workflow engine process everything
5. Export your results

### Expert Workflow

1. Switch to Expert mode
2. Upload custom templates or examples
3. Configure advanced options
4. Use automation tools (code/config generators)
5. Set up integrations (Git, CI/CD, Cloud)
6. Deploy directly to production

## Component Integration

### Adding to a Studio Page

```tsx
import { ModeToggle, BeginnerView, ExpertPanel } from "@/components/studios/modes";
import { WorkflowEngine, IntelligentDefaults } from "@/components/studios/automation";
import { OutputGenerator } from "@/components/studios/outputs";

export default function MyStudioPage() {
  const [mode, setMode] = useState<UserMode>("beginner");
  
  return (
    <div>
      <ModeToggle mode={mode} onChange={setMode} />
      
      {mode === "beginner" ? (
        <BeginnerView
          title="Process Your Data"
          steps={guidedSteps}
        >
          <IntelligentDefaults context={context} fields={fields} />
        </BeginnerView>
      ) : (
        <ExpertPanel sections={expertSections} />
      )}
      
      <WorkflowEngine steps={workflowSteps} />
      <OutputGenerator outputs={outputs} />
    </div>
  );
}
```

## Tips

1. **Start with Examples**: Use the example library to see what's possible
2. **Trust Smart Defaults**: The system suggests optimal configurations
3. **Use Batch Processing**: Process multiple items efficiently
4. **Validate Outputs**: Always validate before deploying
5. **Monitor Resources**: Watch resource usage for large operations

## Next Steps

- Explore the example library
- Try different automation tools
- Set up integrations
- Deploy your first project

For detailed API documentation, see the component files in `src/components/studios/`.
