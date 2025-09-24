#!/usr/bin/env bash
# Reset a remote feature branch to the current state of a base branch (default: main) safely.
# Creates a timestamped backup tag of the remote branch (unless --no-backup) before force-updating it.
# Original purpose: clean reset for 51-picture-upload-restrict-file-types.
#
# Usage:
#   ./scripts/reset-branch-51.sh [options]
#
# Options:
#   -b, --branch <name>      Target feature branch to reset (default: 51-picture-upload-restrict-file-types)
#   -B, --base <name>        Base branch to reset from (default: main)
#   -r, --remote <name>      Remote name (default: origin)
#       --no-backup          Skip creating backup tag
#       --backup-prefix <p>  Prefix for backup tags (default: backup)
#       --no-check-clean     Allow running with uncommitted changes (not recommended)
#       --dry-run            Show what would happen, do not execute mutating commands
#       --keep-local         Do NOT recreate local feature branch after remote reset
#   -y, --yes                Assume yes / non-interactive (skip confirmation)
#   -h, --help               Show help
#
# Environment overrides (lower priority than CLI flags):
#   BRANCH_NAME, BASE_BRANCH, REMOTE, BACKUP_TAG_PREFIX
#
# Exit codes:
#   0 success
#   1 generic failure
#   2 user aborted
set -euo pipefail

COLOR_OK="\e[32m"
COLOR_WARN="\e[33m"
COLOR_ERR="\e[31m"
COLOR_INFO="\e[36m"
COLOR_RESET="\e[0m"
if [ -t 1 ]; then
  enable_color=1
else
  COLOR_OK=""; COLOR_WARN=""; COLOR_ERR=""; COLOR_INFO=""; COLOR_RESET=""; enable_color=0
fi

BRANCH_NAME=${BRANCH_NAME:-51-picture-upload-restrict-file-types}
BASE_BRANCH=${BASE_BRANCH:-main}
REMOTE=${REMOTE:-origin}
BACKUP_TAG_PREFIX=${BACKUP_TAG_PREFIX:-backup}
CREATE_BACKUP=1
CHECK_CLEAN=1
DRY_RUN=0
KEEP_LOCAL=0
ASSUME_YES=0

usage() {
  sed -n '1,70p' "$0" | grep -E '^#' | sed 's/^# \{0,1\}//'
}

log() { printf '%b[%s]%b %s\n' "$COLOR_INFO" "$1" "$COLOR_RESET" "$2"; }
ok() { printf '%b[OK]%b %s\n' "$COLOR_OK" "$COLOR_RESET" "$1"; }
warn() { printf '%b[WARN]%b %s\n' "$COLOR_WARN" "$COLOR_RESET" "$1"; }
err() { printf '%b[ERR]%b %s\n' "$COLOR_ERR" "$COLOR_RESET" "$1" >&2; }

confirm() {
  if [ $ASSUME_YES -eq 1 ]; then return 0; fi
  read -r -p "$1 [y/N]: " ans
  case "$ans" in
    y|Y|yes|YES) return 0;;
    *) return 1;;
  esac
}

run() {
  if [ $DRY_RUN -eq 1 ]; then
    echo "DRY-RUN: $*"
  else
    eval "$@"
  fi
}

while [ $# -gt 0 ]; do
  case "$1" in
    -b|--branch) BRANCH_NAME=$2; shift 2;;
    -B|--base) BASE_BRANCH=$2; shift 2;;
    -r|--remote) REMOTE=$2; shift 2;;
    --no-backup) CREATE_BACKUP=0; shift;;
    --backup-prefix) BACKUP_TAG_PREFIX=$2; shift 2;;
    --no-check-clean) CHECK_CLEAN=0; shift;;
    --dry-run) DRY_RUN=1; shift;;
    --keep-local) KEEP_LOCAL=1; shift;;
    -y|--yes) ASSUME_YES=1; shift;;
    -h|--help) usage; exit 0;;
    *) err "Unknown argument: $1"; usage; exit 1;;
  esac
done

BACKUP_TAG="${BACKUP_TAG_PREFIX}/${BRANCH_NAME}-pre-reset-$(date +%Y%m%d-%H%M%S)"

log INFO "Target branch: $BRANCH_NAME"
log INFO "Base branch:   $BASE_BRANCH"
log INFO "Remote:        $REMOTE"
if [ $CREATE_BACKUP -eq 1 ]; then
  log INFO "Backup tag:    $BACKUP_TAG"
else
  warn "Backup tag creation DISABLED (--no-backup)"
