// Spanish Trip Trainer — scheduled push reminders.
// Invoked every ~15 min by pg_cron. For each enabled subscription, checks the
// device's local time against its morning/evening reminder and sends a push
// (once per slot per day). Deploy with:  supabase functions deploy send-reminders --no-verify-jwt
import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2";

const VAPID_PUBLIC = Deno.env.get("VAPID_PUBLIC")!;
const VAPID_PRIVATE = Deno.env.get("VAPID_PRIVATE")!;
const CRON_SECRET = Deno.env.get("CRON_SECRET")!;
const WINDOW = 15;            // minutes; should match the cron interval

webpush.setVapidDetails("mailto:tshowlan@gmail.com", VAPID_PUBLIC, VAPID_PRIVATE);

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const MORNING_LINES = [
  "¡Buenos días! Two minutes of Spanish before the coffee kicks in?",
  "Rise and shine — your streak isn't going to feed itself.",
  "Morning! A quick lesson and you've earned that croissant.",
  "Despierta 🇪🇸 — today's the day you finally nail 'un cortado'.",
];
const EVENING_LINES = [
  "Before bed: one lesson so you can ask for another pillow mint in Spanish.",
  "Buenas noches soon — keep the streak alive first 🔥",
  "Quick reps before lights out? Future-you at the restaurant says gracias.",
  "Two minutes now beats pointing at the menu later. ¡Vamos!",
];
const pick = (a: string[]) => a[Math.floor(Math.random() * a.length)];

// minutes-of-day + YYYY-MM-DD for a given IANA timezone
function localNow(tz: string) {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz, hour12: false,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
  const p: Record<string, string> = {};
  for (const x of fmt.formatToParts(new Date())) p[x.type] = x.value;
  return { minutes: (+p.hour) * 60 + (+p.minute), date: `${p.year}-${p.month}-${p.day}` };
}

Deno.serve(async (req) => {
  if (req.headers.get("x-cron-secret") !== CRON_SECRET) {
    return new Response("forbidden", { status: 401 });
  }
  const { data: subs, error } = await supabase.from("push_subs").select("*").eq("enabled", true);
  if (error) return new Response(error.message, { status: 500 });

  let sent = 0;
  for (const s of subs ?? []) {
    let tz = "Europe/Madrid";
    try { new Intl.DateTimeFormat("en-CA", { timeZone: s.tz }); tz = s.tz; } catch { /* bad tz */ }
    const { minutes, date } = localNow(tz);

    const slots: Array<["last_morning" | "last_evening", number | null, string[]]> = [
      ["last_morning", s.morning, MORNING_LINES],
      ["last_evening", s.evening, EVENING_LINES],
    ];
    for (const [col, target, lines] of slots) {
      if (target == null) continue;
      if (Math.abs(minutes - target) >= WINDOW) continue;
      if (s[col] === date) continue;                       // already sent this slot today

      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          JSON.stringify({ title: "Spanish Trip Trainer", body: pick(lines) }),
        );
        sent++;
        await supabase.from("push_subs").update({ [col]: date }).eq("player_id", s.player_id);
      } catch (e: any) {
        if (e?.statusCode === 404 || e?.statusCode === 410) {
          await supabase.from("push_subs").delete().eq("player_id", s.player_id); // subscription gone
        }
      }
    }
  }
  return new Response(JSON.stringify({ checked: subs?.length ?? 0, sent }), {
    headers: { "Content-Type": "application/json" },
  });
});
