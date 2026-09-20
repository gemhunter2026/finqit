// GDPR-001: canonical privacy classification for Finqit's community-first data model.
// This registry is intentionally executable data rather than prose so schema, export,
// deletion and AI adapters can consume the same privacy decisions.

export const privacyClasses = [
  "identity",
  "contact",
  "financial",
  "communication",
  "governance",
  "system_metadata",
] as const;

export type PrivacyClass = (typeof privacyClasses)[number];
export type AiPromptPolicy = "exclude" | "redact" | "allow_when_required";
export type RetentionPolicy = "account_lifetime" | "community_lifetime" | "purpose_limited" | "legal_review_required";

export interface PrivacyInventoryItem {
  readonly resource: string;
  readonly fields: readonly string[];
  readonly classification: readonly PrivacyClass[];
  readonly purpose: string;
  readonly retention: RetentionPolicy;
  readonly aiPromptPolicy: AiPromptPolicy;
  readonly notes?: string;
}

export const communityPrivacyInventory = [
  { resource: "profiles", fields: ["id", "full_name", "phone", "avatar_url"], classification: ["identity", "contact"], purpose: "Identify and contact an authenticated Finqit member.", retention: "account_lifetime", aiPromptPolicy: "exclude", notes: "Do not use profile identifiers to enrich AI prompts by default." },
  { resource: "communities", fields: ["id", "name", "address", "city", "postal_code", "country_code"], classification: ["governance"], purpose: "Represent the managed community and its operating context.", retention: "community_lifetime", aiPromptPolicy: "redact" },
  { resource: "community_members", fields: ["community_id", "user_id", "role", "unit_label", "unit_id", "status"], classification: ["identity", "governance"], purpose: "Authorize tenant access and represent membership/unit relationships.", retention: "community_lifetime", aiPromptPolicy: "exclude" },
  { resource: "community_invitations", fields: ["email", "role", "unit_id", "status", "token_hash", "invited_by", "expires_at", "accepted_by", "accepted_at"], classification: ["identity", "contact", "governance", "system_metadata"], purpose: "Invite and securely provision community membership.", retention: "purpose_limited", aiPromptPolicy: "exclude", notes: "Bearer tokens are never stored plaintext; token hashes and invitation metadata never enter AI prompts." },
  { resource: "community_messages", fields: ["sender_email", "recipient_emails", "cc_emails", "subject", "body_text", "headers", "external_message_id", "provider_thread_id", "ai_summary", "ai_category"], classification: ["contact", "communication", "system_metadata"], purpose: "Operate the community inbox and user-requested communication assistance.", retention: "legal_review_required", aiPromptPolicy: "allow_when_required", notes: "Only the minimum message content required for an explicit AI feature may be sent; redact addresses, headers and external identifiers first." },
  { resource: "community_documents", fields: ["title", "category", "storage_path", "mime_type", "size_bytes", "uploaded_by", "created_at"], classification: ["governance", "system_metadata"], purpose: "Store and retrieve community governance/operational documents.", retention: "legal_review_required", aiPromptPolicy: "allow_when_required", notes: "Document contents require separate classification before AI processing; storage paths are never authorization." },
  { resource: "community_finance_entries", fields: ["entry_date", "kind", "category", "supplier", "provider_id", "description", "amount", "currency"], classification: ["financial", "governance"], purpose: "Maintain community financial records and reporting.", retention: "legal_review_required", aiPromptPolicy: "redact" },
  { resource: "community_incidents", fields: ["title", "description", "status", "priority", "reported_by", "assigned_to", "provider_id"], classification: ["identity", "communication", "governance"], purpose: "Track maintenance, safety and operational incidents.", retention: "legal_review_required", aiPromptPolicy: "redact" },
  { resource: "community_votes", fields: ["title", "description", "status", "starts_at", "ends_at", "created_by"], classification: ["governance"], purpose: "Run community consultations and governance workflows.", retention: "legal_review_required", aiPromptPolicy: "redact" },
  { resource: "community_vote_responses", fields: ["vote_id", "option_id", "user_id", "created_at"], classification: ["identity", "governance"], purpose: "Record an eligible member's ballot while preserving ballot confidentiality.", retention: "legal_review_required", aiPromptPolicy: "exclude", notes: "Individual ballots must never enter AI prompts." },
  { resource: "community_providers", fields: ["name", "category", "email", "phone", "website", "tax_id", "notes", "created_by"], classification: ["contact", "financial", "governance"], purpose: "Manage community service-provider relationships.", retention: "legal_review_required", aiPromptPolicy: "redact" },
  { resource: "community_meetings", fields: ["title", "scheduled_at", "location", "agenda", "minutes_document_id", "created_by", "completed_at"], classification: ["governance"], purpose: "Plan meetings and connect agendas/minutes to community records.", retention: "legal_review_required", aiPromptPolicy: "redact" },
  { resource: "community_audit_events", fields: ["actor_user_id", "action", "entity_type", "entity_id", "payload", "occurred_at"], classification: ["identity", "system_metadata", "governance"], purpose: "Provide a security and governance audit trail.", retention: "legal_review_required", aiPromptPolicy: "exclude", notes: "Audit payloads must not contain credentials, invitation tokens or provider secrets." },
] as const satisfies readonly PrivacyInventoryItem[];

export const prohibitedAiPromptFields = new Set([
  "token_hash",
  "headers",
  "external_message_id",
  "provider_thread_id",
  "user_id",
  "actor_user_id",
  "tax_id",
]);

export function assertPrivacyInventoryCoverage(resources: readonly string[]): void {
  const inventoried = new Set<string>(communityPrivacyInventory.map((item) => item.resource));
  const missing = resources.filter((resource) => !inventoried.has(resource));
  if (missing.length > 0) throw new Error(`Missing privacy classification: ${missing.join(", ")}`);
}

export function mayEnterAiPrompt(resource: string, field: string): boolean {
  const item = communityPrivacyInventory.find((candidate) => candidate.resource === resource);
  if (!item || item.aiPromptPolicy === "exclude" || prohibitedAiPromptFields.has(field)) return false;
  return item.fields.includes(field as never);
}