fi
if [ $DRY_RUN -eq 1 ]; then warn "Dry-run mode: no changes will be pushed"; fi

if [ $CHECK_CLEAN -eq 1 ]; then
  if ! git diff --quiet || ! git diff --cached --quiet; then
    warn "Working tree not clean. Use --no-check-clean to override."; exit 1
  fi
else
  warn "Skipping clean working tree check (--no-check-clean)."
fi

log STEP "Fetching latest refs from $REMOTE"; run git fetch "$REMOTE" --prune

# Ensure base branch exists locally & remotely
if ! git show-ref --verify --quiet "refs/heads/${BASE_BRANCH}"; then
  log STEP "Creating local base branch ${BASE_BRANCH} from ${REMOTE}/${BASE_BRANCH}"; run git checkout -B "$BASE_BRANCH" "$REMOTE/$BASE_BRANCH"
fi
run git checkout "$BASE_BRANCH" >/dev/null 2>&1 || { err "Cannot checkout base branch $BASE_BRANCH"; exit 1; }
run git reset --hard "$REMOTE/$BASE_BRANCH"
ok "Base branch synced to $REMOTE/$BASE_BRANCH"

# Check remote feature branch existence & capture old commit
REMOTE_BRANCH_EXISTS=0
OLD_REMOTE_HASH=""
if git ls-remote --exit-code --heads "$REMOTE" "$BRANCH_NAME" >/dev/null 2>&1; then
  REMOTE_BRANCH_EXISTS=1
  OLD_REMOTE_HASH=$(git rev-parse "$REMOTE/$BRANCH_NAME" 2>/dev/null || echo "")
  log INFO "Remote feature branch currently at ${OLD_REMOTE_HASH:-unknown}"
else
  warn "Remote branch $BRANCH_NAME does not exist yet (will be created)."
fi

if [ $CREATE_BACKUP -eq 1 ] && [ $REMOTE_BRANCH_EXISTS -eq 1 ]; then
  log STEP "Creating backup tag $BACKUP_TAG from $REMOTE/$BRANCH_NAME"
  run git tag -f "$BACKUP_TAG" "$REMOTE/$BRANCH_NAME"
  if [ $DRY_RUN -eq 0 ]; then run git push "$REMOTE" "$BACKUP_TAG"; else echo "DRY-RUN: git push $REMOTE $BACKUP_TAG"; fi
  ok "Backup tag recorded"
fi

if ! confirm "Proceed to force reset $BRANCH_NAME to $BASE_BRANCH on $REMOTE?"; then
  err "Aborted by user"; exit 2
fi

log STEP "Force updating remote feature branch (with lease)"
if run git push --force-with-lease "$REMOTE" "$BASE_BRANCH:$BRANCH_NAME"; then
  if [ $REMOTE_BRANCH_EXISTS -eq 1 ]; then
    NEW_HASH=$(git rev-parse "$BASE_BRANCH")
    ok "Remote $BRANCH_NAME moved: $OLD_REMOTE_HASH -> $NEW_HASH"
  else
    ok "Remote $BRANCH_NAME created from $BASE_BRANCH"
  fi
else
  err "Force-with-lease failed. Remote moved unexpectedly."; exit 1
fi

if [ $KEEP_LOCAL -eq 0 ]; then
  log STEP "Recreating local tracking branch $BRANCH_NAME"
  run git checkout -B "$BRANCH_NAME" "$REMOTE/$BRANCH_NAME"
  ok "Local branch now tracking $REMOTE/$BRANCH_NAME"
else
  warn "Skipping local branch recreation (--keep-local)."
fi

log STEP "Verifying branch matches base"
if git diff --quiet "$BASE_BRANCH" "$BRANCH_NAME"; then
  ok "$BRANCH_NAME matches $BASE_BRANCH"
else
  warn "$BRANCH_NAME differs from $BASE_BRANCH (unexpected). Changed files:" && git diff --name-status "$BASE_BRANCH" "$BRANCH_NAME"
fi

echo
ok "Done. Reapply needed changes, then commit & push."
if [ $CREATE_BACKUP -eq 1 ] && [ $REMOTE_BRANCH_EXISTS -eq 1 ]; then
  echo "Backup tag: $BACKUP_TAG (restore: git checkout -b restore-$BRANCH_NAME $BACKUP_TAG)"
fi
if [ $DRY_RUN -eq 1 ]; then
  echo "NOTE: Dry-run performed. Re-run without --dry-run to apply."
fi
