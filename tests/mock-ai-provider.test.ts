import assert from "node:assert/strict";
import test from "node:test";

import { AIProviderError } from "../src/core/ai/provider.ts";
import { MockAIProvider } from "../src/core/ai/mock-provider.ts";

const messages = (scenario: string) => [{ role: "user" as const, content: `[scenario:${scenario}] test` }];

test("returns deterministic summary and zero-cost metadata", async () => {
  const provider = new MockAIProvider();
  const first = await provider.generateText({ messages: messages("summary") });
  const second = await provider.generateText({ messages: messages("summary") });
  assert.deepEqual(first, second);
  assert.equal(first.metadata.usage?.estimatedCostUsd, 0);
});

test("validates deterministic structured fixtures", async () => {
  const provider = new MockAIProvider();
  const response = await provider.generateStructured({
    messages: messages("classification"),
    schemaName: "classification",
    validate(value) {
      assert.deepEqual(value, { category: "community", confidence: 0.98 });
      return value as { category: string; confidence: number };
    },
  });
  assert.equal(response.value.category, "community");
});

test("produces stable embeddings", async () => {
  const provider = new MockAIProvider();
  const a = await provider.embed({ input: ["Finqit", "community"] });
  const b = await provider.embed({ input: ["Finqit", "community"] });
  assert.deepEqual(a, b);
  assert.equal(a.embeddings.length, 2);
});

for (const scenario of ["failure", "timeout"] as const) {
  test(`exposes ${scenario} fixture with retry semantics`, async () => {
    const provider = new MockAIProvider();
    await assert.rejects(
      provider.generateText({ messages: messages(scenario) }),
      (error: unknown) => {
        assert.ok(error instanceof AIProviderError);
        assert.equal(error.retryable, true);
        assert.equal(error.code, scenario === "timeout" ? "timeout" : "provider_unavailable");
        return true;
      },
    );
  });
}
