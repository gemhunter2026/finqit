import assert from "node:assert/strict";
import test from "node:test";

import {
  FeatureFlagConfigurationError,
  defaultFeatureFlags,
  isFeatureEnabled,
  parseFeatureFlags,
} from "../src/core/feature-flags.ts";

test("feature flags fail closed by default", () => {
  const flags = parseFeatureFlags({});
  assert.deepEqual(flags, defaultFeatureFlags);
  assert.equal(isFeatureEnabled(flags, "marketplace"), false);
});

test("environment overrides enable and disable flags deterministically", () => {
  const flags = parseFeatureFlags({
    FINQIT_FEATURE_AI: "true",
    FINQIT_FEATURE_BANKING: "1",
    FINQIT_FEATURE_WHATSAPP: "false",
    FINQIT_FEATURE_MARKETPLACE: "0",
    FINQIT_FEATURE_REAL_PROVIDERS: " TRUE ",
  });

  assert.equal(flags.ai, true);
  assert.equal(flags.banking, true);
  assert.equal(flags.whatsapp, false);
  assert.equal(flags.marketplace, false);
  assert.equal(flags.realProviders, true);
});

test("invalid overrides are rejected rather than silently enabling functionality", () => {
  assert.throws(
    () => parseFeatureFlags({ FINQIT_FEATURE_AI: "yes" }),
    (error: unknown) => {
      assert.ok(error instanceof FeatureFlagConfigurationError);
      assert.match(error.message, /FINQIT_FEATURE_AI/);
      return true;
    },
  );
});

test("flags are immutable snapshots and do not expose authorization semantics", () => {
  const flags = parseFeatureFlags({ FINQIT_FEATURE_MARKETPLACE: "true" });
  assert.equal(Object.isFrozen(flags), true);
  assert.deepEqual(Object.keys(flags).sort(), ["ai", "banking", "marketplace", "realProviders", "whatsapp"]);
});
