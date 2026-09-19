# Finqit domain source architecture

New product logic belongs under `src/domains`, not in App Router page components. Routes in `app/` remain composition/UI entry points.

Each domain (`community`, `inbox`, `documents`, `finance`, `voting`, `providers`, `ai`) follows the same incremental shape when code is needed:

- `domain/` — entities, value objects, invariants and repository ports; no React, browser or vendor imports.
- `application/` — use cases that orchestrate domain ports.
- `adapters/` — Supabase, localStorage, fixture, email or AI provider implementations.
- `ui/` — domain-specific React components/hooks. Shared presentation stays in `components/` until a low-risk migration is justified.

Cross-domain primitives and adapter contracts live in `src/core`. Tenant-owned entities and repository calls carry `CommunityId`; adapters must never infer tenant scope from client-controlled payload data.

## Migration policy

Stable prototype screens are not moved wholesale. When a screen is touched by a backlog task, extract business logic into the appropriate domain and leave the route as composition. Existing demo/localStorage behavior should first be placed behind a typed adapter implementing a domain port, then replaced by Supabase without changing callers.

Do not import `app/` or React from `domain/` or `application/`. Do not import Supabase/provider SDKs from UI or domain code. This keeps provisional implementations replaceable and preserves the community tenant boundary.
