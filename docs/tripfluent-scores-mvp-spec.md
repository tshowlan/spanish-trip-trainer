# Tripfluent Scoring System — MVP Spec

**Purpose:** Replace streak/XP mechanics with a Whoop-style scoring system on the home screen. Three primary scores: **Trip Readiness** (headline composite), **Momentum** (recent activity), and **Retention** (how well material is sticking). Premium, data-forward, anti-Duolingo.

**Context for Claude Code:** Tripfluent is a vanilla JS + Capacitor app hosted on GitHub Pages. Adapt the data layer below to the existing storage approach (assume localStorage/JSON unless the codebase says otherwise). Inspect the existing lesson/session code first and map real events to the schema rather than duplicating state.

---

## 1. The Three Scores

### 1.1 Trip Readiness (headline, 0–100)

*"Where you are."* The hero score, analogous to Whoop Recovery.

**Composite formula:**

```
Readiness = 0.40 × Coverage + 0.40 × Retention + 0.20 × Recency
```

- **Coverage (0–100):** strength-aware coverage of trip-relevant scenario content. Scenario categories: restaurant, transit, hotel, shopping, emergencies, small talk (adapt to actual content taxonomy in the codebase). A seen phrase contributes credit based on its *current* Retention strength, with a floor:

  ```
  coverageCredit(phrase) = max(0.3, strength(phrase) / 100)   // unseen phrases = 0
  Coverage = 100 × Σ coverageCredit / totalTripPhrases
  ```

  Rationale: Coverage must behave as *state*, not a permanent achievement. A fully dormant user drifts toward ~30% of earned coverage credit (Readiness lands in the teens — honest), while an active user with strong retention sees credit ≈ 1 per phrase (no difference from binary coverage). The 0.3 floor reflects that relearning is faster than learning and keeps the comeback path motivating rather than punishing. **Do not add a separate decay timer on Coverage** — all decay derives from the single per-phrase strength curve in 1.3. **Update:** Coverage is further extended to demand-weighted category credit — see `tripfluent-personalization-weights-spec.md` §1.2, which supersedes the equal-weight sum here.
- **Retention (0–100):** see 1.3. Reuse the same value — Retention is both a visible score and a Readiness input. This is intentional (Whoop does the same with HRV inside Recovery).
- **Recency (0–100):** decays with days since last completed session. `Recency = 100 × e^(−days/7)`. Practiced today = 100; a week off ≈ 37.

**Trip date anchoring (the differentiator):**
- If a trip date is set, display "X% ready · N days out."
- Compute a **pace check**: project Readiness at departure assuming current 7-day Momentum continues. If projection < 85, surface one line of copy: "At this pace you'll be ~72% ready. Add ~2 sessions/week to hit 90%." Keep it to a single sentence — informative, never nagging.
- If no trip date is set: show Readiness without countdown; show a quiet "Set your trip date" affordance in the Readiness detail view (not a blocking prompt).

**Display bands** (color/label, no emoji):
- 85–100: **"Fluent for your trip"** (brand moment — use it)
- 65–84: "On track"
- 40–64: "Building"
- 0–39: "Getting started"

### 1.2 Momentum (0–100)

*"What you're doing about it."* Rolling activity, analogous to Whoop Strain.

**Formula (7-day rolling window, recomputed on app open and after each session):**

```
Momentum = min(100, 60 × (activeDays7 / 5) + 40 × min(1, sessions7 / 7))
```

- `activeDays7`: distinct days with ≥1 completed session in the last 7 days (target: 5).
- `sessions7`: total completed sessions in the last 7 days (target: 7).
- **No streak resets.** Missing a day slides the window and dents the score gradually. This smooth decay is the core anti-Duolingo mechanic — preserve it in any future tuning.

### 1.3 Retention (0–100)

*"What's sticking."* Forgetting-curve model over per-phrase history.

**Per-phrase strength:**

```
strength(phrase) = 100 × e^(−daysSinceLastCorrectReview / S)
S = 4 × 1.8^(consecutiveCorrectReviews)   // stability grows with each success
```

