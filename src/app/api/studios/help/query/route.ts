import { NextResponse } from "next/server";
import { z } from "zod";
import { runWithMetering } from "@/lib/tools/runWithMetering";
import { requireSameOrigin } from "@/lib/security/origin";
import { rateLimit } from "@/lib/security/rateLimit";
import { withRequestLogging } from "@/lib/security/requestLog";
import { retrieveContent } from "@/lib/mentor/retrieveContent";
import { generateAnswer } from "@/lib/mentor/llm";

const StudioId = z.enum(["dev", "cyber", "data", "ai", "architecture", "lab"]);
const ComplexityPreset = z.enum(["light", "standard", "heavy"]);

function allowedPrefixes(studio: z.infer<typeof StudioId>): string[] {
  switch (studio) {
    case "dev":
      return ["/dev-studio", "/dev-studios"];
    case "cyber":
      return ["/cyber-studio", "/cyber-studios", "/tools/cyber"];
    case "data":
      return ["/data-studio", "/data-studios", "/tools/data"];
    case "ai":
      return ["/ai-studio", "/ai-studios", "/tools/ai"];
    case "architecture":
      return ["/studios/architecture-diagram-studio", "/tools/software-architecture"];
    case "lab":
    default:
      return ["/studios", "/tools"];
  }
}

function isWithinScope(hrefOrRoute: string, prefixes: string[]) {
  const href = String(hrefOrRoute || "");
  const route = href.startsWith("http") ? href : href.split("#")[0];
  return prefixes.some((p) => route.startsWith(p));
}

function makeRefusal(studioLabel: string, prefixes: string[]) {
  return [
    `I can help only with **${studioLabel}** right now.`,
    ``,
    `Try asking about:`,
    `- what to do first (step-by-step)`,
    `- how to upload a file and what format to use`,
    `- generating an example file you can copy/paste and tailor`,
    ``,
    `Scope routes: ${prefixes.join(", ")}`,
  ].join("\n");
}

function makeExampleFiles(params: {
  studio: z.infer<typeof StudioId>;
  type: string;
  projectName: string;
  requirements: string;
}): Array<{ filename: string; content: string; mime?: string; description?: string }> {
  const project = (params.projectName || "My project").trim().slice(0, 80);
  const req = (params.requirements || "").trim().slice(0, 3000);

  if (params.studio === "architecture" && params.type === "mermaid") {
    return [
      {
        filename: "diagram.mmd",
        mime: "text/plain",
        description: "Mermaid flow diagram (edit names and connections).",
        content:
          `%% ${project}\n` +
          `%% Requirements:\n` +
          req
            .split("\n")
            .slice(0, 10)
            .map((l) => `%% - ${l}`)
            .join("\n") +
          `\n\nflowchart LR\n  user((User)) --> web[Web App]\n  web --> api[API]\n  api --> db[(Database)]\n`,
      },
      {
        filename: "brief.md",
        mime: "text/markdown",
        description: "A short diagram brief you can attach to reviews.",
        content: `# Diagram brief: ${project}\n\n## Goal\n${req || "- (fill in)"}\n\n## Boundaries\n- What is inside the system\n- What is outside the system\n\n## Key risks\n- (fill in)\n`,
      },
    ];
  }

  if (params.studio === "cyber" && params.type === "risk-register") {
    return [
      {
        filename: "risk-register.csv",
        mime: "text/csv",
        description: "CSV risk register starter (edit and upload).",
        content:
          "risk_id,title,asset,threat,impact,likelihood,mitigation,owner,status\n" +
          `R-001,Unauthorised access,${project},Credential stuffing,High,Medium,Rate limits + MFA + monitoring,Security,Open\n` +
          `R-002,Data leak,${project},Misconfigured storage,High,Low,Least privilege + audits,Security,Open\n`,
      },
    ];
  }

  if (params.studio === "cyber" && params.type === "threat-model") {
    const json = {
      project,
      version: 1,
      requirements: req,
      assets: [{ name: "Customer data", sensitivity: "high" }],
      entryPoints: ["Web app", "API"],
      threats: [
        { id: "T1", title: "Credential stuffing", impact: "high", mitigations: ["Rate limiting", "MFA", "Lockout policy"] },
        { id: "T2", title: "SQL injection", impact: "high", mitigations: ["Parameterized queries", "WAF", "Input validation"] },
      ],
    };
    return [{ filename: "threat-model.json", mime: "application/json", description: "Threat model JSON starter.", content: JSON.stringify(json, null, 2) }];
  }

  if (params.studio === "data" && params.type === "dataset-csv") {
    const csv =
      "customer_id,signup_date,plan,monthly_spend,active\n" +
      "c_001,2025-10-01,basic,12.99,true\n" +
      "c_002,2025-10-08,pro,29.99,true\n" +
      "c_003,2025-11-02,basic,12.99,false\n";
    const schema = {
      dataset: project,
      columns: [
        { name: "customer_id", type: "string", nullable: false },
        { name: "signup_date", type: "date", nullable: false },
        { name: "plan", type: "string", nullable: false },
        { name: "monthly_spend", type: "number", nullable: false },
        { name: "active", type: "boolean", nullable: false },
      ],
      requirements: req,
    };
    return [
      { filename: "dataset.csv", mime: "text/csv", description: "Small synthetic dataset starter.", content: csv },
      { filename: "schema.json", mime: "application/json", description: "Schema starter for validation/governance.", content: JSON.stringify(schema, null, 2) },
    ];
  }

  if (params.studio === "dev" && params.type === "openapi") {
    const yaml =
      `openapi: 3.0.3\n` +
      `info:\n  title: ${project} API\n  version: 1.0.0\n` +
      `servers:\n  - url: https://api.example.com\n` +
      `paths:\n  /health:\n    get:\n      summary: Health check\n      responses:\n        '200':\n          description: OK\n` +
      `components:\n  securitySchemes:\n    bearerAuth:\n      type: http\n      scheme: bearer\n      bearerFormat: JWT\n`;
    return [{ filename: "openapi.yaml", mime: "text/yaml", description: "OpenAPI starter spec.", content: yaml + `\n# Requirements:\n# ${req.replace(/\n/g, "\n# ")}\n` }];
  }

  if (params.studio === "ai" && params.type === "ai-studio-project") {
    const projectJson = {
      title: project,
      exampleId: "story-generator",
      audience: "all",
      difficulty: "beginner",
      category: "ai",
      config: { promptTemplate: "Write a safe, kind story about: {{topic}}" },
      requirements: req,
    };
    return [{ filename: "ai-studio-project.json", mime: "application/json", description: "AI Studio project-style JSON starter.", content: JSON.stringify(projectJson, null, 2) }];
  }

  const brief = `# Project brief: ${project}\n\n## Requirements\n${req || "- (fill in)"}\n\n## Next steps\n- Choose the right studio section\n- Upload the example file (if applicable)\n- Run once, inspect output, iterate in small steps\n`;
  return [{ filename: "project-brief.md", mime: "text/markdown", description: "Generic brief starter.", content: brief }];
}

