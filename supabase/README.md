# Supabase schema strategy

Finqit's current `schema.sql` is a reviewed blueprint, not an applied migration. It contains useful community foundations alongside the earlier marketplace model.

## Community-first path

`community-schema-plan.sql` is the DATA-001 target plan. It is intentionally review-only and additive. It records the missing community concepts and the intended migration/RLS sequence without changing a hosted database.

The community MVP owns the near-term schema priority: communities and memberships, buildings/units, invitations, inbox/documents, providers, finance, incidents, meetings, voting and audit history. Existing marketplace tables remain in the blueprint but are dormant until that workstream is deliberately reactivated.

## Rules for future migrations

1. Convert the plan into small ordered migrations; do not execute the plan file directly in production.
2. Enable and test RLS before exposing each new table through Supabase APIs.
3. Resolve authorization from authenticated membership and persisted community ownership, never client-supplied tenant/role claims.
4. Preserve existing free-text fields until a verified backfill exists; destructive cleanup belongs in a later migration.
5. Keep invitation plaintext tokens and provider credentials out of tables, logs and audit payloads.
6. Add cross-community reference enforcement for unit/building/provider links before production writes.
7. Run local migration + RLS regression tests before any hosted deployment.

This keeps DATA-001 reversible and prepares DATA-002+ work without requiring a hosted Supabase project.
