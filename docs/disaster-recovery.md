# Finqit backup, restore and disaster-recovery runbook

Status: PREPARED operational baseline. This runbook does not claim that hosted backups exist yet. It defines the recovery contract to use once a dedicated hosted Finqit Supabase project is provisioned.

## Scope and recovery priorities

Recover Finqit in this order: (1) trusted application/configuration baseline, (2) PostgreSQL schema and data, (3) private storage objects and their metadata, (4) external provider configuration, then (5) application traffic. Never restore production data into a public or developer environment.

Until real-community production readiness is approved, the working targets are **RPO <= 24 hours** and **RTO <= 4 hours after an operator has access to required backups and credentials**. These are operational targets, not current guarantees. Before onboarding real communities, confirm that the selected hosted Supabase plan, storage backup process and deployment platform can actually meet them; tighten them if product/legal requirements demand it.

## Sources of truth

| Asset | Source of truth | Recovery rule |
| --- | --- | --- |
| Application code | GitHub `main` and reviewed release commit | Redeploy a known-good commit; do not reconstruct code from a running deployment. |
| Database schema | `supabase/migrations/` | Rebuild from ordered committed migrations; never edit an already-shared migration to make a restore pass. |
| Database data | Hosted Supabase backup/PITR or verified logical backup | Restore only into an isolated target first; preserve tenant boundaries and audit history. |
| Local/demo data | Versioned seed fixtures when available | Regenerate; do not treat local data as a backup of production. |
| Storage objects | Private bucket backup/export plus database object metadata | Restore objects and metadata together and verify access policies before exposure. |
| Public config | `.env.example`, versioned feature-flag/config contracts | Recreate from reviewed configuration. |
| Secrets | Authorized secret stores in Supabase/Vercel/provider consoles | Never copy secrets into Git, logs, tickets, backup manifests or this runbook. Rotate after suspected compromise. |
| DNS/provider setup | Provider consoles + approved operational inventory | Reconcile manually and verify callbacks/webhooks before enabling traffic. |

## Backup policy to enable with hosted infrastructure

When OPS-004 provisions the hosted project, record the actual Supabase backup capability and retention for the selected plan. Prefer platform-managed daily backups; enable point-in-time recovery when available and justified by production RPO. A backup is not considered usable until a restore has been exercised against an isolated target.

For database exports created outside platform-managed backups, use encrypted storage with access restricted to the smallest operator set, documented retention and deletion. Never place dumps in the repository or application storage buckets.

Storage objects require a separate recovery plan unless the selected hosted backup explicitly proves object bytes are included. Maintain a manifest containing non-secret object identifiers, bucket, size and checksum so a restored object set can be reconciled without exposing object contents.

Configuration/secrets must be inventoried separately because database recovery does not recreate Vercel environment variables, Supabase project secrets, provider API keys, OAuth/webhook configuration, DNS, or external-service state.

## Local deterministic rebuild

The local rebuild path is the schema-recovery smoke test and remains independent from hosted credentials:

```sh
supabase start
supabase db reset
supabase db lint
```

`supabase db reset` must be able to construct an empty database from committed migrations. If reset fails, stop: do not compensate by manually editing the database. Add a forward migration or repair the local configuration through the owning backlog task, then repeat from empty state.

DATA-003 currently owns executable local Supabase configuration/validation. Until that task passes its Docker + Supabase CLI gate, this procedure is documented but not claimed as executed in the current automation environment.

## Hosted database recovery procedure

1. **Declare the incident and freeze writes.** Disable mutating application/provider paths or route traffic away from the affected environment. Record incident start time, suspected data-loss window and last known-good release/backup.
2. **Choose a recovery point.** Select the newest backup before corruption/incident onset that satisfies integrity requirements. Record backup identifier/time and expected data-loss window. Do not overwrite the only recoverable copy.
3. **Create an isolated restore target.** Restore into a new/disposable project or otherwise isolated database when the platform permits. Never test a destructive restore directly against the only production instance.
4. **Reconcile schema.** Compare the restored migration state with the known-good application release. Apply only committed forward migrations required for that release.
5. **Validate tenant security before data checks.** Confirm RLS is enabled where expected, authorization helpers exist, service-role credentials are server-only, and cross-community access tests/policies match the release.
6. **Run integrity checks.** Verify critical table counts, foreign-key consistency, representative communities/memberships and audit history. Check that no tenant-scoped records have lost their community association.
7. **Restore/reconcile storage.** Restore private objects, compare the object manifest/checksums, and verify that database metadata points only to existing objects in the correct tenant scope.
8. **Restore external configuration.** Recreate environment variables and provider configuration from authorized secret/config stores. Keep real-provider feature flags off until provider callbacks and credentials are verified.
9. **Deploy the matching application release.** Use the known-good Git commit and deterministic install/build path. Do not deploy unrelated feature changes during recovery.
10. **Smoke test in isolation.** Exercise authentication/readiness when available, tenant-scoped reads, representative document/storage access and any critical provider webhook path using safe fixtures/sandbox traffic.
11. **Cut over deliberately.** Only after the verification checklist passes, update the deployment/database connection or platform recovery target through the approved production procedure. Monitor errors and audit events closely.
12. **Close and learn.** Record actual RPO/RTO, backup used, validation evidence, any manual steps, and follow-up work. Rotate credentials if compromise cannot be excluded.

