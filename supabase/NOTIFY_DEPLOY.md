# Deploying the Tripfluent notification engine

This is the server half of §6 (the app already syncs the score snapshot the
function reads). Three files:

- `notify.sql` — DB objects (the only place your real schema is referenced)
- `functions/notify/index.ts` — the hourly edge function (schema-agnostic)
- this guide

You need: the Supabase CLI (`npm i -g supabase`), your project ref, and your
existing VAPID key pair (the same one the current morning/evening sender uses —
the public key is in the app's `config.js`; the private key is already a secret
in your project).

---

## 1. Create the DB objects

Open **Supabase → SQL Editor**, paste `notify.sql`, and **before running** fix
the three `<<< ADJUST` spots to match your actual tables/columns:

- the push-subscription table name (assumed `push_subs`) and its columns
  (`endpoint, p256dh, auth, tz, morning, evening, enabled, player_id`);
- the `players` table's group column (assumed `group_code`);
- where the client snapshot lives (assumed `players.progress -> 'notif'`).

Not sure of the names? Run `select table_name from information_schema.tables
where table_schema='public';` and inspect the table your `save_push` RPC writes
to. Then run the file. Sanity check: `select player_id, notif->>'readiness',
jsonb_array_length(recent) from notif_recipients();` should return your
push-enabled users with their snapshot.

## 2. Deploy the function

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# secrets (SUPABASE_URL + service-role are injected automatically at runtime,
# but set them explicitly if your project doesn't; VAPID_* you must set)
supabase secrets set VAPID_PUBLIC="BEYdbCF7...(your public key)"
supabase secrets set VAPID_PRIVATE="(your private key)"
supabase secrets set VAPID_SUBJECT="mailto:you@yourdomain.com"

supabase functions deploy notify --no-verify-jwt
```

`--no-verify-jwt` because the cron calls it machine-to-machine, not a logged-in
user. The function uses the service-role key internally to read all recipients.

## 3. Schedule it hourly

In the SQL editor (needs the `pg_cron` + `pg_net` extensions, both available on
Supabase — enable under **Database → Extensions**):

```sql
select cron.schedule(
  'tripfluent-notify-hourly',
  '0 * * * *',                                   -- top of every hour
  $$ select net.http_post(
       url    := 'https://YOUR_PROJECT_REF.functions.supabase.co/notify',
       headers := jsonb_build_object('Authorization', 'Bearer ' || 'YOUR_ANON_OR_SERVICE_KEY')
     ); $$
);
```

Why hourly: each user is evaluated once/day, at the top of their local delivery
hour (their reminder time, or 18:00 local if they haven't set one), so the job
must wake every hour to catch every timezone. The function itself enforces one
message per user per day.

## 4. Test

- **Dry run now:** `curl -X POST https://YOUR_PROJECT_REF.functions.supabase.co/notify`
  → returns `{ ok, considered, sent }`. `considered` counts users whose local
  delivery hour is *right now*; `sent` counts pushes actually delivered.
- **Force yourself a send:** temporarily make `isDeliveryHour` return `true` (or
  set your reminder time to the current local hour), ensure your account has a
  synced snapshot (`notif->>'readiness'` non-null) and ≥1 fading category or a
  trip countdown, then curl it. Check `select * from notif_log order by sent_at
  desc limit 5;`.
- **Watch logs:** `supabase functions logs notify`.

---

## What this implements (and what it doesn't)

Implemented per spec: **countdown** (30/14/7 days, fires regardless), **pace**
(≤1/week, only when slipping), **retention** (≥8 fading, ≤3/week, ≥48h apart),
**user-scheduled neutral reminder** (suppressed if you practiced that day), the
**traffic rules** (one voice/day, priority countdown→pace→retention, 9–21 quiet
hours for smart sends, no smart sends under 5 sessions), and the **governing
principle** (every message cites a real number/count).

Not yet implemented (flagged in code): **group pulse** — needs a cross-player
query that depends on the group-view rework (migration spec §3); the hook is
marked `// GROUP pulse — TODO`. And **day-of-week** scheduling — uncomment the
`days` column in `notify.sql` §4, have the client pass `p_days` into `save_push`,
and gate delivery on `local.weekday ∈ days`.

## Turning it off

`select cron.unschedule('tripfluent-notify-hourly');` — the app keeps working;
it just stops sending. No client change needed.
