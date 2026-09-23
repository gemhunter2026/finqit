import assert from "node:assert/strict";
import test from "node:test";

import { AIPromptRegistry, defineSchema } from "../src/core/ai/registry.ts";

const classificationSchema = defineSchema("community-classification", (value) => {
  if (!value || typeof value !== "object" || !("category" in value)) {
    throw new Error("Invalid community classification");
  }
  const category = (value as { category: unknown }).category;
  if (typeof category !== "string") throw new Error("Invalid category");
  return { category };
});

const prompt = {
  useCase: "community-classification",
  version: "v1",
  systemPrompt: "Classify the community message without exposing private content.",
  schema: classificationSchema,
};

test("looks up prompts by use case and explicit version", () => {
  const registry = new AIPromptRegistry([prompt]);
  assert.equal(registry.get("community-classification", "v1").systemPrompt, prompt.systemPrompt);
  assert.deepEqual(registry.versions("community-classification"), ["v1"]);
});

test("includes prompt version and schema name in run metadata", () => {
  const registry = new AIPromptRegistry([prompt]);
  assert.deepEqual(registry.metadata("community-classification", "v1"), {
    useCase: "community-classification",
    promptVersion: "v1",
    schemaName: "community-classification",
  });
});

test("co-located schema fails closed on invalid structured output", () => {
  assert.throws(() => classificationSchema.validate({ confidence: 0.9 }), /Invalid community classification/);
  assert.deepEqual(classificationSchema.validate({ category: "governance" }), { category: "governance" });
});

test("rejects duplicate versions and unknown prompt lookups", () => {
  const registry = new AIPromptRegistry([prompt]);
  assert.throws(() => registry.register(prompt), /already registered/);
  assert.throws(() => registry.get("community-classification", "v2"), /Unknown AI prompt/);
});

test("rejects incomplete definitions and schema names", () => {
  assert.throws(() => new AIPromptRegistry([{ ...prompt, version: " " }]), /required/);
  assert.throws(() => defineSchema(" ", (value) => value), /schema name is required/);
});
