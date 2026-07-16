# Tripfluent Working Rules (for all Claude sessions: Code and Chat)

You are one of several Claude sessions working on Tripfluent, a solo-built travel language-learning app. Sessions are stateless workers. The repo is the single source of truth. Conversations are never the source of truth.

## Source of truth files

- `CLAUDE.md` — architecture, tech stack, conventions, current priorities. Stable context.
- `docs/` — specs (learning engine, content map, scoring system, etc.). One file per system.
- `STATUS.md` — running log of what changed, what's in progress, what's next. Most recent entry at the top.
- `docs/decisions.md` — product and technical decisions with a one-line rationale each. Append-only.

If any of these files don't exist yet, create them the first time you need them.

## Session start protocol

1. Read `CLAUDE.md` and `STATUS.md` before doing anything else. (Chat sessions: ask Tom to paste them or check project knowledge if not provided.)
2. Read any `docs/` spec relevant to the task.
3. If the task contradicts a spec or a logged decision, flag the conflict before proceeding. Do not silently override documented decisions.

## Session end protocol

Every session that produces a decision, spec change, or code change must end with a handoff update:

1. Update `STATUS.md` with: date, what was decided or built, any deviations from spec, and what's next.
2. If a decision was made, append it to `docs/decisions.md` with rationale.
3. If a spec changed, edit the spec file itself. Do not leave spec changes only in STATUS.md or chat. **"Spec change" includes a new reusable component or pattern discovered while building, or a spec line the build contradicted** — fold it back into the relevant spec doc (e.g. the design system §3) in the same commit, not just STATUS. Build sessions feed the docs too.
4. **Flag deltas from prior verbal direction.** When a handoff (or a re-mocked artifact) reverses or refines something Tom said earlier in chat, call the delta out explicitly — don't just ship the new final state and let Code infer it. Example: after "make Spain bigger," the re-mocked home kept `.dest` at 28px and put the size increase in the dials; the handoff should say *"note: dest stays 28px, the scale-up is in the dials,"* so Code doesn't carry the stale assumption (Code guessed 33px before this rule). State what changed since the last verbal round, not only the end result.

Chat sessions cannot write to the repo. Output changes as **targeted edits** (which file, which section, old text → new text), NOT a whole replacement file. Tom relays those edits to a Code session, which applies them against the *live* repo file and commits. Never paste a chat-produced whole file into the repo (see "Single-writer rule" below).

If Tom ends a session without asking for the handoff update, prompt him: "Want me to write the handoff update before we stop?"

## Single-writer rule for repo files

Code is the only session that writes files into the repo. This exists because a real collision happened: a chat-edited copy of `design-system.md`, authored from a base that predated newer commits, was dropped in wholesale and silently reverted the committed §5 acceptance gate, §3.1 press physics, and §3.3 sheet docs. Three mechanics caused it, and this rule removes all three.

- **Chat authors; Code integrates.** Chat produces rule text, prose, and design artifacts. Tom relays the substance; a Code session merges it into the current file and commits. Chat's own edited copy never re-enters the repo.
- **Edits are diffs, not whole files.** A whole-file drop can't be git-merged, so anything committed after the author's copy is silently lost. Hand over "in §2.2, replace the Duration bullet with X" — not a 200-line file.
- **Author from HEAD.** If chat must see a doc to change it, seed it with the *current* repo version first (Tom pastes it, or Code prints it). Editing a stale copy is what starts the divergence.
- **Applies to every tracked file** — `design-system.md`, specs, `STATUS.md`, `decisions.md`, code. Design artifacts (`design/*.html`) go through a Code session so they get read + run through the §5 acceptance diff before landing.
- **Propagating a ratified decision into an existing artifact is integration, not authoring.** When a settled rule (a logged decision, an app-wide semantic) leaves an already-committed artifact stale or self-contradicting, Code makes the targeted edit to bring it in sync — and flags it — rather than leaving the artifact contradicting the rule while waiting on a chat re-cut. Chat still owns net-new design; this is just keeping the truth consistent. (Origin: the correction-sheet green→gold error-chunk change, 2026-07-15.)

## Division of labor

- **Chat sessions**: product thinking, spec drafting, strategy, content design. Output is proposed edits (targeted diffs) and design artifacts, relayed to a Code session for integration — never a whole file dropped into the repo (see the single-writer rule).
- **Claude Code sessions**: implementation. Build from the specs in `docs/`, not from memory of prior conversations. If a spec is ambiguous or missing, say so and ask, rather than inventing behavior.

## Rules for all sessions

- Never rely on chat memory or prior-conversation recall for project state. If it matters, it must be in the repo docs. If it's not in the docs, treat it as undecided.
- When implementation deviates from spec (for good reasons), the deviation must be logged in STATUS.md and the spec updated. Undocumented drift is the failure mode this system exists to prevent.
- Keep handoff writing terse and factual. Bullet points, dates, file paths. No narrative recaps.
- Decisions already logged in `docs/decisions.md` are settled unless Tom explicitly reopens them. Do not relitigate (e.g., no streaks — momentum decay was chosen deliberately).

## Project constants (do not rediscover these each session)

- Stack: vanilla JavaScript, Capacitor for iOS, Supabase backend, GitHub Pages hosting.
- Product direction: premium fitness-app aesthetic (Whoop/Oura-style dials: Trip Readiness, Momentum, Retention), deliberately differentiated from Duolingo.
- Curriculum: tiered spiral. Spanish first (Mexico and Spain variants).
- Solo developer, nights and weekends: prefer simple, maintainable solutions over clever infrastructure.
