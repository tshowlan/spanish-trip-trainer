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

Chat sessions cannot write to the repo: instead, output the exact markdown for Tom to commit, clearly labeled with the target file path. Keep it copy-paste ready.

If Tom ends a session without asking for the handoff update, prompt him: "Want me to write the handoff update before we stop?"

## Division of labor

- **Chat sessions**: product thinking, spec drafting, strategy, content design. Output ends as markdown destined for `docs/` or `STATUS.md`.
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
