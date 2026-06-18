-- ============================================================================
--  Spanish Trip Trainer — group + sync backend
--  Paste this whole file into Supabase → SQL Editor → New query → Run.
--  Safe to re-run (idempotent).
--
--  Security model (no passwords):
--   * The `players` table has RLS ON with NO policies, so the public
--     (publishable) key CANNOT read or write it directly.
--   * All access goes through the SECURITY DEFINER functions below, which
--     require either a group code (to read a group) or the caller's own
--     secret (to write their row / restore on another device).
-- ============================================================================

create table if not exists public.players (
  player_id  uuid primary key,
  secret     text        not null,
  name       text        not null default 'Traveler',
  group_code text,
  xp         int         not null default 0,
  streak     int         not null default 0,
  stats      jsonb       not null default '{}'::jsonb,   -- { "Food & Drink": {correct,total}, ... }
  progress   jsonb       not null default '{}'::jsonb,   -- { lessons, profile, history } for device restore
  updated_at timestamptz not null default now()
);

create index if not exists players_group_idx on public.players (group_code);

alter table public.players enable row level security;
-- (intentionally no policies — direct table access is denied for anon)

-- Upsert my own record. Verifies the secret on existing rows.
create or replace function public.sync_player(
  p_id uuid, p_secret text, p_name text, p_group text,
  p_xp int, p_streak int, p_stats jsonb, p_progress jsonb
) returns json
language plpgsql security definer set search_path = public as $$
declare existing public.players;
begin
  select * into existing from public.players where player_id = p_id;
  if found then
    if existing.secret <> p_secret then
      raise exception 'bad secret';
    end if;
    update public.players set
      name       = coalesce(p_name, name),
      group_code = p_group,
      xp         = greatest(coalesce(p_xp, 0), 0),
      streak     = greatest(coalesce(p_streak, 0), 0),
      stats      = coalesce(p_stats, '{}'::jsonb),
      progress   = coalesce(p_progress, progress),
      updated_at = now()
    where player_id = p_id;
  else
    insert into public.players (player_id, secret, name, group_code, xp, streak, stats, progress)
    values (p_id, p_secret, coalesce(p_name, 'Traveler'), p_group,
            greatest(coalesce(p_xp,0),0), greatest(coalesce(p_streak,0),0),
            coalesce(p_stats, '{}'::jsonb), coalesce(p_progress, '{}'::jsonb));
  end if;
  return (select row_to_json(p) from
    (select name, group_code, xp, streak, stats, updated_at
       from public.players where player_id = p_id) p);
end; $$;

-- Read everyone in a group (the social comparison view).
create or replace function public.get_group(p_group text)
returns table (name text, xp int, streak int, stats jsonb, updated_at timestamptz)
language sql security definer set search_path = public as $$
  select name, xp, streak, stats, updated_at
  from public.players
  where p_group is not null and group_code = p_group
  order by xp desc, name asc;
$$;

-- Pull my own record onto a new device (verifies secret). Returns null if no match.
create or replace function public.get_player(p_id uuid, p_secret text)
returns json
language plpgsql security definer set search_path = public as $$
declare r public.players;
begin
  select * into r from public.players where player_id = p_id;
  if not found or r.secret <> p_secret then
    return null;
  end if;
  return (select row_to_json(x) from
    (select name, group_code, xp, streak, stats, progress from public.players where player_id = p_id) x);
end; $$;

-- Let the publishable (anon) key call these functions.
grant execute on function public.sync_player(uuid,text,text,text,int,int,jsonb,jsonb) to anon, authenticated;
grant execute on function public.get_group(text)            to anon, authenticated;
grant execute on function public.get_player(uuid,text)      to anon, authenticated;

-- Nudge PostgREST to refresh its schema cache so the functions are callable now.
notify pgrst, 'reload schema';
