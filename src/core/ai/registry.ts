export interface AIValidationSchema<T> {
  readonly name: string;
  readonly validate: (value: unknown) => T;
}

export interface AIPromptDefinition<T = unknown> {
  readonly useCase: string;
  readonly version: string;
  readonly systemPrompt: string;
  readonly schema?: AIValidationSchema<T>;
}

export interface AIPromptRunMetadata {
  readonly useCase: string;
  readonly promptVersion: string;
  readonly schemaName?: string;
}

export class AIPromptRegistry {
  private readonly definitions = new Map<string, ReadonlyMap<string, AIPromptDefinition>>();

  constructor(definitions: readonly AIPromptDefinition[] = []) {
    for (const definition of definitions) this.register(definition);
  }

  register(definition: AIPromptDefinition): void {
    const useCase = definition.useCase.trim();
    const version = definition.version.trim();
    const systemPrompt = definition.systemPrompt.trim();
    if (!useCase || !version || !systemPrompt) {
      throw new Error("AI prompt useCase, version and systemPrompt are required");
    }

    const versions = new Map(this.definitions.get(useCase) ?? []);
    if (versions.has(version)) {
      throw new Error(`AI prompt ${useCase}@${version} is already registered`);
    }
    versions.set(version, Object.freeze({ ...definition, useCase, version, systemPrompt }));
    this.definitions.set(useCase, versions);
  }

  get(useCase: string, version: string): AIPromptDefinition {
    const definition = this.definitions.get(useCase)?.get(version);
    if (!definition) throw new Error(`Unknown AI prompt ${useCase}@${version}`);
    return definition;
  }

  metadata(useCase: string, version: string): AIPromptRunMetadata {
    const definition = this.get(useCase, version);
    return Object.freeze({
      useCase: definition.useCase,
      promptVersion: definition.version,
      schemaName: definition.schema?.name,
    });
  }

  versions(useCase: string): readonly string[] {
    return Object.freeze([...(this.definitions.get(useCase)?.keys() ?? [])]);
  }
}

export function defineSchema<T>(name: string, validate: (value: unknown) => T): AIValidationSchema<T> {
  const normalizedName = name.trim();
  if (!normalizedName) throw new Error("AI schema name is required");
  return Object.freeze({ name: normalizedName, validate });
}
