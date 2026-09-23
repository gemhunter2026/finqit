type Environment = Readonly<Record<string, string | undefined>>;

export const featureFlagNames = [
  "ai",
  "banking",
  "whatsapp",
  "marketplace",
  "realProviders",
] as const;

export type FeatureFlagName = (typeof featureFlagNames)[number];
export type FeatureFlags = Readonly<Record<FeatureFlagName, boolean>>;

/**
 * Fail-closed defaults. Experimental/external integrations must be deliberately enabled.
 * Flags control rollout only; authorization and tenant checks remain separate concerns.
 */
export const defaultFeatureFlags: FeatureFlags = Object.freeze({
  ai: false,
  banking: false,
  whatsapp: false,
  marketplace: false,
  realProviders: false,
});

const environmentKeys: Readonly<Record<FeatureFlagName, string>> = Object.freeze({
  ai: "FINQIT_FEATURE_AI",
  banking: "FINQIT_FEATURE_BANKING",
  whatsapp: "FINQIT_FEATURE_WHATSAPP",
  marketplace: "FINQIT_FEATURE_MARKETPLACE",
  realProviders: "FINQIT_FEATURE_REAL_PROVIDERS",
});

export class FeatureFlagConfigurationError extends Error {
  readonly issues: readonly string[];

  constructor(issues: readonly string[]) {
    super(`Invalid Finqit feature flags:\n- ${issues.join("\n- ")}`);
    this.name = "FeatureFlagConfigurationError";
    this.issues = issues;
  }
}

function parseBooleanOverride(key: string, rawValue: string | undefined, issues: string[]): boolean | undefined {
  const value = rawValue?.trim().toLowerCase();
  if (!value) return undefined;
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  issues.push(`${key} must be true, false, 1, or 0.`);
  return undefined;
}

export function parseFeatureFlags(environment: Environment): FeatureFlags {
  const issues: string[] = [];
  const flags = { ...defaultFeatureFlags };

  for (const name of featureFlagNames) {
    const override = parseBooleanOverride(environmentKeys[name], environment[environmentKeys[name]], issues);
    if (override !== undefined) flags[name] = override;
  }

  if (issues.length > 0) throw new FeatureFlagConfigurationError(issues);
  return Object.freeze(flags);
}

/** Server-only: feature flags are intentionally not NEXT_PUBLIC_ values. */
export function readServerFeatureFlags(): FeatureFlags {
  return parseFeatureFlags(process.env);
}

export function isFeatureEnabled(flags: FeatureFlags, name: FeatureFlagName): boolean {
  return flags[name];
}
