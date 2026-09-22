// GDPR-003: non-destructive account lifecycle planning for privacy requests.
// This module deliberately does not delete data. It produces an auditable plan that
// a trusted server-side workflow can execute only after retention policy validation.

import { communityPrivacyInventory, type RetentionPolicy } from "./data-inventory";

export type AccountLifecycleState = "active" | "deactivation_requested" | "deactivated";
export type PrivacyAction = "anonymize" | "retain" | "review";

export interface AccountLifecycleRecord {
  readonly userId: string;
  readonly state: AccountLifecycleState;
  readonly requestedAt?: string;
  readonly deactivatedAt?: string;
}

export interface PrivacyActionPlanItem {
  readonly resource: string;
  readonly action: PrivacyAction;
  readonly reason: string;
}

export interface AccountDeactivationPlan {
  readonly userId: string;
  readonly requestedAt: string;
  readonly nextState: "deactivation_requested";
  readonly actions: readonly PrivacyActionPlanItem[];
  readonly destructivePurgeAllowed: false;
}

function actionForRetention(retention: RetentionPolicy): Pick<PrivacyActionPlanItem, "action" | "reason"> {
  switch (retention) {
    case "account_lifetime":
      return {
        action: "anonymize",
        reason: "Account-scoped identity can be anonymized after ownership and retention checks.",
      };
    case "community_lifetime":
      return {
        action: "retain",
        reason: "Shared community history must remain intact; remove direct personal identifiers only where policy permits.",
      };
    case "purpose_limited":
      return {
        action: "review",
        reason: "Purpose completion and any active invitation/workflow must be checked before cleanup.",
      };
    case "legal_review_required":
      return {
        action: "review",
        reason: "Retention obligations are not yet configured and require validated legal/business policy.",
      };
  }
}

export function createAccountDeactivationPlan(userId: string, requestedAt: string): AccountDeactivationPlan {
  const normalizedUserId = userId.trim();
  if (!normalizedUserId) throw new Error("A user id is required to plan account deactivation.");

  const timestamp = new Date(requestedAt);
  if (Number.isNaN(timestamp.getTime())) throw new Error("A valid deactivation request timestamp is required.");

  return {
    userId: normalizedUserId,
    requestedAt: timestamp.toISOString(),
    nextState: "deactivation_requested",
    actions: communityPrivacyInventory.map((item) => ({
      resource: item.resource,
      ...actionForRetention(item.retention),
    })),
    destructivePurgeAllowed: false,
  };
}

export function transitionAccountLifecycle(
  current: AccountLifecycleRecord,
  next: AccountLifecycleState,
  occurredAt: string,
): AccountLifecycleRecord {
  const timestamp = new Date(occurredAt);
  if (Number.isNaN(timestamp.getTime())) throw new Error("A valid lifecycle timestamp is required.");
  const at = timestamp.toISOString();

  if (current.state === "deactivated") {
    if (next !== "deactivated") throw new Error("A deactivated account cannot be reactivated by the privacy workflow.");
    return current;
  }

  if (current.state === "active" && next === "deactivated") {
    throw new Error("Account deactivation requires an explicit deactivation_requested state first.");
  }

  if (next === "active") {
    throw new Error("Reactivation requires a separate authenticated recovery workflow.");
  }

  if (next === "deactivation_requested") {
    return { ...current, state: next, requestedAt: current.requestedAt ?? at };
  }

  if (!current.requestedAt) throw new Error("Cannot deactivate an account without a recorded request.");
  return { ...current, state: "deactivated", deactivatedAt: at };
}

export function assertNoDestructiveAccountPurge(plan: AccountDeactivationPlan): void {
  if (plan.destructivePurgeAllowed !== false) {
    throw new Error("Destructive account purge is disabled until retention policy is validated.");
  }
}
