import assert from "node:assert/strict";
import test from "node:test";

import { FINQIT_DOMAINS } from "../src/core/domain.ts";

test("community-first domain registry remains unique and includes core modules", () => {
  assert.equal(new Set(FINQIT_DOMAINS).size, FINQIT_DOMAINS.length);
  assert.ok(FINQIT_DOMAINS.includes("community"));
  assert.ok(FINQIT_DOMAINS.includes("inbox"));
  assert.ok(FINQIT_DOMAINS.includes("documents"));
});
