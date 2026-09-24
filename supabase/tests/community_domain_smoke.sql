-- DATA-004 repeatable smoke checks. Run after `supabase db reset`.
-- Transaction rolls back so the suite is deterministic and leaves no fixtures.
begin;

insert into auth.users (id, aud, role, email)
values
  ('00000000-0000-4000-8000-000000000101', 'authenticated', 'authenticated', 'data004-owner@example.invalid'),
  ('00000000-0000-4000-8000-000000000102', 'authenticated', 'authenticated', 'data004-resident@example.invalid');

insert into public.communities (id, name, created_by)
values ('10000000-0000-4000-8000-000000000001', 'DATA-004 Smoke Community', '00000000-0000-4000-8000-000000000101');
insert into public.community_buildings (id, community_id, name)
values ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'Building A');
insert into public.community_units (id, community_id, building_id, label, floor, coefficient)
values ('30000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', '1A', '1', 0.125);
insert into public.community_members (community_id, user_id, role, status, unit_id)
values ('10000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000102', 'resident', 'active', '30000000-0000-4000-8000-000000000001');

update public.community_members set status = 'suspended'
where community_id = '10000000-0000-4000-8000-000000000001' and user_id = '00000000-0000-4000-8000-000000000102';

do $$
begin
  if not exists (select 1 from public.community_members where community_id = '10000000-0000-4000-8000-000000000001' and user_id = '00000000-0000-4000-8000-000000000102' and status = 'suspended' and unit_id = '30000000-0000-4000-8000-000000000001') then
    raise exception 'DATA-004 CRUD smoke check failed';
  end if;
end $$;

insert into public.communities (id, name, created_by)
values ('10000000-0000-4000-8000-000000000002', 'Other Community', '00000000-0000-4000-8000-000000000101');

do $$
begin
  begin
    insert into public.community_units (id, community_id, building_id, label)
    values ('30000000-0000-4000-8000-000000000099', '10000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001', 'BAD');
    raise exception 'DATA-004 tenant FK check failed: cross-community building reference was accepted';
  exception when foreign_key_violation then null;
  end;
end $$;

delete from public.community_units where id = '30000000-0000-4000-8000-000000000001';

do $$
begin
  if not exists (select 1 from public.community_members where community_id = '10000000-0000-4000-8000-000000000001' and user_id = '00000000-0000-4000-8000-000000000102' and unit_id is null) then
    raise exception 'DATA-004 unit delete behavior failed';
  end if;
end $$;

rollback;
