# SCENE · Toni's Bar — Bar · Early Evening (v1.1 draft, 2026-09-06)

```yaml
id: bar-early-evening-tonis
category: bar
place: "Toni's Bar"
time: early evening
label: "SCENE: BAR · EARLY EVENING"
end_label: "END SCENE: BAR · EARLY EVENING"
photo: tonis-bar-early-evening.jpg      # GAP: sourcing
name_face: logo
cast: [Toni, Marina]                     # Toni: needs a met-in line in a bar lesson before ship (cast-met-first); Marina by reference only
due_mass_items: [una-cana-por-favor, salud-heard, podria-recomendarme-plato-tipico, bravas-heard, viene-a-las-diez-heard, me-pone-otra-cuando-pueda, a-que-hora-cierra, cerramos-a-la-una-heard]

door:
  verse:
    - "The place is already loud, and the crowd is a drink or two ahead of you."
    - "Toni is behind the bar and in no hurry about anything."
  cta: "Step in"

beats:
  - type: weld
    context: "Toni catches your eye over three heads."
    cue_label: "Order"
    cue: "A caña"
    build: ["una", "caña", "por", "favor"]

  - type: exchange-understand              # scene-local heard; production waits for Wave 2 (¡Salud!)
    context: "The glass lands. Toni taps the bar twice."
    heard: "¡Salud!"
    prompt: "What did he say?"
    choices: ["Careful!", "Cheers!*", "Cash only"]

  - type: weld
    context: "The food menu is scribbled on a mirror. Half of it you can't read."
    cue_label: "Ask"
    cue: "Recommend me something from here"
    build: ["podría", "recomendarme", "un", "plato", "típico", "de", "aquí"]

  - type: exchange-understand              # scene-local noun (bravas) — tap-to-translate covers it
    context: "He doesn't hesitate."
    heard: "Una de bravas. No preguntes."
    heardEn: "An order of bravas. Don't ask."
    prompt: "What did he recommend?"
    choices: ["The croquettes", "The bravas*", "The olives"]

  - type: overheard                        # Marina's thread pays off (Bar Paloma → here)
    context: "Two stools down, a woman asks Toni over the music if Marina is coming tonight."
    heard: "Sí, viene a las diez."
    prompt: "What did you hear?"
    choices: ["She's already left", "She's coming at ten*", "She's coming at two"]

  - type: weld
    context: "You take the last sip. You are not ready to leave, and the night is only getting started."
    cue_label: "The regular's move"
    cue: "One more, when he can"
    build: ["me", "pone", "otra", "cuando", "pueda"]

  - type: weld
    context: "It is getting late, or it isn't. Best to know."
    cue_label: "Ask"
    cue: "What time they close"
    build: ["a", "qué", "hora", "cierra"]

  - type: exchange-number
    context: "Toni doesn't look at the clock."
    heard: "Cerramos a la una."
    prompt: "What time?"
    choices: ["At one*", "At two", "At ten"]

finale:
  line: "You'll be back at ten. You already know where you're sitting."
```
