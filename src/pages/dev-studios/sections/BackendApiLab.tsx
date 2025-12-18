"use client";

import React, { useMemo, useState } from "react";
import { SecurityBanner } from "@/components/dev-studios/SecurityBanner";

type StackId = "express" | "django" | "spring" | "aspnet" | "go";
type TabId = "handler" | "routing" | "docker";

const stacks: Record<StackId, { name: string; description: string }> = {
  express: { name: "Node Express", description: "Fast to start, easy to abuse if you skip validation." },
  django: { name: "Django REST", description: "Batteries included; mind your serializers and auth." },
  spring: { name: "Spring Boot", description: "Powerful, opinionated; keep configs sane." },
  aspnet: { name: "ASP.NET Core Web API", description: "Great tooling; do not forget rate limits and logs." },
  go: { name: "Go microservice", description: "Lean and fast; add observability early." },
};

const apiTemplates: Record<StackId, Record<TabId, string>> = {
  express: {
    handler: `// GET /health
router.get("/health", async (req, res) => {
  // TODO: input validation (query/body)
  return res.status(200).json({ status: "ok", ts: Date.now() });
});
`,
    routing: `import express from "express";
import helmet from "helmet";

const app = express();
app.use(helmet());
app.use(express.json());
app.use("/api", router);

// TODO: error middleware with consistent shape
app.listen(process.env.PORT || 3000);
`,
    docker: `FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]`,
  },
  django: {
    handler: `@api_view(['GET'])
def health(request):
    # TODO: auth if needed
    return Response({"status": "ok", "ts": timezone.now()}, status=200)
`,
    routing: `from django.urls import path
from .views import health

urlpatterns = [
    path("health", health),
]

# TODO: add DRF exception handler for consistent errors`,
    docker: `FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["gunicorn", "app.wsgi", "-b", "0.0.0.0:8000"]`,
  },
  spring: {
    handler: `@RestController
@RequestMapping("/api")
public class HealthController {
  @GetMapping("/health")
  public ResponseEntity<Map<String, Object>> health() {
    Map<String, Object> body = Map.of("status", "ok", "ts", Instant.now());
    return ResponseEntity.ok(body);
  }
}
`,
    routing: `// application.yml snippet
server:
  port: 8080
spring:
  jackson:
    default-property-inclusion: non_null
# TODO: add actuator for health, metrics, tracing`,
    docker: `FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY target/app.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]`,
  },
  aspnet: {
    handler: `[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase {
    [HttpGet]
    public IActionResult Get() => Ok(new { status = "ok", ts = DateTime.UtcNow });
}
`,
    routing: `var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
var app = builder.Build();
app.MapControllers();
// TODO: middleware for error handling + correlation IDs
app.Run();
`,
    docker: `FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet publish -c Release -o /app/publish
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "App.dll"]`,
  },
  go: {
    handler: `func health(w http.ResponseWriter, r *http.Request) {
  // TODO: input validation if params
  resp := map[string]any{"status": "ok", "ts": time.Now().UTC()}
  json.NewEncoder(w).Encode(resp)
}
`,
    routing: `r := chi.NewRouter()
r.Use(middleware.RequestID, middleware.Logger)
r.Get("/api/health", health)
http.ListenAndServe(":3000", r)
// TODO: standard error envelope + auth middleware`,
    docker: `FROM golang:1.22-alpine
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o server .
EXPOSE 3000
CMD ["./server"]`,
  },
};

const checklistItems = [
  { key: "validation", label: "Input validation at the boundary" },
  { key: "errors", label: "Consistent error format" },
  { key: "auth", label: "Authentication on all write endpoints" },
  { key: "rate", label: "Rate limiting at the edge" },
  { key: "logs", label: "Logging of correlation IDs" },
];

export default function BackendApiLab() {
  const [stack, setStack] = useState<StackId>("express");
  const [style, setStyle] = useState("REST");
  const [tab, setTab] = useState<TabId>("handler");
  const [templates, setTemplates] = useState(apiTemplates[stack]);
  const [checks, setChecks] = useState<Record<string, boolean>>({
    validation: false,
    errors: false,
    auth: false,
    rate: false,
    logs: false,
  });

  const healthScore = useMemo(() => {
    const total = checklistItems.length;
    const passed = checklistItems.filter((c) => checks[c.key]).length;
    return Math.round((passed / total) * 100);
  }, [checks]);

  const healthCopy =
    healthScore < 40
      ? "This is basically a haunted house."
      : healthScore < 80
      ? "Usable but do not show auditors yet."
      : "This API would make your future self proud.";

  const generateTemplate = () => {
    setTemplates(apiTemplates[stack]);
  };

  return (
    <div className="space-y-6">
      <SecurityBanner />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Choose backend stack</h2>
            <p className="text-sm text-slate-700">Pick a stack and API style. We will keep everything local and safe.</p>
          </div>
          <div className="space-y-2">
            {(Object.keys(stacks) as StackId[]).map((id) => (
              <label key={id} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3">
                <input
                  type="radio"
                  name="stack"
                  checked={stack === id}
                  onChange={() => setStack(id)}
                  className="mt-1 h-4 w-4 border-slate-300 text-sky-600 focus:ring-sky-200"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{stacks[id].name}</p>
                  <p className="text-xs text-slate-600">{stacks[id].description}</p>
                </div>
              </label>
            ))}
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-700">API style</p>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
            >
              {["REST", "GraphQL", "gRPC"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <p className="text-xs text-slate-500">We will assume REST for the templates but remember to validate either way.</p>
          </div>
        </div>

        <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Endpoint template viewer</h2>
              <p className="text-sm text-slate-700">Generate a tiny endpoint with validation/auth placeholders for the chosen stack.</p>
            </div>
            <button
              onClick={generateTemplate}
              className="rounded-2xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
            >
              Generate sample endpoint
            </button>
          </div>
          <div className="flex gap-2">
            {(["handler", "routing", "docker"] as TabId[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
                  tab === t ? "bg-slate-900 text-white ring-slate-900" : "bg-slate-50 text-slate-700 ring-slate-200 hover:bg-slate-100"
                }`}
              >
                {t === "handler" ? "Handler" : t === "routing" ? "Routing" : "Dockerfile"}
              </button>
            ))}
          </div>
          <pre className="rounded-2xl bg-slate-950 text-slate-100 text-xs p-4 overflow-auto min-h-[220px]">
            {templates[tab]}
          </pre>
        </div>

        <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">API design checklist</h2>
            <p className="text-sm text-slate-700">Tick the boring-but-important boxes. Your future self will send you a thank you note.</p>
          </div>
          <div className="space-y-2 text-sm text-slate-800">
            {checklistItems.map((item) => (
              <label key={item.key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={checks[item.key]}
                  onChange={(e) => setChecks((prev) => ({ ...prev, [item.key]: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-200"
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-700">
              <span>API health</span>
              <span>{healthScore}/100</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100">
              <div
                className={`h-2 rounded-full transition-all ${
                  healthScore < 40 ? "bg-rose-400" : healthScore < 80 ? "bg-amber-400" : "bg-emerald-500"
                }`}
                style={{ width: `${healthScore}%` }}
              />
            </div>
            <p className="text-xs text-slate-600">{healthCopy}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
