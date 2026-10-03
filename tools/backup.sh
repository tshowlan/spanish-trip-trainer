#!/bin/bash
# Tripfluent weekly backup (Tom, 2026-10-03): a copy of everything that would die with the laptop, into iCloud Drive.
#   1. the whole repo with its full history, as one git bundle (restore: git clone spanish-trip-trainer.bundle)
#   2. the Desktop handoff folder (chat's artifacts, mocks, ledgers), zipped
#   3. supabase_push_run.sql (the reminder cron secret; kept out of GitHub on purpose)
#   4. the Supabase vault (the players table) as JSON, ONLY if the service key is at ~/.config/tripfluent/supabase-service-key
# Keeps the newest 8 backups. Scheduled by ~/Library/LaunchAgents/com.tripfluent.backup.plist (Sundays 10:00; runs at next wake if missed).
set -u
REPO="/Users/thomashowland/spanish-trip-trainer"
HANDOFFS="/Users/thomashowland/Desktop/Projects/Tripfluent"
DEST="/Users/thomashowland/Library/Mobile Documents/com~apple~CloudDocs/Tripfluent Backups"
KEYFILE="/Users/thomashowland/.config/tripfluent/supabase-service-key"
STAMP="$(date +%Y-%m-%d_%H%M)"
OUT="$DEST/$STAMP"
LOG="$DEST/backup.log"
mkdir -p "$OUT" || { echo "cannot create $OUT"; exit 1; }
say() { echo "$(date '+%Y-%m-%d %H:%M') $*" | tee -a "$LOG"; }
say "backup start -> $OUT"

# 1. the repo, every commit and branch
if git -C "$REPO" bundle create "$OUT/spanish-trip-trainer.bundle" --all 2>>"$LOG"; then
  say "repo bundle ok ($(du -h "$OUT/spanish-trip-trainer.bundle" | cut -f1), $(git -C "$REPO" rev-list --count HEAD) commits, head $(git -C "$REPO" rev-parse --short HEAD))"
else say "repo bundle FAILED"; fi

# 2. the Desktop handoffs
if [ -d "$HANDOFFS" ]; then
  (cd "$(dirname "$HANDOFFS")" && zip -q -r "$OUT/desktop-handoffs.zip" "$(basename "$HANDOFFS")" -x '*.DS_Store') && say "handoffs zip ok ($(du -h "$OUT/desktop-handoffs.zip" | cut -f1))" || say "handoffs zip FAILED"
else say "handoffs folder missing, skipped"; fi

# 3. the one secrets file
if [ -f "$REPO/supabase_push_run.sql" ]; then cp "$REPO/supabase_push_run.sql" "$OUT/" && say "supabase_push_run.sql ok"; else say "supabase_push_run.sql missing, skipped"; fi

# 4. the vault (needs the service key; the app's publishable key cannot read the table)
if [ -s "$KEYFILE" ]; then
  KEY="$(tr -d '[:space:]' < "$KEYFILE")"
  URL="$(grep -o 'https://[a-z0-9]*\.supabase\.co' "$REPO/config.js" | head -1)"
  if curl -sf --max-time 60 "$URL/rest/v1/players?select=*" -H "apikey: $KEY" -H "Authorization: Bearer $KEY" -o "$OUT/players.json"; then
    say "vault export ok ($(python3 -c "import json,sys; print(len(json.load(open(sys.argv[1]))))" "$OUT/players.json" 2>/dev/null || echo '?') players)"
  else say "vault export FAILED (key or network)"; rm -f "$OUT/players.json"; fi
else say "vault export skipped (no service key at $KEYFILE)"; fi

# keep the newest 8
ls -1d "$DEST"/20* 2>/dev/null | sort | awk -v keep=8 '{ a[NR] = $0 } END { for (i = 1; i <= NR - keep; i++) print a[i] }' | while read -r old; do rm -rf "$old" && say "pruned $(basename "$old")"; done   # (macOS head has no -n -8)
say "backup done"
