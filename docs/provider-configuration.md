# Provider configuration matrix

This document is the operational companion to `src/core/env.ts` and `.env.example`. It lists provider configuration without storing credentials. Real secrets belong only in local secret stores or deployment-provider environment settings.

## Status vocabulary

- **Required now** — required for the current production path.
- **Optional now** — feature works through a local/mock adapter when unset.
- **Future** — reserved until the corresponding adapter is implemented; do not create credentials early.

## Matrix

| Capability | Variable | Exposure | Status | Adapter / owner | Safe local behavior |
| --- | --- | --- | --- | --- | --- |
| Supabase API | `NEXT_PUBLIC_SUPABASE_URL` | Browser-safe URL | Optional now | Supabase client adapter | Leave empty to use local/mock repositories |
| Supabase auth/data | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser-safe publishable credential | Optional now | Supabase client adapter | Leave empty together with URL |
| Supabase privileged operations | `SUPABASE_SERVICE_ROLE_KEY` | **Server secret** | Optional now | Server-only Supabase adapter | Leave empty; privileged remote operations stay disabled |
| Transactional email | `EMAIL_PROVIDER_API_KEY` | **Server secret** | Future | Email adapter | Use deterministic no-send/mock adapter |
| Transactional email sender | `EMAIL_FROM_ADDRESS` | Server config | Future | Email adapter | Use non-delivery fixture identity |
| AI inference | `AI_PROVIDER_API_KEY` | **Server secret** | Future | AI adapter | Use deterministic fixtures; no external inference |
| AI model selection | `AI_MODEL` | Server config | Future | AI adapter | Adapter-owned deterministic default |
| Object storage | `STORAGE_BUCKET` | Server config | Future | Storage adapter | Use local/in-memory fixture storage |
| Analytics | `NEXT_PUBLIC_ANALYTICS_ID` | Browser-safe identifier | Future | Analytics adapter | Analytics disabled |
| Messaging | `MESSAGING_PROVIDER_API_KEY` | **Server secret** | Future | Messaging adapter | Use no-send/mock adapter |
| Messaging sender | `MESSAGING_FROM` | Server config | Future | Messaging adapter | No outbound messages |

## Configuration rules

1. Never place service-role, email, AI, or messaging secrets in `NEXT_PUBLIC_*` variables.
2. Supabase public URL and anon key are a pair: configure both or neither. `src/core/env.ts` enforces this boundary.
3. Optional/future providers must fail closed: an unset credential disables external calls rather than silently contacting a real service.
4. Mock defaults must be deterministic and must not contain real personal data, tokens, email addresses, phone numbers, or production endpoints.
5. Add a variable to `.env.example` and typed validation in `src/core/env.ts` when its adapter becomes active. Until then, this matrix is the source of anticipated names and exposure classification.
6. Hosted credentials are configured per environment (preview/production) and are never copied into the repository.

## Onboarding check

For the current community-first local workflow, no paid hosted-provider credential is required. Copy `.env.example` to `.env.local`; leave Supabase values empty when using mock/local adapters. When local Supabase is running, use its generated local public credentials only in `.env.local`.

Before committing configuration changes, verify that `.env*` remains ignored except `.env.example`, inspect the diff for secret-like values, and confirm every new browser-exposed variable is intentionally safe for public delivery.