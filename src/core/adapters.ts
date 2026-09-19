import type { CommunityId, TenantScopedEntity } from "./domain";

export type StorageScope = "session" | "device";

/** Narrow storage port for provisional browser persistence. Domain code never imports localStorage directly. */
export interface KeyValueStore {
  readonly scope: StorageScope;
  read<T>(communityId: CommunityId, key: string): T | null;
  write<T>(communityId: CommunityId, key: string, value: T): void;
  remove(communityId: CommunityId, key: string): void;
}

/** Guard used by adapters before returning tenant-owned data. */
export function belongsToCommunity<TEntity extends TenantScopedEntity>(
  entity: TEntity,
  communityId: CommunityId,
): boolean {
  return entity.communityId === communityId;
}
