# SCENE · Rosa's — Restaurant · Evening (v1.1, 2026-09-06)

*Wave 1, scene 2 — the full meal, CRITICAL per the scope ceiling. Written to the r27 format; every phrase pinned and pack-known. The read-sign beat debuts here.*

```yaml
id: restaurant-evening-rosas
category: restaurant
place: "Rosa's"
time: evening
label: "SCENE: RESTAURANT · EVENING"
end_label: "END SCENE: RESTAURANT · EVENING"
photo: rosas-evening.jpg           # GAP: sourcing — pictures session; Tom may hand-pick interim
name_face: plain                         # single-word names stay plain display ("Rosa's")
cast: [Rosa]
due_mass_items: [una-mesa-para-dos, que-recomienda, el-filete-heard, soy-alergico-al-marisco,
                 para-mi-el-filete, tirar-sign, todo-bien-heard, la-cuenta-por-favor, quedese-con-el-cambio]

door:
  verse:
    - "Half the neighborhood is already here."
    - "Rosa runs the room without writing anything down."
  cta: "Step in"

beats:
  - type: weld                            # EVERY DAY
    context: "Rosa spots you at the door. Two fingers up."
    cue_label: "She waits"
    cue: "Ask for a table for two"
    build: ["una", "mesa", "para", "dos"]                       # fuse → "Una mesa para dos, por favor" [check: pack form]

  - type: weld                            # BECAUSE OF THAT
    context: "The carta is one laminated page. You close it."
    cue_label: "Rosa is back"
    cue: "Ask what she recommends"
    build: ["qué", "recomienda"]                                # fuse → "¿Qué recomienda?"

  - type: exchange-understand
    context: "She doesn't even glance at the kitchen."
    heard: "El filete, sin duda"
    prompt: "What did she recommend?"
    choices: ["The fish", "The steak*", "The chicken"]

  - type: weld                            # SAFETY — straight talk, no jokes (the carve-out)
    when: profile.dietary != none         # PROFILE-KEYED BEAT: skipped cleanly if no allergy declared
    fill: profile.dietary                 # marisco / gluten / frutos secos / lácteos ... from intake
    context: "Before she leaves the table. Say it clearly."
    cue_label: "This one matters"
    cue: "Tell her: allergic to {dietary_en}"
    build: ["tengo", "alergia", "{al|a los|a la}", "{dietary_es}"]   # NEUTRAL FORM (Tom's ruling): no agreement, universal, safety-grade

  - type: weld
    context: "She nods once. Decision time."
    cue_label: "Order"
    cue: "The steak, for you"
    build: ["para", "mí", "el", "filete"]

  - type: read-sign                       # NEW BEAT TYPE, debut — eyes-overheard
    context: "You find the bathroom door at the back."
    sign: "TIRAR"
    prompt: "The door says:"
    choices: ["Push", "Pull*", "Staff only"]

  - type: exchange-understand
    context: "Rosa swings by, one hand on your chair."
    heard: "¿Todo bien?"
    prompt: "What did she ask?"
    choices: ["More bread?", "All good?*", "Finished?"]

  - type: weld                            # UNTIL FINALLY
    context: "Plates cleared. The room has turned over once."
    cue_label: "Catch her eye"
    cue: "Ask for the check"
    build: ["la", "cuenta", "por", "favor"]

  - type: weld
    context: "You pay. The change lands in a small saucer."
    cue_label: "The regular's move"
    cue: "Tell her to keep it"
    build: ["quédese", "con", "el", "cambio"]

finale:
  line: "Rosa walks you to the door like you've been coming for years."
```

## Notes for the pass

- **Nine asks** — the meal is the critical scene and earns the length; every beat carries an ask (essence guard holds). Trim candidates if it plays long: the carta beat or the saucer beat [Tom's call].
- The recommendation answer uses **el filete** (pack-known); no untaught food nouns are heard.
- The allergy beat is PROFILE-KEYED (Tom's ruling): it exists only for learners who declared a dietary need at intake and fills with THEIR allergy; skipped cleanly otherwise. Context stays flat — the safety carve-out applied to narrative. The phrase is the neutral noun form (Tengo alergia al ___) — no gender dependency; the intake grammar field only shapes variants.
- TIRAR is the read-sign debut; Empujar, Caballeros/Señoras can seed a second tasca/bar scene later.
- Photo: sourcing gap flagged; the door format is ready for whatever image lands.