## Storage recovery checks

Treat storage object bytes and database metadata as one consistency boundary. Before cutover verify:

- every restored object belongs to the expected private bucket and tenant/community namespace;
- object identifiers referenced by database rows exist and checksums/sizes match the backup manifest where available;
- orphan objects are quarantined rather than automatically exposed or deleted;
- missing objects are surfaced as recovery exceptions rather than silently replaced;
- signed/public URL behavior has not changed and private objects remain inaccessible without authorization;
- service-role operations remain server-only and client code cannot choose another community's storage path.

## Configuration and secret recovery checklist

Reconcile, without recording secret values:

- `NEXT_PUBLIC_SUPABASE_URL` and browser-safe Supabase key;
- `SUPABASE_SERVICE_ROLE_KEY` (server-only);
- Finqit feature flags, especially `FINQIT_FEATURE_REAL_PROVIDERS`;
- Vercel project/environment mapping and production domain;
- Supabase auth redirect/origin settings once auth is enabled;
- email, messaging, banking, AI or other provider credentials only for providers actually enabled;
- webhook URLs/signing secrets and provider-side callback configuration;
- DNS records and certificates where external channels require them.

If any secret may have been exposed, restore service with newly rotated credentials rather than reusing the suspect value.

## Recovery verification gate

Recovery is **NO-GO** until all applicable checks pass:

- [ ] recovery point and expected data-loss window are recorded;
- [ ] restored schema derives from committed migrations and matches the deployed release;
- [ ] database integrity/foreign keys are healthy;
- [ ] RLS and tenant-isolation controls are present before application traffic is enabled;
- [ ] at least two synthetic/authorized communities are checked for negative cross-tenant access once executable security tests exist;
- [ ] storage object manifest/references reconcile, or every exception is explicitly quarantined/documented;
- [ ] secrets are loaded from authorized stores and none appear in repository/log evidence;
- [ ] real-provider flags remain off until each external integration is independently verified;
- [ ] application build/deployment and health/readiness checks pass when OPS-003 exists;
- [ ] representative community flows pass without using another tenant's data;
- [ ] operator records actual restore duration, backup age, validation evidence and unresolved exceptions.

Any failed tenant-isolation, integrity or secret-handling check blocks cutover. Availability pressure is not a reason to weaken these gates.

## Failure and partial-recovery rules

If the newest backup is corrupt or incomplete, move backward to the next verified recovery point and explicitly update the data-loss estimate. If storage is unavailable but database recovery succeeds, keep affected document features disabled rather than serving broken or cross-tenant references. If an external provider cannot be verified, keep its feature flag off and restore core/community functionality independently. If migration state and application release cannot be reconciled safely, keep traffic frozen and recover to a mutually compatible release/backup pair.

## Restore-test cadence and evidence

After hosted infrastructure exists, perform a disposable restore test before real-community launch and after material changes to backup topology, storage, migrations or auth/security boundaries. Thereafter, target at least quarterly restore exercises while real community data is held.

Each exercise should retain non-sensitive evidence: date, operator, source backup timestamp/identifier, target environment, release SHA, migration result, storage reconciliation result, tenant-isolation/security test result, measured RPO/RTO, failures and follow-up backlog items. Never attach raw production dumps or secret values as evidence.

## Current known gaps

- Hosted Finqit Supabase is not yet provisioned, so provider-specific backup retention/PITR settings are intentionally unclaimed.
- DATA-003 still needs executable local Docker/Supabase CLI validation; this runbook does not mark that blocked test as passed.
- OPS-003 will add application health/readiness checks; until then use build/deployment plus scoped functional verification.
- Storage backup/export automation and manifests should be implemented once the production storage topology exists.

These gaps do not change the recovery contract: fail closed on tenant/security uncertainty, restore into isolation first, and verify before cutover.
