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

-- DATA-002 correctly scoped unit references by (community_id, unit_id), but a plain
-- composite ON DELETE SET NULL attempts to null both columns. community_id is NOT NULL,
-- so deleting a unit would fail instead of preserving the membership/invitation and
-- clearing only its optional unit reference. Recreate both constraints with a column
-- list so tenant identity is immutable while unit_id alone is cleared.
alter table public.community_members drop constraint community_members_unit_tenant_fk;
alter table public.community_members add constraint community_members_unit_tenant_fk
  foreign key (community_id, unit_id) references public.community_units(community_id, id)
  on delete set null (unit_id);

alter table public.community_invitations drop constraint community_invitations_community_id_unit_id_fkey;
alter table public.community_invitations add constraint community_invitations_unit_tenant_fk
  foreign key (community_id, unit_id) references public.community_units(community_id, id)
  on delete set null (unit_id);

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
