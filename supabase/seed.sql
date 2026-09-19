-- DATA-003 local reset seed hook.
--
-- Keep this file deterministic and synthetic. Community demo fixtures are owned by
-- DEMO-001; until then an empty seed is intentional so `supabase db reset` has a
-- stable hook without inventing production-like personal data.
--
-- Do not add secrets, real email addresses, invitation plaintext tokens or other
-- personal data here.
select 1;
