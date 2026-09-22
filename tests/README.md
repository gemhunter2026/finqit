# Finqit unit-test conventions

Finqit uses the Node 22 built-in `node:test` runner for the baseline unit suite. This keeps the core harness deterministic and dependency-free while the package registry is unavailable.

- Put fast unit tests in `tests/*.test.ts`.
- Import production TypeScript with an explicit `.ts` extension; Node executes it with type stripping.
- Prefer deterministic inline fixtures. Do not use production credentials, hosted Supabase state, network calls, wall-clock timing, or personal data.
- Test tenant/privacy/security boundaries at adapter edges, not only happy paths.
- Use synthetic IDs and data that cannot be mistaken for real customer/community records.
- Run `npm test` locally. CI runs the same command before the production build.

Browser/E2E coverage remains a separate concern and should not be folded into this lightweight unit harness.
