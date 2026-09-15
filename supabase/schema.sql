-- Finqit.ai database blueprint
-- This file is intentionally NOT an applied migration yet.
-- Apply it only to a dedicated Finqit Supabase project after review.
-- All public tables use Row Level Security. Monetary values are stored in euro cents.

create extension if not exists pgcrypto;

create type public.listing_status as enum ('draft', 'verification', 'published', 'reserved', 'sold', 'withdrawn');
create type public.seller_type as enum ('private', 'agency');
create type public.reservation_status as enum ('pending', 'active', 'proceeding', 'declined', 'expired', 'cancelled_by_seller', 'completed');
create type public.queue_status as enum ('eligible', 'won', 'skipped', 'ineligible', 'expired');
create type public.community_role as enum ('owner', 'resident', 'board', 'manager');
create type public.vote_status as enum ('draft', 'open', 'closed', 'cancelled');
create type public.incident_status as enum ('open', 'in_progress', 'waiting_supplier', 'resolved', 'closed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  phone text,
  avatar_url text,
  identity_verified_at timestamptz,
  buyer_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.agencies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  legal_name text,
  tax_id text,
  website text,
  verified_at timestamptz,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.agency_members (
  agency_id uuid not null references public.agencies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'agent' check (role in ('owner', 'admin', 'agent')),
  created_at timestamptz not null default now(),
  primary key (agency_id, user_id)
);

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  seller_type public.seller_type not null,
  owner_user_id uuid references auth.users(id),
  agency_id uuid references public.agencies(id),
  title text not null,
  description text,
  address_line text,
  postal_code text,
  city text not null,
  province text,
  country_code text not null default 'ES',
  latitude numeric(9,6),
  longitude numeric(9,6),
  price_cents bigint not null check (price_cents > 0),
  bedrooms smallint check (bedrooms >= 0),
  bathrooms smallint check (bathrooms >= 0),
  built_area_m2 numeric(8,2) check (built_area_m2 > 0),
  usable_area_m2 numeric(8,2),
  floor text,
  orientation text,
  terrace boolean not null default false,
  lift boolean,
  parking boolean,
  energy_rating text,
  registry_reference text,
  cadastral_reference text,
  status public.listing_status not null default 'draft',
  verified_at timestamptz,
  instant_reserve_enabled boolean not null default false,
  reservation_amount_cents bigint check (reservation_amount_cents >= 0),
  option_premium_cents bigint check (option_premium_cents >= 0),
  reservation_window_hours integer not null default 72 check (reservation_window_hours between 1 and 336),
  published_at timestamptz,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint seller_source_check check (
    (seller_type = 'private' and owner_user_id is not null and agency_id is null)
    or
    (seller_type = 'agency' and agency_id is not null)
  ),
  constraint reserve_terms_check check (
    instant_reserve_enabled = false
    or (
      verified_at is not null
      and reservation_amount_cents is not null
      and option_premium_cents is not null
      and option_premium_cents <= reservation_amount_cents
    )
  )
);

create index properties_marketplace_idx on public.properties(status, city, price_cents, published_at desc);
create index properties_location_idx on public.properties(city, postal_code);
create index properties_agency_idx on public.properties(agency_id) where agency_id is not null;

create table public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index property_images_property_idx on public.property_images(property_id, sort_order);

create table public.listing_mandates (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null unique references public.properties(id) on delete cascade,
  owner_name text not null,
  mandate_reference text,
  signed_at timestamptz,
  verified_at timestamptz,
  expires_at timestamptz,
  document_storage_path text,
  created_at timestamptz not null default now()
);

create table public.buyer_agents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'My Finqit Agent',
  active boolean not null default false,
  city text,
  radius_km numeric(5,1),
  min_price_cents bigint,
  max_price_cents bigint,
  min_bedrooms smallint,
  min_area_m2 numeric(8,2),
  orientations text[] not null default '{}',
  terrace_required boolean not null default false,
  lift_required boolean not null default false,
  parking_required boolean not null default false,
  max_reservation_amount_cents bigint not null default 0 check (max_reservation_amount_cents >= 0),
  auto_reserve_authorized_at timestamptz,
  priority_eligible_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index buyer_agents_active_market_idx on public.buyer_agents(active, city, priority_eligible_at) where active = true;

create table public.reservation_queue_entries (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  buyer_agent_id uuid not null references public.buyer_agents(id) on delete cascade,
  buyer_id uuid not null references auth.users(id) on delete cascade,
  match_score numeric(5,2) not null check (match_score between 0 and 100),
  priority_eligible_at timestamptz not null,
  status public.queue_status not null default 'eligible',
  reason text,
  created_at timestamptz not null default now(),
  decided_at timestamptz,
  unique (property_id, buyer_agent_id)
);
create index reservation_queue_order_idx on public.reservation_queue_entries(property_id, status, priority_eligible_at, created_at);

