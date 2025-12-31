import { NextRequest } from "next/server";
import { createToolExecutionHandler } from "@/lib/studios/toolExecutionHelper";

type StageType = "build" | "test" | "deploy" | "notify" | "custom";
type Trigger = "push" | "pull_request" | "schedule" | "manual";

interface PipelineStage {
  id: string;
  name: string;
  type: StageType;
  commands: string[];
  environment?: string;
  dependencies?: string[];
}

interface Pipeline {
  name: string;
  trigger: Trigger;
  branches?: string[];
  schedule?: string;
  stages: PipelineStage[];
}

function validatePipeline(pipeline: Pipeline): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!pipeline.name || pipeline.name.trim() === "") {
    errors.push("Pipeline name cannot be empty");
  }

  if (!pipeline.stages || pipeline.stages.length === 0) {
    errors.push("Pipeline must have at least one stage");
  }

  pipeline.stages?.forEach((stage, index) => {
    if (!stage.name || stage.name.trim() === "") {
      errors.push(`Stage ${index + 1} must have a name`);
    }

    if (!stage.commands || stage.commands.length === 0) {
      errors.push(`Stage "${stage.name || `Stage ${index + 1}`}" must have at least one command`);
    }

    stage.commands?.forEach((cmd, cmdIndex) => {
      if (!cmd || cmd.trim() === "") {
        warnings.push(`Stage "${stage.name}" has empty command at position ${cmdIndex + 1}`);
      }
    });

    // Check for circular dependencies
    if (stage.dependencies) {
      stage.dependencies.forEach((depId) => {
        const depIndex = pipeline.stages.findIndex((s) => s.id === depId);
        if (depIndex === -1) {
          errors.push(`Stage "${stage.name}" references non-existent dependency: ${depId}`);
        } else if (depIndex >= index) {
          warnings.push(`Stage "${stage.name}" depends on a stage that comes after it`);
        }
      });
    }
  });

  if (pipeline.trigger === "schedule" && !pipeline.schedule) {
    errors.push("Scheduled trigger requires a cron schedule");
  }

  if (pipeline.trigger === "schedule" && pipeline.schedule && !/^\d+ \d+ \* \* \*$/.test(pipeline.schedule)) {
    warnings.push("Schedule format may be invalid. Expected format: 'minute hour * * *'");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

function generateGitHubActionsYaml(pipeline: Pipeline): string {
  let yaml = `name: ${pipeline.name}\n\n`;

  // Trigger configuration
  yaml += "on:\n";
  if (pipeline.trigger === "push") {
    yaml += "  push:\n";
    if (pipeline.branches && pipeline.branches.length > 0) {
      yaml += `    branches:\n`;
      pipeline.branches.forEach((branch) => {
        yaml += `      - ${branch}\n`;
      });
    } else {
      yaml += `    branches: [ main ]\n`;
    }
  } else if (pipeline.trigger === "pull_request") {
    yaml += "  pull_request:\n";
    if (pipeline.branches && pipeline.branches.length > 0) {
      yaml += `    branches:\n`;
      pipeline.branches.forEach((branch) => {
        yaml += `      - ${branch}\n`;
      });
    } else {
      yaml += `    branches: [ main ]\n`;
    }
  } else if (pipeline.trigger === "schedule") {
    yaml += "  schedule:\n";
    yaml += `    - cron: '${pipeline.schedule || "0 0 * * *"}'\n`;
  } else {
    yaml += "  workflow_dispatch:\n";
  }

  yaml += "\n";
  yaml += "jobs:\n";

  // Generate jobs for each stage
  pipeline.stages.forEach((stage, index) => {
    const jobName = stage.name.toLowerCase().replace(/\s+/g, "-");
    yaml += `  ${jobName}:\n`;
    yaml += `    runs-on: ubuntu-latest\n`;

    // Add dependencies (needs)
    if (stage.dependencies && stage.dependencies.length > 0) {
      yaml += `    needs:\n`;
      stage.dependencies.forEach((depId) => {
        const depStage = pipeline.stages.find((s) => s.id === depId);
        if (depStage) {
          const depJobName = depStage.name.toLowerCase().replace(/\s+/g, "-");
          yaml += `      - ${depJobName}\n`;
        }
      });
    }

    yaml += `    steps:\n`;

    // Add checkout step if not first stage or if explicitly needed
    if (index === 0 || stage.type === "build" || stage.type === "test") {
      yaml += `      - uses: actions/checkout@v4\n`;
    }

    // Add environment variables if specified
    if (stage.environment) {
      yaml += `      - name: Set up environment\n`;
      yaml += `        run: |\n`;
      yaml += `          echo "ENVIRONMENT=${stage.environment}" >> $GITHUB_ENV\n`;
    }

    // Add stage-specific setup
    if (stage.type === "build" || stage.type === "test") {
      yaml += `      - name: Set up Node.js\n`;
      yaml += `        uses: actions/setup-node@v4\n`;
      yaml += `        with:\n`;
      yaml += `          node-version: '20'\n`;
      yaml += `      - name: Install dependencies\n`;
      yaml += `        run: npm ci\n`;
    }

    // Add stage commands
    yaml += `      - name: ${stage.name}\n`;
    yaml += `        run: |\n`;
    stage.commands.forEach((cmd) => {
      if (cmd && cmd.trim()) {
        yaml += `          ${cmd}\n`;
      }
    });

    // Add deployment step if deploy stage
    if (stage.type === "deploy") {
      yaml += `      - name: Deploy\n`;
      yaml += `        run: echo "Deployment would happen here"\n`;
    }

    // Add notification step if notify stage
    if (stage.type === "notify") {
      yaml += `      - name: Send notification\n`;
      yaml += `        run: echo "Notification would be sent here"\n`;
    }
  });

  return yaml;
}

export const POST = createToolExecutionHandler({
  toolId: "dev-studio-cicd",
  executeTool: async (userId, body) => {
    const executionStart = Date.now();

    const pipeline: Pipeline = {
      name: body.pipelineName || body.name || "Untitled Pipeline",
      trigger: body.trigger || "push",
      branches: body.branches || ["main"],
      schedule: body.schedule,
      stages: body.stages || [],
    };

    // Validate pipeline
    const validation = validatePipeline(pipeline);

    if (!validation.valid) {
      return {
        result: {
          success: false,
          errors: validation.errors,
          warnings: validation.warnings,
          pipeline,
        },
        actualUsage: {
          cpuMs: Date.now() - executionStart,
          memMb: 100,
          durationMs: Date.now() - executionStart,
        },
      };
    }

    // Generate GitHub Actions YAML if requested
    const githubActionsYaml = body.exportYaml !== false ? generateGitHubActionsYaml(pipeline) : null;

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 200));

    return {
      result: {
        success: true,
        pipeline: {
          name: pipeline.name,
          trigger: pipeline.trigger,
          branches: pipeline.branches,
          schedule: pipeline.schedule,
          stages: pipeline.stages,
          stageCount: pipeline.stages.length,
          githubActionsYaml,
          validation: {
            valid: true,
            warnings: validation.warnings,
          },
          toolId: "dev-studio-cicd",
          timestamp: new Date().toISOString(),
        },
      },
      actualUsage: {
        cpuMs: Date.now() - executionStart,
        memMb: 100,
        durationMs: Date.now() - executionStart,
      },
    };
  },
});
