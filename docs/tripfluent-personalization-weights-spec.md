# Tripfluent — Personalization & Content Demand Weights Spec

**Purpose:** (1) Make content allocation reflect real-world interaction demand per scenario category, (2) make the intake form real — every question either moves a weight, sets an entry depth, or sets a trip parameter, or it's cut. Based on the intake audit (July 2026): destination, tripDate, and allergies are wired; tripType, needs, and level are collected but dead; lodging/transport have fully-authored gated content (`meetsReq`) but are never asked.

**Companion docs:** `tripfluent-scores-mvp-spec.md` (Coverage formula changes land there, §1.1), `tripfluent-xp-to-status-migration-spec.md`.

---

## 1. Demand-Weight Model

Content allocation per scenario category is a function of four dimensions — not frequency alone (raw frequency yields the 60%-meal-ordering app):

| Dimension | Meaning | Example contrast |
|---|---|---|
| **Frequency** | Interactions per trip | Restaurant 15–30× vs airport 2× |
| **Variance** | How differently it goes each time | Airport signage = closed set (~10 items covers 95%); restaurant = branching conversation |
| **Stakes** | Cost of failing | Emergencies: near-zero frequency, mandatory floor — insurance allocation, never cut |
| **Production demand** | Must the user *speak*, or just recognize? | Signage read-only vs pharmacy = producing sentences under stress. Extends the existing 1.5× production weighting from phrase level to category level |

### 1.1 Base weights (defaults — judgment, tunable)

Store as an editable config (`content-weights.json` or Supabase row), never hardcode. Weights normalize to 1.0.

```json
{
  "restaurant":   0.27,
  "transport":    0.17,
  "smalltalk":    0.13,
  "shopping":     0.12,
  "hotel":        0.10,
  "emergencies":  0.09,
  "leisure":      0.07,
  "airport":      0.05
}
```

Rationale anchors: restaurant is high on all four dimensions; transport branches more than expected (taxis, tickets, wrong-stop recovery) and is production-heavy; smalltalk is sneaky-high variance and is what makes a trip feel fluent rather than transactional (premium-travel pillar); emergencies is the stakes floor; airport is twice-per-trip, closed-set, near-zero variance. **Adapt category names to the actual content taxonomy in the codebase.** Future tuning inputs: drill telemetry by category, post-trip "which situations did you actually speak in?" prompts.

### 1.2 Weighted Coverage (change to scores spec §1.1)

Coverage currently treats all phrases equally — silently asserting an airport phrase and a restaurant phrase contribute equally to trip-readiness. Replace with:

```
categoryCredit(c) = Σ coverageCredit(phrase in c) / totalPhrases(c)     // strength-aware, 0.3 floor, unchanged
Coverage = 100 × Σ_c ( categoryCredit(c) × effectiveWeight(c) )
```

Effects inherited system-wide for free: Readiness now means "ready for the interactions this trip will contain"; pace math targets the right material; scores spec §7.3 session recommendations steer toward high-demand gaps automatically because those gaps move the number more.

**Sequencing note:** ship weighted Coverage in the current build pass (before trend charts accumulate history) so Readiness has no re-weighting discontinuity later.

### 1.3 Depth, not just count

