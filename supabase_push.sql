-- ============================================================================
--  Spanish Trip Trainer — push reminders
--  Paste into Supabase → SQL Editor → New query → Run. Safe to re-run.
--
--  Stores one push subscription per device (player), plus the morning/evening
--  reminder times. The scheduled edge function reads this with the service
--  role and sends the notifications. Direct access is denied (RLS, no policies);
--  the app writes via save_push(), gated by the device secret.
-- ============================================================================

create table if not exists public.push_subs (
  player_id    uuid primary key,
  endpoint     text not null,
  p256dh       text not null,
  auth         text not null,
  tz           text not null default 'Europe/Madrid',
  morning      int,                       -- minutes-of-day in local tz; null = off
  evening      int,
  enabled      boolean not null default true,
  last_morning date,
  last_evening date,
  updated_at   timestamptz not null default now()
);

alter table public.push_subs enable row level security;
-- (no policies — only the SECURITY DEFINER function and the service role touch it)

create or replace function public.save_push(
  p_id uuid, p_secret text, p_endpoint text, p_p256dh text, p_auth text,
  p_tz text, p_morning int, p_evening int, p_enabled boolean
) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.players where player_id = p_id and secret = p_secret) then
    raise exception 'bad secret';
  end if;
  insert into public.push_subs (player_id, endpoint, p256dh, auth, tz, morning, evening, enabled)
  values (p_id, p_endpoint, p_p256dh, p_auth, p_tz, p_morning, p_evening, p_enabled)
  on conflict (player_id) do update set
    endpoint = excluded.endpoint, p256dh = excluded.p256dh, auth = excluded.auth,
    tz = excluded.tz, morning = excluded.morning, evening = excluded.evening,
    enabled = excluded.enabled, updated_at = now();
end; $$;

grant execute on function public.save_push(uuid,text,text,text,text,text,int,int,boolean) to anon, authenticated;

notify pgrst, 'reload schema';
