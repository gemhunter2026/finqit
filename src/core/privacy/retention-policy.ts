import { communityPrivacyInventory, type RetentionPolicy } from "./data-inventory";

export type RetentionPolicyKey = RetentionPolicy;
export type RetentionDurationConfig = Partial<Record<RetentionPolicyKey, number>>;

export interface RetentionCandidate {
  readonly id: string;
  readonly resource: string;
  readonly createdAt: Date;
  readonly tenantId?: string;
}

export interface RetentionDecision extends RetentionCandidate {
  readonly policy: RetentionPolicyKey;
  readonly configuredDays: number | null;
  readonly eligible: boolean;
  readonly reason: string;
}

export interface RetentionCleanupReport {
  readonly generatedAt: Date;
  readonly destructiveActionEnabled: boolean;
  readonly scanned: number;
  readonly eligible: number;
  readonly skipped: number;
  readonly decisions: readonly RetentionDecision[];
}

const inventoryByResource = new Map(
  communityPrivacyInventory.map((item) => [item.resource, item] as const),
);

function positiveInteger(value: number | undefined): number | null {
  if (value === undefined || !Number.isInteger(value) || value <= 0) return null;
  return value;
}

export function retentionConfigFromEnv(
  env: Record<string, string | undefined>,
): RetentionDurationConfig {
  const read = (key: string): number | undefined => {
    const raw = env[key];
    if (!raw) return undefined;
    const parsed = Number(raw);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
  };

  return {
    account_lifetime: read("RETENTION_ACCOUNT_LIFETIME_DAYS"),
    community_lifetime: read("RETENTION_COMMUNITY_LIFETIME_DAYS"),
    purpose_limited: read("RETENTION_PURPOSE_LIMITED_DAYS"),
    legal_review_required: read("RETENTION_LEGAL_REVIEW_REQUIRED_DAYS"),
  };
}

export function evaluateRetentionCandidate(
  candidate: RetentionCandidate,
  config: RetentionDurationConfig,
  now = new Date(),
): RetentionDecision {
  const inventory = inventoryByResource.get(candidate.resource);
  if (!inventory) {
    return { ...candidate, policy: "legal_review_required", configuredDays: null, eligible: false, reason: "resource_not_in_privacy_inventory" };
  }

  const configuredDays = positiveInteger(config[inventory.retention]);
  if (configuredDays === null) {
    return { ...candidate, policy: inventory.retention, configuredDays: null, eligible: false, reason: "retention_duration_not_configured" };
  }

  const ageMs = now.getTime() - candidate.createdAt.getTime();
  const thresholdMs = configuredDays * 24 * 60 * 60 * 1000;
  const eligible = ageMs >= thresholdMs;
  return {
    ...candidate,
    policy: inventory.retention,
    configuredDays,
    eligible,
    reason: eligible ? "retention_period_elapsed" : "retention_period_active",
  };
}

export function buildRetentionCleanupReport(
  candidates: readonly RetentionCandidate[],
  config: RetentionDurationConfig,
  now = new Date(),
): RetentionCleanupReport {
  const decisions = candidates.map((candidate) => evaluateRetentionCandidate(candidate, config, now));
  const eligible = decisions.filter((decision) => decision.eligible).length;
  return {
    generatedAt: now,
    destructiveActionEnabled: false,
    scanned: decisions.length,
    eligible,
    skipped: decisions.length - eligible,
    decisions,
  };
}

export interface DestructiveRetentionActivation {
  readonly explicitlyEnabled: true;
  readonly confirmation: "DELETE_RETENTION_ELIGIBLE_RECORDS";
}

export function requireDestructiveRetentionActivation(
  activation: DestructiveRetentionActivation | undefined,
): void {
  if (!activation?.explicitlyEnabled || activation.confirmation !== "DELETE_RETENTION_ELIGIBLE_RECORDS") {
    throw new Error("Destructive retention cleanup is disabled; explicit activation is required.");
  }
}

// This module intentionally does not delete records. A future cleanup adapter must first
// produce a dry-run report, enforce tenant-scoped repositories, then call the activation
// guard immediately before deletion. This keeps legal-review values configurable without
// making an unset or malformed value destructive.
