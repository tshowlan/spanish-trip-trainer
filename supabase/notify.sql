-- =============================================================================
-- Tripfluent notifications — database objects (run once in the Supabase SQL editor)
--
-- This is the ONLY file that touches your real schema. The edge function is
-- schema-agnostic: it just calls notif_recipients() and notif_mark_sent().
-- Adjust the two table/column names marked  <<< ADJUST  to match your project,
-- then run the whole file.
--
-- Assumed existing tables (from your sync_player / save_push RPCs):
--   players( id, name, group_code, progress jsonb )        -- progress->'notif' holds the client snapshot
--   push_subs( player_id, endpoint, p256dh, auth, tz, morning, evening, enabled )
-- If your push data lives on the players table instead, fold the columns in below.
-- =============================================================================

-- 1) frequency-cap / one-voice-per-day ledger --------------------------------
create table if not exists notif_log (
  id         bigint generated always as identity primary key,
  player_id  text        not null,
  type       text        not null,          -- 'countdown_30' | 'countdown_14' | 'countdown_7' | 'pace' | 'retention' | 'group' | 'reminder'
  sent_at    timestamptz not null default now(),
  meta       jsonb       not null default '{}'::jsonb   -- e.g. { "projected": 74 } for pace worsening checks
);
create index if not exists notif_log_player_time on notif_log (player_id, sent_at desc);

-- 2) roster the edge function consumes ---------------------------------------
-- Returns one row per push-enabled recipient, with their live snapshot and the
-- last ~8 days of notif_log (so the function can enforce caps in code).
create or replace function notif_recipients()
returns table (
  player_id  text,
  name       text,
  group_code text,
  endpoint   text,
  p256dh     text,
  auth       text,
  tz         text,
  morning    int,
  evening    int,
  enabled    boolean,
  notif      jsonb,
  recent     jsonb
)
language sql
security definer
set search_path = public
as $$
  select
    p.id::text                                as player_id,
    p.name                                    as name,
    p.group_code                              as group_code,        -- <<< ADJUST if your column differs
    s.endpoint, s.p256dh, s.auth, s.tz, s.morning, s.evening, s.enabled,
    coalesce(p.progress -> 'notif', '{}'::jsonb) as notif,           -- <<< ADJUST if the snapshot lives elsewhere
    coalesce((
      select jsonb_agg(jsonb_build_object('type', l.type, 'sent_at', l.sent_at, 'meta', l.meta) order by l.sent_at desc)
      from notif_log l
      where l.player_id = p.id::text and l.sent_at > now() - interval '8 days'
    ), '[]'::jsonb)                            as recent
  from push_subs s                             -- <<< ADJUST table name if different
  join players  p on p.id::text = s.player_id::text
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

-- 4) OPTIONAL — add a day-of-week schedule to push_subs so §6.2 day selection
--    can take effect. Client would pass p_days (0=Sun..6=Sat) into save_push.
-- alter table push_subs add column if not exists days int[] default '{0,1,2,3,4,5,6}';