- A failed review resets `consecutiveCorrectReviews` to 0 (S back to 4 days).
- **Production vs. recognition weighting:** production attempts (typing/speaking the phrase) count 1.5× toward stability growth vs. recognition (multiple choice/tap). If the app currently only has recognition-style exercises, ship with recognition only and leave the weighting hook in place.

**Score:** mean strength across all phrases the user has *seen at least once*. Unseen phrases don't count against Retention (they count against Coverage instead — keep these axes clean).

**V1 fallback (if per-phrase review results aren't currently logged):** approximate Retention at the *lesson* level — lesson strength decays from last completion date using the same curve with fixed S = 7. Log per-phrase results going forward and switch to the phrase-level model once ≥2 weeks of data exists.

---

## 2. Data Model

Adapt names to existing conventions. Suggested localStorage keys/schema:

```json
// tf_phrases  (per-phrase review state)
{
  "phrase_id": {
    "firstSeen": "2026-07-04T14:02:00Z",
    "lastReviewed": "2026-07-04T14:02:00Z",
    "lastCorrect": "2026-07-04T14:02:00Z",
    "consecutiveCorrect": 3,
    "totalReviews": 5,
    "totalCorrect": 4,
    "lastMode": "production"        // "recognition" | "production"
  }
}

// tf_sessions  (append-only session log)
[
  {
    "startedAt": "2026-07-04T14:00:00Z",
    "completedAt": "2026-07-04T14:09:00Z",
    "lessonId": "restaurant_03",
    "category": "restaurant",
    "phrasesReviewed": 12,
    "correct": 10
  }
]

// tf_trip
{ "tripDate": "2026-12-01", "destination": "Barcelona" }

// tf_scores_cache  (last computed values + timestamp, for instant home render)
{ "readiness": 72, "momentum": 64, "retention": 78, "computedAt": "..." }
```

**Compute cadence:** recompute all scores on app open and after every completed session. Render from `tf_scores_cache` immediately, then update in place if values changed (subtle transition, no flash).

---

## 3. Home Screen & Information Architecture

Follow the existing design token system. Aesthetic reference: Whoop/Oura — typography scale, generous whitespace, muted palette, one accent color per score band. **No mascots, no confetti, no badge icons.**

### 3.0 User hierarchy (every layout decision derives from this)

1. **The trip truth** — "am I going to be ready?" Readiness + countdown + pace, one glance. The only thing that must be visible in second one.
2. **The single next action** — "what should I do right now?" One answer, not a menu.
3. **The work itself** — content, one tap away (not zero — see Learn tab).
4. **Reflection** — trends, divergence stories, archive. Visited weekly.
5. **Identity** — tiers, trip trophies, flame. Visited occasionally.

**The home screen contains levels 1 and 2, period.** Anything else on it dilutes them.

### 3.1 Tab map

| Tab | Contains |
|---|---|
| **Home** | State + action only (3.2) |
| **Learn** | The content library, relocated from home: scenario categories with per-category strength-aware coverage ("Restaurant · 82% strong · 3 fading"), Survival section, search |
| **Progress** | Trend charts (§7.2), divergence narrations, trip archive, tier + nearest-unmet-condition line |
| **Profile** | Settings, practice reminder, account |

**Quests dissolves as a tab.** "Quests" is Duolingo-coded naming and its jobs are already covered: scenario-completion goals = category coverage in Learn; achievements = the tier system. Two progression systems compete for meaning — there is one (tiers).

### 3.2 Home layout (top to bottom)

1. **Header:** flame (per §8.6), wordmark, language switcher. No profile icon or settings gear — account and settings live in the Profile tab (§3.1); one entry point, Whoop/Oura-style.
2. **Dial cluster:** Readiness hero ring, meaningfully larger than the Momentum/Retention flankers — push the size asymmetry beyond near-peer; the hierarchy must be legible at a glance.
   - **Pace tick:** small tick mark on the Readiness arc at "where the glide path says you should be today." Fill past the tick = ahead; visible gap = behind. Zero words; same math as the Progress glide-path chart and the pace notification — one concept, three surfaces.
   - **Countdown subline:** "121d out" (optionally "· on pace"). Only when a trip exists.
   - **Delta whispers:** tiny 7-day delta under each flanking dial ("+6" / "−2"). This is the only trend presence on home — full charts live in Progress, where reflection is visited deliberately instead of becoming wallpaper.
   - **Precision rules:** no decimals on Momentum, no % on Retention. Readiness alone carries % (it is genuinely a proportion of a goal); the flankers stay bare indices — a different unit signals a different instrument (§7.1). Decimals claim precision the model doesn't have and make daily noise look like signal.
3. **Smart action tile:** the single recommended next session (synthesizes due phrases, fading phrases, and coverage gaps per §7.3). One answer.
4. **Practice** (quiet secondary): opens a chooser — *Recommended / By scenario / Weakest phrases*. "Weakest phrases" is the mistakes-drill use case, correctly framed as strength-based (honest) rather than mistake-based (shame-coded).
5. **Optionally:** one line of divergence narration, only when §7.3 has something to say. Silence is a feature.

### 3.3 Kill list (remove from home)

- **Due tile** — an input to the action tile's recommendation, not a destination. Displaying it is the action tile's homework showing.
- **Mistakes tile** — the SRS already requeues errors; a separate drillable "mistakes" pile is a second, parallel error system (same trap as a second decay timer on Coverage). Its use case is served by Practice → Weakest phrases. Remove the red warning-triangle iconography with it — punitive visual language.
- **Status strip** ("81 phrases ready · Focus · On pace") — inventory isn't state, Focus duplicates the action tile, and pace is promoted into the dial as the pace tick.
- **Lesson list on home** — relocated to Learn. Two answers to "what do I do" (tile says *this*, list says *choose*) is one answer too many; state-not-catalog is the Whoop pattern.
- **Three-star lesson ratings** (fix in Learn after relocation) — stars are arcade grammar. Replace with a per-lesson strength indicator (small ring/bar of current phrase strength) that decays and restores like everything else. Same information, native vocabulary.

### 3.4 Detail sheets, legibility, animation

**Tap any score → detail sheet** showing exactly 2–3 drivers, phrased as levers:
- Readiness: "Coverage 80 · Retention 71 · Last practiced 2 days ago"
- Momentum: "4 of 5 active days · 5 sessions this week"
- Retention: "12 phrases fading — Review now" (CTA into a review session of the weakest phrases)

**Legibility rule:** every score must explain itself in one tap. No opaque composites — the user should always see which 2–3 inputs are moving the number and what action raises it.

**Animation:** on app open, count the hero number up from the cached value over ~600ms with an ease-out; arc fills in sync. That's the entire "celebration." Score band changes get a color crossfade, nothing more.

---

## 4. Edge Cases & States

| State | Behavior |
|---|---|
| Brand-new user (0 sessions) | No numbers. Hero shows "Complete your first lesson to start your Trip Readiness score." |
| Cold start (<5 sessions) | Show scores with an "Establishing baseline" sublabel; suppress the pace-check copy. |
| No trip date | Readiness works normally, no countdown; quiet set-date affordance in detail view. |
| Trip date passed | Prompt once to set the next trip (or clear); Readiness reverts to non-anchored mode. |
| Long absence (14+ days) | Recency/Retention have decayed naturally — no shame copy. Detail view leads with the fastest path back up: "A review session is the quickest way to rebuild." |
| All content covered | Coverage sits near 100 only while retention is strong; it fades with phrase strength (by design — reviewing stays valuable and dormancy shows honestly). Detail copy doubles as re-engagement CTA: "Coverage fading — 14 restaurant phrases need review." |

---

## 5. Explicitly Out of Scope (MVP)

- Social features, leaderboards, sharing
- Push notifications / smart nudges — specced separately in `tripfluent-xp-to-status-migration-spec.md` §6; keep logging time-of-day data now to support it
- Multiple concurrent trips
- Streak *mechanics*, XP, gems, hearts/lives, or daily-goal systems — **do not add these**. (The passive daily flame marker is the sole exception, governed by §8.6's guardrails.)

## 6. Build Order

1. Data layer: session log + trip date storage (verify against existing storage code first)
2. Momentum (needs only the session log — ship first, validates the pipeline)
3. Coverage + Recency → Readiness composite (lesson-level Retention fallback if needed)
4. Home screen UI: hero ring + tiles + detail sheets
5. Per-phrase logging → full Retention model
6. Pace-check projection copy
7. Trend views (§7) — requires daily score history; start persisting daily values at step 1 so charts have data by the time they ship

---

## 7. Score Semantics & Trend Views

### 7.1 Role definitions

Each dial answers a different question, at a different timescale, with a different action attached. If a UI element, copy line, or notification blurs these roles, it's wrong.

| Dial | Question it answers | Timescale | User's lever | Responds to action |
|---|---|---|---|---|
| **Trip Readiness** | "Will I be ready?" | Weeks → departure | None directly — it is the *output* | Within days |
| **Momentum** | "Am I doing the work?" | Today / this week | Fully controllable — do a session | Same day |
| **Retention** | "Is it sticking?" | This week / this month | Semi — choose *review* over new content | Within one session |

- Readiness tells you **whether**, Momentum tells you **if today**, Retention tells you **what kind** (of session).
- UI copy must never imply the user can raise Readiness directly ("boost your Readiness!" is banned). Readiness moves because Momentum and Retention moved. Momentum is the only same-day steering wheel.

**The daily interaction loop** (design every screen to support this and nothing more):
1. Glance at Readiness → orientation ("on track for Lisbon?"). Two seconds, no action.
2. Glance at Momentum → the go/no-go decision: low or slipping → today needs a session.
3. Retention picks the session type → phrases fading → review session; Retention strong → new content (feeds Coverage → Readiness).

### 7.2 Trend views

**Principle: each line must have a recognizably different shape**, because each tells a structurally different story. If the three trends read as the same wiggle, users will correctly suspect one number dressed three ways. Default each chart to its own timescale — forcing a shared x-axis flattens exactly the shape differences that carry meaning.

**Data requirement:** persist daily values `{date, readiness, momentum, retention, sessions}` from day one (extends the daily snapshot in the migration spec §4.2). All charts render from this table; values are re-derivable from the session log if history needs backfilling.

| Chart | Default window | Shape / story | Rendering rules |
|---|---|---|---|
| **Readiness — "the climb"** | Full trip window (creation → departure); 90 days if no trip | Slow line rising toward departure; post-trip sag between climbs | Plot against a **glide path**: dotted line from current score to 90-at-departure. The gap between lines *is* "behind pace" — same math as the pace notification, so users can verify what the notification claimed. Mark trip completions as annotated points; frozen departure scores from the archive appear as markers. |
| **Momentum — "the rhythm"** | 4 weeks | Fast-oscillating weekly texture; long-run story is consistency identity ("I hold 60+") | Rolling 7-day line with faint daily session-count bars beneath — habit (line) + the acts that built it (bars). Place directly below the Readiness chart in the trends view so causality is visible in one viewport: Momentum dips → Readiness sags ~1–2 weeks later. |
| **Retention — "the sawtooth"** | 8 weeks | Decays between sessions, jumps on review. **Do not smooth it** — the sawtooth is the forgetting curve made visible and teaches spaced repetition without an explainer | Dot-mark review sessions at each jump. The long-run story is the sawtooth *flattening* (shallower teeth as SRS stability grows) — visual proof the system works. |

### 7.3 Divergence patterns (where three dials earn their keep)

Retention and Readiness will co-move most weeks (Retention is 40% of the composite). The system's value shows in divergences — detect these and narrate them in the trends view or detail sheets with one line of copy:

| Pattern | Diagnosis | Copy direction |
|---|---|---|
| High Retention + falling Readiness | Recency/coverage problem — remembering what was learned, but too little of the trip covered | "What you've learned is solid — but Lisbon needs more. 3 scenario categories untouched." |
| High Momentum + flat/falling Retention | Quality problem — grinding new content while old phrases decay | "You're putting in the work, but 20 earlier phrases are fading. Steer the next session to review." Session recommendation logic should also respond to this pattern, not just the copy. |
| Rising Momentum + rising Readiness | The system working as designed | Optionally affirm once ("Your last 2 weeks moved Readiness +11"), never repeatedly. |
| Flat Momentum + stable-high Readiness + far-off trip | Coasting, legitimately | Say nothing. Silence is a feature. |

---

## 8. Lesson Experience

**Governing principle: effect amplitude proportional to informational significance.** Routine events get quiet feedback; meaningful events get more. (Duolingo's inverse — every effect louder than the information it carries — is the failure mode.) Reference points: Brilliant for adult interactive learning, Apple system micro-interactions (passcode shake, Apple Pay confirm) for motion/haptic vocabulary, Things 3 for completion restraint, Linear for transition speed.

### 8.1 In-lesson header cleanup

- Header carries: exit (✕), progress bar, and the daily flame counter (see 8.6). Nothing else.
- **Remove hearts/lives entirely.** Mistakes are data, not infractions: a wrong answer already resets that phrase's SRS stability, which is the honest consequence. A lives system punishes errors twice and teaches users to fear guessing. No lives, no "out of hearts" gates, no heart refills — and nothing replaces them.
- Wrong answers requeue the phrase later in the same session (standard SRS behavior) rather than costing anything.

### 8.2 Haptic map (Capacitor Haptics plugin)

Consistency is the premium signal: same event → same haptic, always. Do not add haptics beyond this map without extending it deliberately.

| Event | Haptic |
|---|---|
| Card press | Light impact |
| Correct answer | Crisp success tick (notification: success) |
| Wrong answer | Soft double-thud (never a buzzer) |
| Progress bar milestone (25/50/75%) | Slightly richer notch |
| Fading phrase restored (8.4) | Distinct medium tap |
| Session complete | One reserved pattern, used nowhere else |

### 8.3 Motion & depth vocabulary

- **Cards:** press state scales to ~0.98 with a spring; selected state elevates (shadow/border shift). Flat rectangles get physics, not decoration.
- **Answer reveal:** correct = color resolve + checkmark that *draws in* (~200ms), no flash. Wrong = restrained horizontal shake (iOS passcode pattern) + correct answer highlighted; no red splash, no sound effect.
- **Between questions:** next card stack slides/springs in; never repaint the screen statically. Continuous motion is most of "feels alive."
- **Progress bar:** fills with a slight spring overshoot, not a linear tween.
- **Ambient scenario tinting:** very dark, barely-there background gradient keyed to scenario category (cool blue-slate airport, warm amber restaurant, etc.). Gives lessons a sense of place without illustration. Prototype tints before considering photography — photos fight legibility.

### 8.4 The "Restored" moment (the one in-lesson score-adjacent effect)

- **No per-answer score deltas in-lesson.** "+0.4 Readiness" per tap is XP through the side door and breaks score semantics (§7). Score deltas appear only on the session-complete screen ("+3 Readiness · 2 phrases restored"), where they read as a result, not a reward drip.
- **Exception:** when a user correctly reviews a phrase that was *fading* (strength below the retention-notification threshold), show a small inline moment on that card — "Restored" label + a subtle strength arc filling. This is information about the phrase, not currency for the user; it's the in-lesson face of the Retention sawtooth and makes the forgetting curve tangible at the moment the user beats it. Pairs with its haptic (8.2).

### 8.5 Exercise variety (the non-cosmetic half of "dynamic")

- Session rhythm matters more than any animation: mix recognition (tap the meaning), production (type the phrase), and audio-first (hear it, then choose/produce) exercise types within a session.
- The scoring system already pays for this: production attempts carry 1.5× Retention weight (§1.3). Surface variety as rhythm, not as a settings choice.
- Sequencing heuristic: open with 1–2 recognition warm-ups, put production in the middle, close with an audio item. Adapt to what exercise types exist in the codebase; add production/audio types incrementally if only recognition exists today.

### 8.6 Daily flame counter (kept, with guardrails)

The flame day-counter stays as a passive consistency marker (Whoop-style), distinct from a Duolingo streak *mechanic*. The difference is enforcement — the flame is a mirror, not a leash:

- **No loss-aversion machinery:** no streak freezes, no repair purchases, no "your streak is about to die" notifications, no guilt copy on reset. If a day is missed, the number quietly resets; nothing else happens and nothing is said.
- **No systemic weight:** the flame feeds nothing — not scores, not tiers, not session recommendations. Momentum already measures consistency with smooth decay; the flame is display-only.
- **Placement:** header marker only, current size. Never a hero element, never in notifications, never in the session-complete screen.
- If any future feature wants to reference the flame, that's the signal it's becoming a mechanic — route the feature to Momentum instead.