export async function POST(req: Request) {
  return withRequestLogging(req, { route: "POST /api/studios/help/query" }, async () => {
    const originBlock = requireSameOrigin(req);
    if (originBlock) return originBlock;

    const limited = rateLimit(req, { keyPrefix: "studios-help", limit: 60, windowMs: 60_000 });
    if (limited) return limited;

    const bodySchema = z.object({
      studio: StudioId,
      mode: z.enum(["chat", "generate"]),
      question: z.string().optional(),
      example: z
        .object({
          type: z.string().min(1).max(80),
          projectName: z.string().min(1).max(120),
          requirements: z.string().max(6000).optional(),
        })
        .nullable()
        .optional(),
      requestedComplexityPreset: ComplexityPreset.optional(),
    });

    const parsed = bodySchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
    }

    const studio = parsed.data.studio;
    const mode = parsed.data.mode;
    const prefixes = allowedPrefixes(studio);
    const requestedComplexityPreset = parsed.data.requestedComplexityPreset || "standard";
    const studioLabel =
      studio === "dev"
        ? "Dev Studio"
        : studio === "cyber"
        ? "Cyber Studio"
        : studio === "data"
        ? "Data Studio"
        : studio === "ai"
        ? "AI Studio"
        : studio === "architecture"
        ? "Architecture Diagram Studio"
        : "Studios";

    const metered = await runWithMetering({
      req,
      userId: null,
      toolId: "studio-help-assistant",
      inputBytes: Buffer.byteLength(mode === "chat" ? String(parsed.data.question || "") : JSON.stringify(parsed.data.example || {})),
      requestedComplexityPreset,
      execute: async () => {
        if (mode === "generate") {
          const ex = parsed.data.example;
          const files = ex
            ? makeExampleFiles({ studio, type: ex.type, projectName: ex.projectName, requirements: ex.requirements || "" })
            : [];
          const answer = `Generated ${files.length} file(s) for **${studioLabel}**.\n\nNext: download a file, then upload it in the relevant studio tool and run once.`;
          return { output: { answer, files }, outputBytes: Buffer.byteLength(JSON.stringify({ answer, files })) };
        }

        const question = String(parsed.data.question || "").trim().slice(0, 500);
        if (!question) {
          const answer = "Ask a question, or use the example generator.";
          return { output: { answer, files: [] }, outputBytes: Buffer.byteLength(JSON.stringify({ answer, files: [] })) };
        }

        const retrieved = retrieveContent(question, null, 10);
        const scoped = (retrieved.matches || []).filter((m) => isWithinScope(m.pageRoute || m.href, prefixes));

        // If no scoped content found, refuse (keeps help limited to studio content).
        if (!scoped.length) {
          const answer = makeRefusal(studioLabel, prefixes);
          return { output: { answer, files: [] }, outputBytes: Buffer.byteLength(JSON.stringify({ answer, files: [] })) };
        }

        // Optional LLM (if configured) grounded only in scoped citations.
        const ragItems = scoped.slice(0, 6).map((c) => ({ title: c.title, href: c.href, excerpt: c.why }));
        const llm = await generateAnswer(question, ragItems, { title: `${studioLabel} Help`, pathname: `/help?studio=${studio}` }).catch(() => null);

        const answer = llm?.answer
          ? llm.answer
          : [
              `I found these relevant ${studioLabel} sections and can help you apply them:`,
              ...ragItems.map((s, i) => `${i + 1}. ${s.title} (${s.href})`),
              ``,
              `Tell me what you’re building and what you want to upload, and I’ll generate an example file tailored to your requirements.`,
            ].join("\n");

        return { output: { answer, files: [] }, outputBytes: Buffer.byteLength(JSON.stringify({ answer, files: [] })) };
      },
    });

    if (!metered.ok) {
      return NextResponse.json({ ok: false, error: metered.message, estimate: metered.estimate }, { status: metered.status });
    }

    const out = metered.output as any;
    return NextResponse.json({ ok: true, answer: out.answer || "", files: out.files || [], receipt: metered.receipt });
  });
}

