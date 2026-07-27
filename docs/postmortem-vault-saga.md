# Postmortem: The Vault Saga (2026-07-26, v195–v203)

A week of phantom data loss: progress vanished on every reinstall, every repair died before it
arrived, and the app swore everything was fine the whole time. Nine versions to close. This
document exists so the *shape* of this failure is recognized in minutes next time, in any system.

## What actually happened (the short honest version)

No single bug. **Seven mechanisms stacked**, each hiding the others:

1. **A months-stuck service worker** ran June-era code on Tom's phone while newer versions
   downloaded but never activated. Every fix shipped for days executed nowhere.
2. **The version display lied.** It read cache names — which showed the *incoming* version's
   pre-created cache while the old worker still served the page. "v198" on screen, June in memory.
3. **GitHub Pages' 10-minute HTTP cache** served stale files after every deploy, so even honest
   fetches could deliver old code right after a fix shipped.
4. **Login treated a failed restore as optional** (`if (p) applyPlayer(p)`) — a network blip
   silently skipped the restore, showed a fresh account, and said nothing.
5. **A destructive post-restore push** (added in v195 as a "fix") uploaded whatever state existed
   after login — including the empty state of a silently-failed restore — over the good server copy.
6. **The boot push fired before any pull.** Opening the app immediately overwrote the vault with
   local state, killing any server-side repair made while the app was closed.
7. **The farewell push** (on close/background) re-sent the instance's stale boot-time state,
   killing any repair made while the app sat idle. This one survived every other fix and was the
   final assassin: the act of *closing the app to try again* destroyed each attempt.

Plus one self-inflicted wound during recovery: hand-repaired data written as `true` where the app
writes `{at, stars}` objects — done-but-invisible, spawning a phantom "bug" of its own.

## Why it took nine versions (the process failures — the real lessons)

**1. The system reported success while failing.** "Progress restored." "Backed up just now."
"v198." Every signal was a lie built on assumption rather than observation. Nothing measured
ground truth until the very end.

**2. Diagnosis by inference instead of instrumentation.** Eight plausible theories each fit the
visible evidence and each produced a shipped "fix" — stuck worker, zombie tab, cache window, race
conditions. All partially real! None the killer. The loop only broke when the app itself was
made to testify: the Settings X-ray line ("received 16, kept 16") answered in one round what
inference couldn't in fifteen.

**3. Components were tested innocent in isolation; the crime happened in composition.** The
merge was perfect in the harness. The server round-tripped perfectly via curl. The restore was
perfect against real data. The failure lived in the *choreography* — what pushed when, licensed
by what — which no unit-level test exercised.

**4. Delivery and logic were conflated.** Half the saga was fixes not *reaching* the device.
Debugging behavior before verifying which code is executing is archaeology on the wrong ruin.

**5. Silent failure handling (`catch(() => {})`) on data-critical paths** hid every error for
days. Silence is not graceful degradation when data is at stake.

## The laws now in code (never violate when touching cloud.js / accounts.js)

1. **Restore is atomic-or-fail.** Login either fully restores or throws loudly. No optional reads.
2. **The vault mapping is write-once.** An account can never be silently rebound to an empty identity.
3. **No read, no write.** A device that hasn't successfully pulled this session cannot push.
4. **Boot pulls-merges before it pushes.**
5. **An instance never re-pushes a payload it already pushed.** (Signature-gated; disarms the farewell push.)

And the instrumentation that stays forever: the **build stamp** beside the SW version on the
splash (`v203 · v203` — mismatch = stale code, no debate), the **backed-up / restored timestamps**
in Settings, and the **restore X-ray** (received N / kept N).

## The transferable doctrine (for ANY future issue, not just sync)

- **Full-overwrite writes are loaded guns.** Any push/save/PUT that replaces state wholesale
  will eventually fire from a stale client. Prefer merges; where impossible, gate writes on
  proven freshness. (Standing offer: server-side jsonb merge in sync_player = absolute guarantee.)
- **Never trust self-reported success.** Critical operations display *verifiable outcomes*
  (counts, timestamps, echoes of what the server actually stored), not optimistic toasts.
- **Verify the code before debugging the behavior.** A build stamp read from the executing
  JavaScript is one line; a week chasing behavior that isn't running is not.
- **When every component tests innocent, instrument the crime scene.** Ship X-ray diagnostics to
  the failing environment and let it testify. One round of ground truth beats ten rounds of theory.
- **No silent catches on data paths.** Record the error, surface it, then decide to degrade.
- **Design out choreography.** Any fix that requires humans to act in a precise order ("log out,
  wait for me, then sign in") is a fix that will race and lose. Idempotent, merge-based systems
  don't care who moves first.
- **Repair in the system's native shape.** Hand-written data must match what the code writes,
  byte for byte — a well-meant `true` where an object belongs creates tomorrow's phantom bug.
- **Platform facts (iOS PWA), learned the hard way:** the home-screen app and Safari are separate
  installs with separate storage and separate service workers; deleting the icon deletes the app's
  data; Safari's website data is a different bucket; a service worker can stick for months and no
  visible surface will tell you — unless you build the surface.

## The one-line summary

**Every component was innocent; the system was guilty — and it confessed only when we stopped
interrogating theories and instrumented the witness.**
