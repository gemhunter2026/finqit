# Marketplace production-readiness checklist

Task: MARKETPLACE-012

This checklist is the go/no-go boundary between Finqit's preserved marketplace prototype and a transaction-capable production product. It complements `docs/marketplace-scope-boundary.md`; it does not change the Community-first priority or authorize external actions.

## Status semantics

- **Prototype-safe**: may remain simulated/local and must be clearly non-binding.
- **Production gate**: must be implemented and repeatably verified before real reservations are enabled.
- **Founder/external gate**: requires explicit founder authorization, legal approval, credentials, spend, or another external commitment.

A visually complete flow is not evidence that a production gate has passed.

## Readiness matrix

| Capability | Current assumption | Production gate | Backlog owner | Go/no-go evidence |
| --- | --- | --- | --- | --- |
| Identity | Prototype/browser identity can drive demo UX | Real authenticated identity; buyer/seller actions authorized server-side | AUTH-001/002/003, SEC-002/003 | Auth + cross-tenant authorization tests pass |
| Persistence | Browser/local state can preserve demo progress | Durable server persistence with ownership/tenant constraints | DATA-003/004, SEC-003 | Migration/reset + tenant-boundary tests pass |
| Marketplace scope | Marketplace can evolve independently without delaying Community MVP | Community P0/P1 remains uncoupled; shared abstractions stay domain-neutral | MARKETPLACE-001 | Scope-boundary review remains current |
| Reservation allocation | Simulated reserve action is sufficient for UX exploration | Atomic, idempotent allocation with concurrency protection and expiry/cancellation rules | MARKETPLACE-007 | Concurrent reservation tests prove no double allocation |
| Payments | Simulated payment/deposit state is non-binding | Approved payment provider, server-verified state, failure/refund/reconciliation handling | Marketplace payment backlog / founder dependency | Sandbox + failure-path verification; founder activation approval |
| Buyer verification | UI may display demo verification states | Real identity/KYC provider where legally/product-required; no self-asserted verified state | Marketplace verification backlog / founder dependency | Provider state verified server-side; privacy review complete |
| Seller authority | Listing wizard can accept demo seller input | Seller identity and authority/document verification appropriate to jurisdiction | Marketplace verification/legal backlog | Verified evidence policy + rejection/expiry paths |
| Legal terms | Prototype copy is illustrative | Lawyer-approved reservation/option terms, disclosures, cancellation/refund rules and jurisdiction coverage | Founder/legal dependency | Approved versioned terms recorded before binding action |
| Messaging | Demo notifications can be local/no-send | Consent-aware provider integration, delivery/failure state and auditability | MSG-* | Provider contract tests + consent/failure behavior |
| Privacy | Prototype data must remain minimal | Marketplace PII/financial/verification fields added to privacy inventory, export/deactivation/retention controls | GDPR-* | Inventory coverage + retention/export/deactivation verification |
| Audit | Demo actions need not imply legal evidence | Sensitive state transitions record actor, action, scope and safe metadata | SEC-006 | Audit coverage tests for binding actions |
| Abuse/fraud | No production anti-abuse claim | Rate limits, enumeration protection, duplicate/fraud controls and operational review path | SEC-* / marketplace follow-up | Abuse cases exercised without leaking tenant/user data |
| Observability | Build success is not operational readiness | Health/readiness, structured safe telemetry and actionable failure monitoring | OPS-003/007 | Deployment smoke + health + privacy-safe telemetry checks |
| Quality | Manual demo verification is insufficient | CI, unit/contract tests and browser smoke coverage for critical transaction path | QA-001/002/005/006, OPS-002 | Required checks green on release candidate |
| Support/operations | Prototype has no binding support SLA | Cancellation/refund/escalation/support ownership and incident runbook defined | Future operations task | Dry-run incident and customer-support scenarios reviewed |

## Hard go/no-go criteria for real reservations

Real or legally binding reservation actions remain **NO-GO** unless every condition below is true:

- [ ] Authentication and server-side buyer/seller authorization are live and tested.
- [ ] Durable persistence and tenant/ownership isolation are live and tested.
- [ ] Reservation allocation is atomic, idempotent and concurrency-tested.
- [ ] Reservation lifecycle covers expiry, cancellation, retries and recovery.
- [ ] Any money movement uses an explicitly approved provider and server-verified payment state.
- [ ] Refund/failure/reconciliation behavior is implemented and tested before accepting money.
- [ ] Required identity/KYC and seller-authority checks are real, not UI simulation.
- [ ] Binding legal terms and disclosures have explicit legal/founder approval for the launch jurisdiction.
- [ ] Marketplace personal/financial/verification data is covered by privacy inventory and lifecycle controls.
- [ ] Sensitive actions are auditable without logging secrets or unnecessary personal content.
- [ ] Abuse, enumeration and rate-limit failure modes have been exercised.
- [ ] Critical transaction flows have automated regression coverage and a deployment smoke check.
- [ ] Support/escalation ownership exists for reservation, payment and verification failures.

If any item is false or unknown, keep reservation/payment/verification behavior non-binding and visibly simulated.

## Prototype-safe behavior

The marketplace may continue to support search, filtering, saved-home exploration, listing-wizard exploration, non-binding reservation simulations and local demo state while production gates are incomplete. Prototype state must never grant authorization, claim real verification, move money, allocate scarce inventory, or create a legally binding reservation.

## Release review procedure

For each marketplace release candidate:

1. Compare this checklist with the current Master Backlog and `docs/marketplace-scope-boundary.md`.
2. Mark each production gate as verified, failed, or unknown using concrete evidence (PR/commit, test run, provider sandbox result, or approved external decision).
3. Treat **unknown as NO-GO** for binding actions.
4. Re-run authorization, concurrency, payment-failure, privacy, audit and browser smoke tests after material transaction changes.
5. Record any newly discovered gap as a backlog item instead of weakening a gate.
6. Require explicit founder authorization before enabling paid/provider/legal external commitments.

## Maintenance rule

Update this checklist whenever a referenced gate changes materially or a marketplace feature becomes binding. A task being marked Done is not by itself sufficient evidence: the release review must point to repeatable verification. Community P0/P1 work continues to take precedence unless the founder changes that product priority.
