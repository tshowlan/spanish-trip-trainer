/* ============================== CONTENT DEMAND WEIGHTS ==============================
   Personalization spec §1 (base weights) + §3 (modifier vectors). Editable config — the
   allocation logic reads these, never hardcodes them. Categories are the outputs of
   categoryOf() (cloud.js), so this table maps 1:1 onto how Coverage buckets lessons.
   Spec categories → app categories:
     restaurant→Food & Drink · transport+airport→Transport · smalltalk→Basics ·
     shopping→Numbers & Time · hotel→Lodging · emergencies→Advanced · leisure→Sights ·
     (Directions is navigation, its own small bucket). Relative values; effectiveWeights() normalizes. */
const CONTENT_WEIGHTS = {
  "Core":           0.15,   // Stage-0 survival kit + pattern machines: universal generators, every trip
  "Food & Drink":   0.27,   // restaurant — high on all four demand dimensions
  "Transport":      0.20,   // transport + airport signage
  "Basics":         0.14,   // greetings / small talk — the "feels fluent" pillar
  "Advanced":       0.11,   // recovery / emergencies — the stakes floor, never cut
  "Lodging":        0.10,   // hotel / host
  "Numbers & Time": 0.10,   // money, numbers, time — shopping-adjacent utility
  "Directions":     0.05,
  "Sights":         0.03    // leisure / sightseeing
};

/* §3 modifier vectors — multiply the base weight; a missing entry = 1.0 (no change).
   Magnitudes are deliberately gentle (0.6–1.4×): personalization tilts the deck, not deals a new one. */
const TRIPTYPE_MODIFIERS = {
  foodie:      { "Food & Drink": 1.3, "Basics": 1.1, "Numbers & Time": 0.9, "Sights": 0.8 },
  beach:       { "Food & Drink": 1.1, "Transport": 0.8, "Numbers & Time": 0.9, "Lodging": 1.1, "Sights": 1.2 },
  adventure:   { "Food & Drink": 0.9, "Transport": 1.3, "Numbers & Time": 0.9, "Lodging": 0.9, "Sights": 1.3 },
  business:    { "Food & Drink": 0.9, "Transport": 1.2, "Basics": 1.4, "Numbers & Time": 0.7, "Lodging": 1.1, "Sights": 0.6 },
  family:      { "Food & Drink": 1.1, "Transport": 1.1, "Basics": 0.9, "Lodging": 1.1, "Sights": 1.1 },
  sightseeing: { "Transport": 1.2, "Numbers & Time": 1.1, "Sights": 1.1 }
};
const LODGING_MODIFIERS = { airbnb: { "Lodging": 0.6 } };   // airbnb tilts away from hotel content (gently; clamp keeps a floor)
const NEEDS_MODIFIERS   = { chat:   { "Basics": 1.3 } };    // "chat with locals" → small talk
const NO_MODIFIER = new Set(["Advanced", "Core"]);                  // emergencies: stakes floor, personalization never touches it

/* Normalized effective weight per category for a given profile (sums to 1 over the given categories).
   Pass the categories actually present in the deck so a pack missing a category doesn't leak weight. */
function effectiveWeights(profile, categories) {
  const p = profile || {};
  const cats = (categories && categories.length) ? categories : Object.keys(CONTENT_WEIGHTS);
  const w = {};
  cats.forEach(c => {
    let m = 1;
    if (!NO_MODIFIER.has(c)) {
      const tt = TRIPTYPE_MODIFIERS[p.tripType]; if (tt && tt[c]) m *= tt[c];
      (p.lodging || []).forEach(l => { const t = LODGING_MODIFIERS[l]; if (t && t[c]) m *= t[c]; });
      (p.needs || []).forEach(n => { const t = NEEDS_MODIFIERS[n]; if (t && t[c]) m *= t[c]; });
      if (c === "Transport" && (p.transport || []).length >= 3) m *= 1.1;   // §3: 3+ modes → transport rises slightly
    }
    w[c] = (CONTENT_WEIGHTS[c] || 0.05) * m;
  });
  // §3 guardrail: no category personalizes below 0.04 of the deck (every trip contains surprises), then normalize.
  let total = cats.reduce((a, c) => a + w[c], 0) || 1;
  const floor = 0.04 * total;
  cats.forEach(c => { if (w[c] < floor) w[c] = floor; });
  total = cats.reduce((a, c) => a + w[c], 0) || 1;
  cats.forEach(c => (w[c] /= total));
  return w;
}
if (typeof module !== "undefined") module.exports = { CONTENT_WEIGHTS, effectiveWeights };
