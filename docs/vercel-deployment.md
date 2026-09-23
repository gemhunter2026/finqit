# Vercel deployment contract

Task: OPS-005

## Canonical project

Finqit is deployed by the Vercel GitHub integration from `gemhunter2026/finqit`. The canonical Vercel project visible in GitHub deployment status is `gem-hunter-s-projects/finqit`.

Do not infer a different project from connector listings alone. When direct Vercel project inspection is unavailable, use the GitHub commit status named `Vercel` as the authoritative deployment signal and follow its target URL.

## Build contract

- Framework: Next.js.
- Install: `npm ci --no-audit --no-fund` so Vercel uses the committed lockfile deterministically.
- Build: `npm run build`.
- No deployment configuration may contain secrets or production credentials.
- Environment-specific values belong in Vercel environment configuration, not in the repository. Variable names and required/optional semantics are documented in `.env.example` and the provider configuration documentation.

## Environments

### Preview

Every pull request/branch integration should produce a Vercel preview. Before merge, require:

1. repository CI succeeds;
2. the Vercel commit status reaches `success` / `Deployment has completed`;
3. the preview renders the affected route without a server/runtime error;
4. UI changes are checked at desktop and mobile sizes when browser tooling is available;
5. no production-only provider is enabled merely to make preview pass.

### Production

`main` is the canonical production source branch. After merge:

1. verify the `Vercel` commit status for the merged `main` SHA is successful;
2. open the deployment target and smoke-test the affected public flow;
3. once OPS-003 provides a health/readiness endpoint, verify app health separately from backend readiness;
4. treat a successful build as necessary but not sufficient evidence of runtime health.

## Health verification

OPS-003 owns the health/readiness endpoint and is currently dependency-gated. Until it is available, deployment verification uses GitHub CI, Vercel commit status, and a route smoke check. This is an explicit temporary verification limitation, not a substitute for the future health endpoint.

When OPS-003 lands, add the endpoint to preview and production verification without exposing credentials, internal exceptions, tenant data, or provider secrets.

## Troubleshooting

If Vercel is missing from a commit:

1. confirm the commit belongs to the canonical repository/branch;
2. inspect GitHub commit statuses before assuming the Vercel project is disconnected;
3. compare `vercel.json` with this contract;
4. do not create or relink a Vercel project autonomously—project relinking can alter production deployment behavior and requires explicit authorization if the existing integration is actually broken.

If Vercel reports failure, use the deployment target/logs when accessible, fix the repository/configuration defect on the task branch, and re-run validation. Never mark a task Done solely because GitHub CI passed when its acceptance criteria require deployment validation.
