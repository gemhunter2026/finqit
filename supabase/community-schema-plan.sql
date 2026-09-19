-- DATA-001: Finqit community-first target schema plan
--
-- REVIEW-ONLY / NON-DESTRUCTIVE.
-- This file documents additive target structures for versioned migrations.
-- It is intentionally not applied to any hosted Supabase project.
-- Existing marketplace tables in supabase/schema.sql remain dormant and are
-- not removed by this plan.
--
-- Tenant boundary: every community-owned row is anchored to community_id
-- directly, or to a parent whose ownership resolves to a community. Future
-- migrations must enable RLS before exposing these tables through the API.

-- Existing blueprint inventory retained from supabase/schema.sql
-- Community MVP already represented:
--   profiles, communities, community_members, community_messages,
--   community_documents, community_finance_entries, community_incidents,
--   community_votes, community_vote_options, community_vote_responses.
-- Marketplace-only structures retained but dormant:
--   agencies, agency_members, properties, property_images, listing_mandates,
--   buyer_agents, reservation_queue_entries, reservations, reservation_events.
--
-- Gaps addressed below:
--   buildings/units, invitations, providers, meetings, audit events and richer
--   inbox metadata. The definitions are deliberately additive so they can be
--   split into ordered migrations after local Supabase tooling is available.

create type public.community_invitation_status as enum (
  'pending', 'accepted', 'revoked', 'expired'
);

create type public.community_provider_status as enum (
  'candidate', 'active', 'inactive', 'archived'
);

create type public.community_meeting_status as enum (
  'draft', 'scheduled', 'completed', 'cancelled'
);

create type public.community_message_direction as enum ('inbound', 'outbound');

create table public.community_buildings (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  name text not null,
  address_line text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (community_id, name)
);
create index community_buildings_tenant_idx
  on public.community_buildings(community_id, sort_order, name);

create table public.community_units (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  building_id uuid references public.community_buildings(id) on delete set null,
  label text not null,
  floor text,
  coefficient numeric(12,8) check (coefficient is null or coefficient >= 0),
  created_at timestamptz not null default now(),
  unique (community_id, label)
);
create index community_units_tenant_idx
  on public.community_units(community_id, building_id, label);

-- Replaces free-text community_members.unit_label once data is migrated.
-- Keep unit_label temporarily during migration for backwards compatibility.
alter table public.community_members
  add column unit_id uuid references public.community_units(id) on delete set null;
create index community_members_unit_idx
  on public.community_members(community_id, unit_id)
  where unit_id is not null;

create table public.community_invitations (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  email text not null,
  role public.community_role not null default 'resident',
  unit_id uuid references public.community_units(id) on delete set null,
  status public.community_invitation_status not null default 'pending',
  token_hash text not null unique,
  invited_by uuid not null references auth.users(id),
  expires_at timestamptz not null,
  accepted_by uuid references auth.users(id),
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  check (expires_at > created_at)
);
create unique index community_invitations_pending_email_idx
  on public.community_invitations(community_id, lower(email))
  where status = 'pending';

create table public.community_providers (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  name text not null,
  category text,
  status public.community_provider_status not null default 'candidate',
  email text,
  phone text,
  website text,
  tax_id text,
  notes text,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index community_providers_tenant_idx
  on public.community_providers(community_id, status, name);

-- Finance/incidents should eventually reference a provider instead of relying
-- only on free-text supplier. Existing supplier remains during migration.
alter table public.community_finance_entries
  add column provider_id uuid references public.community_providers(id) on delete set null;
alter table public.community_incidents
  add column provider_id uuid references public.community_providers(id) on delete set null;

create table public.community_meetings (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  title text not null,
  status public.community_meeting_status not null default 'draft',
  scheduled_at timestamptz,
  location text,
  agenda jsonb not null default '[]'::jsonb,
  minutes_document_id uuid references public.community_documents(id) on delete set null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);
create index community_meetings_tenant_idx
  on public.community_meetings(community_id, scheduled_at desc);

-- Richer inbox metadata. Preserve the current body_text/AI fields while adding
-- deterministic threading, delivery and processing metadata needed by adapters.
alter table public.community_messages
  add column direction public.community_message_direction not null default 'inbound',
  add column recipient_emails text[] not null default '{}',
  add column cc_emails text[] not null default '{}',
  add column reply_to_message_id uuid references public.community_messages(id) on delete set null,
  add column sent_at timestamptz,
  add column provider_name text,
  add column provider_thread_id text,
  add column headers jsonb not null default '{}'::jsonb,
  add column last_processing_error text;
create unique index community_messages_external_id_idx
  on public.community_messages(community_id, provider_name, external_message_id)
  where external_message_id is not null;
create index community_messages_thread_idx
  on public.community_messages(community_id, provider_thread_id, received_at desc)
  where provider_thread_id is not null;

-- Append-only audit trail for security-sensitive/community-governance actions.
-- payload must never contain credentials, invitation plaintext tokens or raw
-- provider secrets. actor_user_id is nullable for trusted system actions.
create table public.community_audit_events (
  id bigint generated always as identity primary key,
  community_id uuid not null references public.communities(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  payload jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);
create index community_audit_events_tenant_idx
  on public.community_audit_events(community_id, occurred_at desc);

-- RLS migration checklist ----------------------------------------------------
-- The future executable migrations MUST:
-- 1. enable RLS on every new table above before API use;
-- 2. derive membership from (community_id, auth.uid()) rather than trusting
--    client-supplied role/community claims;
-- 3. restrict invitation creation/revocation, provider mutation, meeting
--    administration and audit reads to authorized community roles;
-- 4. prevent clients from inserting/updating audit events directly;
-- 5. validate that building_id/unit_id/provider_id references belong to the
--    same community as the owning row (trigger or composite-FK strategy);
-- 6. make invitation acceptance an atomic server-side operation using only a
--    hash of the bearer token at rest;
-- 7. keep marketplace policies/tables isolated and dormant until that
--    workstream is intentionally reactivated.

-- Migration sequencing ------------------------------------------------------
-- M1: enums + buildings + units + unit membership link
-- M2: invitations + secure acceptance RPC/transaction
-- M3: providers + finance/incident provider links
-- M4: meetings
-- M5: inbox metadata additions + indexes
-- M6: audit events + privileged write path
-- M7: RLS/policy regression tests for all community-owned structures
--
-- No destructive rename/drop is part of DATA-001. Free-text unit_label and
-- supplier fields remain until later migrations can backfill and verify data.
