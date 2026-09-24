-- DATA-004: harden the community/building/unit/membership foundation.
-- Forward-only migration: DATA-002 introduced the base tables; this migration adds
-- lifecycle state, consistent timestamps and indexes required by tenant-scoped flows.

create type public.community_membership_status as enum ('invited', 'active', 'suspended', 'left');

alter table public.communities add column updated_at timestamptz not null default now();
alter table public.community_buildings add column updated_at timestamptz not null default now();
alter table public.community_units add column updated_at timestamptz not null default now();
alter table public.community_members
  add column status public.community_membership_status not null default 'active',
  add column updated_at timestamptz not null default now();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger communities_set_updated_at before update on public.communities for each row execute function public.set_updated_at();
create trigger community_buildings_set_updated_at before update on public.community_buildings for each row execute function public.set_updated_at();
create trigger community_units_set_updated_at before update on public.community_units for each row execute function public.set_updated_at();
create trigger community_members_set_updated_at before update on public.community_members for each row execute function public.set_updated_at();

create index community_members_tenant_status_idx on public.community_members (community_id, status, role, joined_at desc);
create index community_units_tenant_building_idx on public.community_units (community_id, building_id, label);

comment on column public.communities.units_count is 'Legacy compatibility field. Derive unit count from community_units for new code.';
comment on column public.community_members.unit_label is 'Legacy compatibility field. Use unit_id -> community_units.label for new code.';
