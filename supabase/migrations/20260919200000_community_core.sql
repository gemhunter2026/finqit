-- DATA-002: community-first core schema.
-- Supabase supplies auth.users; this migration is safe for an empty Supabase database.

create extension if not exists pgcrypto;

create type public.community_role as enum ('owner', 'resident', 'board', 'manager');
create type public.vote_status as enum ('draft', 'open', 'closed', 'cancelled');
create type public.incident_status as enum ('open', 'in_progress', 'waiting_supplier', 'resolved', 'closed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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