# Tripfluent — XP → Status Migration Spec

**Purpose:** Replace the existing XP system with the three-layer model: **Scores** (Readiness / Momentum / Retention — see `tripfluent-scores-mvp-spec.md`), **Status** (five permanent tiers), and **Groups** (score comparison on shared trips). This spec covers removing XP, the tier system that replaces it, the group view rework, and data migration for existing users.

**Context for Claude Code:** The app is vanilla JS + Capacitor with an existing login and group trip feature (backend exists). Inspect the current XP implementation, auth flow, and group data model first, then adapt the schemas below to what's actually there. The scores spec is a prerequisite — implement or verify it before this migration.

---

## 1. What XP Currently Does → What Replaces It

| XP's job today | Replaced by |
|---|---|
| Progress feedback per session | Score movement (Readiness/Momentum tick up after a session — show the delta: "+3 Readiness") |
| Long-term progression | Status tiers (Section 2) |
| Group leaderboard ranking | Trip Readiness comparison + weekly Momentum (Section 3) |
| Multi-language achievement | Tier gates that require multiple languages (Ambassador+) |

**Remove entirely:** XP counters, XP-earn animations, XP-based leaderboards, daily XP goals, any XP references in copy, and the **hearts/lives system** (mistakes are data — a wrong answer already resets that phrase's SRS stability; see scores spec §8.1). Do not leave a hidden XP counter running "just in case" — the session log is the permanent record and can derive anything later.

**Kept with guardrails:** the daily flame counter stays as a passive, display-only consistency marker — no freezes, no repair, no streak notifications, no guilt copy on reset, feeds nothing. Full rules in scores spec §8.6.

**Keep:** the raw event/session history XP was computed from. If XP events exist but session-level history doesn't, convert XP events into session log entries during migration (Section 4) before deleting anything.

---

## 2. Status Tiers

Five permanent, account-level tiers. Airline-status mental model: earned through accomplishment milestones, never lost, understated presentation.

### 2.1 Definitions

Tier is the **highest** tier for which any one qualifying condition is met. Conditions reference scores from the scores spec.

| Tier | Qualifying conditions (any one) |
|---|---|
| **Newcomer** | Default on account creation |
| **Backpacker** | Complete a trip with Readiness ≥ 70 at trip date, **or** maintain Readiness ≥ 70 for 21 consecutive calendar days with average Momentum ≥ 50 over that window |
| **Culturist** | Complete a trip with Readiness ≥ 85 at trip date, **or** maintain Retention ≥ 75 for 60 consecutive calendar days after any completed trip with average Momentum ≥ 40 over that window |
| **Ambassador** | Reach Backpacker-level (70+ sustained or at trip date) in a **second language**, **or** complete two trips at Readiness ≥ 85 |
| **World Citizen** | Reach Culturist-level (85+) in **two or more languages**, **and** two or more completed trips |

Notes:
- "At trip date" = the Readiness value cached on the trip's date (snapshot it when the date passes — do not recompute later from decayed data).
- The "maintain for N days" paths exist so early users can progress before anyone has completed a trip. **"Consecutive" means calendar days, evaluated against the computed daily score** — the score is computable on days with no practice (it simply decays), so skipped days are not exceptions, they're just lower values. If the score dips below threshold on any day, the counter restarts on the next day it crosses back over. Nothing zeroes: the user is a session away from re-crossing, not restarting progress.
- **Why the Momentum floor:** Readiness's own decay already makes binging inefficient (a 10-lesson day buys only a few days of buffer, exponentially diminishing), but the Momentum clause guards intent — 60% of Momentum is distinct active days (capped 5/week) and sessions cap at 7/week, so it is binge-proof by construction. The sustained paths should prove both state (Readiness) and behavior (Momentum).
- Tiers never decrease. Store `tier` and `tierAchievedAt`; only ever write a higher tier.

### 2.2 Tier evaluation

- Evaluate on: app open, session completion, trip date passing, and (server-side) daily.
- Compute server-side as source of truth (groups need to display friends' tiers); mirror to client cache for offline display.
- On tier-up: one full-screen moment, once — tier name, one line on what earned it, one line on what unlocks the next tier. Same restraint rules as the completion screens: typography and color, no confetti, no badges raining down.

### 2.3 Presentation

- Tier appears in: profile, group member rows (small label next to name), and the tier-up moment. Nowhere else — it should feel like a passport stamp, not a game HUD.
- Progress toward next tier lives on the profile screen only: show the *nearest* unmet condition as a single sentence ("Complete a trip at 85+ Readiness to reach Culturist"). Never show a progress bar filling with points — conditions are milestones, not meters.

---

## 3. Group Trip View Rework

Replace the XP leaderboard with a shared-trip readiness view.

### 3.1 Layout (per group trip)

1. **Header:** destination + shared countdown ("Barcelona · 24 days out").
2. **Member list, sorted by Trip Readiness descending:** name, tier label (small, muted), Readiness number with band color, and a small weekly-Momentum indicator (e.g., "5 sessions this wk").
3. **Weekly pulse strip:** "Most sessions this week: Sarah (6)" — Momentum-based, resets weekly (rolling 7 days, no manual reset logic needed).
4. **Group pace line (optional, if cheap):** "Group average: 68% — on pace for 81% at departure" using the same projection math as the solo pace check.

### 3.2 Rules

- The compared score is **Readiness for this specific trip** (trip-scoped Coverage/Recency; Retention is language-global). If the current build computes anything per-trip already, align with it.
- Members' scores sync on their app open / session completion; show `lastUpdated` staleness subtly (e.g., dimmed number if > 3 days stale) rather than misrepresenting an old score as current.
- No ranks like "#1/#2/#3" labels, no podium graphics, no demotions. The sort order *is* the ranking; anything more is Duolingo-league energy.
- Copy tone: comparative but warm. "Sarah's pulling ahead this week" — never "You're losing."

---

## 4. Data Migration

### 4.1 XP → starting tier (one-time, server-side)

Existing users get a **legacy tier floor** so nobody is demoted to Newcomer:

```
xp == 0                → Newcomer
0 < xp ≤ P40           → Backpacker
P40 < xp ≤ P85         → Culturist
xp > P85               → Ambassador
```

- P40/P85 = the 40th/85th percentile of nonzero XP across existing accounts. With a small user base, eyeball-adjust so the distribution feels right (most active users should land Backpacker/Culturist; only genuine power users Ambassador; nobody grandfathers into World Citizen).
- Store as `legacyTierFloor`. Effective tier = max(earned tier, legacy floor). This keeps future tier logic clean — earned conditions stay pure.
- Log the mapping per user for auditability before deleting XP fields.

### 4.2 New data requirements

- **Daily readiness snapshot:** append `{date, readiness, momentum, language}` once per day server-side (or on first app open, backfilled server-side for missed days). Because all scores are deterministic functions of the session log and timestamps, any historical day's values can be recomputed retroactively — the snapshot is a **performance cache**, not the source of truth, and tier checks work even for days the user never opened the app.
- **Trip completion snapshot:** when a trip's date passes, freeze `{tripId, readinessAtDeparture, language}` on the trip record.
- **Per-user tier record:** `{tier, tierAchievedAt, legacyTierFloor, languagesActive[]}`.
- Session log becomes append-only and permanent (tier conditions are re-derivable from it).

### 4.3 Rollout order

1. Verify/implement the scores spec (prerequisite).
2. Add snapshot writes (daily readiness, trip completion) — start accumulating data before anything visible changes.
3. Backend: tier evaluation + XP→floor migration (run migration, verify mapping log, keep XP data in a backup table until confirmed).
4. Swap group view: leaderboard → readiness comparison.
5. Remove XP UI + earn logic; add score-delta feedback ("+3 Readiness") in its place so sessions never feel unrewarded during the transition.
6. Tier-up moment + profile presentation.

### 4.4 Migration comms (in-app, one time)

One dismissible card on first open post-migration: "Tripfluent has a new progression system. Your history carries over — you're starting as a **Culturist**." Link to a short explainer of the three scores and five tiers. No apology framing; this is an upgrade.

---

## 5. Trip Lifecycle & Archive

Separates the **record** (frozen trip results, permanent) from the **state** (live scores, honest about decay). Both coexist; neither substitutes for the other.

### 5.1 Trip completion transition

When a trip's date passes:

1. Freeze the trip record: `{tripId, destination, tripDate, language, readinessAtDeparture, bandLabel, sessionsCompleted, phrasesLearned}`. Frozen values never recompute.
2. Show a one-time trip summary screen on next app open — the score, band label ("Fluent for your trip" if 85+), destination, and 2–3 stats. Same visual restraint as everything else; this is the closest thing the app has to a finish-line moment, so let typography scale carry it.
3. Move the trip to the archive; home screen reverts to non-anchored mode (or the next upcoming trip, if one exists).
4. Run tier evaluation (trip completion is a tier trigger).

### 5.2 Trip archive

- Profile-level list of completed trips: destination, date, frozen Readiness with band color. Race-history mental model — results are permanent trophies and never decay, regardless of current skill state.
- This shelf is the long-term identity hook and the visible substrate tiers are earned from; a user should be able to see *why* they're a Culturist by looking at their archive.

### 5.3 Returning user / next trip

- **Learning state persists continuously and honestly:** per-phrase strengths, Retention, and strength-aware Coverage carry over, decayed by however long the user was away. Never reset phrase history, and never preserve a stale high Readiness — both lie.
- **What's fresh per trip:** the trip record itself, the countdown, and Coverage recomputed against the new trip's scenario set (largely overlapping for the same language). Recency is just timestamps.
- **The seam copy (one sentence, once):** when a returning user creates a new trip, acknowledge record and state together — "Barcelona: 87. Your Spanish has faded to 34 since — but you'll rebuild much faster than you built." Frames the drop as physics, not failure, and points at the comeback mechanic.
- **The comeback mechanic (already built, surface it):** dormant decay is concentrated in phrase strength, and prior SRS stability makes relearning fast — a returning user's early review sessions restore strength across many phrases at once, so Readiness climbs visibly faster than any new user's. The pace line should make this legible: "At this rate you'll hit 90 by departure."
- Trip-specific content (e.g., Mexico vs. Spain vocabulary) needs no special handling — per-phrase strength is language-scoped and doesn't care which trip introduced a phrase.

## 6. Notifications

**Governing principle:** every notification must contain information that is true whether or not the app wants engagement — a number, a phrase count, a day count, or a name. If the system cannot cite one, it stays silent. Notifications report real state (skill decay, pace vs. trip date); they never manufacture obligation to the app. No streaks, no guilt, no escalation.

### 6.1 Notification types & triggers

| Type | Trigger condition | Frequency cap | Copy pattern |
|---|---|---|---|
| **Retention** (workhorse) | ≥ N phrases (default 8) cross below a strength threshold (default 40) since last notification | Max 3/week, min 48h apart | "14 restaurant phrases are fading — a 5-minute review restores them." Cite count + category; ask is small and specific. |
| **Pace** | Trip date set AND projected Readiness-at-departure drops below target (default 85) AND projection worsened since last pace notification | Max 1/week | "24 days to Lisbon — you're pacing to 76%. Two sessions this week puts 90% back in reach." Always include the recovery lever. Pace attaches to the trip, never the user's character. |
| **Countdown** | Fixed calendar: 30 / 14 / 7 days before trip date | 3 per trip total | "One week to Barcelona — 88%, Fluent for your trip." Fires regardless of behavior; at high readiness this is pure reward. |
| **Group pulse** | Weekly digest per active group trip, or a member crosses a Readiness band | Max 1/week per group | "Sarah reached 84% for Barcelona." Factual, comparative, warm — never win/lose framing. |
| **User-scheduled reminder** | User-set time + days (see 6.2) | As scheduled | Content filled by smart triggers at send time; degrades to neutral ("Your 9pm session") when nothing is notable. |

### 6.2 User-scheduled reminders

Scheduling is dumb; content is smart. The user picks time and days; the payload is whatever is true at send time, in priority order: retention state → pace state → neutral. Never invent urgency to fill the slot.

- **Settings:** "Practice reminder" — time picker + day-of-week selector. Not called a "daily goal." No tracking of whether reminders were "honored," no streak of honored reminders, no escalation on ignore. Ignored reminders change nothing.
- **Master notifications toggle:** one in-app on/off for all Tripfluent notifications (in addition to iOS's native per-app controls). **No per-type toggles** (retention/pace/countdown/group): the §6.3 architecture — one voice per day, silence as a feature — is designed to make granular muting unnecessary. If users ask for per-type muting, treat that as a signal the caps are miscalibrated and fix the caps, not the settings surface.
- **Offer moments:** always available in settings; one contextual prompt immediately after a user sets their first trip date ("Want a daily reminder while you train for Lisbon?"). When that trip completes, ask once whether to keep the reminder; default off if unanswered.
- **Suppression:** if the user already completed a session that day, the reminder does not fire. (Optional toggle, default off: replace with a one-line status — "Done today — 81% and climbing.")

### 6.3 Traffic rules

- **One voice per day:** max one notification per user per day, across all types. If a smart trigger and a scheduled reminder would both fire, the smart content is *absorbed into* the scheduled reminder and delivered at the user's chosen time — the user-set time is the preferred delivery slot for all smart triggers when it exists.
- **Priority when competing:** countdown > pace > retention > group pulse. Losers wait for the next eligible day (retention) or are dropped (group pulse; it regenerates weekly).
- **Silence is a feature:** a user who is on pace with strong retention should receive almost nothing except countdown moments. Notification volume should be *inversely* related to how well things are going. Do not backfill quiet periods.
- **Quiet hours:** no smart-triggered sends before 9:00 or after 21:00 local; user-scheduled reminders fire exactly when set (the user chose it).
- **New users:** no smart notifications until ≥ 5 sessions (cold-start scores are too noisy to cite honestly). Scheduled reminders work from day one if set.

### 6.4 Banned patterns (do not implement, do not A/B test in)

- Streak mechanics or "don't lose your progress/streak" framing (the passive flame marker never appears in notifications — scores spec §8.6)
- "Training debt," owed sessions, or any obligation-to-the-app language
- Escalation sequences on ignored notifications (including sad-mascot or guilt copy)
- Notifications with no citable number, count, or name ("Time to practice!")
- Re-engagement blasts to dormant users beyond the retention type's normal caps — a 6-month-dormant user gets the same honest retention notification as anyone, not a win-back campaign

## 7. Out of Scope

- New social features (chat, reactions, activity feeds)
- Public/global leaderboards — comparison is within a group trip only
- Tier-based feature gating or paywalls
- Reintroducing any per-session point currency under a new name