create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id),
  buyer_id uuid not null references auth.users(id),
  buyer_agent_id uuid references public.buyer_agents(id),
  queue_entry_id uuid references public.reservation_queue_entries(id),
  status public.reservation_status not null default 'pending',
  reservation_amount_cents bigint not null check (reservation_amount_cents >= 0),
  option_premium_cents bigint not null check (option_premium_cents >= 0 and option_premium_cents <= reservation_amount_cents),
  refundable_amount_cents bigint generated always as (reservation_amount_cents - option_premium_cents) stored,
  terms_version text not null,
  accepted_at timestamptz,
  active_at timestamptz,
  expires_at timestamptz,
  visit_scheduled_at timestamptz,
  decided_at timestamptz,
  payment_provider_reference text,
  created_at timestamptz not null default now()
);

-- Database-level enforcement of the core fairness rule.
create unique index reservations_one_active_per_buyer
  on public.reservations(buyer_id)
  where status in ('pending', 'active', 'proceeding');

create unique index reservations_one_active_per_property
  on public.reservations(property_id)
  where status in ('pending', 'active', 'proceeding');

create index reservations_property_idx on public.reservations(property_id, created_at desc);
create index reservations_buyer_idx on public.reservations(buyer_id, created_at desc);

create table public.reservation_events (
  id bigint generated always as identity primary key,
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  event_type text not null,
  actor_user_id uuid references auth.users(id),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index reservation_events_reservation_idx on public.reservation_events(reservation_id, created_at);

create table public.communities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address_line text,
  city text,
  postal_code text,
  country_code text not null default 'ES',
  inbox_alias text unique,
  units_count integer check (units_count >= 0),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.community_members (
  community_id uuid not null references public.communities(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.community_role not null default 'resident',
  unit_label text,
  voting_weight numeric(10,6),
  verified_at timestamptz,
  joined_at timestamptz not null default now(),
  primary key (community_id, user_id)
);
create index community_members_user_idx on public.community_members(user_id, community_id);

create table public.community_messages (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  external_message_id text,
  thread_key text,
  sender_name text,
  sender_email text,
  subject text,
  body_text text,
  received_at timestamptz not null default now(),
  ai_summary text,
  ai_extracted jsonb not null default '{}'::jsonb,
  processing_status text not null default 'pending' check (processing_status in ('pending', 'processed', 'failed')),
  created_at timestamptz not null default now()
);
create index community_messages_inbox_idx on public.community_messages(community_id, received_at desc);

create table public.community_documents (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  source_message_id uuid references public.community_messages(id) on delete set null,
  category text,
  title text not null,
  storage_path text not null,
  mime_type text,
  document_date date,
  ai_summary text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index community_documents_idx on public.community_documents(community_id, category, document_date desc);

create table public.community_finance_entries (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  kind text not null check (kind in ('income', 'expense')),
  status text not null default 'pending' check (status in ('pending', 'paid', 'reconciled', 'cancelled')),
  supplier text,
  concept text not null,
  amount_cents bigint not null check (amount_cents >= 0),
  invoice_document_id uuid references public.community_documents(id) on delete set null,
  occurred_on date,
  reconciled_at timestamptz,
  created_at timestamptz not null default now()
);
create index community_finance_idx on public.community_finance_entries(community_id, occurred_on desc);

create table public.community_incidents (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  created_by uuid not null references auth.users(id),
  title text not null,
  description text,
  status public.incident_status not null default 'open',
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  supplier text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz
);
create index community_incidents_idx on public.community_incidents(community_id, status, created_at desc);

create table public.community_votes (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  created_by uuid not null references auth.users(id),
  title text not null,
  description text,
  status public.vote_status not null default 'draft',
  weighted boolean not null default false,
  opens_at timestamptz,
  closes_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.community_vote_options (
  id uuid primary key default gen_random_uuid(),
  vote_id uuid not null references public.community_votes(id) on delete cascade,
  label text not null,
  sort_order integer not null default 0
);

create table public.community_vote_responses (
  id uuid primary key default gen_random_uuid(),
  vote_id uuid not null references public.community_votes(id) on delete cascade,
  option_id uuid not null references public.community_vote_options(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  weight numeric(10,6) not null default 1,
  cast_at timestamptz not null default now(),
  unique(vote_id, user_id)
);

-- RLS -----------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.agencies enable row level security;
alter table public.agency_members enable row level security;
alter table public.properties enable row level security;
alter table public.property_images enable row level security;
alter table public.listing_mandates enable row level security;
alter table public.buyer_agents enable row level security;
alter table public.reservation_queue_entries enable row level security;
alter table public.reservations enable row level security;
alter table public.reservation_events enable row level security;
alter table public.communities enable row level security;
alter table public.community_members enable row level security;
alter table public.community_messages enable row level security;
alter table public.community_documents enable row level security;
alter table public.community_finance_entries enable row level security;
alter table public.community_incidents enable row level security;
alter table public.community_votes enable row level security;
alter table public.community_vote_options enable row level security;
alter table public.community_vote_responses enable row level security;

-- Profiles
create policy "profiles_select_self" on public.profiles for select to authenticated
using ((select auth.uid()) = id);
create policy "profiles_update_self" on public.profiles for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

-- Agency access
create policy "agencies_select_members" on public.agencies for select to authenticated
using (exists (
  select 1 from public.agency_members m
  where m.agency_id = agencies.id and m.user_id = (select auth.uid())
));
create policy "agency_members_select_self" on public.agency_members for select to authenticated
using (user_id = (select auth.uid()));

-- Marketplace: only published/reserved listings are public. Sellers can also see their own.
create policy "properties_public_read" on public.properties for select to anon, authenticated
using (
  status in ('published', 'reserved')
  or owner_user_id = (select auth.uid())
  or exists (
    select 1 from public.agency_members m
    where m.agency_id = properties.agency_id and m.user_id = (select auth.uid())
  )
);
create policy "properties_private_seller_insert" on public.properties for insert to authenticated
with check (seller_type = 'private' and owner_user_id = (select auth.uid()) and created_by = (select auth.uid()));
create policy "properties_private_seller_update" on public.properties for update to authenticated
using (owner_user_id = (select auth.uid()))
with check (owner_user_id = (select auth.uid()));

create policy "property_images_public_read" on public.property_images for select to anon, authenticated
using (exists (select 1 from public.properties p where p.id = property_images.property_id and p.status in ('published','reserved')));

-- Buyer-owned automation and queue state.
create policy "buyer_agents_owner_all" on public.buyer_agents for all to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));
create policy "queue_entries_buyer_read" on public.reservation_queue_entries for select to authenticated
using (buyer_id = (select auth.uid()));

-- Buyers can read their reservations. Sellers can read reservations for their listings.
create policy "reservations_participant_read" on public.reservations for select to authenticated
using (
  buyer_id = (select auth.uid())
  or exists (
    select 1 from public.properties p
    where p.id = reservations.property_id
      and (
        p.owner_user_id = (select auth.uid())
        or exists (
          select 1 from public.agency_members m
          where m.agency_id = p.agency_id and m.user_id = (select auth.uid())
        )
      )
  )
);
create policy "reservation_events_participant_read" on public.reservation_events for select to authenticated
using (exists (
  select 1 from public.reservations r
  where r.id = reservation_events.reservation_id
    and r.buyer_id = (select auth.uid())
));

-- Communities. A member may read their own membership row; that row then grants
-- access to the community-scoped tables below.
create policy "community_members_select_self" on public.community_members for select to authenticated
using (user_id = (select auth.uid()));
create policy "communities_member_read" on public.communities for select to authenticated
using (exists (
  select 1 from public.community_members m
  where m.community_id = communities.id and m.user_id = (select auth.uid())
));

create policy "community_messages_member_read" on public.community_messages for select to authenticated
using (exists (
  select 1 from public.community_members m
  where m.community_id = community_messages.community_id and m.user_id = (select auth.uid())
));
create policy "community_documents_member_read" on public.community_documents for select to authenticated
using (exists (
  select 1 from public.community_members m
  where m.community_id = community_documents.community_id and m.user_id = (select auth.uid())
));
create policy "community_finance_member_read" on public.community_finance_entries for select to authenticated
using (exists (
  select 1 from public.community_members m
  where m.community_id = community_finance_entries.community_id and m.user_id = (select auth.uid())
));
create policy "community_incidents_member_read" on public.community_incidents for select to authenticated
using (exists (
  select 1 from public.community_members m
  where m.community_id = community_incidents.community_id and m.user_id = (select auth.uid())
));
create policy "community_incidents_member_insert" on public.community_incidents for insert to authenticated
with check (
  created_by = (select auth.uid())
  and exists (
    select 1 from public.community_members m
    where m.community_id = community_incidents.community_id and m.user_id = (select auth.uid())
  )
);
create policy "community_votes_member_read" on public.community_votes for select to authenticated
using (exists (
  select 1 from public.community_members m
  where m.community_id = community_votes.community_id and m.user_id = (select auth.uid())
));
create policy "community_vote_options_member_read" on public.community_vote_options for select to authenticated
using (exists (
  select 1 from public.community_votes v
  join public.community_members m on m.community_id = v.community_id
  where v.id = community_vote_options.vote_id and m.user_id = (select auth.uid())
));
create policy "community_vote_responses_owner_read" on public.community_vote_responses for select to authenticated
using (user_id = (select auth.uid()));
create policy "community_vote_responses_owner_insert" on public.community_vote_responses for insert to authenticated
with check (
  user_id = (select auth.uid())
  and exists (
    select 1 from public.community_votes v
    join public.community_members m on m.community_id = v.community_id
    where v.id = community_vote_responses.vote_id
      and m.user_id = (select auth.uid())
      and v.status = 'open'
      and (v.opens_at is null or v.opens_at <= now())
      and (v.closes_at is null or v.closes_at > now())
  )
);

-- Explicit grants for Data API roles. RLS remains the authorization boundary.
grant select on public.properties, public.property_images to anon;
grant select, insert, update, delete on all tables in schema public to authenticated;

-- Sensitive/system-created records intentionally have no INSERT/UPDATE policies for normal
-- authenticated users. They should be written by trusted server-side workflows after validation:
-- listing_mandates, reservation_queue_entries, reservations, reservation_events,
-- community_messages, community_documents and reconciled finance records.
