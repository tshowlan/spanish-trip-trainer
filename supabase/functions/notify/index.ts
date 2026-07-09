// =============================================================================
// Tripfluent notification engine — Supabase Edge Function (Deno)
//
// Runs on a cron (hourly). For each push-enabled recipient it evaluates the
// §6.1 triggers against their synced score snapshot, applies the §6.3 traffic
// rules (one voice/day, priority, caps, quiet hours, delivery slot), and sends
// one web-push at most. All schema access is behind the notif_recipients() /
// notif_mark_sent() RPCs — this file never names your tables.
//
// Governing principle (§6): every notification cites a real number/count/name.
// If nothing is citable, stay silent. No streaks, no guilt, no escalation.
//
// Secrets required (supabase secrets set ...):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, VAPID_PUBLIC, VAPID_PRIVATE, VAPID_SUBJECT
// =============================================================================
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const VAPID_PUBLIC = Deno.env.get("VAPID_PUBLIC")!;
const VAPID_PRIVATE = Deno.env.get("VAPID_PRIVATE")!;
const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT") ?? "mailto:hello@tripfluent.app";

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);
const db = createClient(SUPABASE_URL, SERVICE_ROLE);

const HOUR = 36e5, DAY = 864e5;

// ---- helpers ----------------------------------------------------------------
function localParts(tz: string, now = new Date()) {
  // returns { hour, ymd } in the recipient's timezone
  const f = new Intl.DateTimeFormat("en-CA", { timeZone: tz || "UTC", hour12: false, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit" });
  const p: Record<string, string> = {};
  for (const part of f.formatToParts(now)) p[part.type] = part.value;
  return { hour: (p.hour === "24" ? 0 : parseInt(p.hour, 10)), ymd: `${p.year}-${p.month}-${p.day}` };
}
const band = (r: number) => r >= 85 ? "Fluent for your trip" : r >= 65 ? "On track" : r >= 40 ? "Building" : "Getting started";
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const dest = (n: any) => n.destination ? cap(String(n.destination)) : "your trip";

type LogRow = { type: string; sent_at: string; meta: any };
const lastOf = (recent: LogRow[], type: string) => recent.find(r => r.type === type)?.sent_at ?? null;
const hoursSince = (iso: string | null) => iso == null ? Infinity : (Date.now() - Date.parse(iso)) / HOUR;
const countSince = (recent: LogRow[], type: string, days: number) =>
  recent.filter(r => r.type === type && Date.now() - Date.parse(r.sent_at) < days * DAY).length;

// ---- the decision (§6.1 triggers, §6.3 priority) ----------------------------
// Returns { type, body, meta } or null. Priority: countdown > pace > retention > group.
function decide(rec: any, local: { hour: number; ymd: string }) {
  const n = rec.notif || {};
  if (!n.readiness && n.readiness !== 0) return null;              // no snapshot yet
  const recent: LogRow[] = rec.recent || [];

  // one voice per day (§6.3): if anything already went out today, stay silent
  const sentToday = recent.some(r => localParts(rec.tz, new Date(r.sent_at)).ymd === local.ymd);
  if (sentToday) return null;

  // COUNTDOWN — fixed 30/14/7 days out, fires regardless of behavior
  for (const m of [30, 14, 7]) {
    const key = `countdown_${m}`;
    if (n.daysOut === m && !lastOf(recent, key)) {
      const lead = m === 7 ? "One week" : `${m} days`;
      return { type: key, body: `${lead} to ${dest(n)} — ${n.readiness}%, ${band(n.readiness)}.` };
    }
  }

  const cold = (n.lifetimeSessions ?? 0) < 5;                     // §6.3: no smart sends for new users

  // SMART triggers only in quiet-hour window (§6.3) and only when not cold-starting
  const inWindow = local.hour >= 9 && local.hour < 21;
  if (!cold && inWindow) {
    // PACE — trip set, projected below target, worsened since last pace notif. Max 1/week.
    const pace = n.pace;
    if (pace && pace.projected < (pace.target ?? 90) && hoursSince(lastOf(recent, "pace")) >= 7 * 24) {
      const prev = recent.find(r => r.type === "pace")?.meta?.projected;
      const worsened = prev == null || pace.projected <= prev;    // only nudge when it's slipping, never when improving
      if (worsened) {
        const lever = pace.addSessions > 0 ? ` ${pace.addSessions} session${pace.addSessions === 1 ? "" : "s"} this week puts ${pace.target}% back in reach.` : "";
        return { type: "pace", body: `${n.daysOut} days to ${dest(n)} — you're pacing to ${pace.projected}%.${lever}`, meta: { projected: pace.projected } };
      }
    }
    // RETENTION (workhorse) — ≥8 fading. Max 3/week, min 48h apart.
    if ((n.fadingTotal ?? 0) >= 8 && hoursSince(lastOf(recent, "retention")) >= 48 && countSince(recent, "retention", 7) < 3) {
      const [catName, count] = Object.entries(n.fadingByCategory || {}).sort((a: any, b: any) => b[1] - a[1])[0] || [];
      if (catName) return { type: "retention", body: `${count} ${String(catName).toLowerCase()} phrases are fading — a 5-minute review restores them.` };
    }
    // GROUP pulse — TODO: needs a cross-player group query; add when the group view lands. Max 1/week.
  }

  // USER-SCHEDULED reminder — neutral fallback at the user's chosen slot only.
  // Suppressed if a session was already completed today. (§6.2)
  if (rec.enabled) {
    const doneToday = n.lastSession && localParts(rec.tz, new Date(n.lastSession)).ymd === local.ymd;
    if (!doneToday) return { type: "reminder", body: `A few minutes now keeps your ${dest(n)} phrases fresh — you're at ${n.readiness}%.` };
  }
  return null;
}

// deliver at the user's chosen time if they set one, else a sensible default (18:00 local)
function isDeliveryHour(rec: any, local: { hour: number }) {
  const slot = rec.enabled && rec.morning != null ? Math.floor(rec.morning / 60) : 18;
  return local.hour === slot;
}

Deno.serve(async () => {
  const { data: recipients, error } = await db.rpc("notif_recipients");
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  let sent = 0, considered = 0;
  for (const rec of recipients ?? []) {
    const local = localParts(rec.tz);
    if (!isDeliveryHour(rec, local)) continue;                   // only evaluate each user once/day, at their slot
    considered++;
    const msg = decide(rec, local);
    if (!msg) continue;
    try {
      await webpush.sendNotification(
        { endpoint: rec.endpoint, keys: { p256dh: rec.p256dh, auth: rec.auth } },
        JSON.stringify({ title: "Tripfluent", body: msg.body }),
      );
      await db.rpc("notif_mark_sent", { p_player: rec.player_id, p_type: msg.type, p_meta: msg.meta ?? {} });
      sent++;
    } catch (e) {
      // 404/410 = subscription gone; leave cleanup to save_push. Log and continue.
      console.error("push failed", rec.player_id, String(e));
    }
  }
  return new Response(JSON.stringify({ ok: true, considered, sent }), { headers: { "content-type": "application/json" } });
});
