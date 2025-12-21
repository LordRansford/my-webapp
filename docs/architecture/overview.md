# Architecture overview (Phase 2 baseline)

This repo is a Next.js app with both **App Router** (`src/app/*`) and **Pages Router** (`src/pages/*`) still in use.

The goal of this baseline is to keep the codebase **layered, testable, and extendable** without changing product behavior.

## Layer diagram

```
Presentation (React / Next pages)
  ├─ src/app/**            (App Router pages + server route handlers)
  ├─ src/pages/**          (Pages Router pages + legacy API handlers)
  └─ src/components/**     (UI components)
        |
        v
Application services (business orchestration)
  └─ src/services/**       (course/progress/learning/feedback services)
        |
        v
Domain (pure rules, no Next/framework deps)
  └─ src/lib/**            (gradually migrating: keep rules/data transforms here)
        |
        v
Infrastructure (I/O, persistence, external systems)
  ├─ src/lib/**            (stores, filesystem persistence, auth store, analytics store)
  └─ src/server/**         (HTTP helpers, errors, structured logging)
```

## Responsibilities by folder

- **`src/components/`**
  - React UI only. Rendering, small UI state, composition.
  - Should not contain business rules or persistence logic.

- **`src/hooks/`**
  - UI orchestration hooks (client state, calling APIs).
  - Must not encode business rules beyond lightweight UI gating (e.g. “requires auth to persist”).

- **`src/services/`**
  - “Application layer”: orchestrates business flows using lower layers.
  - Example: derive a learning record from CPD + analytics stores.
  - **No Next.js request/response objects here**.

- **`src/server/`**
  - Server-only HTTP utilities:
    - Unified error shape (`AppError`)
    - Structured logging (request id, route, duration)
    - Response helpers for App Router and Pages API

- **`src/app/api/**` and `src/pages/api/**`**
  - Route adapters only:
    - Validate inputs
    - Call a service
    - Return a response
  - Must not contain business logic beyond basic validation and security guards (rate limit / origin checks / auth checks).

- **`src/lib/`**
  - Transitional layer:
    - Pure helpers and domain logic live here today
    - Some infrastructure (stores) also lives here today
  - When in doubt: new cross-cutting “rules” should go to `src/services/` first, and later be extracted into a pure domain module.

## Error + response shape (server)

All new/refactored endpoints should return:

- Success:
  - JSON payload plus optional `requestId`
  - `x-request-id` response header
- Error:
  - `{ error: { code, message, requestId } }`
  - Never leak stack traces or internal error messages to clients

## Data flow (typical examples)

### CPD progress save

1. Client updates local CPD state (UI hook)
2. Client calls `PUT /api/progress/cpd`
3. Server validates and persists via auth-backed store

### Learning record refresh

1. Client calls `POST /api/learning/records/refresh` with `{ courseId, levelId }`
2. Route validates + auth
3. Service derives record from:
   - CPD persisted state
   - Analytics events
4. Service stores and returns updated record

## Where to add new features safely

- **New business flows**: add a service in `src/services/`
- **New endpoints**: keep route handlers thin, call services
- **New persistence/external integration**: add an infrastructure module (or extend existing store modules), inject into services when practical
- **New UI**: keep components presentational; orchestrate via hooks that call APIs/services


