# Supabase schema strategy

Finqit's legacy `schema.sql` remains a historical reviewed blueprint. `community-schema-plan.sql` records the DATA-001 reconciliation. Neither file is an executable migration.

## Canonical community migration history

`migrations/` is the executable source of truth for a new community-first Finqit database. Files follow Supabase CLI timestamp ordering:

1. `20260919200000_community_core.sql` — community MVP types/tables and existing compatibility fields.
2. `20260919201000_community_extensions.sql` — buildings/units, invitations, providers, meetings, inbox metadata and audit history, including composite tenant foreign keys.
3. `20260919202000_community_rls.sql` — RLS, membership authorization helpers, member reads and narrower manager administration.

The earlier marketplace model is deliberately not provisioned by these migrations. It remains dormant in `schema.sql` until that workstream is explicitly reactivated.

## Local development

Prerequisites: Docker and a Supabase CLI compatible with the committed `config.toml`. The configuration is intentionally local-only: no hosted project ref or credential belongs in source control.

From the repository root:

```sh
supabase start
supabase db reset
supabase db lint
```

`supabase start` launches the local services. `db reset` rebuilds the database from the ordered files under `migrations/` and then runs `seed.sql`. The current seed is intentionally empty/deterministic; DEMO-001 owns synthetic demo fixtures. `db lint` checks the rebuilt schema.

For a quick smoke query after reset:

```sh
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres \
  -c "select to_regclass('public.communities') as communities;"
```

The result must be `communities`. Stop the stack with:

```sh
supabase stop
```

To discard local state and verify a clean rebuild, run `supabase db reset` again. Committed migrations are immutable after they have been applied to a shared environment; fixes use a new forward migration.

## Local API exposure

`config.toml` exposes only `public` and Supabase's `graphql_public` API schema. Internal auth/storage schemas are not added to the API schema list. Authorization for community-owned rows remains enforced by the migration-defined RLS policies and persisted membership checks.

## Security rules

- Enable RLS before exposing every community-owned table through Supabase APIs.
- Resolve authorization from `auth.uid()` plus persisted community membership; never trust client-supplied tenant or role claims.
- Cross-community building/unit/provider references use composite tenant foreign keys.
- Invitation plaintext tokens and provider credentials never belong in tables, logs, seeds or audit payloads; only invitation token hashes are persisted.
- Audit events intentionally have no authenticated client write policy.
- Preserve compatibility fields such as `unit_label` and free-text `supplier` until a later verified backfill permits cleanup.