Weight expresses as **content-tree depth**, not phrase volume alone. High-weight categories earn: listening comprehension of likely responses (the real restaurant failure mode is the waiter's reply, not producing the order), variation drills, and recovery phrases ("¿puede repetir?"). Low-weight categories are complete at one canonical lesson. This maps onto the scores spec §8.5 exercise-variety work — the audio-first exercise type and the demand-weighted tree are the same investment. Content authoring for depth is a follow-on effort; the weight config and Coverage change are code and ship now.

---

## 2. Intake: Wire, Fix, or Cut

Governing rule: **every intake question must move a weight, set an entry depth, or set a trip parameter — or it's cut.** Verdicts per field from the audit:

| Field | Today | Verdict & action |
|---|---|---|
| **destination** | Real (drives content pack) | Keep as-is |
| **tripDate** | Real (countdown, pace, cram mode) | Keep as-is |
| **allergies** | Real (injects custom lesson) | Keep; pattern to clone (see needs) |
| **lodging / transport** | Never asked; authored content permanently gated dark | **Ask them.** Two multi-select questions populate `profile.lodging` / `profile.transport`; `meetsReq()` starts passing and hidden lessons unlock. Cheapest win in the codebase — do this first. Also feeds modifiers (§3). |
| **level** (placement quiz) | Dead — computed, saved, read by nothing | **Wire to entry depth** (§4). If not wired this pass, remove the quiz — a 4-question quiz that informs nothing is pure onboarding friction. No third option. |
| **tripType** | Dead | **Wire as modifier vector** (§3). |
| **needs** (veg/GF/solo/cities/chat…) | Dead after save; veg/GF generate no content despite dietary-specialty copy | **Fix or cut per option.** Vegetarian/gluten-free: clone the `buildAllergyLesson()` pattern → inject a dietary phrase lesson (cheap, pattern exists, and closes an honesty gap with safety-motivated users). "Chat with locals" → smalltalk modifier (§3). Solo/cities/off-beaten: cut unless a concrete weight/content effect is defined — do not keep collecting answers that inform nothing. |
| **dialect** | Redundant (`destInfo()` recomputes from destination) | **Delete field.** |

### 2.1 Relocate trip-scoped questions to trip creation

tripType, lodging, and transport describe *a trip*, not *an account* (hotel in Madrid, Airbnb in Oaxaca). The per-destination snapshot `state.trips[dest].profile` already exists, so this is UI relocation, not data-model surgery:

- **Account onboarding keeps:** destination + date for the first trip (doubles as trip creation), placement quiz (level is account-scoped), allergies/dietary (account-scoped).
- **Trip creation asks:** trip type, lodging, transport — one screen each, skippable (skipped = base weights). New trips re-ask these three; returning users never repeat the quiz or dietary questions.

---

## 3. Modifier Vectors

`effectiveWeight = normalize(baseWeight × Π modifiers)`. Modifiers multiply; missing answers = 1.0 everywhere (base weights). Store modifier tables in the same editable config as base weights.

**Trip type** (from existing options):

| | restaurant | transport | smalltalk | shopping | hotel | leisure |
|---|---|---|---|---|---|---|
| foodie | 1.3 | 1.0 | 1.1 | 0.9 | 1.0 | 0.8 |
| beach | 1.1 | 0.8 | 1.0 | 0.9 | 1.1 | 1.2 |
| adventure | 0.9 | 1.3 | 1.0 | 0.9 | 0.9 | 1.3 |
| business | 0.9 | 1.2 | 1.4 | 0.7 | 1.1 | 0.6 |
| family | 1.1 | 1.1 | 0.9 | 1.0 | 1.1 | 1.1 |
| sightseeing | 1.0 | 1.2 | 1.0 | 1.1 | 1.0 | 1.1 |

(Emergencies and airport take no modifiers — stakes floor and closed set respectively.)

**Lodging:** `airbnb` → hotel ×0.3, and *unlocks the host/apartment lesson cluster* (talking to a host, appliances, checkout logistics — the gated content). `hotel` → standard. Both selected → both content sets, hotel ×0.8.

**Transport:** selections unlock their gated lessons (metro/train/bus/ferry) and shift weight *within* the transport category (no rental car → taxi/metro-heavy; rental car → driving/parking/fuel cluster). Category-level transport weight rises slightly (+10%) if 3+ modes selected.

**Needs:** "chat with locals" → smalltalk ×1.3.

**Guardrail:** after modifiers, clamp every category (except airport) to ≥ 0.04 of total so no category personalizes to zero — variance means every trip contains surprises. Modifier magnitudes are deliberately gentle (0.6–1.4×): personalization tilts the deck, it doesn't deal a different one.

---

## 4. Level → Entry Depth

Skill level changes **where in each category's tree the user enters**, never the weights (weights = what the trip demands; level = where you start climbing):

- **new:** full tree from stage 0 (survival basics).
- **some:** stage-0 survival lessons marked pre-seen — they enter the SRS as review items at moderate strength rather than new content; user starts at stage 1.
- **confident:** stages 0–1 seeded as review-strength items; user enters at the branching/production layer. First sessions are production-weighted.

Seeded items use reduced initial stability (e.g., S = 7, not full credit) so Retention stays honest: claimed knowledge must survive its first review like everything else. If seeded items fail reviews, strength resets and the tree reopens below them — the SRS self-corrects an overconfident placement with zero special-case logic.

---

## 5. Build Order

1. **Ask lodging + transport** (trip creation screens) → populate profile fields → gated content unlocks via existing `meetsReq()`. Zero new content work.
2. Weights config + **weighted Coverage** (scores spec §1.1 change) — ship in the current pass, before trend history accumulates.
3. Trip-type modifier vectors (reads the already-collected field; it stops being dead).
4. Level → entry-depth seeding (or remove the quiz — no third option).
5. Dietary lessons for veg/GF (clone allergy-lesson pattern); cut dead `needs` options.
6. Relocate trip-scoped questions to trip creation flow (§2.1).
7. Follow-on (content authoring, separate effort): depth-building for high-weight categories per §1.3 — response comprehension, variation drills, recovery phrases.

## 6. Future Scope (stubs, do not build now)

- **Weight tuning from telemetry:** drill frequency by category pre/during trip; optional post-trip one-tap survey ("which situations did you speak in?") feeding config updates.
- **Per-destination weight overlays** (e.g., Mexico City vs beach-town Mexico differ in transport shape).
- **Group trips inheriting a shared trip-type** so members' Readiness targets the same interaction profile.
