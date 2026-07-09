// =============================================================================
// Tripfluent notification engine — Supabase Edge Function (Deno)
//
// Replaces the old `send-reminders` function. Invoked every ~15 min by pg_cron.
// For each push-enabled recipient it evaluates the §6.1 triggers against the
// score snapshot the app syncs to players.progress.notif, applies the §6.3
// traffic rules (one voice/day, priority, caps, quiet hours, delivery slot),
// and sends at most one web-push.
//
// Governing principle (§6): every notification cites a real number/count/name.
// If nothing is citable, stay silent. No streaks, no guilt, no escalation.
//
// Secrets (already set for send-reminders; reuse them):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, VAPID_PUBLIC, VAPID_PRIVATE, CRON_SECRET
// Deploy:  supabase functions deploy notify --no-verify-jwt
// =============================================================================
import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2";

const CRON_SECRET = Deno.env.get("CRON_SECRET")!;
const WINDOW = 15;   // minutes; match the cron interval
webpush.setVapidDetails("mailto:tshowlan@gmail.com", Deno.env.get("VAPID_PUBLIC")!, Deno.env.get("VAPID_PRIVATE")!);
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

const HOUR = 36e5, DAY = 864e5;

// minutes-of-day + hour + YYYY-MM-DD for an IANA timezone
function local(tz: string, when = new Date()) {
  let z = "Europe/Madrid";
  try { new Intl.DateTimeFormat("en-CA", { timeZone: tz }); z = tz; } catch { /* bad tz */ }
  const f = new Intl.DateTimeFormat("en-CA", { timeZone: z, hour12: false, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  const p: Record<string, string> = {};
  for (const x of f.formatToParts(when)) p[x.type] = x.value;
  const hour = +p.hour % 24;
  return { minutes: hour * 60 + (+p.minute), hour, ymd: `${p.year}-${p.month}-${p.day}` };
}
const band = (r: number) => r >= 85 ? "Fluent for your trip" : r >= 65 ? "On track" : r >= 40 ? "Building" : "Getting started";
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const dest = (n: any) => n.destination ? cap(String(n.destination)) : "your trip";

type LogRow = { type: string; sent_at: string; meta: any };
const lastOf = (recent: LogRow[], type: string) => recent.find(r => r.type === type)?.sent_at ?? null;
const hoursSince = (iso: string | null) => iso == null ? Infinity : (Date.now() - Date.parse(iso)) / HOUR;
const countSince = (recent: LogRow[], type: string, days: number) =>
  recent.filter(r => r.type === type && Date.now() - Date.parse(r.sent_at) < days * DAY).length;

// the decision (§6.1 triggers, §6.3 priority countdown > pace > retention > group)
function decide(sub: any, tz: string, now: { minutes: number; hour: number; ymd: string }) {
  const n = sub.notif || {};
  if (n.readiness == null) return null;                          // no snapshot yet
  const recent: LogRow[] = sub.recent || [];

  // one voice per day (§6.3)
  if (recent.some(r => local(tz, new Date(r.sent_at)).ymd === now.ymd)) return null;

  // COUNTDOWN — 30/14/7 days out, fires regardless of behavior
  for (const m of [30, 14, 7]) {
    if (n.daysOut === m && !lastOf(recent, `countdown_${m}`)) {
      return { type: `countdown_${m}`, body: `${m === 7 ? "One week" : m + " days"} to ${dest(n)} — ${n.readiness}%, ${band(n.readiness)}.` };
    }
  }

  const cold = (n.lifetimeSessions ?? 0) < 5;                    // §6.3: no smart sends for new users
  if (!cold && now.hour >= 9 && now.hour < 21) {                // smart sends only in quiet-hour window
    // PACE — trip set, projected below target, worsened since last pace notif. Max 1/week.
    const pace = n.pace;
    if (pace && pace.projected < (pace.target ?? 90) && hoursSince(lastOf(recent, "pace")) >= 7 * 24) {
      const prev = recent.find(r => r.type === "pace")?.meta?.projected;
      if (prev == null || pace.projected <= prev) {             // only when slipping, never when improving
        const lever = pace.addSessions > 0 ? ` ${pace.addSessions} session${pace.addSessions === 1 ? "" : "s"} this week puts ${pace.target}% back in reach.` : "";
        return { type: "pace", body: `${n.daysOut} days to ${dest(n)} — you're pacing to ${pace.projected}%.${lever}`, meta: { projected: pace.projected } };
      }
    }
    // RETENTION (workhorse) — ≥8 fading. Max 3/week, min 48h apart.
    if ((n.fadingTotal ?? 0) >= 8 && hoursSince(lastOf(recent, "retention")) >= 48 && countSince(recent, "retention", 7) < 3) {
      const top = Object.entries(n.fadingByCategory || {}).sort((a: any, b: any) => b[1] - a[1])[0];
      if (top) return { type: "retention", body: `${top[1]} ${String(top[0]).toLowerCase()} phrases are fading — a 5-minute review restores them.` };
    }
    // GROUP pulse — TODO: needs a cross-player group query (migration spec §3). Max 1/week.
  }

  // USER-SCHEDULED reminder — neutral fallback at the chosen slot; suppressed if practiced today (§6.2)
  if (sub.enabled) {
    const doneToday = n.lastSession && local(tz, new Date(n.lastSession)).ymd === now.ymd;
    if (!doneToday) return { type: "reminder", body: `A few minutes now keeps your ${dest(n)} phrases fresh — you're at ${n.readiness}%.` };
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.headers.get("x-cron-secret") !== CRON_SECRET) return new Response("forbidden", { status: 401 });

  const { data: subs, error } = await db.rpc("notif_recipients");
  if (error) return new Response(error.message, { status: 500 });

  let sent = 0, considered = 0;
  for (const sub of subs ?? []) {
    const tz = sub.tz || "Europe/Madrid";
    const now = local(tz);
    // deliver at the user's chosen reminder time, else a default 18:00 local
    const slot = sub.enabled && sub.morning != null ? sub.morning : 18 * 60;
    if (Math.abs(now.minutes - slot) >= WINDOW) continue;
    considered++;
    const msg = decide(sub, tz, now);
    if (!msg) continue;
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify({ title: "Tripfluent", body: msg.body }),
      );
      await db.rpc("notif_mark_sent", { p_player: sub.player_id, p_type: msg.type, p_meta: msg.meta ?? {} });
      sent++;
    } catch (e: any) {
      if (e?.statusCode === 404 || e?.statusCode === 410) await db.from("push_subs").delete().eq("player_id", sub.player_id);
      else console.error("push failed", sub.player_id, String(e));
    }
  }
  return new Response(JSON.stringify({ ok: true, considered, sent }), { headers: { "Content-Type": "application/json" } });
});
