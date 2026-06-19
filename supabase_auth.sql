-- ============================================================================
--  Spanish Trip Trainer — accounts (email + password)
--  Paste into Supabase → SQL Editor → New query → Run. Safe to re-run.
--
--  This adds a private "vault": for each logged-in user it stores the device
--  identity (player_id + secret) created by the app. Logging in on a new
--  device reads the vault, then restores full progress via get_player().
--  RLS ensures a user can only ever touch their OWN vault row.
-- ============================================================================

create table if not exists public.vault (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  player_id  uuid        not null,
  secret     text        not null,
  updated_at timestamptz not null default now()
);

alter table public.vault enable row level security;

drop policy if exists vault_select_own on public.vault;
drop policy if exists vault_insert_own on public.vault;
drop policy if exists vault_update_own on public.vault;

create policy vault_select_own on public.vault
  for select to authenticated using (user_id = auth.uid());
create policy vault_insert_own on public.vault
  for insert to authenticated with check (user_id = auth.uid());
create policy vault_update_own on public.vault
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

grant select, insert, update, delete on public.vault to authenticated;

notify pgrst, 'reload schema';
