import { AIProviderError, assertCapability } from "./provider.ts";
import type {
  AIEmbeddingRequest,
  AIEmbeddingResponse,
  AIGenerationRequest,
  AIProvider,
  AIStructuredRequest,
  AIStructuredResponse,
  AITextResponse,
} from "./provider.ts";

export type MockAIScenario =
  | "classification"
  | "extraction"
  | "summary"
  | "draft"
  | "failure"
  | "timeout";

export interface MockAIFixture {
  readonly text?: string;
  readonly structured?: unknown;
}

const DEFAULT_FIXTURES: Readonly<Record<Exclude<MockAIScenario, "failure" | "timeout">, MockAIFixture>> = {
  classification: { structured: { category: "community", confidence: 0.98 } },
  extraction: { structured: { entities: ["Finqit"], source: "fixture" } },
  summary: { text: "Deterministic Finqit summary fixture." },
  draft: { text: "Deterministic Finqit draft fixture." },
};

function scenarioFromMessages(request: AIGenerationRequest): MockAIScenario {
  const marker = request.messages.map((message) => message.content).join("\n").toLowerCase();
  for (const scenario of ["classification", "extraction", "summary", "draft", "failure", "timeout"] as const) {
    if (marker.includes(`[scenario:${scenario}]`)) return scenario;
  }
  return "summary";
}

function metadata(scenario: MockAIScenario) {
  return {
    provider: "mock",
    model: `mock-${scenario}`,
    requestId: `mock-${scenario}-request`,
    usage: { inputTokens: 10, outputTokens: 5, totalTokens: 15, estimatedCostUsd: 0 },
  } as const;
}

export class MockAIProvider implements AIProvider {
  readonly id = "mock";
  readonly capabilities = new Set(["text", "structured", "embedding"] as const);
  private readonly fixtures: Readonly<Record<Exclude<MockAIScenario, "failure" | "timeout">, MockAIFixture>>;

  constructor(fixtures = DEFAULT_FIXTURES) {
    this.fixtures = fixtures;
  }

  private scenario(request: AIGenerationRequest): MockAIScenario {
    return scenarioFromMessages(request);
  }

  private assertRunnable(scenario: MockAIScenario): void {
    if (scenario === "failure") {
      throw new AIProviderError("provider_unavailable", "Mock AI failure fixture", { retryable: true });
    }
    if (scenario === "timeout") {
      throw new AIProviderError("timeout", "Mock AI timeout fixture", { retryable: true });
    }
  }

  async generateText(request: AIGenerationRequest): Promise<AITextResponse> {
    assertCapability(this, "text");
    const scenario = this.scenario(request);
    this.assertRunnable(scenario);
    const fixture = this.fixtures[scenario as keyof typeof this.fixtures];
    return { text: fixture?.text ?? JSON.stringify(fixture?.structured ?? {}), metadata: metadata(scenario) };
  }

  async generateStructured<T>(request: AIStructuredRequest<T>): Promise<AIStructuredResponse<T>> {
    assertCapability(this, "structured");
    const scenario = this.scenario(request);
    this.assertRunnable(scenario);
    const fixture = this.fixtures[scenario as keyof typeof this.fixtures];
    const value = request.validate(fixture?.structured ?? { text: fixture?.text ?? "" });
    return { value, metadata: metadata(scenario) };
  }

  async embed(request: AIEmbeddingRequest): Promise<AIEmbeddingResponse> {
    assertCapability(this, "embedding");
    const embeddings = request.input.map((value) => {
      const sum = [...value].reduce((total, char) => total + char.codePointAt(0)!, 0);
      return [value.length / 100, (sum % 997) / 997, 1];
    });
    return { embeddings, metadata: metadata("extraction") };
  }
}
