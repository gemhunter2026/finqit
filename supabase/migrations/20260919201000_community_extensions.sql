-- DATA-002: additive community model extensions from DATA-001.

create type public.community_invitation_status as enum ('pending', 'accepted', 'revoked', 'expired');
create type public.community_provider_status as enum ('candidate', 'active', 'inactive', 'archived');
create type public.community_meeting_status as enum ('draft', 'scheduled', 'completed', 'cancelled');
create type public.community_message_direction as enum ('inbound', 'outbound');

create table public.community_buildings (
  id uuid primary key default gen_random_uuid(), community_id uuid not null references public.communities(id) on delete cascade,
  name text not null, address_line text, sort_order integer not null default 0, created_at timestamptz not null default now(),
  unique (community_id, name), unique (community_id, id)
);
create index community_buildings_tenant_idx on public.community_buildings(community_id, sort_order, name);

create table public.community_units (
  id uuid primary key default gen_random_uuid(), community_id uuid not null references public.communities(id) on delete cascade,
  building_id uuid, label text not null, floor text, coefficient numeric(12,8) check (coefficient is null or coefficient >= 0),
  created_at timestamptz not null default now(), unique (community_id, label), unique (community_id, id),
  foreign key (community_id, building_id) references public.community_buildings(community_id, id) on delete set null
);
create index community_units_tenant_idx on public.community_units(community_id, building_id, label);

alter table public.community_members add column unit_id uuid;
alter table public.community_members add constraint community_members_unit_tenant_fk
  foreign key (community_id, unit_id) references public.community_units(community_id, id) on delete set null;
create index community_members_unit_idx on public.community_members(community_id, unit_id) where unit_id is not null;

create table public.community_invitations (
  id uuid primary key default gen_random_uuid(), community_id uuid not null references public.communities(id) on delete cascade,
  email text not null, role public.community_role not null default 'resident', unit_id uuid, status public.community_invitation_status not null default 'pending',
  token_hash text not null unique, invited_by uuid not null references auth.users(id), expires_at timestamptz not null,
  accepted_by uuid references auth.users(id), accepted_at timestamptz, created_at timestamptz not null default now(),
  check (expires_at > created_at), foreign key (community_id, unit_id) references public.community_units(community_id, id) on delete set null
);
create unique index community_invitations_pending_email_idx on public.community_invitations(community_id, lower(email)) where status = 'pending';

create table public.community_providers (
  id uuid primary key default gen_random_uuid(), community_id uuid not null references public.communities(id) on delete cascade,
  name text not null, category text, status public.community_provider_status not null default 'candidate', email text, phone text, website text,
  tax_id text, notes text, created_by uuid not null references auth.users(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (community_id, id)
);
create index community_providers_tenant_idx on public.community_providers(community_id, status, name);
alter table public.community_finance_entries add column provider_id uuid;
alter table public.community_finance_entries add constraint community_finance_provider_tenant_fk
  foreign key (community_id, provider_id) references public.community_providers(community_id, id) on delete set null;
alter table public.community_incidents add column provider_id uuid;
alter table public.community_incidents add constraint community_incidents_provider_tenant_fk
  foreign key (community_id, provider_id) references public.community_providers(community_id, id) on delete set null;

create table public.community_meetings (
  id uuid primary key default gen_random_uuid(), community_id uuid not null references public.communities(id) on delete cascade,
  title text not null, status public.community_meeting_status not null default 'draft', scheduled_at timestamptz, location text,
  agenda jsonb not null default '[]'::jsonb, minutes_document_id uuid references public.community_documents(id) on delete set null,
  created_by uuid not null references auth.users(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now(), completed_at timestamptz
);
create index community_meetings_tenant_idx on public.community_meetings(community_id, scheduled_at desc);

alter table public.community_messages
  add column direction public.community_message_direction not null default 'inbound', add column recipient_emails text[] not null default '{}',
  add column cc_emails text[] not null default '{}', add column reply_to_message_id uuid references public.community_messages(id) on delete set null,
  add column sent_at timestamptz, add column provider_name text, add column provider_thread_id text,
  add column headers jsonb not null default '{}'::jsonb, add column last_processing_error text;
create unique index community_messages_external_id_idx on public.community_messages(community_id, provider_name, external_message_id) where external_message_id is not null;
create index community_messages_thread_idx on public.community_messages(community_id, provider_thread_id, received_at desc) where provider_thread_id is not null;

create table public.community_audit_events (
  id bigint generated always as identity primary key, community_id uuid not null references public.communities(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null, action text not null, entity_type text not null, entity_id text,
  payload jsonb not null default '{}'::jsonb, occurred_at timestamptz not null default now()
);
create index community_audit_events_tenant_idx on public.community_audit_events(community_id, occurred_at desc);