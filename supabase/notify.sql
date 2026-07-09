-- =============================================================================
-- Tripfluent notifications — database objects (run once in the Supabase SQL editor)
--
-- Matched to your real schema (from functions/send-reminders): the push table is
-- `push_subs(player_id, endpoint, p256dh, auth, tz, morning, evening, enabled,
-- last_morning, last_evening)`, and the client score snapshot is synced by
-- sync_player into `players.progress -> 'notif'`.
--
-- The edge function is schema-agnostic — it only calls the two RPCs below.
-- If your `players` table names the group/progress columns differently, fix the
-- two spots marked  <<< CONFIRM  then run the whole file.
-- =============================================================================

-- 1) frequency-cap / one-voice-per-day ledger --------------------------------
create table if not exists notif_log (
  id         bigint generated always as identity primary key,
  player_id  text        not null,
  type       text        not null,     -- countdown_30 | countdown_14 | countdown_7 | pace | retention | group | reminder
  sent_at    timestamptz not null default now(),
  meta       jsonb       not null default '{}'::jsonb   -- e.g. { "projected": 74 } for pace-worsening checks
);
create index if not exists notif_log_player_time on notif_log (player_id, sent_at desc);

-- 2) roster the edge function consumes ---------------------------------------
-- One row per push-enabled recipient: their subscription, their live snapshot,
-- and the last ~8 days of notif_log (so the function enforces caps in code).
create or replace function notif_recipients()
returns table (
  player_id text, endpoint text, p256dh text, auth text, tz text,
  morning int, evening int, enabled boolean, name text, group_code text,
  notif jsonb, recent jsonb
)
language sql
security definer
set search_path = public
as $$
  select
    s.player_id::text, s.endpoint, s.p256dh, s.auth, s.tz,
    s.morning, s.evening, s.enabled,
    p.name,
    p.group_code,                                         -- <<< CONFIRM players' group column
    coalesce(p.progress -> 'notif', '{}'::jsonb) as notif, -- <<< CONFIRM players' progress column
    coalesce((
      select jsonb_agg(jsonb_build_object('type', l.type, 'sent_at', l.sent_at, 'meta', l.meta) order by l.sent_at desc)
      from notif_log l
      where l.player_id = s.player_id::text and l.sent_at > now() - interval '8 days'
    ), '[]'::jsonb) as recent
  from push_subs s
  join players p on p.id::text = s.player_id::text
  where s.enabled = true and s.endpoint is not null;
$$;

-- 3) record a send (called by the edge function after a successful push) ------
create or replace function notif_mark_sent(p_player text, p_type text, p_meta jsonb default '{}'::jsonb)
returns void
language sql
security definer
set search_path = public
as $$
  insert into notif_log (player_id, type, meta) values (p_player, p_type, coalesce(p_meta, '{}'::jsonb));
$$;

-- 4) OPTIONAL — day-of-week scheduling (§6.2). Uncomment, then have the client
--    pass p_days into save_push and gate delivery on the weekday in the function.
-- alter table push_subs add column if not exists days int[] default '{0,1,2,3,4,5,6}';
