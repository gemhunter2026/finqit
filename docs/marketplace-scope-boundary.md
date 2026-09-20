# Marketplace scope boundary

Task: MARKETPLACE-001

Finqit's Community MVP is the active product priority. The marketplace prototype from PR #1 is preserved as a separate future product pillar, but marketplace productionization must not compete with P0/P1 community foundations.

## Canonical boundary

### Shared foundations — build once for both pillars

The following capabilities may be designed for reuse when they are required by Community work:

- authenticated identity and profile primitives;
- tenant-safe authorization and audit logging;
- typed provider/adaptor boundaries;
- privacy classification, retention and observability primitives;
- accessible responsive design-system components that do not encode marketplace business rules;
- deployment, CI, health and testing infrastructure.

Community requirements determine the near-term shape of these foundations. Marketplace needs must not broaden a shared abstraction until a real second use case exists.

### Community MVP — active production path

Community work includes community membership, buildings and units, communications/inbox, documents, finances, incidents, voting, meetings, providers, community AI/RAG and the security/privacy controls required to operate those features. P0/P1 Community tasks take precedence over marketplace work.

### Marketplace — preserved prototype, production work deferred

PR #1 contains useful prototype assets and product exploration for:

- property search, filters, sorting, map and saved homes;
- buyer My Finqit and Auto-Reserve Agent concepts;
- Instant Reserve UX and reservation economics;
- seller listing wizard, inventory and listing lifecycle;
- browser-persisted demo state and responsive marketplace navigation.

These assets are reference/prototype material, not production contracts. Do not merge marketplace-first architecture into Community merely to preserve them.

## Explicit production blockers

The prototype must not be represented as production-ready until separate backlog work provides and verifies at least:

1. real authentication and buyer/seller authorization;
2. durable backend persistence and tenant/ownership boundaries;
3. atomic reservation allocation and concurrency controls;
4. KYC/identity and seller authority/document verification where required;
5. regulated payment-provider integration and refund/failure handling;
6. lawyer-approved reservation/option terms and jurisdiction-specific disclosures;
7. production messaging/notification semantics and consent;
8. security, privacy, audit, abuse and operational readiness for marketplace data/actions.

No autonomous task may convert simulated payment, verification, reservation or legal states into real external actions without the corresponding production dependency and founder authorization where required.

## Integration checklist for future marketplace work

Before promoting marketplace code toward `main`, verify:

- [ ] Community P0/P1 execution is not delayed or coupled to marketplace-only work.
- [ ] Shared code is genuinely domain-neutral; marketplace business rules stay in marketplace modules.
- [ ] Prototype browser state is not treated as an authorization or persistence boundary.
- [ ] Binding actions have server-side authorization, validation, idempotency and auditable state transitions.
- [ ] Reservation allocation is atomic and tested for concurrent buyers.
- [ ] Payment and verification UI clearly reflects real provider state rather than simulation.
- [ ] Personal and financial data is covered by Finqit's privacy inventory and retention controls.
- [ ] Failure, empty, retry and cancellation states are tested.
- [ ] Marketplace routes do not weaken Community tenant isolation or RLS.
- [ ] Any external or irreversible action has the required founder/legal/provider approval.

## Repeatable verification

A future agent can re-check this boundary by comparing the current default branch with PR #1 and the Master Backlog. Marketplace-only implementation should remain deferred unless its dependencies are satisfied and its priority no longer conflicts with Community MVP execution. If marketplace code is later merged, update this document in the same change that alters the boundary.
