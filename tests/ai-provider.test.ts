import assert from "node:assert/strict";
import test from "node:test";

import {
  AIProviderError,
  assertCapability,
  normalizeAIProviderError,
  type AIProvider,
} from "../src/core/ai/provider.ts";

const mockProvider: AIProvider = {
  id: "mock",
  capabilities: new Set(["text", "structured", "embedding"]),
  async generateText() {
    return {
      text: "hello",
      metadata: { provider: "mock", model: "deterministic" },
    };
  },
  async generateStructured(request) {
    const value = request.validate({ ok: true });
    return {
      value,
      metadata: { provider: "mock", model: "deterministic" },
    };
  },
  async embed(request) {
    return {
      embeddings: request.input.map((_, index) => [index, 1]),
      metadata: { provider: "mock", model: "deterministic" },
    };
  },
};

test("AIProvider contract supports text, structured output and embeddings", async () => {
  assertCapability(mockProvider, "text");
  assertCapability(mockProvider, "structured");
  assertCapability(mockProvider, "embedding");

  const text = await mockProvider.generateText({
    messages: [{ role: "user", content: "hello" }],
  });
  assert.equal(text.text, "hello");

  const structured = await mockProvider.generateStructured({
    schemaName: "result",
    messages: [{ role: "user", content: "return structured data" }],
    validate(value) {
      assert.deepEqual(value, { ok: true });
      return value as { ok: boolean };
    },
  });
  assert.deepEqual(structured.value, { ok: true });

  const embedded = await mockProvider.embed({ input: ["one", "two"] });
  assert.deepEqual(embedded.embeddings, [[0, 1], [1, 1]]);
});

test("unsupported capability fails closed", () => {
  assert.throws(
    () =>
      assertCapability(
        { id: "text-only", capabilities: new Set(["text"]) },
        "embedding",
      ),
    (error: unknown) =>
      error instanceof AIProviderError &&
      error.code === "invalid_request" &&
      error.retryable === false,
  );
});

test("provider errors retain explicit retry semantics", () => {
  const retryable = new AIProviderError("rate_limited", "slow down", {
    retryable: true,
  });
  assert.equal(retryable.retryable, true);
  assert.equal(normalizeAIProviderError(retryable), retryable);

  const normalized = normalizeAIProviderError(new Error("secret provider detail"));
  assert.equal(normalized.code, "unknown");
  assert.equal(normalized.retryable, false);
  assert.equal(normalized.message, "AI provider request failed");
});
