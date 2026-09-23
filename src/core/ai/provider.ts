export type AICapability = "text" | "structured" | "embedding";

export type AIRole = "system" | "user" | "assistant";

export interface AIMessage {
  readonly role: AIRole;
  readonly content: string;
}

export interface AIRequestOptions {
  readonly timeoutMs?: number;
  readonly maxAttempts?: number;
  readonly signal?: AbortSignal;
}

export interface AIGenerationRequest extends AIRequestOptions {
  readonly messages: readonly AIMessage[];
  readonly model?: string;
  readonly temperature?: number;
  readonly maxOutputTokens?: number;
}

export interface AIStructuredRequest<T> extends AIGenerationRequest {
  readonly schemaName: string;
  readonly validate: (value: unknown) => T;
}

export interface AIEmbeddingRequest extends AIRequestOptions {
  readonly input: readonly string[];
  readonly model?: string;
}

export interface AIUsage {
  readonly inputTokens?: number;
  readonly outputTokens?: number;
  readonly totalTokens?: number;
  readonly estimatedCostUsd?: number;
}

export interface AIResponseMetadata {
  readonly provider: string;
  readonly model: string;
  readonly requestId?: string;
  readonly usage?: AIUsage;
}

export interface AITextResponse {
  readonly text: string;
  readonly metadata: AIResponseMetadata;
}

export interface AIStructuredResponse<T> {
  readonly value: T;
  readonly metadata: AIResponseMetadata;
}

export interface AIEmbeddingResponse {
  readonly embeddings: readonly (readonly number[])[];
  readonly metadata: AIResponseMetadata;
}

export type AIErrorCode =
  | "invalid_request"
  | "authentication"
  | "permission_denied"
  | "rate_limited"
  | "timeout"
  | "provider_unavailable"
  | "invalid_response"
  | "cancelled"
  | "unknown";

export class AIProviderError extends Error {
  readonly code: AIErrorCode;
  readonly retryable: boolean;
  readonly cause?: unknown;

  constructor(
    code: AIErrorCode,
    message: string,
    options: { retryable?: boolean; cause?: unknown } = {},
  ) {
    super(message);
    this.name = "AIProviderError";
    this.code = code;
    this.retryable = options.retryable ?? false;
    this.cause = options.cause;
  }
}

export interface AIProvider {
  readonly id: string;
  readonly capabilities: ReadonlySet<AICapability>;

  generateText(request: AIGenerationRequest): Promise<AITextResponse>;

  generateStructured<T>(
    request: AIStructuredRequest<T>,
  ): Promise<AIStructuredResponse<T>>;

  embed(request: AIEmbeddingRequest): Promise<AIEmbeddingResponse>;
}

export function assertCapability(
  provider: Pick<AIProvider, "id" | "capabilities">,
  capability: AICapability,
): void {
  if (!provider.capabilities.has(capability)) {
    throw new AIProviderError(
      "invalid_request",
      `AI provider ${provider.id} does not support ${capability}`,
    );
  }
}

export function normalizeAIProviderError(error: unknown): AIProviderError {
  if (error instanceof AIProviderError) return error;
  if (error instanceof DOMException && error.name === "AbortError") {
    return new AIProviderError("cancelled", "AI request was cancelled", {
      cause: error,
    });
  }
  if (error instanceof Error) {
    return new AIProviderError("unknown", "AI provider request failed", {
      cause: error,
    });
  }
  return new AIProviderError("unknown", "AI provider request failed", {
    cause: error,
  });
}
