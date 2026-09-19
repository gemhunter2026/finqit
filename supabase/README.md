# Supabase schema strategy

Finqit's legacy `schema.sql` remains a historical reviewed blueprint. `community-schema-plan.sql` records the DATA-001 reconciliation. Neither file is an executable migration.

## Canonical community migration history

`migrations/` is now the executable source of truth for a new community-first Finqit database. Files follow Supabase CLI timestamp ordering:

1. `20260919200000_community_core.sql` — community MVP types/tables and existing compatibility fields.
2. `20260919201000_community_extensions.sql` — buildings/units, invitations, providers, meetings, inbox metadata and audit history, including composite tenant foreign keys.
3. `20260919202000_community_rls.sql` — RLS, membership authorization helpers, member reads and narrower manager administration.

The earlier marketplace model is deliberately not provisioned by these migrations. It remains dormant in `schema.sql` until that workstream is explicitly reactivated.

## Repeatable verification

Once DATA-003 provides local Supabase CLI configuration, verification is:

```sh
supabase start
supabase db reset
supabase db lint
```

`db reset` must succeed from an empty local Supabase database using only ordered files under `migrations/`. Re-running `db reset` is the supported local rollback/rebuild path; committed migrations are immutable after they have been applied to a shared environment. Fixes are made with a new forward migration.

DATA-002 intentionally does not require or modify a hosted Supabase project. Until local CLI infrastructure exists, GitHub build validation plus static SQL/security review is the available verification boundary; DATA-003 must add executable reset/lint coverage before any hosted deployment.

## Security rules

- Enable RLS before exposing every community-owned table through Supabase APIs.
- Resolve authorization from `auth.uid()` plus persisted community membership; never trust client-supplied tenant or role claims.
- Cross-community building/unit/provider references use composite tenant foreign keys.
- Invitation plaintext tokens and provider credentials never belong in tables, logs or audit payloads; only invitation token hashes are persisted.
- Audit events intentionally have no authenticated client write policy.
- Preserve compatibility fields such as `unit_label` and free-text `supplier` until a later verified backfill permits cleanup.
