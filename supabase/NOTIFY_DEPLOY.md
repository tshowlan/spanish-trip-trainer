# Deploying the Tripfluent notification engine

This **replaces** the existing `send-reminders` function (which still sends the
old streak copy). The app already syncs the score snapshot the new function
reads (`players.progress.notif`), so this is purely server-side.

Project: **`ijrpogqxbcacvcasdzco`** · function URL once deployed:
`https://ijrpogqxbcacvcasdzco.functions.supabase.co/notify`

Files:
- `notify.sql` — `notif_log` table + `notif_recipients()` / `notif_mark_sent()` RPCs
- `functions/notify/index.ts` — the engine (schema-agnostic; only calls those RPCs)

Secrets are **already set** for `send-reminders` and are reused as-is:
`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `VAPID_PUBLIC`, `VAPID_PRIVATE`,
`CRON_SECRET`. Nothing new to set.

---

## 1. Create the DB objects

Supabase → **SQL Editor** → paste `notify.sql` → run. It's already matched to
your `push_subs` schema. Only confirm the two `<<< CONFIRM` spots — that your
`players` table has a `group_code` column and a `progress` jsonb column (the
ones `sync_player` writes). Verify:

```sql
select player_id, notif->>'readiness', notif->>'fadingTotal', jsonb_array_length(recent)
from notif_recipients();
```

You should see your push-enabled users with a non-null readiness once they've
opened the app on the new build (v46+, which syncs the snapshot).

## 2. Deploy the function

```bash
supabase link --project-ref ijrpogqxbcacvcasdzco
supabase functions deploy notify --no-verify-jwt
```

## 3. Point the cron at `notify` (and retire `send-reminders`)

You already have a ~15-min cron calling `send-reminders`. Repoint it — or add a
new schedule and drop the old one:

```sql
-- stop the old streak sender
select cron.unschedule('send-reminders');   -- use its real job name; see: select * from cron.job;

-- run the new engine every 15 min (matches the function's ±15-min delivery window)
select cron.schedule(
  'tripfluent-notify',
  '*/15 * * * *',
  $$ select net.http_post(
       url     := 'https://ijrpogqxbcacvcasdzco.functions.supabase.co/notify',
       headers := jsonb_build_object('x-cron-secret', current_setting('app.cron_secret', true))
     ); $$
);
```

If your old cron passed `CRON_SECRET` some other way (e.g. a hardcoded header or
a vault secret), mirror that here — the function rejects any call whose
`x-cron-secret` header doesn't match the `CRON_SECRET` secret.

## 4. Test

```bash
curl -X POST https://ijrpogqxbcacvcasdzco.functions.supabase.co/notify \
  -H "x-cron-secret: YOUR_CRON_SECRET"
# → {"ok":true,"considered":N,"sent":M}
```

`considered` = users whose local delivery time is within ±15 min of now; `sent` =
pushes delivered. To force yourself one: set your reminder time to the current
local time (Settings → Practice reminder), make sure your account has a synced
snapshot with a fading category or a 30/14/7-day countdown, then curl. Check
`select * from notif_log order by sent_at desc limit 5;` and
`supabase functions logs notify`.

---

## What it implements

Per §6: **countdown** (30/14/7 days, always), **pace** (≤1/week, only when
slipping), **retention** (≥8 fading, ≤3/week, ≥48h apart), a **neutral scheduled
reminder** (suppressed if you practiced that day), under the **traffic rules**
(one message/user/day, priority countdown→pace→retention, 9–21 quiet hours for
smart sends, nothing smart under 5 sessions), every message citing a real number.

**Deferred (marked TODO in code):** group pulse (needs the group-view rework,
migration §3) and day-of-week scheduling (uncomment `notify.sql` §4 + pass
`p_days` into `save_push`).

## Rollback

`select cron.unschedule('tripfluent-notify');` — the app keeps working, sends
just stop. (Re-schedule `send-reminders` if you want the old behavior back.)
