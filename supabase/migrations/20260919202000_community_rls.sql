-- DATA-002: tenant boundary policies. New community tables are not API-readable before this migration.

create or replace function public.is_community_member(target_community_id uuid)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.community_members m where m.community_id = target_community_id and m.user_id = auth.uid()) $$;

create or replace function public.can_manage_community(target_community_id uuid)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.community_members m where m.community_id = target_community_id and m.user_id = auth.uid() and m.role in ('owner','board','manager')) $$;

revoke all on function public.is_community_member(uuid) from public;
revoke all on function public.can_manage_community(uuid) from public;
grant execute on function public.is_community_member(uuid) to authenticated;
grant execute on function public.can_manage_community(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.communities enable row level security;
alter table public.community_members enable row level security;
alter table public.community_messages enable row level security;
alter table public.community_documents enable row level security;
alter table public.community_finance_entries enable row level security;
alter table public.community_incidents enable row level security;
alter table public.community_votes enable row level security;
alter table public.community_vote_options enable row level security;
alter table public.community_vote_responses enable row level security;
alter table public.community_buildings enable row level security;
alter table public.community_units enable row level security;
alter table public.community_invitations enable row level security;
alter table public.community_providers enable row level security;
alter table public.community_meetings enable row level security;
alter table public.community_audit_events enable row level security;

create policy profiles_self_read on public.profiles for select to authenticated using (id = auth.uid());
create policy profiles_self_update on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy communities_member_read on public.communities for select to authenticated using (public.is_community_member(id));
create policy members_member_read on public.community_members for select to authenticated using (public.is_community_member(community_id));

create policy messages_member_read on public.community_messages for select to authenticated using (public.is_community_member(community_id));
create policy documents_member_read on public.community_documents for select to authenticated using (public.is_community_member(community_id));
create policy finance_member_read on public.community_finance_entries for select to authenticated using (public.is_community_member(community_id));
create policy incidents_member_read on public.community_incidents for select to authenticated using (public.is_community_member(community_id));
create policy votes_member_read on public.community_votes for select to authenticated using (public.is_community_member(community_id));
create policy vote_options_member_read on public.community_vote_options for select to authenticated using (exists (select 1 from public.community_votes v where v.id = vote_id and public.is_community_member(v.community_id)));
create policy vote_responses_member_read on public.community_vote_responses for select to authenticated using (exists (select 1 from public.community_votes v where v.id = vote_id and public.is_community_member(v.community_id)));
create policy buildings_member_read on public.community_buildings for select to authenticated using (public.is_community_member(community_id));
create policy units_member_read on public.community_units for select to authenticated using (public.is_community_member(community_id));
create policy providers_member_read on public.community_providers for select to authenticated using (public.is_community_member(community_id));
create policy meetings_member_read on public.community_meetings for select to authenticated using (public.is_community_member(community_id));

-- Sensitive administration is intentionally narrower than ordinary member reads.
create policy invitations_manager_read on public.community_invitations for select to authenticated using (public.can_manage_community(community_id));
create policy invitations_manager_insert on public.community_invitations for insert to authenticated with check (public.can_manage_community(community_id) and invited_by = auth.uid());
create policy invitations_manager_update on public.community_invitations for update to authenticated using (public.can_manage_community(community_id)) with check (public.can_manage_community(community_id));
create policy providers_manager_write on public.community_providers for all to authenticated using (public.can_manage_community(community_id)) with check (public.can_manage_community(community_id));
create policy meetings_manager_write on public.community_meetings for all to authenticated using (public.can_manage_community(community_id)) with check (public.can_manage_community(community_id));
create policy buildings_manager_write on public.community_buildings for all to authenticated using (public.can_manage_community(community_id)) with check (public.can_manage_community(community_id));
create policy units_manager_write on public.community_units for all to authenticated using (public.can_manage_community(community_id)) with check (public.can_manage_community(community_id));

-- Audit events have no client write policy. Managers may inspect their tenant's trail.
create policy audit_manager_read on public.community_audit_events for select to authenticated using (public.can_manage_community(community_id));