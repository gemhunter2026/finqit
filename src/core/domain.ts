export const FINQIT_DOMAINS = [
  "community",
  "inbox",
  "documents",
  "finance",
  "voting",
  "providers",
  "ai",
] as const;

export type FinqitDomain = (typeof FINQIT_DOMAINS)[number];

/** Every tenant-owned aggregate must carry its community boundary explicitly. */
export type CommunityId = string & { readonly __brand: "CommunityId" };

export interface TenantScopedEntity {
  readonly communityId: CommunityId;
}

/**
 * Repository ports live with domain code; infrastructure adapters implement them.
 * This keeps Supabase, local fixtures and future providers out of UI components.
 */
export interface Repository<TEntity extends TenantScopedEntity, TId extends string = string> {
  getById(communityId: CommunityId, id: TId): Promise<TEntity | null>;
  list(communityId: CommunityId): Promise<readonly TEntity[]>;
}

export interface MutableRepository<
  TEntity extends TenantScopedEntity,
  TId extends string = string,
> extends Repository<TEntity, TId> {
  save(communityId: CommunityId, entity: TEntity): Promise<TEntity>;
  remove(communityId: CommunityId, id: TId): Promise<void>;
}
