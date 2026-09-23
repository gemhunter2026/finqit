# AI prompt and schema registry

AI prompts are application behavior, not UI copy. Every prompt must be registered with an explicit use case and immutable version. Structured-output validation belongs beside the prompt definition through `AIValidationSchema`.

## Change process

1. Add a new version instead of mutating an existing version once it is relied on by a workflow.
2. Keep the previous version available while evaluating the replacement.
3. Add deterministic fixtures/tests for lookup and schema success/failure behavior.
4. Record `AIPromptRunMetadata` with each AI run so the use case, prompt version and schema name are traceable.
5. Promote a new version in the calling workflow only after its tests/evaluation pass. Roll back by selecting the previous registered version.

Prompt definitions must not contain tenant secrets, credentials or user-specific data. Runtime user/community content is supplied separately to the provider and must continue to follow Finqit's privacy and authorization boundaries.
