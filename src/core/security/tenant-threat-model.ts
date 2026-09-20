export type CommunityRole = "resident" | "owner" | "board" | "manager";
export type Access = "none" | "own" | "community" | "manage" | "server-only";

export type TenantEntity = {
  table: string;
  tenantKey: "community_id" | "derived";
  containsPersonalData: boolean;
  read: Record<CommunityRole, Access>;
  write: Record<CommunityRole, Access>;
  notes?: string;
};

const communityRead: Record<CommunityRole, Access> = {
  resident: "community",
  owner: "community",
  board: "community",
  manager: "community",
};

const privilegedWrite: Record<CommunityRole, Access> = {
  resident: "none",
  owner: "manage",
  board: "manage",
  manager: "manage",
};

/**
 * SEC-001 canonical authorization matrix.
 *
 * This is deliberately data, not UI logic: RLS migrations and authorization tests can
 * consume/review the same boundary model. `community_id` must always be derived from a
 * persisted membership or parent relation; request payloads are never authority.
 */
export const tenantEntities: readonly TenantEntity[] = [
  { table: "communities", tenantKey: "derived", containsPersonalData: false, read: communityRead, write: privilegedWrite },
  { table: "community_buildings", tenantKey: "community_id", containsPersonalData: false, read: communityRead, write: privilegedWrite },
  { table: "community_units", tenantKey: "community_id", containsPersonalData: false, read: communityRead, write: privilegedWrite },
  {
    table: "community_members", tenantKey: "community_id", containsPersonalData: true,
    read: { resident: "own", owner: "community", board: "community", manager: "community" },
    write: { resident: "own", owner: "manage", board: "manage", manager: "manage" },
    notes: "Residents may update only explicitly self-service profile/membership fields; role/status/weight are privileged.",
  },
  {
    table: "community_invitations", tenantKey: "community_id", containsPersonalData: true,
    read: { resident: "none", owner: "community", board: "community", manager: "community" },
    write: privilegedWrite,
    notes: "Raw invitation tokens are never stored; acceptance is a server-validated token-hash flow.",
  },
  {
    table: "community_messages", tenantKey: "community_id", containsPersonalData: true,
    read: communityRead,
    write: { resident: "none", owner: "manage", board: "manage", manager: "manage" },
    notes: "Inbound ingestion and provider metadata writes are server-only even when users can compose outbound messages.",
  },
  { table: "community_documents", tenantKey: "community_id", containsPersonalData: true, read: communityRead, write: privilegedWrite, notes: "Storage object authorization must derive tenant from persisted document metadata, never path text alone." },
  { table: "community_finance_entries", tenantKey: "community_id", containsPersonalData: true, read: communityRead, write: privilegedWrite },
  { table: "community_incidents", tenantKey: "community_id", containsPersonalData: true, read: communityRead, write: { resident: "own", owner: "manage", board: "manage", manager: "manage" } },
  { table: "community_votes", tenantKey: "community_id", containsPersonalData: false, read: communityRead, write: privilegedWrite },
  { table: "community_vote_options", tenantKey: "derived", containsPersonalData: false, read: communityRead, write: privilegedWrite, notes: "Tenant is derived through vote_id -> community_votes.community_id." },
  { table: "community_vote_responses", tenantKey: "derived", containsPersonalData: true, read: { resident: "own", owner: "own", board: "own", manager: "own" }, write: { resident: "own", owner: "own", board: "own", manager: "own" }, notes: "Tenant and option validity derive through the parent vote; individual ballots are not community-readable." },
  { table: "community_providers", tenantKey: "community_id", containsPersonalData: true, read: communityRead, write: privilegedWrite },
  { table: "community_meetings", tenantKey: "community_id", containsPersonalData: true, read: communityRead, write: privilegedWrite },
  { table: "community_audit_events", tenantKey: "community_id", containsPersonalData: true, read: { resident: "none", owner: "community", board: "community", manager: "community" }, write: { resident: "server-only", owner: "server-only", board: "server-only", manager: "server-only" }, notes: "Clients never insert or mutate audit events directly; payloads must exclude secrets and unnecessary personal data." },
] as const;

export type ThreatScenario = {
  id: string;
  attack: string;
  invariant: string;
  futureTest: string;
};

export const tenantThreatScenarios: readonly ThreatScenario[] = [
  { id: "BOLA-01", attack: "Authenticated user substitutes another community_id in a query or mutation.", invariant: "Membership is checked against auth.uid(); payload tenant identifiers cannot grant access.", futureTest: "Member of community A cannot select/insert/update/delete rows belonging to community B." },
  { id: "BOLA-02", attack: "User supplies a foreign unit/building/provider/document ID from another community.", invariant: "Cross-tenant references are rejected by composite foreign keys and RLS.", futureTest: "Every tenant-scoped foreign key rejects an ID owned by a different community." },
  { id: "ROLE-01", attack: "Resident changes role, membership status, voting weight, finance data, invitations, or governance records.", invariant: "Privileged fields/actions require owner/board/manager authorization in persisted membership.", futureTest: "Resident privileged writes fail while permitted self-service writes succeed." },
  { id: "INGEST-01", attack: "Client impersonates an inbound provider/webhook or forges processing metadata.", invariant: "Provider ingestion, raw headers, delivery metadata and audit writes are server-only.", futureTest: "Authenticated client cannot directly insert trusted ingestion/audit metadata." },
  { id: "STORAGE-01", attack: "User guesses or edits a storage object path for another community.", invariant: "Object access is authorized through persisted tenant metadata; bucket/path naming is not authorization.", futureTest: "Signed/read/write storage operations fail for objects mapped to another community." },
  { id: "VOTE-01", attack: "User reads another member's ballot or submits an option from a different vote/community.", invariant: "Ballots are self-readable/self-writable and option/community ancestry must match.", futureTest: "Ballot privacy and parent-option tenant integrity are enforced." },
  { id: "INVITE-01", attack: "Leaked database content reveals usable invitation credentials or token replay succeeds.", invariant: "Only token hashes are persisted; expiry/status/single-use checks are server validated.", futureTest: "Raw token is absent at rest and accepted/revoked/expired tokens cannot be replayed." },
  { id: "ENUM-01", attack: "Anonymous or non-member user enumerates communities, aliases, member identities, documents or providers.", invariant: "Tenant-scoped tables default deny without an active persisted membership or explicit server flow.", futureTest: "Anon and authenticated non-member reads return no tenant rows." },
] as const;

export const securityInvariants = {
  defaultDeny: true,
  tenantAuthority: "persisted-membership",
  actorAuthority: "auth.uid()",
  serviceRoleBrowserSafe: false,
  rawInvitationTokensAtRest: false,
  storagePathIsAuthorization: false,
  auditClientWritable: false,
} as const;

export function assertThreatModelCoverage(tableNames: readonly string[]): void {
  const covered = new Set(tenantEntities.map((entity) => entity.table));
  const missing = tableNames.filter((table) => !covered.has(table));
  if (missing.length > 0) {
    throw new Error(`SEC-001 threat model missing tenant entities: ${missing.join(", ")}`);
  }
}
